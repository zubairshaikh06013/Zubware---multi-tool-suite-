import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Plus, Code, Sparkles, Layers } from 'lucide-react';

interface SchemaMarkupGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const SchemaMarkupGeneratorTool: React.FC<SchemaMarkupGeneratorToolProps> = ({ onShowToast }) => {
  const [schemaType, setSchemaType] = useState<'Organization' | 'Article' | 'FAQPage' | 'Product' | 'LocalBusiness'>('Organization');

  // Organization fields
  const [orgName, setOrgName] = useState<string>('Zubware');
  const [orgUrl, setOrgUrl] = useState<string>('https://zubware.com');
  const [orgLogo, setOrgLogo] = useState<string>('https://zubware.com/logo.png');
  const [orgDescription, setOrgDescription] = useState<string>('Free online tools for productivity, files, and text processing.');

  // Article fields
  const [articleHeadline, setArticleHeadline] = useState<string>('How to Boost Browser Productivity in 2026');
  const [articleAuthor, setArticleAuthor] = useState<string>('Zubware Editorial Team');
  const [articleDatePublished, setArticleDatePublished] = useState<string>(new Date().toISOString().split('T')[0]);
  const [articleImage, setArticleImage] = useState<string>('https://zubware.com/article-banner.jpg');

  // FAQPage questions
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([
    { q: 'Is Zubware free to use?', a: 'Yes, all tools on Zubware are 100% free with no account or registration required.' },
    { q: 'Are my files safe and private?', a: 'All processing happens locally in your browser. No files are uploaded to any server.' }
  ]);

  // Product fields
  const [productName, setProductName] = useState<string>('Zubware Toolkit');
  const [productImage, setProductImage] = useState<string>('https://zubware.com/product.png');
  const [productPrice, setProductPrice] = useState<string>('0.00');
  const [productCurrency, setProductCurrency] = useState<string>('USD');

  // LocalBusiness fields
  const [bizName, setBizName] = useState<string>('Zubware Studio');
  const [bizTelephone, setBizTelephone] = useState<string>('+1-555-0199');
  const [bizStreet, setBizStreet] = useState<string>('123 Market Street');
  const [bizCity, setBizCity] = useState<string>('San Francisco');
  const [bizState, setBizState] = useState<string>('CA');
  const [bizPostal, setBizPostal] = useState<string>('94105');

  const [copied, setCopied] = useState<boolean>(false);

  const handleAddFaq = () => {
    setFaqs(prev => [...prev, { q: 'New question?', a: 'Answer to question.' }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateFaq = (idx: number, field: 'q' | 'a', val: string) => {
    setFaqs(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const getJsonLdObject = () => {
    switch (schemaType) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: orgName,
          url: orgUrl,
          logo: orgLogo,
          description: orgDescription
        };
      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: articleHeadline,
          image: articleImage ? [articleImage] : undefined,
          datePublished: articleDatePublished,
          author: {
            '@type': 'Person',
            name: articleAuthor
          },
          publisher: {
            '@type': 'Organization',
            name: orgName,
            logo: {
              '@type': 'ImageObject',
              url: orgLogo
            }
          }
        };
      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a
            }
          }))
        };
      case 'Product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: productName,
          image: productImage ? [productImage] : undefined,
          offers: {
            '@type': 'Offer',
            price: productPrice,
            priceCurrency: productCurrency,
            availability: 'https://schema.org/InStock'
          }
        };
      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: bizName,
          telephone: bizTelephone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: bizStreet,
            addressLocality: bizCity,
            addressRegion: bizState,
            postalCode: bizPostal
          }
        };
      default:
        return {};
    }
  };

  const jsonLdString = JSON.stringify(getJsonLdObject(), null, 2);
  const fullHtmlSnippet = `<script type="application/ld+json">\n${jsonLdString}\n</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullHtmlSnippet);
    setCopied(true);
    onShowToast('JSON-LD schema markup copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonLdString], { type: 'application/ld+json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema_${schemaType.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded schema.json!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Schema Type Switcher */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Schema Entity Type:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {(['Organization', 'Article', 'FAQPage', 'Product', 'LocalBusiness'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSchemaType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                schemaType === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Layout: Inputs on left, Code on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {schemaType} Properties
            </h3>

            {schemaType === 'Organization' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={orgUrl}
                    onChange={(e) => setOrgUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={orgLogo}
                    onChange={(e) => setOrgLogo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            )}

            {schemaType === 'Article' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Headline</label>
                  <input
                    type="text"
                    value={articleHeadline}
                    onChange={(e) => setArticleHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={articleAuthor}
                    onChange={(e) => setArticleAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Published</label>
                  <input
                    type="date"
                    value={articleDatePublished}
                    onChange={(e) => setArticleDatePublished(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={articleImage}
                    onChange={(e) => setArticleImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            )}

            {schemaType === 'FAQPage' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Question & Answer List</span>
                  <button
                    onClick={handleAddFaq}
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Q&A
                  </button>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-600">Question #{idx + 1}</span>
                        {faqs.length > 1 && (
                          <button onClick={() => handleRemoveFaq(idx)} className="text-rose-500 hover:text-rose-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)}
                        placeholder="Question text..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <textarea
                        value={faq.a}
                        onChange={(e) => handleUpdateFaq(idx, 'a', e.target.value)}
                        placeholder="Answer text..."
                        rows={2}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {schemaType === 'Product' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Price</label>
                    <input
                      type="text"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                    <input
                      type="text"
                      value={productCurrency}
                      onChange={(e) => setProductCurrency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Image URL</label>
                  <input
                    type="url"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            )}

            {schemaType === 'LocalBusiness' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={bizTelephone}
                    onChange={(e) => setBizTelephone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Street</label>
                    <input
                      type="text"
                      value={bizStreet}
                      onChange={(e) => setBizStreet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      value={bizCity}
                      onChange={(e) => setBizCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Output (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" /> Validated JSON-LD Output
            </span>
            <span>Google Rich Snippets ready</span>
          </div>
          <textarea
            value={fullHtmlSnippet}
            readOnly
            rows={14}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Snippet!' : 'Copy JSON-LD Script'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download schema.json</span>
        </button>
      </div>
    </div>
  );
};
