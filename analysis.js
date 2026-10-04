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
      /(?:pay|send|transfer|deposit|purchase|buy|fee|charge|cost).{0,55}(?:training|equipment|starter kit|registration|application|activation|processing|upfront|first|refundable)/iu,
      /(?:training|equipment|starter kit|registration|application|activation|processing).{0,55}(?:fee|payment|deposit|pay|transfer|buy|purchase)/iu,
      /(?:先|预|需要|请).{0,16}(?:付|交|缴).{0,16}(?:费|押金|培训|设备|保证金)/u,
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
      /(?:check|cheque).{0,90}(?:send|wire|transfer|return|refund|buy|purchase)/iu,
      /(?:send|wire|transfer|return).{0,90}(?:check|cheque|remaining balance|overpayment)/iu,
      /(?:支票|汇票).{0,35}(?:转账|转回|退回|购买)/u
    ]
  },
  {
    id: 'identity',
    level: 'stop',
    en: 'Sensitive information requested early',
    zh: '过早索取敏感资料',
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
    id: 'easy-income',
    level: 'check',
    en: 'High pay for little work',
    zh: '轻松高薪承诺',
    actionEn: 'Check the role, pay, and employer through an independently found careers page. This signal alone is not proof of fraud.',
    actionZh: '通过独立找到的招聘页面核实岗位和薪酬。仅凭这条不能认定是骗局。',
    source: 'https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams',
    patterns: [
      /(?:easy|simple|little|minimal|no).{0,35}(?:work|effort|experience).{0,55}(?:earn|pay|income|salary|money)/iu,
      /(?:earn|make|salary|income|pay).{0,55}(?:daily|per day|a day|per hour).{0,55}(?:no experience|easy|simple|little effort)/iu,
      /(?:轻松|无需经验|零经验).{0,25}(?:高薪|日赚|日入|赚钱|收入)/u
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
      /(?:contact|message|chat|interview|continue|reply|move).{0,50}(?:telegram|whatsapp|signal)/iu,
      /(?:telegram|whatsapp|signal).{0,50}(?:interview|recruiter|hiring|job|work)/iu,
      /(?:转到|添加|联系|面试).{0,20}(?:Telegram|WhatsApp|电报)/iu
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

function locate(match, text) {
  const boundary = /[.!?。！？\n]/u;
  let start = match.index;
  let end = match.index + match[0].length;
  while (start > 0 && !boundary.test(text[start - 1]) && match.index - start < 90) start--;
  while (end < text.length && !boundary.test(text[end]) && end - (match.index + match[0].length) < 100) end++;
  if (end < text.length && boundary.test(text[end])) end++;
  while (start < end && /\s/u.test(text[start])) start++;
  return { start, end, quote: text.slice(start, end) };
}

function isExplicitDenial(ruleId, quote) {
  if (!['payment', 'identity'].includes(ruleId)) return false;
  const denial = /(?:\b(?:never|will not|won't|do not|don't|no need to|not required to)\b.{0,55}\b(?:ask|request|require|charge|pay|payment|fee|send|provide|share|passport|bank|identity)\b)|(?:(?:不会|绝不|无需|不需要|请勿|不要).{0,30}(?:付款|交费|收费|培训费|押金|身份证|银行卡|护照))/iu;
  return denial.test(quote);
}

function sentenceRanges(text) {
  const ranges = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (/[.!?。！？\n]/u.test(text[i])) {
      ranges.push({ start, end: i + 1 });
      start = i + 1;
    }
  }
  if (start < text.length) ranges.push({ start, end: text.length });
  return ranges;
}

export function analyzeOffer(text) {
  const input = String(text || '').slice(0, 20000);
  const ranges = sentenceRanges(input);
  const findings = RULES.flatMap(rule => {
    const hits = ranges.flatMap(range => rule.patterns.flatMap(pattern => {
      const segment = input.slice(range.start, range.end);
      const match = pattern.exec(segment);
      return match ? [locate({ ...match, index: range.start + match.index }, input)] : [];
    }));
    const hit = hits.filter(candidate => !isExplicitDenial(rule.id, candidate.quote)).sort((a,b) => a.start - b.start)[0];
    return hit ? [{ ...rule, ...hit }] : [];
  });
  return {
    findings,
    stopCount: findings.filter(f => f.level === 'stop').length,
    checkCount: findings.filter(f => f.level === 'check').length
  };
}

export function senderCheck(email, officialUrl) {
  const sender = String(email || '').trim().toLowerCase();
  const official = String(officialUrl || '').trim();
  if (!sender && !official) return { status: 'missing' };
  if (sender && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender)) return { status: 'invalid-email' };
  const senderDomain = sender ? sender.split('@')[1] : undefined;
  let host;
  if (official) {
    try {
      const url = new URL(official.includes('://') ? official : `https://${official}`);
      if (!['http:', 'https:'].includes(url.protocol)) return { status: 'invalid-url' };
      host = url.hostname.toLowerCase().replace(/^www\./, '');
      if (!host.includes('.')) return { status: 'invalid-url' };
    } catch {
      return { status: 'invalid-url' };
    }
  }
  if (!sender) return { status: 'no-email', officialDomain: host };
  const personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me', 'qq.com', '163.com'];
  if (personalDomains.includes(senderDomain)) return { status: 'personal', senderDomain, officialDomain: host };
  if (!host) return { status: 'needs-official', senderDomain };
  const matches = senderDomain === host || senderDomain.endsWith(`.${host}`);
  return { status: matches ? 'aligned' : 'mismatch', senderDomain, officialDomain: host };
}

export function redactForExport(value) {
  return String(value || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu, '[email redacted]')
    .replace(/\+?\d[\d\s().-]{7,}\d/gu, '[number redacted]')
    .replace(/\b\d{6,}\b/gu, '[number redacted]');
}
