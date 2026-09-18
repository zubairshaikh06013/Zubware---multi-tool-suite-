import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileSignature, Download, PenTool, Type, Image as ImageIcon, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { renderPdfPageToCanvas } from '../../../lib/pdfUtils';

export function PdfSignatureTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [pageCanvasUrl, setPageCanvasUrl] = useState<string | null>(null);

  // Signature state
  const [sigMode, setSigMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState<string>('John Doe');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Placement position on page (normalized 0 to 1)
  const [posX, setPosX] = useState<number>(0.65); // 65% from left
  const [posY, setPosY] = useState<number>(0.85); // 85% from top
  const [sigScale, setSigScale] = useState<number>(1);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Drawing canvas ref
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    if (pdfBuffer && totalPages > 0) {
      renderPdfPageToCanvas(pdfBuffer, selectedPage - 1, 1.2).then((canvas) => {
        setPageCanvasUrl(canvas.toDataURL('image/png'));
      });
    }
  }, [pdfBuffer, selectedPage, totalPages]);

  const handleFile = async (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf' && !uploadedFile.name.endsWith('.pdf')) {
      onShowToast('Please upload a valid PDF document');
      return;
    }
    const buffer = await uploadedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    setFile(uploadedFile);
    setPdfBuffer(buffer);
    setTotalPages(pdfDoc.getPageCount());
    setSelectedPage(1);
    onShowToast(`Loaded PDF with ${pdfDoc.getPageCount()} pages`);
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (drawCanvasRef.current) {
      setSignatureDataUrl(drawCanvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  const generateTypedSignature = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'italic 42px "Brush Script MT", cursive, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || 'Sign Here', 200, 60);

    const url = canvas.toDataURL('image/png');
    setSignatureDataUrl(url);
    onShowToast('Typed signature created');
  };

  const handleSignatureUpload = (f: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSignatureDataUrl(e.target?.result as string);
      onShowToast('Signature image loaded');
    };
    reader.readAsDataURL(f);
  };

  const applySignatureAndDownload = async () => {
    if (!pdfBuffer || !signatureDataUrl) {
      onShowToast('Please create or upload a signature first');
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      const page = pdfDoc.getPage(selectedPage - 1);
      const { width, height } = page.getSize();

      const sigImageBytes = await fetch(signatureDataUrl).then((res) => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigImageBytes);

      const sigWidth = 140 * sigScale;
      const sigHeight = (140 * (sigImage.height / sigImage.width)) * sigScale;

      const x = posX * width - sigWidth / 2;
      const y = (1 - posY) * height - sigHeight / 2; // PDF coordinates start from bottom-left

      page.drawImage(sigImage, {
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: sigWidth,
        height: sigHeight,
      });

      const signedPdfBytes = await pdfDoc.save();
      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed_${file?.name || 'document.pdf'}`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Signed PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to sign PDF document');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            PDF E-Signature & Signer (100% Client-Side)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Draw, type, or upload your signature and stamp it securely onto any page of your PDF document.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Signature Creator & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[160px]"
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              id="pdf-sign-file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="space-y-1 text-center w-full">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate px-4">{file.name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{totalPages} pages</p>
                <label
                  htmlFor="pdf-sign-file"
                  className="text-[11px] text-slate-400 hover:underline cursor-pointer block pt-1 font-bold"
                >
                  Change PDF
                </label>
              </div>
            ) : (
              <label htmlFor="pdf-sign-file" className="cursor-pointer space-y-2 block">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload PDF Document</p>
              </label>
            )}
          </div>

          {/* Signature Mode Tabs */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Create Your Signature
            </span>

            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSigMode('draw')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  sigMode === 'draw' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <PenTool className="w-3 h-3" /> Draw
              </button>
              <button
                onClick={() => {
                  setSigMode('type');
                  generateTypedSignature();
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  sigMode === 'type' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Type className="w-3 h-3" /> Type
              </button>
              <button
                onClick={() => setSigMode('upload')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  sigMode === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ImageIcon className="w-3 h-3" /> Upload
              </button>
            </div>

            {/* Signature Input based on mode */}
            {sigMode === 'draw' && (
              <div className="space-y-2">
                <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl bg-white overflow-hidden shadow-inner">
                  <canvas
                    ref={drawCanvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-[150px] cursor-crosshair touch-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={clearCanvas}
                    className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear Signature
                  </button>
                </div>
              </div>
            )}

            {sigMode === 'type' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => {
                    setTypedName(e.target.value);
                  }}
                  onBlur={generateTypedSignature}
                  placeholder="Type your full name..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                />
                <button
                  onClick={generateTypedSignature}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Generate Cursive Signature
                </button>
              </div>
            )}

            {sigMode === 'upload' && (
              <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => e.target.files?.[0] && handleSignatureUpload(e.target.files[0])}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white"
                />
              </div>
            )}

            {/* Target Page & Scale */}
            {totalPages > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Target Page to Sign:</span>
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(Number(e.target.value))}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                  >
                    {Array.from({ length: totalPages }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Page {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Signature Scale:</span>
                    <span>{Math.round(sigScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={sigScale}
                    onChange={(e) => setSigScale(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            )}

            <button
              onClick={applySignatureAndDownload}
              disabled={!file || !signatureDataUrl || isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Apply Signature & Download PDF</span>
            </button>
          </div>
        </div>

        {/* Right Col: Interactive Placement Canvas */}
        <div className="lg:col-span-7 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Placement Preview (Click anywhere on page to position signature)
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
              Page {selectedPage} of {totalPages || 1}
            </span>
          </div>

          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              const y = (e.clientY - rect.top) / rect.height;
              setPosX(x);
              setPosY(y);
              onShowToast('Signature positioned');
            }}
            className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex items-center justify-center min-h-[460px] relative cursor-crosshair overflow-hidden"
          >
            {pageCanvasUrl ? (
              <div className="relative inline-block max-w-full shadow-lg border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white">
                <img
                  src={pageCanvasUrl}
                  alt={`Page ${selectedPage}`}
                  className="max-h-[480px] w-auto object-contain pointer-events-none"
                />

                {/* Draggable/Clickable Stamp Overlay */}
                {signatureDataUrl && (
                  <div
                    style={{
                      left: `${posX * 100}%`,
                      top: `${posY * 100}%`,
                      transform: `translate(-50%, -50%) scale(${sigScale})`,
                    }}
                    className="absolute pointer-events-none p-1 border-2 border-dashed border-indigo-500 bg-indigo-50/20 rounded-lg shadow-sm"
                  >
                    <img
                      src={signatureDataUrl}
                      alt="Signature Stamp"
                      className="max-w-[120px] max-h-[50px] object-contain"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-2 text-slate-400">
                <FileSignature className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Upload a PDF to preview and stamp signatures</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
