import React from 'react';

export const GstInvoiceGuide = () => (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">GST invoice example: from item prices to balance due</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">This worked example shows how the calculator handles a discount and partial payment. The 18% rate is an arithmetic example, not a recommendation for your goods or services. Other Charges are zero and rounding does not change this example.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <caption className="p-4 text-left font-semibold">Example invoice with a ₹10,000 payment received</caption>
              <thead className="bg-slate-100 dark:bg-slate-800"><tr><th scope="col" className="p-3">Calculation</th><th scope="col" className="p-3">Amount</th></tr></thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  ['Item 1: ₹25,000 less ₹1,000 discount', '₹24,000 taxable'],
                  ['Item 2: ₹5,000 with no discount', '₹5,000 taxable'],
                  ['Total taxable value: ₹24,000 + ₹5,000', '₹29,000'],
                  ['Example GST: ₹29,000 × 18%', '₹5,220'],
                  ['Intra-state calculator split: CGST + SGST', '₹2,610 + ₹2,610'],
                  ['Grand total: ₹29,000 + ₹5,220', '₹34,220'],
                  ['Amount Received, entered manually', '₹10,000'],
                  ['Balance Due and UPI QR amount', '₹24,220'],
                ].map(([label, value]) => <tr key={label}><th scope="row" className="p-3 font-medium">{label}</th><td className="p-3 whitespace-nowrap">{value}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div lang="hi" className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">GST invoice कैसे बनाएं — आसान हिंदी गाइड</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li><strong>Edit Form:</strong> sample नाम, GSTIN, पता, bank details और UPI ID हटाकर अपनी सही जानकारी भरें। ग्राहक, invoice number, तारीख और Place of Supply जाँचें।</li>
              <li><strong>Items:</strong> हर सामान या service की quantity, rate, discount और लागू GST rate भरें। सही HSN/SAC और tax rate की पुष्टि करें; tool इन्हें आपके लिए तय नहीं करता।</li>
              <li><strong>Payment:</strong> ग्राहक से पहले पैसा मिला है तो Amount Received में भरें। QR में बाकी रकम आती है। यह tool बैंक से payment की पुष्टि नहीं करता।</li>
              <li><strong>Live Preview:</strong> नाम, tax, कुल रकम और QR जाँचकर Download PDF दबाएं। Print में A4, 100% scale और no margins चुनें, अगर आपके device में ये विकल्प हों।</li>
              <li><strong>Save invoice:</strong> बिल इसी browser में रखें और invoice number या customer से खोजें। अधूरा काम Save Draft से रखें।</li>
              <li><strong>Backup:</strong> Download invoice backup से खुले हुए बिल की JSON file रखें। दूसरे device पर Open backup करें, फिर Save invoice दबाएं। Browser data मिटाने से पहले जरूरी बिलों का backup लें।</li>
            </ol>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white">Before sharing an invoice</h3>
              <p>Replace every sample detail, verify invoice numbering and review the document type, Place of Supply, tax mode and item rates. Scan the payment QR in your payment app to check the recipient and amount. Creating a QR does not verify that the UPI account exists or belongs to you.</p>
              <p>Keep the editable JSON backup as well as the PDF. Saved invoices are local to this browser; they are not a cloud accounting ledger, inventory system or automatic payment tracker.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white">Payment QR and government e-invoicing</h3>
              <p>The UPI QR requests a payment. An Invoice Registration Portal generates an IRN and signed e-invoice QR through a separate process. This generator does not perform that registration or guarantee statutory compliance.</p>
              <p>Check current requirements through the <a className="underline text-indigo-600 dark:text-indigo-400" href="https://www.gst.gov.in/" target="_blank" rel="noopener noreferrer">GST Portal</a> and the <a className="underline text-indigo-600 dark:text-indigo-400" href="https://einvoice1.gst.gov.in/" target="_blank" rel="noopener noreferrer">official e-Invoice Portal</a>. Confirm the rules applicable to your transaction with your tax adviser where needed.</p>
            </div>
          </div>
        </section>
);
