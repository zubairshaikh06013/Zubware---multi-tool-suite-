import { calculatePartnership, type PartnershipPlan } from './partnership';
export interface AgreementParty { address: string; duties: string; }
export interface AgreementDetails {
  business: string; activity: string; address: string; country: string; state: string; place: string;
  date: string; startDate: string; duration: string; distribution: string; management: string;
  banking: string; noticeDays: number; disputes: string; additional: string;
  parties: Record<string, AgreementParty>; witnesses: { name: string; address: string }[];
  includeIllustration: boolean;
}
export function emptyAgreementDetails(): AgreementDetails {
  return { business: '', activity: '', address: '', country: 'India', state: '', place: '', date: '', startDate: '', duration: '', distribution: '', management: '', banking: '', noticeDays: 30, disputes: '', additional: '', parties: {}, witnesses: [{ name: '', address: '' }, { name: '', address: '' }], includeIllustration: true };
}
export function agreementIssues(plan: PartnershipPlan, d: AgreementDetails): string[] {
  const issues: string[] = [];
  if (calculatePartnership(plan).errors.length) issues.push('calculation');
  if (![d.business, d.activity, d.address, d.country, d.state, d.place, d.date, d.startDate, d.duration, d.distribution, d.management, d.banking, d.disputes].every(v => typeof v === 'string' && v.trim())) issues.push('details');
  const validDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
  if (!validDate(d.date) || !validDate(d.startDate)) issues.push('dates');
  if (!Number.isInteger(d.noticeDays) || d.noticeDays < 1 || d.noticeDays > 3650) issues.push('notice');
  if (plan.partners.some(p => !p.name.trim() || !d.parties[p.id]?.address?.trim())) issues.push('parties');
  if (d.witnesses.some(w => Boolean(w.name.trim()) !== Boolean(w.address.trim()))) issues.push('witnesses');
  return [...new Set(issues)];
}
/** Exact document context, not a cryptographic signature or identity check. */
export function agreementContext(plan: PartnershipPlan, details: AgreementDetails, currency: string, hindi: boolean): string {
  return JSON.stringify({ plan, details, currency, hindi });
}
export function agreementFinancialClauses(plan: PartnershipPlan, currency: string, hi: boolean): { title: string; text: string }[] {
  const tr = (en: string, hindi: string) => hi ? hindi : en;
  const money = (n: number) => new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency }).format(n);
  const ratio = (weights: number[]) => plan.partners.map((p, i) => `${p.name || `Partner ${i + 1}`}: ${weights[i]}`).join(' / ');
  const salaries = plan.partners.map(p => `${p.name}: ${p.working ? money(p.salary) : money(0)}; ${tr('bonus', 'बोनस')} ${p.working ? p.bonus : 0}%`).join(' | ');
  const sharing = plan.method === 'equal' ? tr('The residual pool is divided equally among all listed partners.', 'बची रकम सभी सूचीबद्ध पार्टनरों में बराबर बांटी जाएगी.') : plan.method === 'capital' ? tr('Residual shares are proportional to capital contributed in the schedule.', 'बची रकम का हिस्सा अनुसूची में भरे निवेश के अनुपात में होगा.') : plan.method === 'time' ? tr('Residual shares are proportional to each partner’s scheduled capital multiplied by months invested.', 'बची रकम का हिस्सा हर पार्टनर के निवेश × निवेश के महीनों के अनुपात में होगा.') : plan.method === 'slabs' ? tr('Use the highest input-profit threshold reached and apply its weights to the ENTIRE residual pool, not marginal bands. Thresholds refer to profit before partner allowances. The first slab also applies below zero unless the separate loss ratio overrides it.', 'भुगतान से पहले के मुनाफे पर पहुंची सबसे ऊंची सीमा चुनकर उसका अनुपात पूरी बची रकम पर लगाएं, अलग-अलग हिस्सों पर नहीं। अलग घाटा अनुपात न होने पर शून्य से नीचे भी पहला स्लैब लगेगा.') : tr(`The residual pool is shared using the agreed weights ${ratio(plan.partners.map(p => p.weight))}. These are ratio weights, not necessarily ownership percentages.`, `बची रकम का तय अनुपात ${ratio(plan.partners.map(p => p.weight))} होगा। ये अनुपात हैं, जरूरी नहीं कि मालिकाना प्रतिशत हों।`);
  return [
    { title: tr('Calculation period and accounting basis', 'हिसाब की अवधि और आधार'), text: tr(`The initial calculation schedule covers ${plan.months} month(s). Input profit is after ordinary business costs and before the partner allowances below. Salary amounts are totals for this full period, not monthly rates. This schedule does not itself fix ownership, management authority or guaranteed returns.`, `शुरुआती हिसाब ${plan.months} महीने का है। आम बिजनेस खर्च के बाद, नीचे के पार्टनर भुगतान घटाने से पहले का मुनाफा लिया जाएगा। वेतन पूरी अवधि का है, हर महीने का नहीं। इस अनुसूची से मालिकाना हक, फैसले लेने का अधिकार या गारंटी वाली कमाई तय नहीं होती।`) },
    { title: tr('Salary, capital interest and bonus', 'वेतन, निवेश का ब्याज और बोनस'), text: tr(`Period salary and bonus schedule: ${salaries}. Annual capital interest: ${plan.interest}%, prorated as capital × annual rate × months invested / 12. Bonuses use only a positive balance after salary and capital interest; all partner bonuses use the same base. Investor-only partners receive no salary or bonus.`, `पूरी अवधि के वेतन और बोनस की सूची: ${salaries}। निवेश पर सालाना ब्याज ${plan.interest}% है: निवेश × सालाना दर × निवेश के महीने / 12। बोनस वेतन और ब्याज के बाद बची पॉजिटिव रकम पर होगा; सभी बोनस का आधार वही रकम होगी। केवल निवेश करने वालों का वेतन और बोनस शून्य है।`) },
    { title: tr('Business reserve and sharing method', 'बिजनेस रिजर्व और बंटवारे का तरीका'), text: tr(`Retain ${plan.reserve}% of the positive balance after bonuses in the business. No reserve is retained from a negative balance. ${sharing}`, `बोनस के बाद बची पॉजिटिव रकम का ${plan.reserve}% बिजनेस में रखा जाएगा। नेगेटिव रकम में रिजर्व नहीं होगा। ${sharing}`) },
    { title: tr('Negative balance and loss allocation', 'नेगेटिव रकम और घाटे का बंटवारा'), text: tr(`If salary and capital interest exceed profit, those allowances remain allocated and the shortfall becomes a negative residual pool. ${plan.separateLoss ? `Use the separate agreed loss weights ${ratio(plan.partners.map(p => p.lossWeight))}.` : 'Use the same selected sharing method for the negative residual pool.'} Bonus and reserve apply only when their respective bases are positive. A negative allocation is not a cash payout. Review this allowance policy expressly before execution.`, `वेतन और ब्याज मुनाफे से ज्यादा होने पर वे आवंटित रहेंगे और कमी नेगेटिव बची रकम बनेगी। ${plan.separateLoss ? `घाटे का अलग तय अनुपात ${ratio(plan.partners.map(p => p.lossWeight))} होगा।` : 'नेगेटिव बची रकम में वही चुना बंटवारे का तरीका लागू होगा।'} बोनस और रिजर्व अपने आधार के पॉजिटिव होने पर ही लगेंगे। नेगेटिव आवंटन भुगतान नहीं है। हस्ताक्षर से पहले इस भुगतान नीति पर साफ सहमति करें।`) },
  ];
}
