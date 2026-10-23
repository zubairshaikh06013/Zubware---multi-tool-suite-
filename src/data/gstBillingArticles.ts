import { BlogArticle } from '../types';

const common = {
  language: 'hi' as const,
  publishedTime: '2026-10-23T22:10:00Z',
  modifiedTime: '2026-10-23T22:10:00Z',
  author: { name: 'Zubware', url: 'https://www.zubware.com/about', role: 'Tool guides and documentation' },
  publisher: { name: 'Zubware', url: 'https://www.zubware.com' },
  category: 'Business Guides',
  readingTime: '4 min read',
  relatedToolIds: ['gst-invoice-generator'],
};

export const GST_BILLING_ARTICLES: BlogArticle[] = [
  {
    ...common,
    slug: 'gst-invoice-format-guide',
    canonicalPath: '/blog/gst-invoice-format-guide',
    title: 'GST Invoice Format: Sample Bill और PDF बनाने की आसान गाइड',
    metaTitle: 'GST Invoice Format & Sample PDF — हिंदी गाइड | Zubware',
    description: 'GST invoice का sample देखें। Seller, buyer, items, tax और balance due की details समझें और free bill maker से अपना A4 PDF बनाएं।',
    excerpt: 'एक sample invoice की मदद से समझें कि बिल में क्या भरना है, tax कहाँ दिखता है और PDF भेजने से पहले क्या देखना है।',
    tags: ['GST Invoice', 'GST Invoice Format', 'GST Bill Maker', 'Hindi Guide'],
    takeaways: ['Sample PDF सिर्फ layout समझने के लिए है।', 'अपनी business details और लागू tax inputs भरें।', 'PDF बनाना और government e-invoice registration अलग काम हैं।'],
    sections: [
      { id: 'sample', title: 'GST bill का sample देखें', content: 'अगर पहली बार GST invoice बना रहे हैं तो पहले [sample PDF डाउनलोड करें](/downloads/gst-invoice-sample.pdf)। यह एक illustrative layout है: इसमें seller और buyer, item table, taxable amount, tax और balance due की जगह दिखाई गई है। नाम और details काल्पनिक हैं। यह किसी असली sale का bill या government-approved template नहीं है।\n\nअपना बिल बनाने के लिए [Free GST Invoice Generator खोलें](/gst-invoice-generator)। Sample PDF को भरकर भेजने के बजाय editor में अपनी details डालें, ताकि calculation और final PDF आपके data से बनें।' },
      { id: 'details', title: 'Form भरने के लिए कौन-सी जानकारी तैयार रखें?', content: '| हिस्सा | क्या तैयार रखें |\n|---|---|\n| Seller | Business name, address, applicable GSTIN और contact |\n| Buyer | Customer name, billing address और applicable GSTIN |\n| Invoice | Number, date, document type और Place of Supply |\n| Items | Description, quantity, unit, rate और HSN/SAC |\n| Tax | लागू rate, tax mode और line discounts |\n| Payment | अपनी bank details, UPI ID और पहले मिली payment |\n\nयह practical data-entry checklist है, हर transaction के लिए पूरी legal checklist नहीं। Current requirements के लिए [GST Portal](https://www.gst.gov.in/) और [CBIC Tax Information](https://taxinformation.cbic.gov.in/) देखें। Invoice numbering, registration और special cases अपनी स्थिति के हिसाब से check करें।' },
      { id: 'example', title: 'Sample की रकम कैसे बनी?', content: 'पहली service का price ₹25,000 है और discount ₹1,000 है, इसलिए taxable value ₹24,000 हुई। दूसरी service ₹5,000 की है। कुल taxable value ₹29,000 है। Example के लिए 18% tax लगाने पर ₹5,220 tax और ₹34,220 total बनता है।\n\nअगर ₹10,000 पहले मिल चुके हैं, तो बाकी payment ₹24,220 है। Zubware में Amount Received भरने पर UPI QR में यही बाकी रकम आती है। QR बन जाने से payment received confirm नहीं होती। यह 18% सिर्फ calculation example है; अपनी service का rate इससे तय न करें। [CGST/SGST/IGST example देखें](/blog/cgst-sgst-igst-calculation-guide)।' },
      { id: 'download', title: 'अपना GST invoice PDF कैसे बनाएं?', content: '1. [GST bill maker](/gst-invoice-generator) में sample नाम, GSTIN, पता, bank और UPI details बदलें।\n2. Customer, invoice number, date और Place of Supply भरें।\n3. Items, discount और independently verified tax inputs डालें।\n4. Live Preview में totals, spelling और page breaks देखें।\n5. Download PDF दबाएं और downloaded file खोलकर check करें।\n6. Save invoice से browser में copy रखें; editable copy के लिए Download invoice backup इस्तेमाल करें।\n\nSaved invoices इसी browser में रहते हैं। Browser data हटाने या phone बदलने से पहले PDF और JSON backup सुरक्षित रखें।' },
      { id: 'checks', title: 'PDF भेजने से पहले आखिरी check', content: 'गलत customer, पुराना invoice number और sample UPI ID जैसी गलतियाँ साफ दिखने वाले PDF में भी रह सकती हैं। नाम, address, item quantities, discount, tax और balance को अपने records से मिलाएं। Multi-page bill हो तो हर page देखें।\n\nयह tool GST registration lookup, return filing या IRN generation नहीं करता। UPI payment QR भी IRP-signed e-invoice QR नहीं है। [HSN/SAC और GSTIN check करने की guide](/blog/hsn-sac-gstin-invoice-guide) पढ़ें।' },
    ],
    faqs: [
      { question: 'क्या sample invoice PDF free है?', answer: 'हाँ। Sample layout देखने और PDF डाउनलोड करने के लिए account की जरूरत नहीं है। अपना bill बनाने के लिए GST invoice editor इस्तेमाल करें।' },
      { question: 'क्या sample invoice में असली GSTIN है?', answer: 'नहीं। Sample में fictional placeholders हैं। इसे किसी transaction के लिए जारी न करें।' },
    ],
  },
  {
    ...common,
    slug: 'cgst-sgst-igst-calculation-guide',
    canonicalPath: '/blog/cgst-sgst-igst-calculation-guide',
    title: 'CGST, SGST और IGST Calculation: GST Invoice के आसान Examples',
    metaTitle: 'CGST SGST IGST Calculation Examples — हिंदी | Zubware',
    description: 'Tax-exclusive और inclusive GST की calculation, discount और partial payment के examples समझें। GST invoice में tax mode और totals check करें।',
    excerpt: '₹1,000 और ₹1,180 के examples से tax निकालना समझें और invoice में discount या advance payment की सही जगह पहचानें।',
    tags: ['GST Invoice', 'CGST', 'SGST', 'IGST', 'GST Calculation', 'Hindi Guide'],
    takeaways: ['Tax amount = taxable value × entered rate ÷ 100.', 'Inclusive price में tax पहले से शामिल होता है।', 'Payment received घटाने से बाकी payment बदलती है, item का tax अपने आप नहीं बदलता।'],
    sections: [
      { id: 'exclusive', title: 'Price के ऊपर GST जोड़ने का example', content: 'मान लें taxable value ₹1,000 है और independently confirmed rate 18% है। Tax = ₹1,000 × 18 ÷ 100 = ₹180। Total ₹1,180 बनेगा। यहाँ rate केवल arithmetic समझाने के लिए है।\n\n| Calculation mode | Tax breakup | Total |\n|---|---|---|\n| CGST + SGST split | ₹90 + ₹90 | ₹1,180 |\n| IGST | ₹180 | ₹1,180 |\n\nदोनों rows में total एक है, लेकिन invoice पर tax का नाम और breakup अलग है। किसी bill की सिर्फ grand total देखकर tax treatment सही मान लेना ठीक नहीं।' },
      { id: 'mode', title: 'Zubware में कौन-सा tax mode आता है?', content: '[GST Invoice Generator](/gst-invoice-generator) के automatic mode में Supplier State और Place of Supply compare होते हैं। दोनों match होने पर calculator CGST + SGST split दिखाता है; अलग होने पर IGST दिखाता है। अपनी situation के हिसाब से tax mode review करें।\n\nPlace of Supply को केवल buyer के phone number या address से guess न करें। Special supplies, Union Territory tax और अन्य exceptions अलग review मांग सकते हैं। यह calculator applicable legal treatment तय नहीं करता। Current rules [GST Portal](https://www.gst.gov.in/) या [CBIC Tax Information](https://taxinformation.cbic.gov.in/) से check करें।' },
      { id: 'inclusive', title: 'अगर ₹1,180 में GST पहले से शामिल है?', content: '18% included price के example में taxable base = ₹1,180 ÷ 1.18 = ₹1,000। Included tax = ₹1,180 − ₹1,000 = ₹180। ₹1,180 पर फिर 18% जोड़ देने से ₹1,392.40 बनेगा, जो इस inclusive-price example का सही total नहीं है।\n\nसामान्य formula: taxable base = inclusive total ÷ (1 + rate ÷ 100)। Tool की Rate field को tax-exclusive item price के रूप में भरें; inclusive amount को पहले अलग करें। अलग-अलग tax rates वाले items को एक ही combined rate से reverse-calculate न करें।' },
      { id: 'discount', title: 'Discount और मिली हुई payment में फर्क', content: 'एक item का gross price ₹2,000 और line discount 10% हो तो calculator ₹200 घटाकर ₹1,800 taxable value लेता है। Example rate 18% पर tax ₹324 और total ₹2,124 बनता है। Discount की legal eligibility अपनी transaction के लिए अलग check करें।\n\nअगर customer ने ₹500 दिए हैं तो Amount Received में ₹500 भरें। इस example में बाकी ₹1,624 है। Received payment को item discount में भरने से taxable value बदल जाएगी। Zubware की Other Charges field item taxes के बाद जुड़ती है; उस field पर additional GST अपने आप calculate नहीं होता। Taxable charges को अलग review करें।' },
      { id: 'rounding', title: 'Rounding और PDF कैसे check करें?', content: 'हर item का quantity × rate, फिर discount और selected tax rate देखें। दो decimal places और round-off की वजह से paise का फर्क हो सकता है। Compare करते समय दोनों calculations में rounding का तरीका एक रखें।\n\n[Free GST bill maker](/gst-invoice-generator) में figures डालें, Live Preview देखें और PDF खोलकर tax breakup मिलाएं। [Sample invoice format guide](/blog/gst-invoice-format-guide) से layout और [HSN/SAC guide](/blog/hsn-sac-gstin-invoice-guide) से input verification समझें।' },
    ],
    faqs: [
      { question: 'क्या CGST और SGST का example rate अलग-अलग 18% है?', answer: 'नहीं। इस example में combined 18% को 9% CGST और 9% SGST में बाँटा गया है। अपनी transaction का actual rate और treatment independently confirm करें।' },
      { question: 'क्या calculator मेरे product का GST rate बताता है?', answer: 'नहीं। आपको लागू rate देना है। Calculation result rate classification का प्रमाण नहीं है।' },
    ],
  },
  {
    ...common,
    slug: 'hsn-sac-gstin-invoice-guide',
    canonicalPath: '/blog/hsn-sac-gstin-invoice-guide',
    title: 'HSN/SAC Code और GSTIN: GST Invoice से पहले कैसे Check करें',
    metaTitle: 'HSN SAC & GSTIN Check Guide — आसान हिंदी | Zubware',
    description: 'GST Portal पर HSN/SAC खोजने और GSTIN details check करने का तरीका जानें। Format check, registration lookup और tax rate में फर्क समझें।',
    excerpt: 'किसी दूसरे bill से code copy करने से पहले अपनी item description और taxpayer details को official portal पर check करें।',
    tags: ['GST Invoice', 'HSN', 'SAC', 'GSTIN', 'Hindi Guide'],
    takeaways: ['HSN goods और SAC services की classification से जुड़े codes हैं।', 'GSTIN का format match होना active registration का प्रमाण नहीं है।', 'Search result के साथ description और applicable rate भी verify करें।'],
    sections: [
      { id: 'difference', title: 'HSN, SAC और GSTIN एक चीज नहीं हैं', content: '| Detail | किस काम के लिए |\n|---|---|\n| HSN | Goods की classification |\n| SAC | Services की classification |\n| GSTIN | Registered taxpayer की पहचान |\n| GST rate | Transaction पर लागू tax percentage |\n\nInvoice में item description के साथ relevant HSN/SAC और seller/buyer details में applicable GSTIN आता है। केवल मिलता-जुलता नाम देखकर दूसरे business का code अपने bill में न डालें। Product के material, use और exact description से classification बदल सकती है।' },
      { id: 'search', title: 'Official GST Portal पर HSN/SAC कैसे खोजें?', content: '1. [GST Portal](https://www.gst.gov.in/) खोलें।\n2. Services → User Services → Search HSN Code का विकल्प खोजें।\n3. Code पता हो तो HSN से, नहीं तो description से search करें।\n4. Description search में goods या services का सही विकल्प चुनें।\n5. Result की technical description को अपने product या service से मिलाएं।\n6. Relevant code और लागू rate की पुष्टि के बाद invoice में भरें।\n\nOfficial [Search HSN functionality advisory](https://tutorial.gst.gov.in/downloads/news/advisory_on_search_hsn_code_functionality_final.pdf) इस workflow को समझाती है। Portal interface बदल सकता है। Search सुझाव classification पर अंतिम legal ruling नहीं हैं।' },
      { id: 'gstin', title: 'GSTIN registration कैसे check करें?', content: 'GST Portal के Search Taxpayer विकल्प में GSTIN/UIN से search करें। [Official Search Taxpayer help](https://tutorial.gst.gov.in/userguide/taxpayersdashboard/Search_Taxpayer.htm) के मुताबिक pre-login search उपलब्ध है। Result में legal name, registration status और relevant business details को अपने records से मिलाएं।\n\nएक tool सिर्फ characters या checksum check करे तो इससे यह साबित नहीं होता कि registration active है या number सही business का है। Zubware के invoice form की input checks live registration lookup नहीं हैं। जरूरत हो तो customer या supplier से details confirm करें।' },
      { id: 'digits', title: 'कितने digits और कौन-सा tax rate भरना है?', content: 'Required code length और invoice disclosure आपकी situation तथा applicable rules पर depend कर सकते हैं। किसी unsourced chart से universal rule न लें। [CBIC Tax Information](https://taxinformation.cbic.gov.in/) पर current notifications देखें और classification में doubt हो तो अपने tax adviser से पूछें।\n\nएक ही familiar code या एक ही rate को हर item में लगाना convenient हो सकता है, पर सही होने का प्रमाण नहीं है। इसी तरह invoice generator में दिखने वाले rate options पूरी current tax-rate directory नहीं हैं।' },
      { id: 'invoice', title: 'Check करने के बाद अपना invoice बनाएं', content: '[GST Invoice Generator](/gst-invoice-generator) में supplier और buyer की details भरें। हर line में अपनी description और verified HSN/SAC डालें, फिर quantity, tax-exclusive rate, discount और applicable GST rate चुनें। Place of Supply और tax mode review करें।\n\nLive Preview और downloaded PDF दोनों में code और amounts check करें। [GST invoice format guide](/blog/gst-invoice-format-guide) layout दिखाती है और [CGST/SGST/IGST guide](/blog/cgst-sgst-igst-calculation-guide) arithmetic examples समझाती है। Registration lookup, rate verification और invoice PDF बनाना अलग steps हैं।' },
    ],
    faqs: [
      { question: 'क्या Zubware official GSTIN registration verify करता है?', answer: 'नहीं। Invoice form की checks input format तक सीमित हैं। Registration और business details GST Portal पर independently check करें।' },
      { question: 'क्या HSN search से हमेशा सही rate तय हो जाता है?', answer: 'Search classification खोजने में मदद करती है। Exact description, transaction और current applicable notifications से rate की पुष्टि करें।' },
    ],
  },
];
