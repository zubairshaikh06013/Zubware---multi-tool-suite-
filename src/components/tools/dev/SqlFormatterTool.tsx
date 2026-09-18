import React, { useState } from 'react';
import { Database, Copy, Check, Download, Trash2, Upload, Sparkles, Sliders, Minimize2 } from 'lucide-react';

export function SqlFormatterTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const sampleSql = `select u.id, u.first_name, u.last_name, u.email, count(o.id) as total_orders, sum(o.total_amount) as lifetime_spend from users u left join orders o on u.id = o.user_id where u.status = 'active' and o.created_at >= '2025-01-01' group by u.id, u.first_name, u.last_name, u.email having sum(o.total_amount) > 1000 order by lifetime_spend desc limit 50;`;

  const [inputSql, setInputSql] = useState<string>(sampleSql);
  const [outputSql, setOutputSql] = useState<string>('');
  const [keywordCasing, setKeywordCasing] = useState<'upper' | 'lower' | 'preserve'>('upper');
  const [indentSpaces, setIndentSpaces] = useState<number>(2);
  const [commaPosition, setCommaPosition] = useState<'end' | 'start'>('end');
  const [copied, setCopied] = useState<boolean>(false);

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'CROSS JOIN',
    'OUTER JOIN', 'FULL JOIN', 'JOIN', 'ON', 'GROUP BY', 'HAVING', 'ORDER BY', 'ASC', 'DESC',
    'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES',
    'NOT NULL', 'DEFAULT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'IN', 'BETWEEN', 'LIKE',
    'IS NULL', 'IS NOT NULL', 'EXISTS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'
  ];

  const formatSql = () => {
    if (!inputSql.trim()) {
      setOutputSql('');
      return;
    }

    let sql = inputSql.trim();

    // Standardize whitespace
    sql = sql.replace(/\s+/g, ' ');

    // Handle major clause breaks
    const majorClauses = [
      'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'JOIN',
      'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'INSERT INTO',
      'VALUES', 'UPDATE', 'SET', 'DELETE FROM'
    ];

    // Case normalization helper
    const transformCase = (word: string) => {
      if (keywordCasing === 'upper') return word.toUpperCase();
      if (keywordCasing === 'lower') return word.toLowerCase();
      return word;
    };

    // Replace major clauses with newlines
    majorClauses.forEach((clause) => {
      const regex = new RegExp(`\\b${clause}\\b`, 'gi');
      sql = sql.replace(regex, `\n${clause} `);
    });

    // Secondary clauses: AND, OR
    ['AND', 'OR'].forEach((sub) => {
      const regex = new RegExp(`\\b${sub}\\b`, 'gi');
      sql = sql.replace(regex, `\n  ${sub} `);
    });

    const indentStr = ' '.repeat(indentSpaces);
    const lines = sql.split('\n');
    const formattedLines: string[] = [];

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) return;

      // Check if line starts with major clause
      const matchedMajor = majorClauses.find((c) =>
        line.toUpperCase().startsWith(c.toUpperCase() + ' ') || line.toUpperCase() === c.toUpperCase()
      );

      let processedLine = line;

      // Apply casing to all keywords in line
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        processedLine = processedLine.replace(regex, transformCase(kw));
      });

      if (matchedMajor) {
        formattedLines.push(processedLine);
      } else if (line.toUpperCase().startsWith('AND ') || line.toUpperCase().startsWith('OR ')) {
        formattedLines.push(`${indentStr}${processedLine}`);
      } else {
        formattedLines.push(`${indentStr}${processedLine}`);
      }
    });

    let result = formattedLines.join('\n');

    // Comma placement adjustment
    if (commaPosition === 'start') {
      result = result.replace(/,\s*\n\s*/g, '\n  , ');
    }

    setOutputSql(result);
    onShowToast('SQL formatted successfully!');
  };

  const minifySql = () => {
    if (!inputSql.trim()) return;
    const minified = inputSql
      .replace(/\s+/g, ' ')
      .replace(/\s*([,;()=])\s*/g, '$1 ')
      .trim();
    setOutputSql(minified);
    onShowToast('SQL minified!');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputSql(content);
        onShowToast(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputSql) return;
    navigator.clipboard.writeText(outputSql);
    setCopied(true);
    onShowToast('SQL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputSql) return;
    const blob = new Blob([outputSql], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query.sql';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded query.sql!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            SQL Query Formatter & Beautifier
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Format, beautify, and indent SQL queries with customizable keyword casing and indentation rules.
          </p>
        </div>
        <button
          onClick={() => { setInputSql(sampleSql); onShowToast('Sample SQL loaded'); }}
          className="px-3.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
        >
          Load Sample Query
        </button>
      </div>

      {/* Options Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Keywords:</span>
            <select
              value={keywordCasing}
              onChange={(e) => setKeywordCasing(e.target.value as any)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
              <option value="preserve">Preserve</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indent:</span>
            <select
              value={indentSpaces}
              onChange={(e) => setIndentSpaces(parseInt(e.target.value))}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Commas:</span>
            <select
              value={commaPosition}
              onChange={(e) => setCommaPosition(e.target.value as any)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <option value="end">Trailing (item,)</option>
              <option value="start">Leading (, item)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={minifySql}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" /> Minify
          </button>
          <button
            onClick={formatSql}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Format SQL
          </button>
        </div>
      </div>

      {/* Grid Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Input Query
            </label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload .sql
                <input
                  type="file"
                  accept=".sql,text/plain"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setInputSql(''); setOutputSql(''); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={inputSql}
            onChange={(e) => setInputSql(e.target.value)}
            placeholder="Paste your SQL statement here..."
            rows={15}
            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 resize-y"
          />
        </div>

        {/* Output Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Formatted SQL
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputSql}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputSql}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" /> Download .sql
              </button>
            </div>
          </div>
          <textarea
            value={outputSql}
            readOnly
            placeholder="Formatted query will appear here..."
            rows={15}
            className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-indigo-900 dark:text-indigo-300 focus:outline-none resize-y select-all"
          />
        </div>
      </div>
    </div>
  );
}
