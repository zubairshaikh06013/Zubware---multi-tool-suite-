import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Trash2, Upload, Sparkles, Eye, Code2 } from 'lucide-react';

export function MarkdownToHtmlTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const sampleMarkdown = `# SplitDrop Markdown Guide

Welcome to the **Markdown to HTML Converter**!

## Features
* Fast client-side rendering
* Real-time HTML markup generation
* Fully private — *zero server uploads*

### Code Example
Here is a sample JavaScript snippet:
\`\`\`javascript
const welcome = (name) => {
  console.log(\`Hello, \${name}!\`);
};
\`\`\`

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

### Task List
1. Write documentation in Markdown
2. Convert to semantic HTML
3. Publish to web or CMS

Visit [Zubware](https://zubware.com) for more productivity tools!`;

  const [inputMd, setInputMd] = useState<string>(sampleMarkdown);
  const [viewMode, setViewMode] = useState<'html' | 'preview'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  // Clean, high-performance regex-based Markdown to HTML converter
  const parseMarkdown = (md: string): string => {
    if (!md) return '';

    let html = md;

    // Code blocks
    html = html.replace(/```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const langClass = lang ? ` class="language-${lang}"` : '';
      return `<pre><code${langClass}>${escaped}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, (_, code) => {
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<code>${escaped}</code>`;
    });

    // Headings
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Bold & Italics
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');

    // Images & Links
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Horizontal Rule
    html = html.replace(/^(?:---|\*\*\*|___)$/gim, '<hr />');

    // Unordered Lists
    html = html.replace(/^\s*[\-\*]\s+(.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
      if (!match.startsWith('<ul>')) {
        return `<ul>${match}</ul>`;
      }
      return match;
    });

    // Ordered Lists
    html = html.replace(/^\s*\d+\.\s+(.*)$/gim, '<oli>$1</oli>');
    html = html.replace(/<oli>(.*?)<\/oli>/g, '<li>$1</li>');

    // Paragraphs (split by empty lines)
    const lines = html.split(/\n\n+/);
    const parsedBlocks = lines.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|pre|blockquote|hr|table)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    });

    return parsedBlocks.filter(Boolean).join('\n\n');
  };

  const generatedHtml = parseMarkdown(inputMd);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputMd(content);
        onShowToast(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    onShowToast('HTML copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; margin-top: 24px; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    pre code { background: transparent; color: inherit; padding: 0; }
    blockquote { border-left: 4px solid #6366f1; margin: 16px 0; padding-left: 16px; color: #64748b; font-style: italic; }
    a { color: #4f46e5; text-decoration: underline; }
  </style>
</head>
<body>
${generatedHtml}
</body>
</html>`;
    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded converted.html!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Markdown to HTML Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert Markdown files into clean semantic HTML markup with live web preview and instant export.
          </p>
        </div>
        <button
          onClick={() => { setInputMd(sampleMarkdown); onShowToast('Sample Markdown loaded'); }}
          className="px-3.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
        >
          Load Sample Markdown
        </button>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Markdown Input Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Markdown Input (.MD)
            </label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload .md
                <input
                  type="file"
                  accept=".md,.markdown,text/markdown,text/plain"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setInputMd(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={inputMd}
            onChange={(e) => setInputMd(e.target.value)}
            placeholder="Type or paste markdown here..."
            rows={16}
            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 resize-y"
          />
        </div>

        {/* HTML Preview / Source Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Web Preview
              </button>
              <button
                onClick={() => setViewMode('html')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'html'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> HTML Markup
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!generatedHtml}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy HTML'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!generatedHtml}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>

          {viewMode === 'preview' ? (
            <div
              className="w-full p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-800 dark:text-slate-200 min-h-[360px] max-h-[480px] overflow-y-auto prose dark:prose-invert prose-indigo max-w-none"
              dangerouslySetInnerHTML={{ __html: generatedHtml }}
            />
          ) : (
            <textarea
              value={generatedHtml}
              readOnly
              rows={16}
              className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-indigo-900 dark:text-indigo-300 focus:outline-none resize-y select-all"
            />
          )}
        </div>
      </div>
    </div>
  );
}
