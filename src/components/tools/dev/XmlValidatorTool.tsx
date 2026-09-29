import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Sparkles, 
  FileCode, 
  Minimize2, 
  Maximize2, 
  Layers 
} from 'lucide-react';

interface XmlValidatorToolProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_XML_PRESETS = [
  {
    name: 'Sitemap XML',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-09-29</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/tools</loc>
    <lastmod>2026-09-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
  },
  {
    name: 'RSS 2.0 Feed',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Zubware Engineering Blog</title>
    <link>https://zubware.com/blog</link>
    <description>Latest high performance web development articles</description>
    <item>
      <title>Building 300+ In-Browser Tools</title>
      <link>https://zubware.com/blog/browser-tools</link>
      <guid>post_101</guid>
      <pubDate>Mon, 29 Sep 2026 09:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`
  },
  {
    name: 'SVG Graphic',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="45" fill="#4f46e5" stroke="#ffffff" stroke-width="2" />
  <polygon points="50,20 62,42 85,42 66,56 73,78 50,64 27,78 34,56 15,42 38,42" fill="#fbbf24" />
</svg>`
  },
  {
    name: 'SOAP Envelope',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <auth:ApiKey xmlns:auth="http://api.example.com">API_KEY_SECURE</auth:ApiKey>
  </soap:Header>
  <soap:Body>
    <m:GetOrderStatus xmlns:m="http://orders.example.com">
      <m:OrderId>ORD-98214</m:OrderId>
    </m:GetOrderStatus>
  </soap:Body>
</soap:Envelope>`
  }
];

export const XmlValidatorTool: React.FC<XmlValidatorToolProps> = ({ onShowToast }) => {
  const [xmlInput, setXmlInput] = useState<string>(SAMPLE_XML_PRESETS[0].code);
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [stats, setStats] = useState<{ nodes: number; attributes: number; rootTag: string; depth: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const validateXml = (input: string) => {
    setXmlInput(input);
    if (!input.trim()) {
      setIsValid(null);
      setErrorMessage('');
      setErrorLine(null);
      setStats(null);
      return;
    }

    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(input, 'application/xml');
      const parserError = dom.querySelector('parsererror');

      if (parserError) {
        setIsValid(false);
        const errText = parserError.textContent || 'XML Parsing Error';
        setErrorMessage(errText);

        // Attempt to extract line number
        const lineMatch = errText.match(/line\s+(\d+)/i) || errText.match(/row\s+(\d+)/i);
        if (lineMatch) {
          setErrorLine(parseInt(lineMatch[1], 10));
        } else {
          setErrorLine(null);
        }
        setStats(null);
      } else {
        setIsValid(true);
        setErrorMessage('');
        setErrorLine(null);

        // Calculate statistics
        const allElements = dom.getElementsByTagName('*');
        let attrCount = 0;
        let maxDepth = 0;

        const calcDepth = (node: Element, depth: number) => {
          if (depth > maxDepth) maxDepth = depth;
          for (let i = 0; i < node.children.length; i++) {
            calcDepth(node.children[i], depth + 1);
          }
        };

        if (dom.documentElement) {
          calcDepth(dom.documentElement, 1);
        }

        for (let i = 0; i < allElements.length; i++) {
          attrCount += allElements[i].attributes.length;
        }

        setStats({
          nodes: allElements.length,
          attributes: attrCount,
          rootTag: dom.documentElement ? dom.documentElement.nodeName : 'None',
          depth: maxDepth
        });
      }
    } catch (err: any) {
      setIsValid(false);
      setErrorMessage(err.message || 'Invalid XML Markup');
      setErrorLine(null);
      setStats(null);
    }
  };

  const formatXml = (spaces: number = 2) => {
    if (!xmlInput.trim() || isValid === false) return;
    try {
      const PADDING = ' '.repeat(spaces);
      const reg = /(>)(<)(\/*)/g;
      let xml = xmlInput.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      let formatted = '';
      const lines = xml.split('\r\n');

      lines.forEach((line) => {
        let indent = 0;
        if (line.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (line.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1;
        } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        formatted += PADDING.repeat(pad) + line + '\r\n';
        pad += indent;
      });

      const cleaned = formatted.trim();
      setXmlInput(cleaned);
      validateXml(cleaned);
      onShowToast(`Formatted XML with ${spaces} spaces indentation!`);
    } catch {
      onShowToast('Could not format XML.');
    }
  };

  const minifyXml = () => {
    if (!xmlInput.trim()) return;
    const minified = xmlInput
      .replace(/>[\r\n\t ]+</g, '><')
      .replace(/[\r\n\t ]+/g, ' ')
      .trim();
    setXmlInput(minified);
    validateXml(minified);
    onShowToast('Minified XML into single compact stream!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        validateXml(content);
        onShowToast(`Uploaded ${file.name}!`);
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(xmlInput);
    setCopied(true);
    onShowToast('Copied XML to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadXml = () => {
    const blob = new Blob([xmlInput], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validated_document.xml';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded XML file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛡️</span> XML Validator, Formatter & Linter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check XML documents for well-formedness, tag mismatches, hierarchy depth, formatting, and minification.
          </p>
        </div>

        {isValid !== null && (
          <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm ${
            isValid 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}>
            {isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {isValid ? 'Well-Formed XML Document' : 'Syntax Error Detected'}
          </div>
        )}
      </div>

      {/* Preset Samples & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase">Sample Presets:</span>
          {SAMPLE_XML_PRESETS.map((sample) => (
            <button
              key={sample.name}
              onClick={() => validateXml(sample.code)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
            >
              {sample.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload .xml</span>
            <input type="file" accept=".xml,.rss,.svg,.atom" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => formatXml(2)}
            disabled={!isValid}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Format (Beautify)</span>
          </button>

          <button
            onClick={minifyXml}
            disabled={!isValid}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={downloadXml}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={() => validateXml('')}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Clear Editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Stats */}
      <div className="space-y-4">
        <textarea
          value={xmlInput}
          onChange={(e) => validateXml(e.target.value)}
          placeholder="Paste or upload XML document markup here..."
          rows={14}
          className={`w-full p-4 rounded-3xl bg-slate-950 font-mono text-xs leading-relaxed outline-none border transition-all ${
            isValid === false 
              ? 'border-rose-500 text-rose-300' 
              : 'border-slate-800 text-emerald-400 focus:border-indigo-500'
          }`}
        />

        {/* Error Alert Box */}
        {isValid === false && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs space-y-2">
            <div className="font-bold flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" /> XML Parse Error
              {errorLine && <span className="bg-rose-500/20 px-2 py-0.5 rounded-full text-[10px]">Near Line {errorLine}</span>}
            </div>
            <p className="font-mono whitespace-pre-wrap">{errorMessage}</p>
          </div>
        )}

        {/* Document Stats Box */}
        {isValid === true && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Root Element</span>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono truncate block">
                &lt;{stats.rootTag}&gt;
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Elements</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {stats.nodes.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Attributes Count</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {stats.attributes.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Max Tree Depth</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {stats.depth} levels
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
