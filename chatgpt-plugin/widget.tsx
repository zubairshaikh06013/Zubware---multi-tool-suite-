import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { App as McpApp } from '@modelcontextprotocol/ext-apps';
import { LanguageProvider } from '../src/context/LanguageContext';
import { loadLanguage, type LanguageCode } from '../src/lib/i18n';
import { ToolErrorBoundary } from '../src/components/ToolErrorBoundary';
import { ToolRenderer } from './generated/ToolRenderer';
import catalog from './generated/catalog.json';
import './widget.css';

function Widget() {
  const [toolId, setToolId] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [toast, setToast] = useState('');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [bridgeStatus, setBridgeStatus] = useState('Connecting to ChatGPT…');
  const bridge = useRef<McpApp | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const langRequest = useRef(0);
  const tool = catalog.find(item => item.id === toolId);
  const visible = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return catalog.filter(item => (!category || item.category === category) && terms.every(term =>
      [item.title, item.description, item.id, item.category, ...item.features].join(' ').toLowerCase().includes(term)));
  }, [query, category]);
  useEffect(() => {
    if (window.parent === window) { setBridgeStatus('Browser preview'); return; }
    let active = true;
    const app = new McpApp({ name: 'Zubware', version: '0.1.0' }, {});
    bridge.current = app;
    app.ontoolresult = result => {
      const content = result.structuredContent as { toolId?: string; query?: string; category?: string } | undefined;
      if (!active || !content) return;
      if (typeof content.toolId === 'string' && catalog.some(t => t.id === content.toolId)) setToolId(content.toolId);
      if (typeof content.query === 'string') { setQuery(content.query); setToolId(''); }
      if (typeof content.category === 'string') setCategory(content.category);
    };
    app.connect().then(() => { if (active) setBridgeStatus('Connected to ChatGPT'); }).catch(() => {
      if (active) setBridgeStatus('ChatGPT connection unavailable. Tools can still be used here.');
    });
    return () => { active = false; bridge.current = null; void app.close(); };
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const showToast = (message: string) => {
    setToast(message); clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4000);
  };
  const navigate = (path: string) => {
    const target = catalog.find(item => item.path === path.replace(/\.html$/, '') || '/' + item.id === path);
    if (target) setToolId(target.id);
    else showToast('Use the Zubware website for this page.');
  };
  const changeLanguage = async (next: LanguageCode) => {
    const request = ++langRequest.current;
    try { await loadLanguage(next); if (request === langRequest.current) setLanguage(next); }
    catch { showToast('Language could not be loaded.'); }
  };
  return <LanguageProvider currentLang={language} onChangeLang={changeLanguage}>
    <main className="plugin-shell">
      <header className="plugin-header">
        <button className="plugin-brand" onClick={() => setToolId('')}>Z<span>ubware</span></button>
        <span>{catalog.length} tools</span>
        <select aria-label="Tool language" value={language} onChange={e => void changeLanguage(e.target.value as LanguageCode)}><option value="en">English</option><option value="hi">हिंदी</option></select>
      </header>
      <p className="plugin-status">{bridgeStatus}</p>
      {tool ? <>
        <button className="plugin-back" onClick={() => setToolId('')}>← All tools</button>
        <h1>{tool.title}</h1><p className="plugin-description">{tool.description}</p>
        <p className="plugin-note">Choose files and settings in this panel. Opening a tool does not process your files. Some browser features may require the website.</p>
        <a className="plugin-external" href={tool.url} target="_blank" rel="noopener noreferrer" onClick={event => {
          if (bridge.current) { event.preventDefault(); void bridge.current.openLink({url:tool.url}).catch(() => showToast('Open this tool at ' + tool.url)); }
        }}>Open on Zubware ↗</a>
        <ToolErrorBoundary key={tool.id} toolTitle={tool.title}><ToolRenderer activeTool={tool} triggerToast={showToast} navigateTo={navigate} /></ToolErrorBoundary>
      </> : <>
        <h1>What would you like to do?</h1><p className="plugin-description">Find a tool, choose your inputs, and work in your browser.</p>
        <div className="plugin-filters"><input aria-label="Search tools" placeholder="Search photos, PDF, resume, calculators…" value={query} onChange={e => setQuery(e.target.value)}/>
        <select aria-label="Category" value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{[...new Set(catalog.map(t => t.category))].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <p className="plugin-status">{visible.length} tools found</p>
        <div className="plugin-grid">{visible.map(item => <button className="plugin-card" key={item.id} onClick={() => setToolId(item.id)}><small>{item.category}</small><strong>{item.title}</strong><span>{item.description}</span></button>)}</div>
        {!visible.length && <p>No matching tools. Try another search or category.</p>}
      </>}
      {toast && <div role="status" className="plugin-toast">{toast}</div>}
      <footer className="plugin-footer"><a href="https://www.zubware.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy</a> · <a href="https://www.zubware.com" target="_blank" rel="noopener noreferrer">Zubware.com</a></footer>
    </main>
  </LanguageProvider>;
}
createRoot(document.getElementById('root')!).render(<Widget />);
