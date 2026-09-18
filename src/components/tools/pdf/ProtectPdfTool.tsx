import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF, AlreadyEncryptedError } from '@pdfsmaller/pdf-encrypt';
import {
  Upload,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  FileCheck,
  RefreshCw,
  KeyRound,
  Printer,
  Copy,
  FileEdit
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

export const ProtectPdfTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('');
  const [algorithm, setAlgorithm] = useState<'AES-256' | 'RC4'>('AES-256');

  // Permission settings
  const [allowPrinting, setAllowPrinting] = useState<boolean>(true);
  const [allowCopying, setAllowCopying] = useState<boolean>(true);
  const [allowAnnotating, setAllowAnnotating] = useState<boolean>(true);
  const [allowModifying, setAllowModifying] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);
  const [successInfo, setSuccessInfo] = useState<{ fileName: string; size: number } | null>(null);

  // Compute password strength
  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-300 dark:bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 20;
    if (/\d/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

    if (score < 40) return { score: Math.max(score, 20), label: 'Weak', color: 'bg-rose-500' };
    if (score < 70) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleFileAdded = async (uploadedFile: File) => {
    if (!uploadedFile.name.endsWith('.pdf') && uploadedFile.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF file');
      return;
    }

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      const version = extractPdfVersionFromBuffer(buffer);

      setFile(uploadedFile);
      setPdfBuffer(buffer);
      setPageCount(count);
      setPdfVersion(version);
      setSuccessInfo(null);
      onShowToast(`Loaded PDF (${count} pages)`);
    } catch {
      onShowToast('Failed to load PDF document');
    }
  };

  const handleProtectAndDownload = async () => {
    if (!pdfBuffer || !file) return;

    if (!password.trim()) {
      onShowToast('Please enter a password to protect the PDF');
      return;
    }

    if (password !== confirmPassword) {
      onShowToast('Passwords do not match! Please check and retry.');
      return;
    }

    setIsProcessing(true);
    setSuccessInfo(null);
    setStage('Reading PDF');
    setProgress(20);

    try {
      await new Promise(r => setTimeout(r, 120));
      setStage('Analyzing');
      setProgress(40);

      // Load with pdf-lib to ensure clean, canonical PDF structure
      const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      const rawPdfBytes = await pdfDoc.save();

      setStage('Processing');
      setProgress(65);
      await new Promise(r => setTimeout(r, 100));

      setStage('Preparing Download');
      setProgress(85);

      // Real encryption using standard AES-256 or RC4
      const encryptedBytes = await encryptPDF(rawPdfBytes, password, {
        ownerPassword: ownerPassword.trim() || password,
        algorithm: algorithm,
        allowPrinting: allowPrinting,
        allowCopying: allowCopying,
        allowAnnotating: allowAnnotating,
        allowModifying: allowModifying,
        allowFillingForms: true,
        allowHighQualityPrint: allowPrinting,
      });

      // Quick sanity check: verify that the resulting PDF is actually encrypted
      let isVerifiedLocked = false;
      try {
        await PDFDocument.load(encryptedBytes);
      } catch (err: any) {
        if (err?.message?.includes('encrypted') || err?.message?.includes('password')) {
          isVerifiedLocked = true;
        }
      }

      const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const downloadName = `${baseName}_protected.pdf`;

      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      setSuccessInfo({ fileName: downloadName, size: encryptedBytes.length });
      onShowToast(`🔒 PDF locked with ${algorithm} encryption!`);
    } catch (err: any) {
      console.error('Protect PDF error:', err);
      if (err instanceof AlreadyEncryptedError || err?.name === 'AlreadyEncryptedError') {
        onShowToast('This PDF is already encrypted. Please unlock it first.');
      } else {
        onShowToast(`Failed to encrypt PDF: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setPassword('');
    setConfirmPassword('');
    setOwnerPassword('');
    setSuccessInfo(null);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🔒</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('protectPdfTitle', 'Password Protect PDF')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t(
            'protectPdfSubtitle',
            'Encrypt and add real AES-256 password protection to your confidential PDF documents directly in your browser.'
          )}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfProtect', 'Select PDF file to protect')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('supportsSinglePdf', 'Choose any PDF document to lock with a password')}
          </span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileAdded(e.target.files[0])}
          />
        </label>
      ) : (
        <div className="space-y-6">
          <FileInformationPanel
            fileName={file.name}
            fileSize={file.size}
            pageCount={pageCount}
            pdfVersion={pdfVersion}
            status={isProcessing ? stage : 'Idle'}
            statusProgress={progress}
          />

          {/* Password Input Panel */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Set Document Passwords
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Real Standard Encryption
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* User Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Document Password (Required to Open) *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to lock PDF"
                    className="w-full p-3 pr-10 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Strength: {strength.label}</span>
                      <span>{strength.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Document Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter same password"
                  className={`w-full p-3 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-rose-500 focus:ring-rose-500'
                      : confirmPassword && password === confirmPassword
                      ? 'border-emerald-500 focus:ring-emerald-500'
                      : ''
                  }`}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1">Passwords do not match</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-[11px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>
            </div>

            {/* Advanced Encryption & Permissions Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                {showAdvanced ? 'Hide Advanced Security Options' : 'Show Advanced Security & Permission Options'}
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Encryption Algorithm
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAlgorithm('AES-256')}
                        className={`p-3 rounded-xl text-left border cursor-pointer transition-all ${
                          algorithm === 'AES-256'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-extrabold">AES-256 (Recommended)</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Modern, high-security standard</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAlgorithm('RC4')}
                        className={`p-3 rounded-xl text-left border cursor-pointer transition-all ${
                          algorithm === 'RC4'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-extrabold">RC4 (128-bit)</div>
                        <div className="text-[10px] opacity-75 mt-0.5">Legacy compatibility</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Permissions Allowed for Password Holders:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowPrinting}
                          onChange={(e) => setAllowPrinting(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Allow Printing</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowCopying}
                          onChange={(e) => setAllowCopying(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Allow Copying</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowAnnotating}
                          onChange={(e) => setAllowAnnotating(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <FileEdit className="w-3.5 h-3.5 text-slate-500" />
                        <span>Allow Comments</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Owner / Master Password (Optional)
                    </label>
                    <input
                      type="password"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Leave empty to use document password"
                      className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Owner password gives unrestricted permission to edit security settings in Adobe Acrobat.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Success Note Banner */}
          {successInfo && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300">
                  Document Successfully Encrypted & Downloaded ({successInfo.fileName})
                </div>
                <div className="text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
                  Your PDF is now locked with <strong>{algorithm}</strong> standard encryption. When opened in any PDF
                  viewer (such as Adobe Acrobat, Google Chrome, Safari, Apple Preview, or Foxit Reader), it will
                  prompt for the password you specified.
                </div>
              </div>
            </div>
          )}

          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <div className="flex gap-3">
              <button
                onClick={resetAll}
                className="py-4 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm cursor-pointer transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleProtectAndDownload}
                disabled={!password || password !== confirmPassword}
                className={`flex-1 py-4 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !password || password !== confirmPassword
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-[0.99]'
                }`}
              >
                <Lock className="w-4 h-4" />
                Encrypt & Download Protected PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
