import React, { useState } from 'react';
import { Upload, FileCode, Download, RefreshCw, FileText, Check, AlertCircle, Sparkles } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

export function PdfToWordTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [extractedHtml, setExtractedHtml] = useState<string>('');
  const [pagesParagraphs, setPagesParagraphs] = useState<string[][]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleFile = async (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf' && !uploadedFile.name.endsWith('.pdf')) {
      onShowToast('Please upload a valid PDF document');
      return;
    }
    const buffer = await uploadedFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
    const pdf = await loadingTask.promise;
    setFile(uploadedFile);
    setPdfBuffer(buffer);
    setTotalPages(pdf.numPages);
    setExtractedHtml('');
    onShowToast(`Loaded PDF: ${pdf.numPages} pages`);
  };

  const convertToWord = async () => {
    if (!pdfBuffer || !file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer.slice(0)) });
      const pdf = await loadingTask.promise;
      let htmlContent = '';
      const allPagesParas: string[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(Math.round((i / pdf.numPages) * 100));
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageParas: string[] = [];

        htmlContent += `<div style="page-break-after: always; margin-bottom: 24px; padding: 20px; border-bottom: 1px dashed #cbd5e1;">`;
        htmlContent += `<p style="color: #64748b; font-size: 11px; font-weight: bold;">Page ${i}</p>`;

        let currentParagraph = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textContent.items.forEach((item: any) => {
          const str = item.str || '';
          if (item.hasEOL || str.endsWith('.')) {
            currentParagraph += ' ' + str;
            if (currentParagraph.trim()) {
              const trimmed = currentParagraph.trim();
              pageParas.push(trimmed);
              htmlContent += `<p style="margin-bottom: 12px; line-height: 1.6; font-size: 13pt; font-family: Calibri, sans-serif;">${trimmed}</p>`;
            }
            currentParagraph = '';
          } else {
            currentParagraph += ' ' + str;
          }
        });

        if (currentParagraph.trim()) {
          const trimmed = currentParagraph.trim();
          pageParas.push(trimmed);
          htmlContent += `<p style="margin-bottom: 12px; line-height: 1.6; font-size: 13pt; font-family: Calibri, sans-serif;">${trimmed}</p>`;
        }

        htmlContent += `</div>`;
        allPagesParas.push(pageParas);
      }

      setPagesParagraphs(allPagesParas);
      setExtractedHtml(htmlContent);
      onShowToast('Converted PDF to Word format!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to convert PDF to Word');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadDocx = async () => {
    if (!pagesParagraphs.length || !file) return;

    try {
      const zip = new JSZip();

      zip.file(
        '[Content_Types].xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
      );

      zip.file(
        '_rels/.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
      );

      const xmlEscape = (str: string) =>
        str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');

      let documentBodyXml = '';
      pagesParagraphs.forEach((page, pIdx) => {
        if (pIdx > 0) {
          documentBodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
        }
        page.forEach((pText) => {
          documentBodyXml += `<w:p><w:pPr><w:spacing w:after="160" w:line="276" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">${xmlEscape(pText)}</w:t></w:r></w:p>`;
        });
      });

      const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${documentBodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

      zip.folder('word')?.file('document.xml', documentXml);

      const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace(/\.[^/.]+$/, '')}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Downloaded Word document (.DOCX)!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to generate DOCX file');
    }
  };

  const downloadDoc = () => {
    if (!extractedHtml || !file) return;

    const docHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${file.name}</title>
        <!--[if gte mso 9]>
        <xml>
        <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
        </xml>
        <![endif]-->
      </head>
      <body style="font-family: Calibri, Arial, sans-serif; font-size: 12pt; color: #1e293b; padding: 40px;">
    `;
    const docFooter = '</body></html>';
    const fullDoc = docHeader + extractedHtml + docFooter;

    const blob = new Blob(['\ufeff' + fullDoc], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded Word document (.DOC)!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            PDF to Word Converter (.DOC / .DOCX)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert fixed PDF layout into editable Microsoft Word (.DOC) document with paragraph and page preservation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload & Conversion */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[220px]"
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              id="pdf-to-word-file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="space-y-2 text-center w-full">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate px-4">{file.name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{totalPages} pages detected</p>
                <label
                  htmlFor="pdf-to-word-file"
                  className="text-[11px] text-slate-400 hover:underline cursor-pointer block pt-1 font-bold"
                >
                  Choose another PDF
                </label>
              </div>
            ) : (
              <label htmlFor="pdf-to-word-file" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload PDF File</p>
                  <p className="text-xs text-slate-400 mt-1">Convert to Microsoft Word document</p>
                </div>
              </label>
            )}
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <button
              onClick={convertToWord}
              disabled={!file || isProcessing}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting PDF ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Convert PDF to Word</span>
                </>
              )}
            </button>

            {isProcessing && (
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Output Preview & Download */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col min-h-[360px]">
            {extractedHtml ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Word Document Document Preview
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Ready to export
                  </span>
                </div>

                <div
                  dangerouslySetInnerHTML={{ __html: extractedHtml }}
                  className="flex-1 max-h-[340px] overflow-y-auto pr-2 text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-3"
                />
              </div>
            ) : (
              <div className="m-auto text-center space-y-2 text-slate-400">
                <FileCode className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Document preview will appear here</p>
              </div>
            )}
          </div>

          {extractedHtml && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={downloadDoc}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download .DOC
              </button>
              <button
                onClick={downloadDocx}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Editable .DOCX
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
