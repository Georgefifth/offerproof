export const RULES = [
  {
    id: 'payment',
    level: 'stop',
    en: 'Payment to get the job',
    zh: '入职前要求付款',
    actionEn: 'Do not pay. A job offer should not require an application, training, equipment, or activation fee.',
    actionZh: '先不要付款。不要为申请、培训、设备或激活资格预付费用。',
    source: 'https://consumer.ftc.gov/consumer-alerts/2023/12/how-spot-latest-job-scams',
    patterns: [
      /\b(?:pay|send|transfer|deposit|purchase|buy|fee|charge|cost)\b.{0,55}\b(?:training|equipment|starter kit|registration|application|activation|processing|upfront|first|refundable)\b/iu,
      /\b(?:training|equipment|starter kit|registration|application|activation|processing)\b.{0,55}\b(?:fee|payment|deposit|pay|transfer|buy|purchase)\b/iu,
      /(?:先|预|需要|请).{0,16}(?:付|交|缴).{0,16}(?:费|押金|培训|设备|保证金)/u,
      /(?:培训费|报名费|入职费|保证金|设备费).{0,20}(?:缴纳|支付|转账|交费|付款)/u,
      /(?:yuran|deposit|bayar|pembayaran|fi latihan).{0,35}(?:kerja|latihan|peralatan|pendaftaran)/iu
    ]
  },
  {
    id: 'check',
    level: 'stop',
    en: 'Check or money transfer scheme',
    zh: '支票转账套路',
    actionEn: 'Do not deposit a check and send money back. A displayed bank balance does not prove the check is genuine.',
    actionZh: '不要存入支票后再转出钱。账户显示到账不代表支票真实。',
    source: 'https://consumer.ftc.gov/consumer-alerts/2022/05/want-work-home-spot-scams-first',
    patterns: [
      /\b(?:a|the|this|our|company|cashier.s)\s+(?:check|cheque)\b.{0,90}\b(?:send|wire|transfer|return|refund|buy|purchase)\b/iu,
      /\b(?:send|wire|transfer|return)\b.{0,90}(?:\b(?:a|the|this|our|company)\s+(?:check|cheque)\b|\bremaining balance\b|\boverpayment\b)/iu,
      /(?:支票|汇票).{0,35}(?:转账|转回|退回|购买)/u
    ]
  },
  {
    id: 'identity',
    level: 'stop',
    en: 'Sensitive information requested before verification',
    zh: '核实前索取敏感资料',
    actionEn: 'Do not send identity or bank documents before you independently verify the employer and hiring process.',
    actionZh: '独立核实雇主和招聘流程之前，不要提交身份证明或银行资料。',
    source: 'https://consumer.ftc.gov/consumer-alerts/2025/07/job-scammers-are-looking-hire-you',
    patterns: [
      /(?:send|upload|provide|share|submit|need|require).{0,75}(?:passport|social security|ssn|bank account|routing number|identity card|national id|driver.s licen[cs]e)/iu,
      /(?:passport|social security|ssn|bank account|routing number|identity card|national id|driver.s licen[cs]e).{0,75}(?:before (?:the |your )?interview|right away|today|now)/iu,
      /(?:提供|上传|发送|提交).{0,30}(?:身份证|护照|银行卡|银行账户|银行账号)/u
    ]
  },
  {
    id: 'credentials', level: 'stop',
    en: 'Password or verification code requested', zh: '索取密码或验证码',
    actionEn: 'Do not send passwords or one-time codes to a recruiter. Contact the service through its official app or website if you need to secure an account.',
    actionZh: '不要向招聘人员发送密码或一次性验证码。如需保护账户，请通过服务的官方应用或网站操作。',
    source: 'https://consumer.ftc.gov/consumer-alerts/2024/03/whats-verification-code-why-would-someone-ask-me-it',
    patterns: [
      /(?:send|provide|share|tell|forward|give|submit).{0,45}(?:password|verification code|one[ -]time code|otp|passcode)/iu,
      /(?:password|verification code|one[ -]time code|otp|passcode).{0,35}(?:send|share|forward|recruiter)/iu,
      /(?:提供|发送|告诉|转发|提交|分享).{0,20}(?:密码|验证码|动态口令)/u,
      /把.{0,8}(?:密码|验证码|动态口令).{0,16}(?:发|提交|提供|转发|告诉)/u
    ]
  },
  {
    id: 'easy-income',
    level: 'check',
    en: 'Easy earnings promise',
    zh: '轻松赚钱承诺',
    actionEn: 'Check the role, pay, and employer through an independently found careers page. This signal alone is not proof of fraud.',
    actionZh: '通过独立找到的招聘页面核实岗位和薪酬。仅凭这条不能认定是骗局。',
    source: 'https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams',
    patterns: [
      /\b(?:easy|simple|little|minimal)\b.{0,35}\b(?:work|effort)\b.{0,55}\b(?:earn|pay|income|salary|money)\b/iu,
      /\b(?:earn|make)\b.{0,55}\b(?:daily|per day|a day|per hour)\b.{0,55}\b(?:no experience|easy|simple|little effort)\b/iu,
      /(?:轻松|无需经验|零经验).{0,25}(?:高薪|日赚|日入|赚钱|收入)/u,
      /(?:高薪|日赚|日入).{0,25}(?:轻松|无需经验|零经验)/u
    ]
  },
  {
    id: 'messenger',
    level: 'check',
    en: 'Hiring moved to a private messenger',
    zh: '要求转到私人聊天软件',
    actionEn: 'Verify the recruiter through the employer’s independently found official contact channel.',
    actionZh: '通过独立找到的雇主官方渠道核实招聘人员身份。',
    source: 'https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams',
    patterns: [
      /\b(?:contact|message|chat|interview|continue|reply|move)\b.{0,50}\b(?:telegram|whatsapp|signal)\b/iu,
      /\b(?:telegram|whatsapp|signal)\b.{0,50}\b(?:interview|recruiter|hiring|job|work)\b/iu,
      /(?:转到|添加|联系|面试).{0,20}(?:Telegram|WhatsApp|电报)/iu
    ]
  },
  {
    id: 'task-payment',
    level: 'stop',
    en: 'Paying to unlock work or earnings',
    zh: '充值解锁任务或提现',
    actionEn: 'Do not deposit your money to unlock tasks or withdraw wages. Stop adding funds, even if the platform shows earnings.',
    actionZh: '不要为了接任务或提取工资充值。即使平台显示收益，也先停止转入资金。',
    source: 'https://consumer.ftc.gov/consumer-alerts/2024/11/task-scams-create-illusion-making-money',
    patterns: [
      /(?:deposit|recharge|top[ -]?up|pay|send|transfer).{0,70}(?:unlock|withdraw|release|complete).{0,40}(?:task|earning|commission|wage|balance|payment)/iu,
      /(?:unlock|withdraw|release).{0,45}(?:earning|commission|wage|balance).{0,65}(?:deposit|recharge|top[ -]?up|pay|crypto|USDT)/iu,
      /(?:充值|垫付|转账|补单|买币|购买USDT).{0,35}(?:任务|解锁|提现|佣金|工资|收益)/iu,
      /(?:提现|解锁|领取佣金).{0,30}(?:充值|转账|垫付|保证金|USDT)/iu
    ]
  },
  {
    id: 'pressure',
    level: 'check',
    en: 'Pressure to act immediately',
    zh: '催促立即行动',
    actionEn: 'Pause and verify independently. Urgency is a reason to slow down, not to skip checks.',
    actionZh: '先暂停并独立核实。催促是放慢速度的理由，不是跳过核验的理由。',
    source: 'https://consumer.ftc.gov/consumer-alerts/2025/05/college-students-avoid-scammers-while-you-job-hunt',
    patterns: [
      /(?:within|in the next).{0,15}(?:hour|hours|minute|minutes).{0,45}(?:accept|respond|reply|pay|send|submit)/iu,
      /(?:accept|respond|reply|pay|send|submit).{0,45}(?:immediately|right now|within (?:an? |\d+ )?hour)/iu,
      /(?:立即|马上|限时|今天).{0,20}(?:付款|转账|回复|提交|确认)/u
    ]
  }
];

// Split contrast clauses as well as sentences so a safety claim cannot hide a later request.
// Keep dots inside domains, email addresses, and decimals intact for evidence offsets.
function clauseRanges(text) {
  const boundaries = /[!?。！？\n；;]|(?<![\p{L}\p{N}])\.(?![\p{L}\p{N}])|(?<=[\p{L}\p{N}])\.(?=\s|$)|(?<=\s)(?:but|however|yet|instead|except)\b|[,，:](?=\s*(?:please|you must|you need|send|pay|deposit|provide|submit|upload|先|请|需|必须|提交|转账|充值))|\band\b(?=\s+(?:please|you must|you need|send|pay|deposit|provide|submit|upload)\b)|但是|不过|然而|可是|但/giu;
  const ranges = [];
  let start = 0;
  for (const match of text.matchAll(boundaries)) {
    const punctuation = /^[!?。！？\n；;.]$/u.test(match[0]);
    const end = punctuation ? match.index + match[0].length : match.index;
    if (end > start) ranges.push({ start, end });
    start = match.index + match[0].length;
  }
  if (start < text.length) ranges.push({ start, end: text.length });
  return ranges;
}

function passage(text, range, match) {
  let start = Math.max(range.start, range.start + match.index - 90);
  let end = Math.min(range.end, range.start + match.index + match[0].length + 100);
  while (start < end && /\s/u.test(text[start])) start++;
  while (end > start && /\s/u.test(text[end - 1])) end--;
  return { start, end, quote: text.slice(start, end) };
}

function isExplicitDenial(ruleId, clause, match) {
  if (!['payment', 'identity', 'task-payment', 'check', 'credentials'].includes(ruleId)) return false;
  // Inspect only the text leading to this hit. A denial later in a sentence must
  // not erase an earlier request, and "won't hire until you pay" is not a denial.
  const prefix = clause.slice(0, match.index + match[0].length + 12);
  const target = ruleId === 'identity'
    ? '(?:passport|bank|identity|social security|ssn|national id|driver)'
    : ruleId === 'credentials' ? '(?:password|verification code|one.time code|otp|passcode)'
    : '(?:payment|fee|deposit|transfer|recharge|task|earning|check|cheque|money|training|equipment)';
  const negation = "(?:never|will not|won't|do not|don't|no need to|not required to)";
  const verbs = '(?:ask|request|require|charge|pay|send|provide|share|upload|submit|deposit|transfer|recharge|top[ -]?up)';
  const scope = '(?:(?!\\band\\b|\\buntil\\b|\\bunless\\b|[,，;]).){0,60}';
  const english = new RegExp(`\\b${negation}\\s+(?:ever\\s+)?${verbs}\\b${scope}\\b${target}\\b`, 'iu');
  const chinese = ruleId === 'identity' || ruleId === 'credentials'
    ? /(?:不会|绝不|无需|不需要|请勿|不要)(?:你|您|再|先)?(?:要求|索取|提交|提供|发送|上传|分享).{0,20}(?:身份证|银行卡|护照|银行账号|密码|验证码)/u
    : /(?:不会|绝不|无需|不需要|请勿|不要)(?:你|您|再|先)?(?:要求.{0,6})?(?:付款|交费|收费|交|付|缴|转账|充值|垫付).{0,20}(?:费|金|款|钱|任务|佣金|收益|支票)/u;
  const reversedChinese = ruleId === 'credentials' && /(?:不要|请勿|无需|不需要)把.{0,8}(?:密码|验证码|动态口令).{0,16}(?:发|提交|提供|转发|告诉)/u.test(prefix);
  const suffixDenial = /(?:training|equipment|application|registration).{0,15}fee.{0,12}(?:not required|not needed|not payable)/iu;
  const suffix = suffixDenial.exec(clause);
  const suffixApplies = suffix && suffix.index <= match.index + match[0].length && suffix.index + suffix[0].length >= match.index;
  return english.test(prefix) || chinese.test(prefix) || reversedChinese || (ruleId === 'payment' && suffixApplies);
}

function isLaterOnboarding(clause) {
  const early = /(?:before.{0,20}(?:interview|hir(?:ed|ing))|right away|immediately|面试前|录用前|立即|马上)/iu;
  const later = /(?:after.{0,45}(?:sign(?:ing)?|signed|employment contract|accept(?:ed|ing)?.{0,10}offer|hired)|once.{0,35}(?:hired|contract.{0,15}signed)|入职后|录用后|签(?:署|订).{0,15}(?:合同|协议).{0,8}(?:后|以后))/iu;
  return !early.test(clause) && later.test(clause);
}

export function analyzeOffer(text) {
  const input = String(text || '').slice(0, 20000);
  const ranges = clauseRanges(input);
  const findings = RULES.flatMap(rule => {
    const hits = [];
    for (const range of ranges) {
      const segment = input.slice(range.start, range.end);
      for (const pattern of rule.patterns) {
        const regex = new RegExp(pattern.source, pattern.flags + 'g');
        for (const match of segment.matchAll(regex)) {
          if (isExplicitDenial(rule.id, segment, match)) continue;
          const item = passage(input, range, match);
          item.onboarding = rule.id === 'identity' && isLaterOnboarding(segment);
          if (!hits.some(hit => hit.start === item.start && hit.end === item.end)) hits.push(item);
        }
      }
    }
    if (!hits.length) return [];
    hits.sort((a,b) => a.start - b.start);
    const onlyOnboarding = rule.id === 'identity' && hits.every(hit => hit.onboarding);
    const context = onlyOnboarding ? {
      level: 'check', en: 'Verify the onboarding request', zh: '核实入职资料请求',
      actionEn: 'The message says this is after hiring. Confirm the employer and use its independently verified secure HR channel before sending documents.',
      actionZh: '原文称这是录用后的流程。提交资料前，仍应独立确认雇主，并使用已核实的安全人事渠道。'
    } : {};
    return [{ ...rule, ...context, ...hits[0], evidence: hits }];
  });
  return { findings, stopCount: findings.filter(f => f.level === 'stop').length, checkCount: findings.filter(f => f.level === 'check').length };
}

function normalizeDomain(value) {
  try {
    if (/[\s/@?#:%<>\\]/u.test(value)) return null;
    const host = new URL(`https://${value}`).hostname.toLowerCase().replace(/\.$/, '');
    if (host.length > 253 || !host.includes('.') || /^\d+(?:\.\d+){3}$/.test(host)) return null;
    if (!host.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(label))) return null;
    return host;
  } catch { return null; }
}

export function senderCheck(email, officialUrl) {
  const sender = String(email || '').trim().toLowerCase();
  const official = String(officialUrl || '').trim();
  if (!sender && !official) return { status: 'missing' };
  if (sender && !/^[^\s@<>]+@[^\s@/<>:]+$/u.test(sender)) return { status: 'invalid-email' };
  const senderDomain = sender ? normalizeDomain(sender.split('@')[1]) : undefined;
  if (sender && !senderDomain) return { status: 'invalid-email' };
  let host;
  if (official) {
    try {
      const url = new URL(official.includes('://') ? official : `https://${official}`);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return { status: 'invalid-url' };
      host = normalizeDomain(url.hostname.replace(/^www\./, ''));
      if (!host) return { status: 'invalid-url' };
    } catch { return { status: 'invalid-url' }; }
  }
  if (!sender) return { status: 'no-email', officialDomain: host };
  const personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me', 'qq.com', '163.com'];
  if (personalDomains.includes(senderDomain)) return { status: 'personal', senderDomain, officialDomain: host };
  if (!host) return { status: 'needs-official', senderDomain };
  const matches = senderDomain === host || senderDomain.endsWith(`.${host}`);
  return { status: matches ? 'aligned' : 'mismatch', senderDomain, officialDomain: host };
}

export function reviewState(analysis, domain, checks) {
  if (analysis.stopCount) return 'Pause';
  if (['mismatch', 'personal'].includes(domain.status)) return checks && domain.officialDomain ? 'DomainReview' : 'Mismatch';
  if (!checks || !domain.officialDomain || !['aligned', 'no-email'].includes(domain.status)) return 'Unverified';
  return analysis.checkCount ? 'Review' : 'Confirmed';
}

export function redactForExport(value) {
  return String(value || '')
    .replace(/https?:\/\/[^\s<>]+/giu, match => {
      try { return `[link: ${new URL(match).hostname}]`; } catch { return '[link redacted]'; }
    })
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu, '[email redacted]')
    .replace(/\+?\d[\d\s().-]{7,}\d/gu, match => /^\d{4}-\d{2}-\d{2}$/u.test(match) ? match : '[number redacted]')
    .replace(/\b\d{6,}\b/gu, '[number redacted]');
}
