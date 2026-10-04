import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeOffer, senderCheck, redactForExport } from './analysis.js';

test('direct payment and pre-interview identity request trigger high-impact warnings', () => {
  const message = 'To activate your position, pay a refundable training fee today. Send your passport and bank account before your interview.';
  const result = analyzeOffer(message);
  assert.deepEqual(result.findings.filter(f => f.level === 'stop').map(f => f.id).sort(), ['identity', 'payment']);
  for (const finding of result.findings) assert.equal(message.slice(finding.start, finding.end), finding.quote);
});

test('ordinary scheduling message gets no listed warning and is never certified as safe', () => {
  const result = analyzeOffer('Thank you for applying. We would like to schedule a 30-minute interview next Tuesday.');
  assert.equal(result.findings.length, 0);
  assert.equal(result.stopCount, 0);
});

test('Chinese payment request is detected', () => {
  assert.ok(analyzeOffer('请先交培训费，今天确认岗位。').findings.some(f => f.id === 'payment'));
});

test('explicit safety statements do not become payment or identity warnings', () => {
  const result = analyzeOffer('We will never ask you to pay a training fee. We will not request your passport before an interview.');
  assert.equal(result.findings.filter(f => ['payment','identity'].includes(f.id)).length, 0);
});

test('a later payment request is still found after a safety statement', () => {
  const result = analyzeOffer('We never ask you to pay a training fee. To activate your account, pay a registration fee now.');
  assert.ok(result.findings.some(f => f.id === 'payment' && f.quote.includes('pay a registration fee')));
});

test('sender domain comparison does not treat lookalike suffix as aligned', () => {
  assert.equal(senderCheck('hr@company.com.evil.test', 'https://company.com').status, 'mismatch');
  assert.equal(senderCheck('hr@careers.company.com', 'https://company.com').status, 'aligned');
  assert.equal(senderCheck('hr@gmail.com', 'https://company.com').status, 'personal');
});

test('unsupported URL schemes cannot be treated as company websites', () => {
  assert.equal(senderCheck('hr@company.com', 'javascript:alert(1)').status, 'invalid-url');
});

test('SMS offers can skip email comparison while retaining an independently found site', () => {
  assert.deepEqual(senderCheck('', 'https://company.com'), { status: 'no-email', officialDomain: 'company.com' });
});

test('shared evidence excerpts redact common contact and account formats', () => {
  const redacted = redactForExport('Send to jane@example.com or +1 (555) 123-4567; account 123456789. Fee $75.');
  assert.ok(!redacted.includes('jane@example.com'));
  assert.ok(!redacted.includes('123456789'));
  assert.ok(redacted.includes('$75'));
});
