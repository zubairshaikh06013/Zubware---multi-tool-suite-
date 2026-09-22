import React, { useState } from 'react';
import { Upload, FileText, Download, RefreshCw, Sparkles, Settings, Eye, Check } from 'lucide-react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';

interface DocElement {
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'bullet' | 'table';
  text?: string;
  rows?: string[][];
}

export function WordToPdfTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [docElements, setDocElements] = useState<DocElement[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [fontSize, setFontSize] = useState<number>(11);
  const [marginMm, setMarginMm] = useState<number>(15);
  const [pdfGeneratedUrl, setPdfGeneratedUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const sampleDocElements: DocElement[] = [
    { type: 'heading1', text: 'Executive Project Proposal' },
    { type: 'paragraph', text: 'This document was converted from a Word (.docx) file directly in the browser using Zubware client-side processing.' },
    { type: 'heading2', text: '1. Project Overview & Objectives' },
    { type: 'paragraph', text: 'The objective of this initiative is to deliver fast, reliable, privacy-friendly online utilities without transmitting sensitive files to remote servers.' },
    { type: 'bullet', text: 'Zero server uploads: 100% in-browser conversion' },
    { type: 'bullet', text: 'Retains semantic headings, lists, and structure' },
    { type: 'bullet', text: 'Instant PDF export with customizable margins and paper sizes' },
    { type: 'heading2', text: '2. Performance Deliverables' },
    {
      type: 'table',
      rows: [
        ['Deliverable', 'Format', 'Processing Time', 'Status'],
        ['PDF to Word Converter', 'DOCX / DOC', '< 1.5s', 'Completed'],
        ['Word to PDF Converter', 'Vector PDF', '< 1.0s', 'Live'],
        ['Table & Structure Parser', 'High Precision', 'Instant', 'Verified']
      ]
    },
    { type: 'heading2', text: '3. Conclusion' },
    { type: 'paragraph', text: 'Files remain on your local device at all times, making this suitable for confidential contracts, resumes, and enterprise reports.' }
  ];

  const parseDocx = async (buffer: ArrayBuffer): Promise<DocElement[]> => {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(buffer);
    const documentXmlFile = loadedZip.file('word/document.xml');

    if (!documentXmlFile) {
      throw new Error('Invalid Word document: missing word/document.xml');
    }

    const xmlText = await documentXmlFile.async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    const elements: DocElement[] = [];
    const body = xmlDoc.getElementsByTagName('w:body')[0];
    if (!body) return elements;

    // Traverse direct child nodes of w:body (w:p and w:tbl)
    for (let i = 0; i < body.children.length; i++) {
      const child = body.children[i];

      if (child.nodeName === 'w:p') {
        // Check paragraph style
        const pStyle = child.getElementsByTagName('w:pStyle')[0];
        const styleVal = pStyle ? pStyle.getAttribute('w:val') || '' : '';

        // Check if list item
        const numPr = child.getElementsByTagName('w:numPr')[0];

        // Gather all text runs
        const tNodes = child.getElementsByTagName('w:t');
        let paragraphText = '';
        for (let j = 0; j < tNodes.length; j++) {
          paragraphText += tNodes[j].textContent || '';
        }

        const trimmed = paragraphText.trim();
        if (!trimmed) continue;

        if (/Heading1|Title/i.test(styleVal)) {
          elements.push({ type: 'heading1', text: trimmed });
        } else if (/Heading2/i.test(styleVal)) {
          elements.push({ type: 'heading2', text: trimmed });
        } else if (/Heading3/i.test(styleVal)) {
          elements.push({ type: 'heading3', text: trimmed });
        } else if (numPr) {
          elements.push({ type: 'bullet', text: trimmed });
        } else {
          elements.push({ type: 'paragraph', text: trimmed });
        }
      } else if (child.nodeName === 'w:tbl') {
        const rows: string[][] = [];
        const trNodes = child.getElementsByTagName('w:tr');
        for (let r = 0; r < trNodes.length; r++) {
          const row: string[] = [];
          const tcNodes = trNodes[r].getElementsByTagName('w:tc');
          for (let c = 0; c < tcNodes.length; c++) {
            const cellTextNodes = tcNodes[c].getElementsByTagName('w:t');
            let cellText = '';
            for (let t = 0; t < cellTextNodes.length; t++) {
              cellText += (cellTextNodes[t].textContent || '') + ' ';
            }
            row.push(cellText.trim());
          }
          if (row.length > 0) rows.push(row);
        }
        if (rows.length > 0) {
          elements.push({ type: 'table', rows });
        }
      }
    }

    return elements;
  };

  const handleFile = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.docx')) {
      onShowToast('Please upload a .docx Word document file');
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);
    setProgress(20);

    try {
      const buffer = await uploadedFile.arrayBuffer();
      setProgress(50);
      const parsed = await parseDocx(buffer);
      setProgress(80);

      if (parsed.length === 0) {
        onShowToast('Word document appears to be empty or image-only');
      } else {
        setDocElements(parsed);
        onShowToast(`Loaded ${parsed.length} elements from ${uploadedFile.name}`);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Failed to parse Word document. Please ensure it is a valid .docx file.');
    } finally {
      setProgress(100);
      setIsProcessing(false);
    }
  };

  const loadSample = () => {
    const fakeFile = new File(['sample'], 'Sample_Proposal.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    setFile(fakeFile);
    setDocElements(sampleDocElements);
    onShowToast('Loaded sample Word document!');
  };

  const generatePdf = () => {
    if (docElements.length === 0) return;

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = marginMm;
      const contentWidth = pageWidth - margin * 2;

      let currentY = margin;

      const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
      };

      docElements.forEach((el) => {
        if (el.type === 'heading1' && el.text) {
          checkPageBreak(16);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(fontSize + 8);
          doc.setTextColor(15, 23, 42); // slate-900
          const lines = doc.splitTextToSize(el.text, contentWidth);
          doc.text(lines, margin, currentY);
          currentY += lines.length * 8 + 4;
        } else if (el.type === 'heading2' && el.text) {
          checkPageBreak(12);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(fontSize + 4);
          doc.setTextColor(30, 41, 59); // slate-800
          const lines = doc.splitTextToSize(el.text, contentWidth);
          doc.text(lines, margin, currentY);
          currentY += lines.length * 6 + 3;
        } else if (el.type === 'heading3' && el.text) {
          checkPageBreak(10);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(fontSize + 2);
          doc.setTextColor(51, 65, 85); // slate-700
          const lines = doc.splitTextToSize(el.text, contentWidth);
          doc.text(lines, margin, currentY);
          currentY += lines.length * 5 + 2;
        } else if (el.type === 'bullet' && el.text) {
          checkPageBreak(8);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(fontSize);
          doc.setTextColor(30, 41, 59);
          doc.text('•', margin + 2, currentY);
          const lines = doc.splitTextToSize(el.text, contentWidth - 8);
          doc.text(lines, margin + 7, currentY);
          currentY += lines.length * (fontSize * 0.45) + 3;
        } else if (el.type === 'paragraph' && el.text) {
          checkPageBreak(8);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(fontSize);
          doc.setTextColor(51, 65, 85);
          const lines = doc.splitTextToSize(el.text, contentWidth);
          doc.text(lines, margin, currentY);
          currentY += lines.length * (fontSize * 0.45) + 3;
        } else if (el.type === 'table' && el.rows && el.rows.length > 0) {
          const colCount = el.rows[0].length;
          const colWidth = contentWidth / colCount;
          const rowHeight = 7;

          el.rows.forEach((row, rIdx) => {
            checkPageBreak(rowHeight + 2);

            // Row background for header
            if (rIdx === 0) {
              doc.setFillColor(241, 245, 249); // slate-100
              doc.rect(margin, currentY - 5, contentWidth, rowHeight, 'F');
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(fontSize - 1);
              doc.setTextColor(15, 23, 42);
            } else {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(fontSize - 1);
              doc.setTextColor(51, 65, 85);
            }

            // Draw border
            doc.setDrawColor(203, 213, 225); // slate-300
            doc.rect(margin, currentY - 5, contentWidth, rowHeight, 'S');

            row.forEach((cell, cIdx) => {
              const cellLines = doc.splitTextToSize(cell, colWidth - 4);
              doc.text(cellLines[0] || '', margin + cIdx * colWidth + 2, currentY);
            });

            currentY += rowHeight;
          });

          currentY += 4;
        }
      });

      const outputBlob = doc.output('blob');
      setPdfBlob(outputBlob);
      if (pdfGeneratedUrl) {
        URL.revokeObjectURL(pdfGeneratedUrl);
      }
      const newUrl = URL.createObjectURL(outputBlob);
      setPdfGeneratedUrl(newUrl);
      onShowToast('PDF generated successfully!');
    } catch (err) {
      console.error(err);
      onShowToast('Error generating PDF');
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !file) {
      generatePdf();
      return;
    }
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded PDF file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Word to PDF Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert Microsoft Word (.docx) documents into high-quality PDFs client-side without uploading to servers.
          </p>
        </div>
        <button
          onClick={loadSample}
          className="px-3.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
        >
          Try Sample Word Doc
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload and Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
            <Upload className="w-10 h-10 text-indigo-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {file ? file.name : 'Upload Word Document (.docx)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Select or drop your DOCX file. Fast, secure, and processed entirely inside your browser.
            </p>
            <label className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer transition-colors shadow-md">
              Browse DOCX File
              <input
                type="file"
                accept=".docx"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </label>
            {file && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> {(file.size / 1024).toFixed(1)} KB loaded
              </p>
            )}
          </div>

          {/* Configuration Settings */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5 text-indigo-500" />
              <span>PDF Page Settings</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Page Format</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  <option value="a4">A4 (Standard)</option>
                  <option value="letter">Letter (US)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Font Size ({fontSize}pt)</label>
                <input
                  type="range"
                  min="9"
                  max="14"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-indigo-600 cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Page Margins ({marginMm}mm)</label>
              <input
                type="range"
                min="10"
                max="30"
                value={marginMm}
                onChange={(e) => setMarginMm(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-indigo-600 cursor-pointer"
              />
            </div>

            <button
              onClick={generatePdf}
              disabled={docElements.length === 0 || isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate PDF Preview</span>
            </button>
          </div>
        </div>

        {/* Right Column: Preview and Download */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-500" /> Document Content ({docElements.length} elements)
              </span>
              {pdfBlob && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  PDF Ready ({(pdfBlob.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>

            {docElements.length > 0 ? (
              <div className="flex-1 max-h-[380px] overflow-y-auto pr-2 space-y-3 text-slate-800 dark:text-slate-200 text-xs">
                {docElements.map((el, idx) => {
                  if (el.type === 'heading1') {
                    return <h1 key={idx} className="text-lg font-black text-slate-900 dark:text-white pt-2">{el.text}</h1>;
                  }
                  if (el.type === 'heading2') {
                    return <h2 key={idx} className="text-base font-bold text-slate-800 dark:text-slate-100 pt-1">{el.text}</h2>;
                  }
                  if (el.type === 'heading3') {
                    return <h3 key={idx} className="text-sm font-bold text-slate-700 dark:text-slate-200">{el.text}</h3>;
                  }
                  if (el.type === 'bullet') {
                    return <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300">{el.text}</li>;
                  }
                  if (el.type === 'table' && el.rows) {
                    return (
                      <div key={idx} className="overflow-x-auto my-2 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs border-collapse">
                          <tbody>
                            {el.rows.map((r, rI) => (
                              <tr key={rI} className={rI === 0 ? 'bg-slate-100 dark:bg-slate-800 font-bold' : 'border-t border-slate-100 dark:border-slate-800'}>
                                {r.map((c, cI) => (
                                  <td key={cI} className="p-2 border-r border-slate-100 dark:border-slate-800 last:border-r-0">{c}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return <p key={idx} className="leading-relaxed text-slate-600 dark:text-slate-300">{el.text}</p>;
                })}
              </div>
            ) : (
              <div className="m-auto text-center space-y-2 text-slate-400">
                <FileText className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Upload a .docx file or click "Try Sample Word Doc" to begin</p>
              </div>
            )}
          </div>

          {docElements.length > 0 && (
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
