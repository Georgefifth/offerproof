import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { firefox } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const project = fileURLToPath(new URL('../', import.meta.url));
const server = createServer(async (req, res) => {
  const name = (req.url || '/').split('?')[0].replace(/^\//, '') || 'index.html';
  if (!['index.html', 'styles.css', 'app.js', 'analysis.js', 'record.js', 'favicon.svg'].includes(name)) {
    res.writeHead(404); res.end(); return;
  }
  const contentType = name.endsWith('.js') ? 'text/javascript' : name.endsWith('.css') ? 'text/css' : name.endsWith('.svg') ? 'image/svg+xml' : 'text/html';
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(await readFile(join(project, name)));
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const remoteBase = process.env.OFFERPROOF_BASE_URL;
const base = remoteBase || `http://127.0.0.1:${server.address().port}/`;
const output = join(project, 'test-artifacts', remoteBase ? 'live' : '');
await mkdir(output, { recursive: true });
const browser = await firefox.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await context.newPage();
const errors = [];
const externalRequests = [];
const accessibility = [];
page.on('request', request => { if (!request.url().startsWith(base) && !request.url().startsWith('blob:')) externalRequests.push(request.url()); });
async function audit(label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  accessibility.push({ label, violations: result.violations });
  await writeFile(join(output, 'accessibility.json'), JSON.stringify(accessibility, null, 2));
  assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `Accessibility: ${label}`);
}
page.on('pageerror', error => errors.push(error.message));
page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));

try {
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.match(await page.title(), /OfferProof/);
  assert.equal(await page.locator('#results').isVisible(), false);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#offerText').evaluate(el => el === document.activeElement), true);
  await page.locator('a[href="#recovery"]').click();
  assert.equal(new URL(page.url()).hash, '#recovery');
  assert.equal(await page.locator('#recovery').evaluate(el => el === document.activeElement), true);
  await audit('initial desktop');

  await page.locator('#analyzeBtn').click();
  assert.equal(await page.locator('#results').isVisible(), false);
  assert.equal(await page.locator('#offerText').evaluate(el => el.validationMessage.length > 0), true);

  await page.locator('#loadRisky').click();
  assert.match(await page.locator('#offerText').inputValue(), /refundable training fee/);
  await page.locator('#analyzeBtn').click();
  assert.equal(await page.locator('.finding-card').count(), 4);
  assert.equal(await page.locator('#highlightedMessage mark').count(), 4);
  assert.equal(await page.locator('#resultTitle').evaluate(el => el === document.activeElement), true);
  assert.match(await page.locator('#verdictTitle').innerText(), /Stop and independently verify/);
  assert.match(await page.locator('#domainResult').innerText(), /personal email domain/);
  await page.screenshot({ path: `${output}/firefox-risky-desktop.png`, fullPage: true });

  await page.locator('#exportBtn').click();
  assert.equal(await page.locator('#recordPreview').isVisible(), true);
  await page.locator('#copyRecord').click();
  await page.waitForFunction(() => /Copied|Text selected/.test(document.querySelector('#recordStatus').textContent));
  await page.evaluate(() => {
    window.originalClipboardWrite = navigator.clipboard.writeText;
    navigator.clipboard.writeText = async () => { throw new Error('Clipboard denied for fallback test'); };
  });
  await page.locator('#copyRecord').click();
  await page.waitForFunction(() => /Text selected/.test(document.querySelector('#recordStatus').textContent));
  assert.equal(await page.locator('#recordText').evaluate(el => el.selectionEnd - el.selectionStart), (await page.locator('#recordText').inputValue()).length);
  await page.evaluate(() => { navigator.clipboard.writeText = window.originalClipboardWrite; delete window.originalClipboardWrite; });
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#downloadBtn').click();
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
  assert.match(await page.locator('#verdictTitle').innerText(), /Your independent checks are recorded/);
  await page.locator('#officialSite').fill('https://northstar.example/careers/design-intern');
  assert.equal(await page.locator('#checkSite').isChecked(), true);
  assert.equal(await page.locator('#checkRole').isChecked(), true);
  assert.equal(await page.locator('#checkContact').isChecked(), true);
  await page.locator('#senderEmail').fill('another@northstar.example');
  assert.equal(await page.locator('#checkSite').isChecked(), true);
  assert.equal(await page.locator('#checkRole').isChecked(), true);
  assert.equal(await page.locator('#checkContact').isChecked(), false);
  await page.locator('#checkContact').check();
  await audit('completed review');
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
  assert.match(await page.locator('#verdictTitle').innerText(), /Your independent checks are recorded/);

  await page.locator('#langToggle').click();
  assert.match(await page.locator('#heroTitle').innerText(), /回复之前/);
  assert.match(await page.locator('#verdictTitle').innerText(), /已记录你的独立核验/);
  await page.locator('.evidence-details summary').click();
  await page.locator('#evidenceNotes').fill('确认日期：2026-10-05，联系人 jane@example.com，岗位 https://northstar.example/jobs?token=secret');
  await page.locator('#questionsBtn').click();
  assert.match(await page.locator('#questionsText').inputValue(), /招聘这个具体岗位/);
  await page.locator('#copyQuestions').click();
  await page.waitForFunction(() => /已复制|文字已选中/.test(document.querySelector('#questionsStatus').textContent));
  await page.locator('#exportBtn').click();
  assert.match(await page.locator('#recordText').inputValue(), /个人核验记录/);
  assert.doesNotMatch(await page.locator('#recordText').inputValue(), /jane@example.com|token=secret/);
  await audit('Chinese report');
  await page.screenshot({ path: `${output}/firefox-chinese.png`, fullPage: true });
  await page.locator('#langToggle').click();
  assert.match(await page.locator('#heroTitle').innerText(), /Pause before/);
  assert.match(await page.locator('#recordText').inputValue(), /personal review record/);

  await page.locator('#offerText').fill('A different invitation.');
  assert.equal(await page.locator('#results').isVisible(), false);
  assert.equal(await page.locator('#verify').isVisible(), false);

  await page.locator('#offerText').fill('We do not charge application fees, but please pay a training fee. Later pay an equipment fee.');
  await page.locator('#offerText').press('Control+Enter');
  assert.match(await page.locator('#statusBanner').innerText(), /Pause/);
  await page.locator('.finding-card details summary').click();
  assert.match(await page.locator('.finding-card details').innerText(), /equipment fee/);
  await page.locator('#offerText').fill('  Normal scheduling message.  ');
  await page.locator('#analyzeBtn').click();
  await page.locator('#offerText').press('End');
  assert.equal(await page.locator('#results').isVisible(), true);
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#resetBtn').click();
  assert.equal(await page.locator('#offerText').inputValue(), '  Normal scheduling message.  ');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#resetBtn').click();
  assert.equal(await page.locator('#offerText').inputValue(), '');
  assert.equal(await page.locator('#evidenceNotes').inputValue(), '');
  assert.equal(await page.locator('#results').isVisible(), false);

  await page.locator('#offerText').fill('<img src=x onerror="window.testXss=true"> Pay the equipment fee.');
  await page.locator('#analyzeBtn').click();
  assert.equal(await page.locator('#highlightedMessage img').count(), 0);
  assert.equal(await page.evaluate(() => window.testXss), undefined);
  assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });

  await page.setViewportSize({ width: 390, height: 844 });
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#loadRisky').click();
  assert.match(await page.locator('#offerText').inputValue(), /window.testXss/);
  assert.equal(await page.locator('#results').isVisible(), true);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#loadRisky').click();
  await page.locator('#analyzeBtn').click();
  await page.screenshot({ path: `${output}/firefox-risky-mobile.png`, fullPage: true });
  await page.locator('#verify').screenshot({ path: `${output}/firefox-mobile-verification.png` });
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(horizontalOverflow, false);
  await audit('mobile risky review');
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `Overflow at ${width}`);
  }

  await page.locator('#recoveryCountry').selectOption('my');
  assert.match(await page.locator('#recoveryLocal').innerText(), /NSRC 997/);
  assert.match(await page.locator('#recoveryOfficial').getAttribute('href'), /malaysia.gov.my/);
  await page.locator('#recoveryCountry').selectOption('sg');
  assert.match(await page.locator('#recoveryLocal').innerText(), /1799/);
  await page.locator('#recoveryCountry').selectOption('other');
  assert.equal(await page.locator('#recoveryOfficial').isVisible(), false);
  await page.locator('#langToggle').click();
  await page.locator('#loadOrdinary').click();
  assert.match(await page.locator('#offerText').inputValue(), /暑期设计实习/);
  await page.locator('#analyzeBtn').click();
  assert.match(await page.locator('#findingCount').innerText(), /0/);
  await page.locator('#loadTask').click();
  await page.locator('#analyzeBtn').click();
  assert.match(await page.locator('#findingsList').innerText(), /充值解锁任务或提现/);
  assert.equal(await page.locator('#messageEvidence').getAttribute('open'), null);
  await page.locator('#messageEvidence summary').click();
  assert.equal(await page.locator('#highlightedMessage').isVisible(), true);
  await page.locator('a[href="#verify"]').click();
  assert.equal(new URL(page.url()).hash, '#verify');
  await page.locator('#langToggle').click();
  await page.locator('#offerText').fill('Pay the equipment fee. '.repeat(800));
  const started = Date.now();
  await page.locator('#analyzeBtn').click();
  assert.equal(await page.locator('.finding-card').count(), 1);
  const elapsed = Date.now() - started;
  const existing = await page.locator('#offerText').inputValue();
  const accepted = await page.locator('#offerText').evaluate(el => {
    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => 'x'.repeat(25000) } });
    return el.dispatchEvent(event);
  });
  assert.equal(accepted, false);
  assert.equal(await page.locator('#offerText').inputValue(), existing);
  assert.match(await page.locator('#inputStatus').innerText(), /exceeds 20,000/);
  assert.ok(elapsed < 5000, `Long message review took ${elapsed}ms`);
  await writeFile(join(output, 'metrics.json'), JSON.stringify({ longMessageCharacters: await page.locator('#offerText').evaluate(el => el.value.length), analysisInteractionMs: elapsed }, null, 2));
  assert.deepEqual(errors, []);
  assert.deepEqual(externalRequests, []);
  console.log('PASS Firefox end-to-end: empty, samples, warnings, highlights, export/copy, domains, notes/questions, checklist, language, reset, keyboard, XSS/privacy, mobile, accessibility');
  console.log(`Screenshots: ${output}`);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
