import { analyzeOffer, senderCheck, redactForExport } from './analysis.js';

const $ = id => document.getElementById(id);
const text = (id, value) => { $(id).textContent = value; };
const translations = {
  en: {
    eyebrow: 'FOR THE OFFER THAT FEELS TOO GOOD TO IGNORE', hero1: 'Pause before', hero2: 'you reply.', heroCopy: "A job offer can look real and still ask for something it shouldn't. Check the message, verify the employer independently, and keep a record of what you found.", meta: 'READ THE EVIDENCE. MAKE YOUR OWN CALL.', step1: 'STEP 01 — THE MESSAGE', inputTitle: 'What did they send?', inputNote: 'Paste the invitation exactly as received. You can remove personal details first.', offerLabel: 'JOB OR INTERNSHIP MESSAGE', privacy: 'Your message stays in this browser tab.', tryExample: 'TRY AN EXAMPLE', riskySample: 'Suspicious offer ↗', ordinarySample: 'Ordinary offer ↗', analyze: 'Examine this offer', whyLabel: 'WHY THIS MATTERS', whyTitle: 'The request is the clue.', whyCopy: "A logo, polished email, or even an interview doesn't confirm who sent the offer. Requests for upfront payment or identity documents deserve a pause.", readGuidance: 'Read FTC guidance ↗', step2: 'STEP 02 — THE SIGNALS', resultTitle: 'What stands out?', messageEvidence: 'MESSAGE EVIDENCE', highlightNote: 'Highlighted text triggered a warning. Other risks may still be present.', step3: 'STEP 03 — INDEPENDENT CHECK', verifyTitle: 'Check outside the message.', verifyNote: 'Do not use the contact link or number supplied in the invitation as your only evidence.', emailLabel: 'SENDER EMAIL', siteLabel: 'OFFICIAL SITE YOU FOUND YOURSELF', domainCaveat: 'A matching domain alone does not prove that the message is genuine. A mismatch needs investigation.', checklistLabel: 'YOUR CHECKLIST', check1: 'I found the company’s website independently, without opening a link from this message.', check2: 'I found this specific role on the company’s official careers page, or confirmed it directly.', check3: 'I contacted the company using details from its official website and confirmed the recruiter or offer.', recordLabel: 'YOUR REVIEW RECORD', export: 'Download review record ↓', recordPreviewLabel: 'REVIEW RECORD — SELECT TO COPY IF DOWNLOADS ARE BLOCKED', recoveryLabel: 'IF YOU ALREADY SENT MONEY OR DETAILS', recoveryTitle: 'Act now, not after the review.', recoveryCopy: "Contact your bank or payment provider immediately. If you shared a password, change it and secure the account. Use your country's official fraud reporting channel.", recoveryLink: 'FTC recovery and reporting ↗', p1Title: 'No magic score', p1Copy: 'We show the evidence and leave uncertain cases uncertain.', p2Title: 'No hidden upload', p2Copy: 'Analysis runs in your browser. The pasted message is not stored.', p3Title: 'No shortcut to trust', p3Copy: 'Independent employer contact matters more than a polished invitation.', empty: 'Paste a message to begin.', signals: n => `${n} ${n === 1 ? 'signal' : 'signals'} found`, stop: 'PAUSE', investigate: 'CHECK', cautionTitle: 'Pause before sharing anything.', cautionCopy: 'This message contains a request that can put your money or identity at risk. Do not pay or send documents while you verify.', watchTitle: 'There are reasons to check further.', watchCopy: 'These signals do not prove fraud. Verify the employer independently before responding.', clearTitle: 'No listed warning phrases found.', clearCopy: 'That is not a safety guarantee. A convincing scam may use different wording. Continue with an independent check.', noFindings: 'No phrases matched our limited set of warning rules. Continue with the independent check below.', domainMissing: 'Enter a sender email to inspect its domain.', domainInvalidEmail: 'The sender email format is invalid.', domainPersonal: d => `The sender uses a personal email domain (${d}). Confirm their role using an independently found company contact.`, domainNeedOfficial: d => `Sender domain: ${d}. Add the official site you found independently to compare.`, domainInvalidUrl: 'Enter a valid official website address.', domainAligned: (a,b) => `The sender domain ${a} aligns with ${b}. This is only one clue; complete the independent checks.`, domainMismatch: (a,b) => `The sender domain ${a} differs from ${b}. Ask the company through an independent channel to explain.`, verdictPause: 'Stop and independently verify.', verdictPauseCopy: 'A high-impact warning remains even if the message looks professional. Do not pay or share identity documents based on this offer.', verdictMismatch: 'Resolve the sender mismatch.', verdictMismatchCopy: 'The sender domain differs from the official site you entered. Contact the employer through an independently found channel.', verdictConfirmed: 'Independent confirmation recorded.', verdictConfirmedCopy: 'You marked all three checks complete. Keep your own evidence; this tool does not certify the offer.', verdictUnverified: 'Still unverified.', verdictUnverifiedCopy: 'Complete the independent checks before relying on this invitation. Unchecked items are not evidence of legitimacy.', placeholders: { offerText: 'Paste the email, text, or job offer here…', senderEmail: 'recruiter@example.com', officialSite: 'https://example.com' }
  },
  zh: {
    eyebrow: '一封看起来不容错过的工作邀约', hero1: '回复之前，', hero2: '先核实。', heroCopy: '一封工作邀约可以看起来很正式，却提出不该提出的要求。检查原文、独立核实雇主，并保存你的核验记录。', meta: '查看证据，再由你自己判断。', step1: '第 01 步 — 邀约原文', inputTitle: '对方发来了什么？', inputNote: '原样粘贴邀约。你可以先删掉个人资料。', offerLabel: '兼职或实习邀约', privacy: '内容只留在这个浏览器标签页。', tryExample: '试试示例', riskySample: '可疑邀约 ↗', ordinarySample: '普通邀约 ↗', analyze: '检查这封邀约', whyLabel: '为什么要查', whyTitle: '真正的线索在要求里。', whyCopy: '标志、精美邮件，甚至面试，都不能证实发件人身份。要求预付款或身份证明资料时，先停一停。', readGuidance: '阅读 FTC 指引 ↗', step2: '第 02 步 — 风险线索', resultTitle: '有哪些异常？', messageEvidence: '原文证据', highlightNote: '高亮文字触发了提示；其他风险仍可能存在。', step3: '第 03 步 — 独立核实', verifyTitle: '离开原消息再查。', verifyNote: '不要只依赖邀约提供的电话或链接。', emailLabel: '发件人邮箱', siteLabel: '你独立找到的官网', domainCaveat: '域名匹配也不能证明邮件真实；不匹配则需要调查。', checklistLabel: '核验清单', check1: '我没有点消息里的链接，而是独立找到了公司官网。', check2: '我在官方招聘页找到了这个岗位，或直接向公司确认了岗位。', check3: '我用官网上的联系方式向公司确认了招聘人员或邀约。', recordLabel: '核验记录', export: '下载核验记录 ↓', recordPreviewLabel: '核验记录 — 如果下载受阻，可选中文字复制', recoveryLabel: '如果你已经付款或发送资料', recoveryTitle: '现在就采取行动。', recoveryCopy: '立即联系银行或支付平台。如果分享了密码，请更改密码并保护账户。使用所在国家的官方诈骗举报渠道。', recoveryLink: 'FTC 补救及举报指引 ↗', p1Title: '不打神奇分数', p1Copy: '显示证据；证据不足时就说尚未核实。', p2Title: '不暗中上传', p2Copy: '在浏览器内分析，粘贴的消息不会被保存。', p3Title: '不走信任捷径', p3Copy: '独立联系雇主，比一封精美邀约更重要。', empty: '请先粘贴一封邀约。', signals: n => `发现 ${n} 条线索`, stop: '暂停', investigate: '核实', cautionTitle: '提供资料或付款前，先暂停。', cautionCopy: '消息中有可能危及钱财或身份资料的要求。核实之前，不要付款或发送证件。', watchTitle: '有需要进一步核实的地方。', watchCopy: '这些线索不足以认定是骗局。回复前请独立核实雇主。', clearTitle: '没有匹配到已列出的风险用语。', clearCopy: '这不代表安全。骗局可能使用其他措辞，请继续独立核实。', noFindings: '没有匹配到有限规则中的用语。请继续完成下方核验。', domainMissing: '输入发件人邮箱以检查域名。', domainInvalidEmail: '发件人邮箱格式无效。', domainPersonal: d => `发件人使用私人邮箱域名（${d}）。请通过独立找到的公司渠道确认身份。`, domainNeedOfficial: d => `发件域名：${d}。输入你独立找到的官网以作比较。`, domainInvalidUrl: '请输入有效的官网地址。', domainAligned: (a,b) => `发件域名 ${a} 与 ${b} 一致。这只是一个线索，请继续独立核实。`, domainMismatch: (a,b) => `发件域名 ${a} 与 ${b} 不一致。请通过独立渠道向公司询问。`, verdictPause: '先停下，独立核实。', verdictPauseCopy: '仍有高影响风险线索。不要仅凭这封邀约付款或发送证件。', verdictMismatch: '先弄清域名为何不一致。', verdictMismatchCopy: '发件域名与你输入的官网不同。请用独立找到的联系方式确认。', verdictConfirmed: '已记录独立确认。', verdictConfirmedCopy: '你标记完成了三项核验。请保留自己的证据；本工具不会为邀约出具安全证明。', verdictUnverified: '仍未核实。', verdictUnverifiedCopy: '在依赖这封邀约前完成独立核验。未勾选的项目不能作为真实凭据。', placeholders: { offerText: '在这里粘贴邮件、短信或工作邀约…', senderEmail: 'recruiter@example.com', officialSite: 'https://example.com' }
  }
};

translations.en.domainNoEmail = 'No sender email was provided. Use the independently found website and contact check instead.';
translations.zh.domainNoEmail = '没有发件人邮箱。请改用独立找到的官网和联系方式核实。';

const samples = {
  risky: `Hello! We are delighted to offer you a remote student assistant position at Northstar Studio. You can earn $300 per day with no experience. Please contact our recruiter on Telegram for the next step. To activate your position, pay a refundable training fee of $75 today. Send your passport and bank account details before your interview so we can prepare payroll.`,
  ordinary: `Hello, thank you for applying for the summer design internship at Northstar Studio. We would like to schedule a 30-minute interview next Tuesday. Please confirm your availability. You can review the role on our careers page. We will not request payment or financial documents during the interview process.`
};

let language = 'en';
let currentAnalysis = null;
let analyzedText = '';
const t = () => translations[language];

function setLanguage(next) {
  language = next;
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = t()[el.dataset.i18n];
    if (typeof value === 'string') el.textContent = value;
  });
  Object.entries(t().placeholders).forEach(([id, value]) => { $(id).placeholder = value; });
  $('langToggle').textContent = next === 'en' ? '中文' : 'English';
  if (currentAnalysis) renderAnalysis();
  renderDomain();
  renderVerdict();
}

function setSample(kind) {
  $('offerText').value = samples[kind];
  $('senderEmail').value = kind === 'risky' ? 'talent.northstar@gmail.com' : 'maya@northstar.example';
  $('officialSite').value = kind === 'risky' ? 'https://northstar.example' : '';
  ['checkSite','checkRole','checkContact'].forEach(id => { $(id).checked = false; });
  updateCount();
  $('offerText').focus();
}

function updateCount() {
  $('charCount').textContent = `${$('offerText').value.length.toLocaleString()} / 20,000`;
  if (currentAnalysis && $('offerText').value !== analyzedText) {
    currentAnalysis = null;
    $('recordPreview').classList.add('hidden');
    $('recordText').value = '';
    ['checkSite','checkRole','checkContact'].forEach(id => { $(id).checked = false; });
    $('results').classList.add('hidden');
    $('verify').classList.add('hidden');
  }
}

function clearRecordPreview() {
  $('recordPreview').classList.add('hidden');
  $('recordText').value = '';
}

function appendHighlighted(textValue, findings) {
  const target = $('highlightedMessage');
  target.replaceChildren();
  const spans = findings.map(f => ({ start: f.start, end: f.end })).sort((a,b) => a.start - b.start);
  const merged = [];
  for (const span of spans) {
    const last = merged.at(-1);
    if (last && span.start <= last.end) last.end = Math.max(last.end, span.end);
    else merged.push({ ...span });
  }
  let cursor = 0;
  for (const span of merged) {
    target.append(document.createTextNode(textValue.slice(cursor, span.start)));
    const mark = document.createElement('mark');
    mark.textContent = textValue.slice(span.start, span.end);
    target.append(mark);
    cursor = span.end;
  }
  target.append(document.createTextNode(textValue.slice(cursor)));
}

function renderAnalysis() {
  const { findings, stopCount, checkCount } = currentAnalysis;
  text('findingCount', t().signals(findings.length));
  const banner = $('statusBanner');
  banner.className = `status-banner ${stopCount ? 'caution' : checkCount ? 'watch' : ''}`;
  banner.replaceChildren();
  const h = document.createElement('h3');
  const p = document.createElement('p');
  h.textContent = stopCount ? t().cautionTitle : checkCount ? t().watchTitle : t().clearTitle;
  p.textContent = stopCount ? t().cautionCopy : checkCount ? t().watchCopy : t().clearCopy;
  banner.append(h, p);
  const list = $('findingsList');
  list.replaceChildren();
  for (const f of findings) {
    const card = document.createElement('article');
    card.className = 'finding-card';
    const head = document.createElement('div'); head.className = 'finding-head';
    const title = document.createElement('h3'); title.textContent = language === 'en' ? f.en : f.zh;
    const severity = document.createElement('span'); severity.className = `severity ${f.level}`; severity.textContent = f.level === 'stop' ? t().stop : t().investigate;
    head.append(title, severity);
    const quote = document.createElement('blockquote'); quote.className = 'quote'; quote.textContent = `“${f.quote}”`;
    const action = document.createElement('p'); action.textContent = language === 'en' ? f.actionEn : f.actionZh;
    const source = document.createElement('a'); source.href = f.source; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = language === 'en' ? 'Source guidance ↗' : '查看来源指引 ↗';
    card.append(head, quote, action, source); list.append(card);
  }
  if (!findings.length) {
    const empty = document.createElement('div'); empty.className = 'finding-card'; empty.textContent = t().noFindings; list.append(empty);
  }
  appendHighlighted(analyzedText, findings);
  $('results').classList.remove('hidden');
  $('verify').classList.remove('hidden');
  renderDomain();
  renderVerdict();
}

function renderDomain() {
  const result = senderCheck($('senderEmail').value, $('officialSite').value);
  const box = $('domainResult');
  box.className = 'domain-result';
  const value = {
    missing: t().domainMissing,
    'no-email': t().domainNoEmail,
    'invalid-email': t().domainInvalidEmail,
    personal: t().domainPersonal(result.senderDomain),
    'needs-official': t().domainNeedOfficial(result.senderDomain),
    'invalid-url': t().domainInvalidUrl,
    aligned: t().domainAligned(result.senderDomain, result.officialDomain),
    mismatch: t().domainMismatch(result.senderDomain, result.officialDomain)
  }[result.status];
  box.textContent = value;
  if (['personal','mismatch'].includes(result.status)) box.classList.add('alert');
  if (result.status === 'aligned') box.classList.add('ok');
  return result;
}

function renderVerdict() {
  if (!currentAnalysis) return;
  const domain = senderCheck($('senderEmail').value, $('officialSite').value);
  const checks = ['checkSite','checkRole','checkContact'].every(id => $(id).checked);
  const state = currentAnalysis.stopCount ? 'Pause' : domain.status === 'mismatch' || domain.status === 'personal' ? 'Mismatch' : checks && domain.officialDomain ? 'Confirmed' : 'Unverified';
  text('verdictTitle', t()[`verdict${state}`]);
  text('verdictCopy', t()[`verdict${state}Copy`]);
}

function exportRecord() {
  if (!currentAnalysis) return;
  const domain = senderCheck($('senderEmail').value, $('officialSite').value);
  const lines = [
    'OFFERPROOF — personal review record',
    `Created: ${new Date().toISOString()}`,
    'This record does not certify that an offer is genuine or fraudulent.',
    '',
    `Warning signs: ${currentAnalysis.findings.length}`,
    ...currentAnalysis.findings.flatMap(f => [`- ${f.en}: ${redactForExport(f.quote)}`, `  Guidance: ${f.actionEn}`, `  Source: ${f.source}`]),
    '',
    `Sender domain check: ${domain.status}`,
    `Sender domain: ${domain.senderDomain || '(not available)'}`,
    `Independently found site domain: ${domain.officialDomain || '(not available)'}`,
    '',
    'Independent checks (self-reported):',
    ...[['checkSite','Website found independently'],['checkRole','Role found or confirmed'],['checkContact','Recruiter or offer confirmed via official contact']].map(([id,label]) => `- [${$(id).checked ? 'x' : ' '}] ${label}`),
    '',
    'The complete message is intentionally omitted. This record is generated only when you request it.',
    'Automated redaction is limited. Review the record before sharing it.'
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  $('recordText').value = lines.join('\n');
  $('recordPreview').classList.remove('hidden');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'offerproof-review.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

$('langToggle').addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
$('loadRisky').addEventListener('click', () => setSample('risky'));
$('loadOrdinary').addEventListener('click', () => setSample('ordinary'));
$('offerText').addEventListener('input', updateCount);
$('analyzeBtn').addEventListener('click', () => {
  analyzedText = $('offerText').value.trim();
  if (!analyzedText) { $('offerText').focus(); $('offerText').setCustomValidity(t().empty); $('offerText').reportValidity(); return; }
  $('offerText').setCustomValidity('');
  currentAnalysis = analyzeOffer(analyzedText);
  renderAnalysis();
  $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('offerText').addEventListener('input', () => $('offerText').setCustomValidity(''));
['senderEmail','officialSite'].forEach(id => $(id).addEventListener('input', () => {
  ['checkSite','checkRole','checkContact'].forEach(checkId => { $(checkId).checked = false; });
  clearRecordPreview();
  renderDomain(); renderVerdict();
}));
['checkSite','checkRole','checkContact'].forEach(id => $(id).addEventListener('change', () => { clearRecordPreview(); renderVerdict(); }));
$('exportBtn').addEventListener('click', exportRecord);
setLanguage('en');
