import React from 'react';

export function CashClosingGuide() {
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
    <h2 className="text-xl font-bold">Cash closing calculator: check counted cash against expected cash</h2>
    <p>Enter the quantity of each note or coin to count the physical cash in your drawer. Then enter the expected cash from your register or cash book. The difference is counted cash minus expected cash: a negative difference is a shortage, a positive difference is an excess, and zero means the entered figures match.</p>
    <h3 className="font-bold">Cash tally example</h3>
    <p>20 × ₹500 + 10 × ₹200 + 7 × ₹100 + 1 × ₹50 = ₹12,750 in 38 pieces. If the expected balance is ₹12,800, the drawer is ₹50 short. If it is ₹12,700, the drawer is ₹50 over. Recount the notes and check the recorded cash movements before changing the records.</p>
    <h3 className="font-bold">Find the expected closing balance</h3>
    <p>For a simple drawer, start with opening cash, add cash received, and subtract cash paid out or removed. For example: ₹2,000 opening cash + ₹11,500 cash received − ₹700 cash expenses = ₹12,800 expected cash. Account for cash refunds, deposits and withdrawals consistently with your records; avoid counting the same movement twice.</p>
    <p>UPI and card receipts are not physical cash in the drawer. Total sales and expected drawer cash are different figures. This tool does not import transactions, calculate profit, or identify why a mismatch happened.</p>
    <h3 className="font-bold">Download a denomination tally as PDF, CSV or text</h3>
    <p>The summary includes denomination quantities, subtotals, total pieces and the amount in Indian number words. If you entered expected cash, the comparison is included too. Print / Save PDF downloads an A4 document; open it on your phone to print or share. CSV opens in spreadsheet apps, while TXT and Copy summary give a plain-text record.</p>
    <h3 className="font-bold">Cash closing kaise check karein?</h3>
    <p>Har note ya coin ki quantity bharo, uski total rupee value nahi. Phir cash book ka expected balance enter karo. Shortage aaye to counting aur cash entries dobara check karo. Difference apne aap missing cash ka reason prove nahi karta. Inputs is browser tab mein calculate hote hain; record chahiye to download kar lo.</p>
    <p>See the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/blog/cash-closing-denomination-shortage-guide">cash closing formula and shortage-check guide</a>. Need a bill for a sale? Open the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/gst-invoice-generator">GST Invoice Generator</a>; for basic calculations use the <a className="text-indigo-600 dark:text-indigo-400 underline" href="/percentage-calculator">Percentage Calculator</a>.</p>
  </section>;
}
