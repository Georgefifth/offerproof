import { redactForExport } from './analysis.js';

const labels = {
  en: {
    title: 'OFFERPROOF — personal review record', created: 'Created', caveat: 'This record does not certify that an offer is genuine or fraudulent.',
    verdict: 'Review outcome', warnings: 'Warning signs', guidance: 'Guidance', source: 'Source', domainCheck: 'Sender domain check', sender: 'Sender domain', site: 'Independently found site domain',
    checks: 'Independent checks (self-reported)', checkLabels: ['Website found independently', 'Role found or confirmed', 'Recruiter or offer confirmed via official contact'],
    notes: 'Your evidence notes', missing: '(not available)', omitted: 'The complete message is intentionally omitted. Nothing is saved or uploaded by this app.',
    redaction: 'Automated redaction is limited. Review this record before sharing it.',
    states: { missing: 'Not entered', 'no-email': 'No sender email; verify via official contact', 'invalid-email': 'Invalid email', 'invalid-url': 'Invalid website', personal: 'Personal email domain', 'needs-official': 'Official site needed', aligned: 'Domains align; not proof of identity', mismatch: 'Domains differ; explanation needed' }
  },
  zh: {
    title: 'OFFERPROOF — 个人核验记录', created: '生成时间', caveat: '这份记录不能证明邀约真实，也不能认定其为诈骗。',
    verdict: '核验状态', warnings: '风险线索', guidance: '建议行动', source: '来源', domainCheck: '发件域名核对', sender: '发件域名', site: '独立找到的官网域名',
    checks: '独立核验（由你自行标记）', checkLabels: ['独立找到公司官网', '找到或确认具体岗位', '通过官方渠道确认招聘人员或邀约'],
    notes: '你的核验笔记', missing: '（未提供）', omitted: '完整邀约原文已省略。本工具不会保存或上传内容。',
    redaction: '自动遮盖的范围有限，分享前请检查这份记录。',
    states: { missing: '未填写', 'no-email': '没有邮箱，请通过官方渠道核实', 'invalid-email': '邮箱格式无效', 'invalid-url': '官网地址无效', personal: '私人邮箱域名', 'needs-official': '需填写独立找到的官网', aligned: '域名一致，不能证明身份', mismatch: '域名不同，需独立确认原因' }
  }
};

export function createRecord({ analysis, domain, checks, notes = '', language = 'en', verdict = '', created = new Date().toISOString() }) {
  const l = labels[language] || labels.en;
  const zh = language === 'zh';
  const redact = value => {
    const clean = redactForExport(value);
    return zh ? clean.replaceAll('[email redacted]', '[邮箱已遮盖]').replaceAll('[number redacted]', '[号码已遮盖]').replaceAll('[link:', '[链接域名:') : clean;
  };
  const lines = [l.title, `${l.created}: ${created}`, l.caveat, '', `${l.verdict}: ${verdict}`, `${l.warnings}: ${analysis.findings.length}`];
  for (const f of analysis.findings) {
    lines.push(`- ${zh ? f.zh : f.en}`);
    for (const item of f.evidence || [f]) lines.push(`  “${redact(item.quote)}”`);
    lines.push(`  ${l.guidance}: ${zh ? f.actionZh : f.actionEn}`, `  ${l.source}: ${f.source}`);
  }
  lines.push('', `${l.domainCheck}: ${l.states[domain.status] || domain.status}`, `${l.sender}: ${domain.senderDomain || l.missing}`, `${l.site}: ${domain.officialDomain || l.missing}`, '', l.checks);
  l.checkLabels.forEach((label, i) => lines.push(`- [${checks[i] ? 'x' : ' '}] ${label}`));
  if (notes.trim()) lines.push('', l.notes, redact(notes.slice(0, 1000)));
  lines.push('', l.omitted, l.redaction);
  return lines.join('\n');
}
