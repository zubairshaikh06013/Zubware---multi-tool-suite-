import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Copy, Check, Download, Bold, Italic, Heading, List, Table, Code, Link, Image, Eye, FileCode, Upload, Trash2 } from 'lucide-react';

export const MarkdownEditorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [markdown, setMarkdown] = useState(
    `# Zubware Markdown Editor\n\nWelcome to the **live browser-based Markdown Editor**. Write and format document notes with instant preview and multi-format exports.\n\n## Key Features\n- Real-time side-by-side preview\n- Toolbar helpers for bold, italic, headings, lists, tables, code blocks, links, and images\n- Export to **Markdown (.md)**, **HTML (.html)**, or **Text (.txt)**\n\n### Sample Table\n| Feature | Status | Speed |\n| --- | --- | --- |\n| Client-side | Active | Instant |\n| Privacy | Local Browser | No Server Storage |\n\n\`\`\`javascript\nconsole.log("Hello, Zubware Markdown!");\n\`\`\`\n\n[Visit Zubware](https://www.zubware.com)\n`
  );

  const [activeTab, setActiveTab] = useState<'split' | 'edit' | 'preview'>('split');
  const [copied, setCopied] = useState(false);

  // Helper to insert markdown syntax into editor
  const insertText = (prefix: string, suffix: string = '') => {
    setMarkdown((prev) => `${prev}\n${prefix}sample text${suffix}`);
  };

  // Render Markdown and sanitize generated HTML before display/export.
  const renderMarkdownToHtml = (md: string): string => {
    const rawHtml = marked.parse(md, {
      async: false,
      gfm: true,
      breaks: false,
    }) as string;

    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
    });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setMarkdown(content);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = (type: 'md' | 'html' | 'txt') => {
    let content = markdown;
    let mime = 'text/markdown';
    let filename = `document.${type}`;

    if (type === 'html') {
      content = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>Exported Markdown</title>\n<style>body{font-family:sans-serif;padding:30px;line-height:1.6;max-width:800px;margin:auto;}</style>\n</head>\n<body>\n${renderMarkdownToHtml(markdown)}\n</body>\n</html>`;
      mime = 'text/html';
    } else if (type === 'txt') {
      mime = 'text/plain';
    }

    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Exported as .${type.toUpperCase()}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    onShowToast('Copied Markdown source!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Markdown Editor & Live Preview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Write, edit, preview, and export Markdown documents to .MD, .HTML, or .TXT formats.
          </p>
        </div>
      </div>

      {/* Toolbar & View Mode Selector */}
      <div className="glass-card p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Markdown Toolbar */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => insertText('**', '**')}
            title="Bold"
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('*', '*')}
            title="Italic"
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('## ')}
            title="Heading"
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Heading className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('- ')}
            title="Unordered List"
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |')}
            title="Insert Table"
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('```javascript\n', '\n```')}
            title="Code Block"
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('[Link Title](', ')')}
            title="Insert Link"
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('![Image Alt](', ')')}
            title="Insert Image"
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Editor Only
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Preview Only
          </button>
        </div>
      </div>

      {/* Main Canvas View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(activeTab === 'split' || activeTab === 'edit') && (
          <div className={`space-y-2 ${activeTab === 'edit' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Markdown Code</label>
              <div className="flex items-center gap-2">
                <label className="px-2 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-all flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" /> Upload .md
                  <input
                    type="file"
                    accept=".md,.txt,.markdown"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => { setMarkdown(''); onShowToast('Cleared editor'); }}
                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              rows={16}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type Markdown here..."
              className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        )}

        {(activeTab === 'split' || activeTab === 'preview') && (
          <div className={`space-y-2 ${activeTab === 'preview' ? 'lg:col-span-2' : ''}`}>
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Live HTML Rendered Preview</label>
            <div
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 min-h-[350px] overflow-y-auto text-xs font-sans text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-pre:bg-slate-950 prose-pre:text-indigo-200 prose-table:w-full prose-th:border prose-th:border-slate-300 prose-th:p-2 prose-td:border prose-td:border-slate-300 prose-td:p-2 zubware-markdown-preview"
              dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(markdown) }}
            />
          </div>
        )}
      </div>

      {/* Export Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied MD Source!' : 'Copy Markdown'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Export:</span>
          <button
            onClick={() => handleExport('md')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> .MD
          </button>
          <button
            onClick={() => handleExport('html')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> .HTML
          </button>
          <button
            onClick={() => handleExport('txt')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> .TXT
          </button>
        </div>
      </div>
    </div>
  );
};
