import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { firefox } from 'playwright';

const project = fileURLToPath(new URL('../', import.meta.url));
const server = createServer(async (req, res) => {
  const name = (req.url || '/').split('?')[0].replace(/^\//, '') || 'index.html';
  if (!['index.html', 'styles.css', 'app.js', 'analysis.js', 'favicon.svg'].includes(name)) {
    res.writeHead(404); res.end(); return;
  }
  const contentType = name.endsWith('.js') ? 'text/javascript' : name.endsWith('.css') ? 'text/css' : name.endsWith('.svg') ? 'image/svg+xml' : 'text/html';
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(await readFile(join(project, name)));
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
const output = join(project, 'test-artifacts');
await mkdir(output, { recursive: true });
const browser = await firefox.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));

try {
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.match(await page.title(), /OfferProof/);
  assert.equal(await page.locator('#results').isVisible(), false);

  await page.locator('#analyzeBtn').click();
  assert.equal(await page.locator('#results').isVisible(), false);
  assert.equal(await page.locator('#offerText').evaluate(el => el.validationMessage.length > 0), true);

  await page.locator('#loadRisky').click();
  assert.match(await page.locator('#offerText').inputValue(), /refundable training fee/);
  await page.locator('#analyzeBtn').click();
  assert.equal(await page.locator('.finding-card').count(), 4);
  assert.equal(await page.locator('#highlightedMessage mark').count(), 4);
  assert.match(await page.locator('#verdictTitle').innerText(), /Stop and independently verify/);
  assert.match(await page.locator('#domainResult').innerText(), /personal email domain/);
  await page.screenshot({ path: `${output}/firefox-risky-desktop.png`, fullPage: true });

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'offerproof-review.txt');
  const record = await readFile(await download.path(), 'utf8');
  assert.match(record, /Warning signs: 4/);
  assert.match(record, /\nSender domain check:/);
  assert.doesNotMatch(record, /talent\.northstar@gmail\.com/);
  assert.doesNotMatch(record, /https:\/\/northstar\.example/);
  assert.equal(await page.locator('#recordPreview').isVisible(), true);

  await page.locator('#checkSite').check();
  assert.equal(await page.locator('#recordPreview').isVisible(), false);
  await page.locator('#loadOrdinary').click();
  await page.locator('#analyzeBtn').click();
  assert.equal(await page.locator('#highlightedMessage mark').count(), 0);
  assert.match(await page.locator('#verdictTitle').innerText(), /Still unverified/);
  await page.locator('#officialSite').fill('https://northstar.example/careers');
  assert.match(await page.locator('#domainResult').innerText(), /aligns with/);
  await page.locator('#checkSite').check();
  await page.locator('#checkRole').check();
  await page.locator('#checkContact').check();
  assert.match(await page.locator('#verdictTitle').innerText(), /Independent confirmation recorded/);
  await page.screenshot({ path: `${output}/firefox-ordinary-confirmed.png`, fullPage: true });

  await page.locator('#loadOrdinary').click();
  assert.equal(await page.locator('#checkSite').isChecked(), false);
  assert.equal(await page.locator('#results').isVisible(), false);
  await page.locator('#analyzeBtn').click();
  assert.match(await page.locator('#verdictTitle').innerText(), /Still unverified/);

  await page.locator('#officialSite').fill('https://northstar.example/careers');
  await page.locator('#senderEmail').fill('recruiter@different.example');
  assert.equal(await page.locator('#checkSite').isChecked(), false);
  assert.match(await page.locator('#domainResult').innerText(), /differs from/);
  assert.match(await page.locator('#verdictTitle').innerText(), /Resolve the sender mismatch/);
  await page.locator('#senderEmail').fill('bad-email');
  assert.match(await page.locator('#domainResult').innerText(), /format is invalid/);
  await page.locator('#senderEmail').fill('');
  assert.match(await page.locator('#domainResult').innerText(), /No sender email was provided/);
  await page.locator('#checkSite').check();
  await page.locator('#checkRole').check();
  await page.locator('#checkContact').check();
  assert.match(await page.locator('#verdictTitle').innerText(), /Independent confirmation recorded/);

  await page.locator('#langToggle').click();
  assert.match(await page.locator('#heroTitle').innerText(), /回复之前/);
  assert.match(await page.locator('#verdictTitle').innerText(), /已记录独立确认/);
  await page.screenshot({ path: `${output}/firefox-chinese.png`, fullPage: true });
  await page.locator('#langToggle').click();
  assert.match(await page.locator('#heroTitle').innerText(), /Pause before/);

  await page.locator('#offerText').fill('A different invitation.');
  assert.equal(await page.locator('#results').isVisible(), false);
  assert.equal(await page.locator('#verify').isVisible(), false);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#loadRisky').click();
  await page.locator('#analyzeBtn').click();
  await page.screenshot({ path: `${output}/firefox-risky-mobile.png`, fullPage: true });
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(horizontalOverflow, false);
  assert.deepEqual(errors, []);
  console.log('PASS Firefox end-to-end: empty, samples, warnings, highlights, export, domains, checklist, language, reset, mobile');
  console.log(`Screenshots: ${output}`);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
