import React from 'react';

export function AttendanceGuide() {
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
    <h2 className="text-xl font-bold">75% attendance calculator: classes to attend or miss</h2>
    <p>Enter the classes you attended and the classes actually held for each subject. Choose 75%, 80%, 90% or a custom target. Your college may use a different minimum or separate rules for lectures and practicals; use its official records and policy.</p>
    <h3 className="font-bold">Two different questions need two different calculations</h3>
    <p><strong>Attend consecutively</strong> tells you how many future classes you must attend in a row to reach the target, assuming more classes can continue to be held. <strong>Remaining classes this semester</strong> sets a fixed end point: the planner tells you how many of those classes you must attend and whether the target is still possible.</p>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="text-left font-semibold mb-2">Worked examples with a 75% target</caption><thead><tr><th className="p-2">Attended / held</th><th className="p-2">Remaining</th><th className="p-2">Semester plan</th></tr></thead><tbody>
      <tr><td className="p-2">30 / 40</td><td className="p-2">20</td><td className="p-2">Attend 15; miss at most 5. Final: 45/60 = 75%.</td></tr>
      <tr><td className="p-2">20 / 40</td><td className="p-2">10</td><td className="p-2">Target not reachable. Even 10/10 gives 30/50 = 60%.</td></tr>
      <tr><td className="p-2">45 / 50</td><td className="p-2">10</td><td className="p-2">Attend 0; miss at most 10. Final: 45/60 = 75%.</td></tr>
    </tbody></table></div>
    <h3 className="font-bold">Why overall attendance can hide a subject shortage</h3>
    <p>A student attending 35/40 Mathematics classes and 25/40 Physics classes has 60/80 = 75% overall. Physics is only 62.5%. If the requirement applies to each subject, the overall percentage does not resolve the Physics shortage. Enter each subject separately and plan its remaining classes independently.</p>
    <h3 className="font-bold">Do not round 74.99% up to 75%</h3>
    <p>The display rounds percentages for readability, but the required-class calculation uses the underlying counts. Cancelled classes, medical leave, credit hours and attendance corrections depend on your institution. This planner assumes every entered class has equal weight and does not grant attendance exemptions.</p>
    <h3 className="font-bold">75% attendance ke liye kitni classes attend karni hain?</h3>
    <p>Har subject mein attended aur held classes bharo. Semester mein kitni classes bachi hain, pata hai to remaining classes bhi bharo. Planner batayega unmein se kitni attend karni hain. Agar sab bachi hui classes attend karke bhi target possible nahi hai, woh bhi clearly dikhega.</p>
    <p>See the <a href="/blog/how-many-classes-to-attend-for-75-percent" className="text-indigo-600 dark:text-indigo-400 underline">75% attendance formula and worked examples</a>. Planning marks too? Use the <a href="/cgpa-calculator" className="text-indigo-600 dark:text-indigo-400 underline">CGPA Calculator</a> or <a href="/exam-score-calculator" className="text-indigo-600 dark:text-indigo-400 underline">Exam Score Calculator</a>.</p>
  </section>;
}
