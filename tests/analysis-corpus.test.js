import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeOffer, senderCheck, reviewState, redactForExport } from '../analysis.js';
import { createRecord } from '../record.js';

// Synthetic examples adapted from the cited scam mechanisms; not real user reports
// and not an accuracy benchmark. Each case isolates a specific failure mode.
const cases = [
  ['contrast does not hide payment', 'We will not charge an application fee, but please pay a training fee to begin.', 'payment', 'stop'],
  ['Chinese contrast', '不用交报名费，但是请先交培训费。', 'payment', 'stop'],
  ['semicolon scopes denial', 'We will never ask for money; pay a registration fee to activate the job.', 'payment', 'stop'],
  ['new request after comma', 'We will not charge an application fee, please pay a training fee.', 'payment', 'stop'],
  ['coordinated new request', 'We will not request a passport and you must provide your bank account now.', 'identity', 'stop'],
  ['ordinary scheduling', 'Please confirm your availability for a video interview next Tuesday.', null],
  ['safety statement', 'We will never ask you to pay a training fee or share bank account details.', null],
  ['Chinese safety statement', '请勿提供身份证，不需要交培训费。', null],
  ['after hiring is still a check', 'Please provide your bank account after you sign the employment contract.', 'identity', 'check'],
  ['Chinese onboarding', '请在签署劳动合同后提交银行账号。', 'identity', 'check'],
  ['early request overrides later claim', 'Send your passport before your interview, after signing our form.', 'identity', 'stop'],
  ['payment remains a stop after contract', 'After signing the contract, pay the equipment fee.', 'payment', 'stop'],
  ['task deposit', 'Deposit $100 to unlock your next tasks and commission.', 'task-payment', 'stop'],
  ['withdrawal fee', 'Withdraw your earnings after you pay a deposit in USDT.', 'task-payment', 'stop'],
  ['Chinese task', '请充值500元，解锁任务后才能提现佣金。', 'task-payment', 'stop'],
  ['Chinese withdrawal', '提现之前需要充值保证金。', 'task-payment', 'stop'],
  ['task safety statement', 'Do not deposit money to unlock tasks or withdraw earnings.', null],
  ['fake check', 'Deposit this cheque, then transfer the remaining balance to our supplier.', 'check', 'stop'],
  ['ordinary bank deposit', 'Your wages will be deposited directly into your account each month.', null],
  ['messenger invitation', 'Please contact our recruiter on WhatsApp to continue the interview.', 'messenger', 'check'],
  ['ordinary mention of app', 'Our team develops a Telegram integration for customers.', null],
  ['urgency', 'Send your response within 1 hour to secure the position.', 'pressure', 'check'],
  ['normal deadline', 'Please respond by Friday if you are available for an interview.', null],
  ['decimal and domain preserved', 'Visit hr.example.com, then pay a refundable training fee of $75.50.', 'payment', 'stop'],
  ['Chinese payment reversed', '培训费需要缴纳之后才能入职。', 'payment', 'stop'],
  ['Malay payment', 'Bayar yuran pendaftaran untuk kerja ini.', 'payment', 'stop'],
  ['no input', '', null],
  ['punctuationless request', 'please pay a refundable equipment fee', 'payment', 'stop'],
  ['conditional refusal is not a safety statement', 'We will not hire you until you pay a training fee.', 'payment', 'stop'],
  ['conditional identity request', 'We will not interview you until you provide your passport.', 'identity', 'stop'],
  ['early request followed by denial stays visible', 'Pay the registration fee and never pay other fees.', 'payment', 'stop'],
  ['credentials', 'Please send your verification code to the recruiter.', 'credentials', 'stop'],
  ['Chinese credentials', '请把短信验证码提供给我们。请发送验证码来确认入职。', 'credentials', 'stop'],
  ['credentials denial', 'We will never ask you to share your password or verification code.', null],
  ['ordinary account setup', 'Create a password on the official HR portal after verifying the employer.', null],
  ['check is a verb', 'Check our careers page and send your resume to the listed address.', null],
  ['coffee is not a fee', 'Coffee training and equipment orientation are included in the internship.', null],
  ['ordinary entry-level pay', 'No experience required, pay is $15 per hour.', null],
  ['Chinese code safety', '不要把短信验证码告诉其他人。', null],
  ['Chinese code request reversed', '请把短信验证码提供给招聘人员。', 'credentials', 'stop'],
  ['no need to pay', 'You do not need to pay a training fee.', null],
  ['no fee noun statement', 'There is no training fee to pay.', null],
  ['plural passwords denial', 'We never ask you to send passwords or verification codes.', null],
  ['passive identity denial', 'You will not be asked to provide your passport before interview.', null],
  ['plural passports denial', 'We will not request passports before hiring.', null],
  ['no need contrast still flags', 'You do not need to pay a training fee, but you must pay an equipment deposit.', 'payment', 'stop'],
  ['no fee does not hide another fee', 'No training fee, only pay the equipment deposit.', 'payment', 'stop'],
  ['passive denial does not hide conditional demand', 'You will not be hired until you send your password.', 'credentials', 'stop']
];
for (const [name, message, id, level] of cases) {
  test(name, () => {
    const result = analyzeOffer(message);
    if (id === null) assert.equal(result.findings.length, 0);
    else assert.ok(result.findings.some(f => f.id === id && f.level === level), JSON.stringify(result.findings.map(f => ({ id: f.id, level: f.level }))));
    for (const f of result.findings) for (const e of f.evidence) assert.equal(message.slice(e.start, e.end), e.quote);
  });
}

test('multiple payment passages remain available and highlightable', () => {
  const message = 'Pay the registration fee. Later pay the equipment fee.';
  const payment = analyzeOffer(message).findings.find(f => f.id === 'payment');
  assert.equal(payment.evidence.length, 2);
});

test('invalid or deceptive site strings cannot complete a review', () => {
  for (const url of ['https://company.com@evil.test', 'https://127.0.0.1', 'https://.com', 'file:///etc/passwd', 'https://bad_host.test']) {
    const domain = senderCheck('hr@company.com', url);
    assert.equal(domain.status, 'invalid-url');
    assert.equal(reviewState({ stopCount: 0, checkCount: 0 }, domain, true), 'Unverified');
  }
});

test('international domains are normalized consistently', () => {
  const domain = senderCheck('hr@bücher.de', 'https://bücher.de');
  assert.equal(domain.status, 'aligned');
  assert.equal(domain.senderDomain, 'xn--bcher-kva.de');
});

test('email domains cannot contain URL fragments or paths', () => {
  for (const email of ['hr@company.com#fake', 'hr@company.com?fake', 'hr@company.com\\evil', 'hr@company.com/path']) {
    assert.equal(senderCheck(email, 'https://company.com').status, 'invalid-email');
  }
});

test('ordinary confirmation dates survive export redaction', () => {
  assert.equal(redactForExport('Confirmed on 2026-10-05 via official email.'), 'Confirmed on 2026-10-05 via official email.');
});

test('remaining warning signs stay visible despite a completed checklist', () => {
  const analysis = analyzeOffer('Contact the recruiter on Telegram for the interview.');
  assert.equal(reviewState(analysis, { status: 'aligned', officialDomain: 'company.com' }, true), 'Review');
});

test('an independently checked recruiting agency can be recorded without erasing domain caution', () => {
  assert.equal(reviewState({ stopCount: 0, checkCount: 0 }, { status: 'mismatch', officialDomain: 'company.com' }, true), 'DomainReview');
  assert.equal(reviewState({ stopCount: 0, checkCount: 0 }, { status: 'mismatch', officialDomain: 'company.com' }, false), 'Mismatch');
});

test('URL query tokens are omitted from exported notes', () => {
  assert.equal(redactForExport('Checked https://company.com/jobs?token=secret#name'), 'Checked [link: company.com]');
});

test('Chinese record includes localized guidance, notes, and self-reported checks', () => {
  const record = createRecord({ analysis: analyzeOffer('请先交培训费。'), domain: { status: 'no-email', officialDomain: 'company.com' }, checks: [true, false, false], notes: '联系 jane@example.com，岗位 https://company.com/jobs?token=secret', language: 'zh', verdict: '先停下，独立核实。', created: '2026-10-05T00:00:00Z' });
  assert.match(record, /个人核验记录/);
  assert.match(record, /入职前要求付款/);
  assert.match(record, /由你自行标记/);
  assert.doesNotMatch(record, /jane@example.com|token=secret/);
  assert.match(record, /\[x\] 独立找到公司官网/);
});
