import { analyzeOffer, senderCheck, reviewState } from './analysis.js';
import { createRecord } from './record.js';

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
Object.assign(translations.en, {
  tryExample: 'TRY A FICTIONAL EXAMPLE', recoveryCountry: 'OFFICIAL HELP IN YOUR COUNTRY', chooseCountry: 'Choose your country', countryMY: 'Malaysia', countrySG: 'Singapore', countryUS: 'United States', countryOther: 'Other country', officialHelp: 'Official guidance ↗',
  recoveryMY: 'Malaysia: contact your bank immediately. Call NSRC 997 for online financial scam response.', recoverySG: 'Singapore: contact your bank immediately. Call ScamShield 1799 for advice and reporting guidance.', recoveryUS: 'United States: contact your bank or payment provider immediately. Report the incident to the FTC; use IdentityTheft.gov if identity information was shared.', recoveryOther: 'Contact your bank or payment provider immediately. Find your country’s official police or government fraud reporting service independently.',
  taskSample: 'Task job ↗', continueCheck: 'Continue to the independent check ↓', messageEvidence: 'WHOLE MESSAGE WITH HIGHLIGHTS',
  missingSite: 'You marked the checks complete. Add the official website you found independently to finish this record.', invalidInputs: 'Correct the email or website field above before completing this record.',
  limit: 'This paste exceeds 20,000 characters. Shorten it before pasting; your existing message was kept unchanged.',
  skip: 'Skip to the offer checker', reset: 'Clear this review', resetConfirm: 'Clear the message, checks, and notes in this tab?', cleared: 'Review cleared.', changed: 'Message changed. Examine it again to update the results.',
  export: 'Review & export record ↓', download: 'Download .txt', copyRecord: 'Copy record', copied: 'Copied.', copyFallback: 'Text selected. Press Ctrl+C or ⌘C to copy.', reviewBeforeSharing: 'Review this record before sharing it. Redaction is limited.',
  recordPreviewLabel: 'YOUR RECORD — REVIEW BEFORE SHARING', notesSummary: 'Add evidence notes (optional)', notesLabel: 'WHAT DID YOU CHECK?', notesHint: 'Notes stay in this tab. Avoid identity numbers or passwords. Exports redact common contacts and keep only the domain of links.', notesPlaceholder: 'Official role page, confirmation date, or how you contacted the employer…',
  questions: 'Prepare questions for the employer', questionsHint: 'Use contact details you found independently.', questionsLabel: 'QUESTIONS FOR THE OFFICIAL CONTACT', copyQuestions: 'Copy questions',
  questionTemplate: 'Hello, I found your contact details independently on your official website. Could you please confirm:\n\n1. Is this specific role currently open at your company?\n2. Is the person who contacted me authorized to recruit for it?\n3. What is the official interview and onboarding process, including any request for payment or documents?\n\nI will wait for confirmation before sending money or identity documents. Thank you.',
  progress: n => `${n} of 3 checks recorded`, moreEvidence: n => `${n} more matching passage${n === 1 ? '' : 's'}`,
  verdictConfirmed: 'Your independent checks are recorded.', verdictConfirmedCopy: 'You marked all three checks complete. Keep the supporting evidence. This remains your own report, not employer verification by OfferProof.',
  verdictDomainReview: 'Checks recorded; the sender domain still needs context.', verdictDomainReviewCopy: 'You marked recruiter confirmation complete. Keep the company’s response explaining the separate or personal email domain; OfferProof cannot verify that relationship.',
  verdictReview: 'Checks recorded; warning signs remain.', verdictReviewCopy: 'Review the warning passages with the employer through its official contact. Completed boxes do not remove these concerns.',
  domainInvalidUrl: 'Enter a public website domain without login details, such as https://company.com.',
  domainMismatch: (a,b) => `The sender domain ${a} differs from ${b}. An agency or hiring portal may use a different domain; confirm the connection through the company’s official contact.`
});
Object.assign(translations.zh, {
  tryExample: '试试虚构示例', recoveryCountry: '所在国家的官方求助渠道', chooseCountry: '选择所在国家', countryMY: '马来西亚', countrySG: '新加坡', countryUS: '美国', countryOther: '其他国家', officialHelp: '官方指引 ↗',
  recoveryMY: '马来西亚：立即联系银行。拨打 NSRC 997 寻求网络金融诈骗的紧急响应。', recoverySG: '新加坡：立即联系银行。拨打 ScamShield 1799 获取建议及举报指引。', recoveryUS: '美国：立即联系银行或支付平台，并向 FTC 举报。如已泄露身份资料，可使用 IdentityTheft.gov。', recoveryOther: '立即联系银行或支付平台，并独立查找所在国家的警方或政府官方诈骗举报渠道。',
  taskSample: '任务兼职 ↗', continueCheck: '继续独立核验 ↓', messageEvidence: '查看完整原文和高亮',
  missingSite: '你已标记完成核验，请填写独立找到的官网，以完成这份记录。', invalidInputs: '完成记录之前，请先修正上方的邮箱或官网地址。',
  limit: '这次粘贴超过20,000字，请缩短后重新粘贴。原有内容未被替换。',
  skip: '跳到邀约检查', reset: '清空本次核验', resetConfirm: '清空这个标签页中的邀约、勾选项和笔记？', cleared: '本次核验已清空。', changed: '原文已修改，请重新检查以更新结果。',
  export: '查看及导出核验记录 ↓', download: '下载 .txt', copyRecord: '复制记录', copied: '已复制。', copyFallback: '文字已选中，请按 Ctrl+C 或 ⌘C 复制。', reviewBeforeSharing: '分享前请检查这份记录，自动遮盖的范围有限。',
  recordPreviewLabel: '核验记录 — 分享前请检查', notesSummary: '添加核验证据笔记（选填）', notesLabel: '你核实了什么？', notesHint: '笔记只留在这个标签页。不要填证件号码或密码。导出时会遮盖常见联系方式，链接只保留域名。', notesPlaceholder: '官方岗位页面、确认日期，或你联系雇主的方式……',
  questions: '准备向雇主核实的问题', questionsHint: '请使用独立找到的联系方式。', questionsLabel: '发给官方联系人的问题', copyQuestions: '复制问题',
  questionTemplate: '您好，我独立从贵公司的官网找到了联系方式。请帮忙确认：\n\n1. 贵公司目前是否正在招聘这个具体岗位？\n2. 联系我的人员是否获授权招聘该岗位？\n3. 正式面试和入职流程是什么？其中是否涉及付款或提交资料？\n\n得到确认之前，我会先暂停付款或发送身份证明资料。谢谢。',
  progress: n => `已记录 ${n} / 3 项核验`, moreEvidence: n => `另外 ${n} 处匹配原文`,
  verdictConfirmed: '已记录你的独立核验。', verdictConfirmedCopy: '你标记完成了三项核验，请保留支持证据。这是你自己的记录，并非 OfferProof 已验证雇主身份。',
  verdictDomainReview: '核验已记录，仍需保留域名差异的解释。', verdictDomainReviewCopy: '你已标记确认招聘人员身份。请保留公司对不同域名或私人邮箱的正式说明；OfferProof 无法验证双方关系。',
  verdictReview: '核验已记录，风险线索仍需确认。', verdictReviewCopy: '请通过雇主的官方渠道确认这些原文线索。完成勾选不会消除疑点。',
  domainInvalidUrl: '请输入不含登录资料的公开网站域名，例如 https://company.com。',
  domainMismatch: (a,b) => `发件域名 ${a} 与 ${b} 不同。招聘代理或招聘平台可能使用不同域名，请通过公司官方渠道确认双方关系。`
});

const samples = {
  en: {
    risky: 'Hello! We are delighted to offer you a remote student assistant position at Northstar Studio. You can earn $300 per day with no experience. Please contact our recruiter on Telegram for the next step. To activate your position, pay a refundable training fee of $75 today. Send your passport and bank account details before your interview so we can prepare payroll.',
    ordinary: 'Hello, thank you for applying for the summer design internship at Northstar Studio. We would like to schedule a 30-minute interview next Tuesday. Please confirm your availability. You can review the role on our careers page. We will not request payment or financial documents during the interview process.',
    task: 'We are hiring students to rate products online for Northstar Studio. To continue, deposit $100 in USDT to unlock your next tasks and withdraw your commission. The balance shown in the app will be released after this payment.'
  },
  zh: {
    risky: '你好！北辰工作室邀请你担任远程学生助理，零经验也能轻松日赚高薪。请添加 Telegram 联系人进行面试。请先交75元培训费，激活后即可上岗。请在面试前提交护照和银行账号，以便提前准备工资。',
    ordinary: '你好，感谢你申请北辰工作室的暑期设计实习。我们想在下周二安排一次30分钟面试，请确认方便的时间。你可以独立在我们的官网招聘页查看岗位。我们不会要求你支付培训费，也不会在面试前索取身份证或银行账号。',
    task: '北辰工作室招募学生兼职，在平台上评价商品。请先充值500元USDT，解锁下一组任务并提现佣金。平台显示的收益会在完成充值后到账。'
  }
};

let language = 'en';
let currentAnalysis = null;
let analyzedText = '';
let verificationInputs = { sender: '', host: undefined };
const t = () => translations[language];
function inputFeedback(key = '') {
  $('inputStatus').dataset.key = key; text('inputStatus', key ? t()[key] : '');
  if (['empty', 'limit'].includes(key)) $('offerText').setCustomValidity(t()[key]);
}

function setLanguage(next) {
  const hadRecord = !$('recordPreview').classList.contains('hidden');
  language = next;
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = t()[el.dataset.i18n];
    if (typeof value === 'string') el.textContent = value;
  });
  Object.entries(t().placeholders).forEach(([id, value]) => { $(id).placeholder = value; });
  $('langToggle').textContent = next === 'en' ? '中文' : 'English';
  $('langToggle').setAttribute('aria-label', next === 'en' ? 'Switch to Chinese' : '切换为英文');
  $('evidenceNotes').placeholder = t().notesPlaceholder;
  $('results').setAttribute('aria-label', next === 'en' ? 'Analysis results' : '检查结果');
  $('verify').setAttribute('aria-label', next === 'en' ? 'Independent verification' : '独立核验');
  $('highlightedMessage').setAttribute('aria-label', next === 'en' ? 'Message evidence' : '原文证据');
  $('questionsText').value = t().questionTemplate;
  $('questionsStatus').textContent = '';
  if ($('inputStatus').dataset.key) inputFeedback($('inputStatus').dataset.key);
  if (currentAnalysis) renderAnalysis();
  renderDomain();
  renderVerdict();
  renderRecovery();
  if (hadRecord && currentAnalysis) prepareRecord(false);
}

function setSample(kind) {
  currentAnalysis = null;
  analyzedText = '';
  $('evidenceNotes').value = '';
  inputFeedback();
  $('offerText').setCustomValidity('');
  $('questionsPanel').classList.add('hidden');
  $('questionsBtn').setAttribute('aria-expanded', 'false');
  document.querySelector('.evidence-details').open = false;
  clearRecordPreview();
  $('results').classList.add('hidden');
  $('verify').classList.add('hidden');
  $('offerText').value = samples[language][kind];
  $('senderEmail').value = kind === 'risky' ? 'talent.northstar@gmail.com' : kind === 'ordinary' ? 'maya@northstar.example' : '';
  $('officialSite').value = kind !== 'ordinary' ? 'https://northstar.example' : '';
  ['checkSite','checkRole','checkContact'].forEach(id => { $(id).checked = false; });
  syncVerificationInputs();
  updateCount();
  $('offerText').focus();
}

function syncVerificationInputs() {
  verificationInputs = { sender: $('senderEmail').value.trim().toLowerCase(), host: senderCheck('', $('officialSite').value).officialDomain };
}

function updateCount() {
  $('charCount').textContent = `${$('offerText').value.length.toLocaleString()} / 20,000`;
  if (currentAnalysis && $('offerText').value !== analyzedText) {
    currentAnalysis = null;
    inputFeedback('changed');
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
  const spans = findings.flatMap(f => f.evidence || [f]).map(f => ({ start: f.start, end: f.end })).sort((a,b) => a.start - b.start);
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
    card.append(head, quote);
    if (f.evidence?.length > 1) {
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.textContent = t().moreEvidence(f.evidence.length - 1);
      details.append(summary);
      for (const item of f.evidence.slice(1)) {
        const extra = document.createElement('blockquote'); extra.className = 'quote'; extra.textContent = `“${item.quote}”`; details.append(extra);
      }
      card.append(details);
    }
    card.append(action, source); list.append(card);
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
  text('checkProgress', t().progress(['checkSite','checkRole','checkContact'].filter(id => $(id).checked).length));
  const state = reviewState(currentAnalysis, domain, checks);
  document.querySelector('.verdict').className = `verdict panel state-${state.toLowerCase()}`;
  text('verdictTitle', t()[`verdict${state}`]);
  const copy = state === 'Unverified' && checks ? (['invalid-email', 'invalid-url'].includes(domain.status) ? t().invalidInputs : t().missingSite) : t()[`verdict${state}Copy`];
  text('verdictCopy', copy);
}

function prepareRecord(focus = true) {
  if (!currentAnalysis) return;
  $('recordText').value = createRecord({
    analysis: currentAnalysis, domain: senderCheck($('senderEmail').value, $('officialSite').value),
    checks: ['checkSite','checkRole','checkContact'].map(id => $(id).checked), notes: $('evidenceNotes').value,
    language, verdict: $('verdictTitle').textContent
  });
  $('recordPreview').classList.remove('hidden');
  text('recordStatus', t().reviewBeforeSharing);
  if (focus) $('recordText').focus();
}

function downloadRecord() {
  if (!currentAnalysis || !$('recordText').value) return;
  const blob = new Blob([$('recordText').value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'offerproof-review.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(id, statusId) {
  const field = $(id);
  try { await navigator.clipboard.writeText(field.value); text(statusId, t().copied); }
  catch { field.focus(); field.select(); text(statusId, t().copyFallback); }
}

function renderRecovery() {
  const country = $('recoveryCountry').value;
  const keys = { my: 'MY', sg: 'SG', us: 'US', other: 'Other' };
  const urls = {
    my: 'https://www.malaysia.gov.my/en/categories/safety-community-and-law--order/cybersecurity/nsrc-997-hotline',
    sg: 'https://www.scamshield.gov.sg/check-for-scams/scamshield-helpline/',
    us: 'https://reportfraud.ftc.gov/'
  };
  text('recoveryLocal', country ? t()[`recovery${keys[country]}`] : '');
  $('recoveryOfficial').classList.toggle('hidden', !urls[country]);
  if (urls[country]) $('recoveryOfficial').href = urls[country];
  else $('recoveryOfficial').removeAttribute('href');
}

function resetReview() {
  if (($('offerText').value || $('evidenceNotes').value) && !window.confirm(t().resetConfirm)) return;
  setSample('ordinary');
  ['offerText', 'senderEmail', 'officialSite'].forEach(id => { $(id).value = ''; });
  syncVerificationInputs();
  updateCount();
  inputFeedback('cleared');
  $('offerText').focus();
}

$('langToggle').addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
$('loadRisky').addEventListener('click', () => setSample('risky'));
$('loadOrdinary').addEventListener('click', () => setSample('ordinary'));
$('loadTask').addEventListener('click', () => setSample('task'));
$('offerText').addEventListener('input', updateCount);
$('analyzeBtn').addEventListener('click', () => {
  if ($('inputStatus').dataset.key === 'limit') { $('offerText').focus(); $('offerText').reportValidity(); return; }
  analyzedText = $('offerText').value;
  if (!analyzedText.trim()) { inputFeedback('empty'); $('offerText').focus(); $('offerText').setCustomValidity(t().empty); $('offerText').reportValidity(); return; }
  $('offerText').setCustomValidity('');
  inputFeedback();
  currentAnalysis = analyzeOffer(analyzedText);
  $('messageEvidence').open = !matchMedia('(max-width: 800px)').matches;
  renderAnalysis();
  $('resultTitle').focus({ preventScroll: true });
  $('results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});
$('offerText').addEventListener('input', () => {
  $('offerText').setCustomValidity('');
  if (['empty', 'cleared', 'limit'].includes($('inputStatus').dataset.key)) inputFeedback();
});
['senderEmail','officialSite'].forEach(id => $(id).addEventListener('input', () => {
  const host = senderCheck('', $('officialSite').value).officialDomain;
  const sender = $('senderEmail').value.trim().toLowerCase();
  if (host !== verificationInputs.host) ['checkSite','checkRole','checkContact'].forEach(checkId => { $(checkId).checked = false; });
  else if (sender !== verificationInputs.sender) $('checkContact').checked = false;
  syncVerificationInputs();
  clearRecordPreview();
  renderDomain(); renderVerdict();
}));
['checkSite','checkRole','checkContact'].forEach(id => $(id).addEventListener('change', () => { clearRecordPreview(); renderVerdict(); }));
$('exportBtn').addEventListener('click', () => prepareRecord());
$('downloadBtn').addEventListener('click', downloadRecord);
$('copyRecord').addEventListener('click', () => copyText('recordText', 'recordStatus'));
$('copyQuestions').addEventListener('click', () => copyText('questionsText', 'questionsStatus'));
$('evidenceNotes').addEventListener('input', clearRecordPreview);
$('recoveryCountry').addEventListener('change', renderRecovery);
$('resetBtn').addEventListener('click', resetReview);
$('questionsBtn').addEventListener('click', () => {
  const open = $('questionsPanel').classList.toggle('hidden') === false;
  $('questionsBtn').setAttribute('aria-expanded', String(open));
  if (open) { $('questionsStatus').textContent = ''; $('questionsText').value = t().questionTemplate; $('questionsText').focus(); }
});
$('offerText').addEventListener('paste', event => {
  const value = event.clipboardData?.getData('text/plain');
  if (value == null) return;
  const field = $('offerText');
  const length = field.value.length - (field.selectionEnd - field.selectionStart) + value.length;
  if (length > field.maxLength) { event.preventDefault(); inputFeedback('limit'); }
});
$('offerText').addEventListener('keydown', event => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); $('analyzeBtn').click(); }
});
setLanguage('en');
