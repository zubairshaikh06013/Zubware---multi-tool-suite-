import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  Download,
  Printer,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FileText,
  RotateCcw,
  Info,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

type OptionType = 4 | 5 | 6; // A-D, A-E, A-F

export const OmrSheetGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();

  // Test Header Information
  const [instituteName, setInstituteName] = useState('ACADEMY OF SCIENCES');
  const [examTitle, setExamTitle] = useState('MID-TERM ASSESSMENT 2026');
  const [subject, setSubject] = useState('Physics & Mathematics');
  const [examDate, setExamDate] = useState('06/09/2026');

  // Exam Configuration
  const [questionCount, setQuestionCount] = useState<number>(50);
  const [optionsPerQuestion, setOptionsPerQuestion] = useState<OptionType>(4);
  const [columnsCount, setColumnsCount] = useState<number>(2);

  // Student Info Block Options
  const [showRollNoGrid, setShowRollNoGrid] = useState(true);
  const [rollNoDigits, setRollNoDigits] = useState<number>(6);
  const [showSetCode, setShowSetCode] = useState(true);
  const [showSignatureBoxes, setShowSignatureBoxes] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);

  // Sheet Mode: Blank or Answer Key
  const [sheetMode, setSheetMode] = useState<'blank' | 'answer-key'>('blank');
  const [answerKey, setAnswerKey] = useState<Record<number, string>>({});

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Handle Question Count Preset
  const handlePresetCount = (cnt: number) => {
    setQuestionCount(cnt);
    if (cnt <= 25) setColumnsCount(1);
    else if (cnt <= 50) setColumnsCount(2);
    else if (cnt <= 100) setColumnsCount(3);
    else setColumnsCount(4);
    onShowToast(`Configured for ${cnt} questions.`);
  };

  const handleToggleAnswer = (qNum: number, letter: string) => {
    if (sheetMode !== 'answer-key') return;
    setAnswerKey(prev => {
      const next = { ...prev };
      if (next[qNum] === letter) {
        delete next[qNum];
      } else {
        next[qNum] = letter;
      }
      return next;
    });
  };

  // Generate canvas rendering of standard A4 sheet (2480 × 3508 at 300 DPI, or 1240 × 1754 at 150 DPI)
  const renderOmrCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 1240;
    canvas.height = 1754;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Corner Optical Fiducial Registration Marks (Black squares for alignment)
    const markSize = 24;
    const pad = 36;
    ctx.fillStyle = '#000000';
    ctx.fillRect(pad, pad, markSize, markSize); // Top-left
    ctx.fillRect(canvas.width - pad - markSize, pad, markSize, markSize); // Top-right
    ctx.fillRect(pad, canvas.height - pad - markSize, markSize, markSize); // Bottom-left
    ctx.fillRect(canvas.width - pad - markSize, canvas.height - pad - markSize, markSize, markSize); // Bottom-right

    // 2. Header Section
    let curY = pad + 10;
    ctx.textAlign = 'center';

    if (instituteName.trim()) {
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(instituteName.toUpperCase(), canvas.width / 2, curY + 20);
      curY += 28;
    }

    if (examTitle.trim()) {
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText(examTitle.toUpperCase(), canvas.width / 2, curY + 18);
      curY += 24;
    }

    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#475569';
    const subDate = [subject.trim(), examDate.trim() ? `Date: ${examDate.trim()}` : ''].filter(Boolean).join('   |   ');
    if (subDate) {
      ctx.fillText(subDate, canvas.width / 2, curY + 14);
      curY += 22;
    }

    // Divider line
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad + markSize + 15, curY + 5);
    ctx.lineTo(canvas.width - pad - markSize - 15, curY + 5);
    ctx.stroke();
    curY += 16;

    // 3. Identification & Candidate Details Section
    const contentWidth = canvas.width - (pad + 15) * 2;
    const infoStartX = pad + 15;

    // Candidate Name Write-in Box
    ctx.textAlign = 'left';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('CANDIDATE NAME (IN CAPITAL LETTERS):', infoStartX, curY + 14);
    curY += 18;

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(infoStartX, curY, contentWidth * 0.58, 28);

    // Roll number or set code blocks
    let rightBlockX = infoStartX + contentWidth * 0.62;
    let rightBlockY = curY - 18;

    if (showSetCode) {
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('TEST BOOKLET SET:', rightBlockX, rightBlockY + 14);
      const setLetters = ['A', 'B', 'C', 'D'];
      const bubbleRadius = 9;

      setLetters.forEach((letCode, idx) => {
        const bx = rightBlockX + idx * 30 + 15;
        const by = rightBlockY + 34;

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(bx, by, bubbleRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(letCode, bx, by + 3.5);
      });
      ctx.textAlign = 'left';
    }

    curY += 38;

    // Instructions Section if enabled
    if (showInstructions) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(infoStartX, curY, contentWidth, 34);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(infoStartX, curY, contentWidth, 34);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('IMPORTANT INSTRUCTIONS:', infoStartX + 10, curY + 14);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(
        '• Use Blue / Black Ballpoint Pen only.   • Darken bubbles completely like ( ● ).   • Do not fold, tear or use correction fluid on this sheet.',
        infoStartX + 10,
        curY + 26
      );
      curY += 44;
    } else {
      curY += 12;
    }

    // 4. Questions & Bubble Grid
    const questionsStartY = curY;
    const questionsAvailableHeight = canvas.height - questionsStartY - (showSignatureBoxes ? 110 : 70);

    const questionsPerCol = Math.ceil(questionCount / columnsCount);
    const colWidth = (contentWidth - (columnsCount - 1) * 20) / columnsCount;
    const rowHeight = Math.min(26, questionsAvailableHeight / questionsPerCol);
    const bubbleRadius = Math.max(7, Math.min(9, rowHeight * 0.36));

    for (let c = 0; c < columnsCount; c++) {
      const colStartX = infoStartX + c * (colWidth + 20);

      // Draw Column Header
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(colStartX, questionsStartY, colWidth, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Q.No', colStartX + 22, questionsStartY + 14);

      for (let o = 0; o < optionsPerQuestion; o++) {
        const optX = colStartX + 52 + o * ((colWidth - 56) / optionsPerQuestion) + 12;
        ctx.fillText(OPTION_LETTERS[o], optX, questionsStartY + 14);
      }

      // Draw Question Rows in this Column
      for (let r = 0; r < questionsPerCol; r++) {
        const qNum = c * questionsPerCol + r + 1;
        if (qNum > questionCount) break;

        const rowY = questionsStartY + 24 + r * rowHeight;

        // Alternate light zebra striping
        if (r % 2 === 1) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(colStartX, rowY - 2, colWidth, rowHeight);
        }

        // Question Number
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${qNum}.`, colStartX + 34, rowY + rowHeight / 2 + 2);

        // Option Bubbles
        for (let o = 0; o < optionsPerQuestion; o++) {
          const letter = OPTION_LETTERS[o];
          const optX = colStartX + 52 + o * ((colWidth - 56) / optionsPerQuestion) + 12;
          const optY = rowY + rowHeight / 2;

          const isSelected = sheetMode === 'answer-key' && answerKey[qNum] === letter;

          if (isSelected) {
            // Filled bubble for Answer Key mode
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(optX, optY, bubbleRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(letter, optX, optY + 3.2);
          } else {
            // Blank unfilled bubble
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(optX, optY, bubbleRadius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#475569';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(letter, optX, optY + 3.2);
          }
        }
      }

      // Outer border for column
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.strokeRect(colStartX, questionsStartY, colWidth, 20 + questionsPerCol * rowHeight);
    }

    // 5. Signature Boxes Section at Bottom
    if (showSignatureBoxes) {
      const sigY = canvas.height - pad - markSize - 55;
      const boxWidth = contentWidth * 0.42;

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;

      // Candidate signature box
      ctx.strokeRect(infoStartX, sigY, boxWidth, 44);
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'left';
      ctx.fillText("CANDIDATE'S SIGNATURE", infoStartX + 8, sigY + 58);

      // Invigilator signature box
      const invX = canvas.width - pad - 15 - boxWidth;
      ctx.strokeRect(invX, sigY, boxWidth, 44);
      ctx.fillText("INVIGILATOR'S SIGNATURE", invX + 8, sigY + 58);
    }

    return canvas;
  };

  // Render preview canvas
  useEffect(() => {
    const canvas = renderOmrCanvas();
    const pCanvas = previewCanvasRef.current;
    if (pCanvas) {
      pCanvas.width = canvas.width;
      pCanvas.height = canvas.height;
      const ctx = pCanvas.getContext('2d');
      if (ctx) ctx.drawImage(canvas, 0, 0);
    }
  }, [
    instituteName,
    examTitle,
    subject,
    examDate,
    questionCount,
    optionsPerQuestion,
    columnsCount,
    showRollNoGrid,
    showSetCode,
    showSignatureBoxes,
    showInstructions,
    sheetMode,
    answerKey
  ]);

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pW = doc.internal.pageSize.getWidth();
      const pH = doc.internal.pageSize.getHeight();

      const canvas = renderOmrCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      doc.addImage(imgData, 'JPEG', 0, 0, pW, pH, undefined, 'FAST');

      const prefix = sheetMode === 'answer-key' ? 'omr-answer-key' : 'omr-sheet';
      doc.save(`${prefix}-${questionCount}q.pdf`);
      onShowToast('Print-ready OMR PDF downloaded!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to create PDF.');
    }
  };

  const handleDownloadPng = () => {
    const canvas = renderOmrCanvas();
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    const prefix = sheetMode === 'answer-key' ? 'omr-answer-key' : 'omr-sheet';
    a.download = `${prefix}-${questionCount}q.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast('High-res OMR PNG downloaded.');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Generated locally in your browser. Fully printable and ready for exam evaluation.</span>
      </div>

      {/* Generator Notice */}
      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 text-xs border border-indigo-200/60 dark:border-indigo-800/40">
        <Info className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
        <span>
          <strong>Printable OMR Sheet Generator:</strong> Design standardized optical answer sheets and official answer keys for schools, competitive mock exams, and assessments. Print directly or download as high-resolution PDF.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Sheet Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            {/* Sheet Mode Toggle */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setSheetMode('blank')}
                className={`flex-1 py-2 rounded-lg cursor-pointer transition-all ${
                  sheetMode === 'blank' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Blank Student Sheet
              </button>
              <button
                type="button"
                onClick={() => setSheetMode('answer-key')}
                className={`flex-1 py-2 rounded-lg cursor-pointer transition-all ${
                  sheetMode === 'answer-key' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Teacher Answer Key
              </button>
            </div>

            {/* Header Details */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Institute / Organization Name</label>
                <input
                  type="text"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  placeholder="e.g. Springfield High School"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Exam / Assessment Title</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Annual Physics Assessment"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Date</label>
                  <input
                    type="text"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-200/60 dark:border-slate-800" />

            {/* Questions Setup */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Question Count</label>
                <div className="flex flex-wrap gap-1.5">
                  {[20, 50, 100, 150, 200].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePresetCount(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        questionCount === num
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Options per Question</label>
                  <select
                    value={optionsPerQuestion}
                    onChange={(e) => setOptionsPerQuestion(parseInt(e.target.value) as OptionType)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <option value={4}>4 (A, B, C, D)</option>
                    <option value={5}>5 (A, B, C, D, E)</option>
                    <option value={6}>6 (A, B, C, D, E, F)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Columns Layout</label>
                  <select
                    value={columnsCount}
                    onChange={(e) => setColumnsCount(parseInt(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <option value={1}>1 Column</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSetCode}
                    onChange={(e) => setShowSetCode(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Include Question Booklet Set (A, B, C, D)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSignatureBoxes}
                    onChange={(e) => setShowSignatureBoxes(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Include Candidate & Invigilator signature boxes
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInstructions}
                    onChange={(e) => setShowInstructions(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Include bubble marking instructions box
                  </span>
                </label>
              </div>
            </div>

            {sheetMode === 'answer-key' && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300">
                <span className="font-bold block mb-1">Answer Key Mode Active:</span>
                Click on the question options below to mark correct answers. Filled bubbles will appear in your download.
                <div className="mt-2 flex flex-wrap gap-1 max-h-36 overflow-y-auto p-1 bg-white dark:bg-slate-900 rounded-lg">
                  {Array.from({ length: questionCount }, (_, i) => i + 1).map((q) => (
                    <div key={q} className="flex items-center gap-1 border p-1 rounded">
                      <span className="font-bold text-[10px]">{q}:</span>
                      {OPTION_LETTERS.slice(0, optionsPerQuestion).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => handleToggleAnswer(q, l)}
                          className={`w-4 h-4 rounded-full text-[9px] font-bold cursor-pointer ${
                            answerKey[q] === l ? 'bg-black text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: Sheet Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Sheet Print Preview (Standard A4)
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Save PNG
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>

            {/* Sheet Display Stage */}
            <div className="p-4 rounded-xl bg-slate-200/70 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[500px] overflow-auto">
              <canvas
                ref={previewCanvasRef}
                className="max-h-[620px] object-contain shadow-2xl rounded-xs bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
