import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, RefreshCw, Sparkles, Copy, Check, Plus, Trash2, Table } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

export function PdfToExcelTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleRows: string[][] = [
    ['Invoice #', 'Client Name', 'Issue Date', 'Amount (USD)', 'Status'],
    ['INV-2026-001', 'Acme Corporation', '2026-01-15', '$4,500.00', 'Paid'],
    ['INV-2026-002', 'Global Tech Solutions', '2026-01-20', '$12,850.00', 'Paid'],
    ['INV-2026-003', 'Apex Design Studio', '2026-02-01', '$3,200.00', 'Pending'],
    ['INV-2026-004', 'Starlight Logistics', '2026-02-10', '$8,400.00', 'Paid'],
    ['INV-2026-005', 'Horizon Media Partners', '2026-02-18', '$6,150.00', 'Pending'],
    ['INV-2026-006', 'Vanguard Consulting', '2026-03-02', '$15,000.00', 'Overdue']
  ];

  const handleFileUpload = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf') && uploadedFile.type !== 'application/pdf') {
      onShowToast('Please upload a valid PDF document');
      return;
    }

    setFile(uploadedFile);
    try {
      const buffer = await uploadedFile.arrayBuffer();
      setPdfBuffer(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);
      setSelectedPage(1);
      onShowToast(`Loaded ${uploadedFile.name} (${pdf.numPages} pages)`);
      extractTables(buffer, 1, pdf.numPages);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to read PDF document');
    }
  };

  const loadSample = () => {
    const fakeFile = new File(['sample'], 'Financial_Report.pdf', { type: 'application/pdf' });
    setFile(fakeFile);
    setTableData(sampleRows);
    setTotalPages(1);
    onShowToast('Loaded sample financial report table!');
  };

  const extractTables = async (buffer: ArrayBuffer, startP: number, endP: number) => {
    setIsExtracting(true);
    setProgress(0);

    try {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
      const pdf = await loadingTask.promise;
      const allRows: string[][] = [];

      for (let p = startP; p <= Math.min(endP, pdf.numPages); p++) {
        setProgress(Math.round(((p - startP + 1) / (endP - startP + 1)) * 100));
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();

        // Group text items by Y position (row)
        // Note: PDF coordinate (0,0) is bottom-left, so higher Y means higher on page
        const itemsWithCoords = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => ({
            str: item.str || '',
            x: item.transform ? item.transform[4] : 0,
            y: item.transform ? item.transform[5] : 0,
            width: item.width || 0,
          }))
          .filter((item) => item.str.trim().length > 0);

        // Group items within 4 points of Y tolerance into same row
        const rowBuckets: { y: number; items: typeof itemsWithCoords }[] = [];
        const yTolerance = 5;

        itemsWithCoords.forEach((item) => {
          const matchedBucket = rowBuckets.find((b) => Math.abs(b.y - item.y) <= yTolerance);
          if (matchedBucket) {
            matchedBucket.items.push(item);
          } else {
            rowBuckets.push({ y: item.y, items: [item] });
          }
        });

        // Sort rows descending by Y (top of page to bottom)
        rowBuckets.sort((a, b) => b.y - a.y);

        // In each row, sort items ascending by X (left to right)
        rowBuckets.forEach((bucket) => {
          bucket.items.sort((a, b) => a.x - b.x);
          const rowCells: string[] = [];
          let currentCell = '';
          let lastX = -999;
          const xGapTolerance = 18; // Gap threshold to separate cells into columns

          bucket.items.forEach((it) => {
            if (lastX >= 0 && it.x - lastX > xGapTolerance) {
              if (currentCell.trim()) {
                rowCells.push(currentCell.trim());
              }
              currentCell = it.str;
            } else {
              currentCell += (currentCell ? ' ' : '') + it.str;
            }
            lastX = it.x + it.width;
          });

          if (currentCell.trim()) {
            rowCells.push(currentCell.trim());
          }

          if (rowCells.length > 0) {
            allRows.push(rowCells);
          }
        });
      }

      if (allRows.length === 0) {
        onShowToast('No tabular text detected in selected pages');
      } else {
        setTableData(allRows);
        onShowToast(`Extracted ${allRows.length} rows from PDF!`);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Error extracting tables from PDF');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCellEdit = (rowIdx: number, colIdx: number, value: string) => {
    const updated = [...tableData];
    updated[rowIdx] = [...updated[rowIdx]];
    updated[rowIdx][colIdx] = value;
    setTableData(updated);
  };

  const addRow = () => {
    const colCount = tableData.length > 0 ? tableData[0].length : 3;
    const newRow = new Array(colCount).fill('');
    setTableData([...tableData, newRow]);
    onShowToast('Added new row');
  };

  const deleteRow = (idx: number) => {
    setTableData(tableData.filter((_, i) => i !== idx));
    onShowToast('Deleted row');
  };

  const toCsvString = () => {
    return tableData
      .map((row) =>
        row
          .map((cell) => {
            const escaped = cell.replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      )
      .join('\r\n');
  };

  const downloadCsv = () => {
    if (tableData.length === 0) return;
    const csvContent = '\ufeff' + toCsvString();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(file?.name || 'document').replace(/\.[^/.]+$/, '')}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded CSV file!');
  };

  const downloadXlsx = async () => {
    if (tableData.length === 0) return;

    try {
      const zip = new JSZip();

      // [Content_Types].xml
      zip.file(
        '[Content_Types].xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`
      );

      // _rels/.rels
      zip.file(
        '_rels/.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
      );

      // xl/_rels/workbook.xml.rels
      zip.folder('xl')?.file(
        '_rels/workbook.xml.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
      );

      // xl/workbook.xml
      zip.folder('xl')?.file(
        'workbook.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
      );

      // xl/styles.xml
      zip.folder('xl')?.file(
        'styles.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
</styleSheet>`
      );

      const xmlEscape = (str: string) =>
        str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');

      const getColLetter = (colIndex: number): string => {
        let temp = colIndex;
        let letter = '';
        while (temp >= 0) {
          letter = String.fromCharCode((temp % 26) + 65) + letter;
          temp = Math.floor(temp / 26) - 1;
        }
        return letter;
      };

      let sheetRowsXml = '';
      tableData.forEach((row, rIdx) => {
        const rowNum = rIdx + 1;
        let rowCellsXml = '';
        row.forEach((cell, cIdx) => {
          const colLetter = getColLetter(cIdx);
          const cellRef = `${colLetter}${rowNum}`;
          rowCellsXml += `<c r="${cellRef}" t="inlineStr"><is><t>${xmlEscape(cell)}</t></is></c>`;
        });
        sheetRowsXml += `<row r="${rowNum}">${rowCellsXml}</row>`;
      });

      const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${sheetRowsXml}
  </sheetData>
</worksheet>`;

      zip.folder('xl')?.folder('worksheets')?.file('sheet1.xml', sheetXml);

      const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(file?.name || 'document').replace(/\.[^/.]+$/, '')}_data.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Downloaded Excel Workbook (.XLSX)!');
    } catch (err) {
      console.error(err);
      onShowToast('Error generating Excel file');
    }
  };

  const handleCopyTsv = () => {
    const tsv = tableData.map((row) => row.join('\t')).join('\n');
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    onShowToast('Copied table to clipboard (TSV)!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            PDF to Excel Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Extract tables, financial sheets, and structured data from PDF documents directly into Excel (.xlsx) and CSV format.
          </p>
        </div>
        <button
          onClick={loadSample}
          className="px-3.5 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
        >
          Try Sample PDF Table
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Options */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
            <Upload className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {file ? file.name : 'Upload PDF Document'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Extracts table data locally in your browser. No files are uploaded to any server.
            </p>
            <label className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer transition-colors shadow-md">
              Browse PDF
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            {totalPages > 0 && (
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
                {totalPages} {totalPages === 1 ? 'page' : 'pages'} detected
              </p>
            )}
          </div>

          {totalPages > 0 && (
            <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Page Range Extraction
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => pdfBuffer && extractTables(pdfBuffer, 1, 1)}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  Page 1 Only
                </button>
                <button
                  onClick={() => pdfBuffer && extractTables(pdfBuffer, 1, totalPages)}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  All {totalPages} Pages
                </button>
              </div>

              {isExtracting && (
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500 font-bold">
                    <span>Extracting tables...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {tableData.length > 0 && (
            <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Table Actions
              </span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={addRow}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
                <button
                  onClick={handleCopyTsv}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Table to Clipboard'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Editable Data Grid & Export Buttons */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Extracted Data Grid ({tableData.length} rows)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click any cell to edit before export
              </span>
            </div>

            {tableData.length > 0 ? (
              <div className="flex-1 max-h-[380px] overflow-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {tableData.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={`group ${
                          rIdx === 0
                            ? 'bg-slate-100 dark:bg-slate-800 font-bold sticky top-0 z-10'
                            : 'border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="w-8 p-2 text-center text-slate-400 font-mono text-[10px] select-none border-r border-slate-100 dark:border-slate-800">
                          {rIdx + 1}
                        </td>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-1 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleCellEdit(rIdx, cIdx, e.target.value)}
                              className="w-full px-2 py-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:bg-emerald-50 dark:focus:bg-emerald-950/30 focus:outline-none rounded"
                            />
                          </td>
                        ))}
                        <td className="w-8 p-1 text-center">
                          {rIdx > 0 && (
                            <button
                              onClick={() => deleteRow(rIdx)}
                              title="Delete row"
                              className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="m-auto text-center space-y-2 text-slate-400">
                <FileSpreadsheet className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Upload a PDF containing tables or click "Try Sample PDF Table"</p>
              </div>
            )}
          </div>

          {tableData.length > 0 && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={downloadCsv}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <Download className="w-4 h-4" /> Export CSV (.CSV)
              </button>
              <button
                onClick={downloadXlsx}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Excel (.XLSX)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
