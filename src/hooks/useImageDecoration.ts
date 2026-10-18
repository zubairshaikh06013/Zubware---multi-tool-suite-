import { useEffect, useRef, useState } from 'react';
import { decodeBrowserImage } from '../lib/browserImageDecode';
import { encodeCanvasBlob } from '../lib/canvasEncoding';
import { getImageMetadata, ImageMetadata } from '../lib/imageUtils';
import { imageResizeDimensions } from '../lib/imageResize';
import { imageExportExtension } from '../lib/imageExport';

/** Source ownership and export cancellation shared by the three canvas decoration tools. */
export function useImageDecoration(render: (canvas: HTMLCanvasElement, image: HTMLImageElement) => void,
  outputFormat: string, suffix: string, onShowToast: (message: string) => void) {
  const [file, setFile] = useState<File | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const source = useRef(0), revision = useRef(0), sourceUrl = useRef('');
  const exporting = useRef(false);
  const release = () => { if (sourceUrl.current) URL.revokeObjectURL(sourceUrl.current); sourceUrl.current = ''; };
  useEffect(() => () => { source.current++; revision.current++; release(); }, []);
  const reset = () => {
    source.current++; revision.current++; release(); exporting.current = false;
    setFile(null); setImageObj(null); setMetadata(null); setReady(false); setError(''); setIsProcessing(false);
  };
  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    reset();
    const run = source.current;
    setFile(files[0]); setIsProcessing(true);
    let decoded: Awaited<ReturnType<typeof decodeBrowserImage>> | undefined;
    try {
      decoded = await decodeBrowserImage(files[0]);
      if (run !== source.current) { URL.revokeObjectURL(decoded.url); return; }
      imageResizeDimensions(decoded.image.naturalWidth, decoded.image.naturalHeight,
        {mode:'percentage', width:1, height:1, percentage:100, preserveBatchAspect:false});
      const meta = await getImageMetadata(files[0], decoded.image);
      if (run !== source.current) { URL.revokeObjectURL(decoded.url); return; }
      sourceUrl.current = decoded.url;
      setMetadata(meta); setImageObj(decoded.image);
    } catch (cause) {
      if (decoded) URL.revokeObjectURL(decoded.url);
      if (run !== source.current) return;
      setFile(null); setError(cause instanceof Error ? cause.message : 'Unable to open this image.');
    } finally { if (run === source.current) setIsProcessing(false); }
  };
  useEffect(() => {
    revision.current++; exporting.current = false;
    if (!imageObj || !canvasRef.current) return;
    setIsProcessing(false); setReady(false); setError('');
    try { render(canvasRef.current, imageObj); setReady(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to render this image.'); }
  }, [imageObj, render, outputFormat]);
  const handleDownload = async () => {
    if (!ready || !canvasRef.current || !file || exporting.current) return;
    const run = revision.current;
    exporting.current = true; setIsProcessing(true); setError('');
    try {
      const preview = canvasRef.current;
      // JPEG has no alpha. Composite onto white instead of the browser's implicit black.
      const canvas = outputFormat === 'jpg' ? document.createElement('canvas') : preview;
      if (canvas !== preview) {
        canvas.width = preview.width; canvas.height = preview.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Unable to prepare the download.');
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(preview, 0, 0);
      }
      const mime = outputFormat === 'jpg' ? 'image/jpeg' : outputFormat === 'webp' ? 'image/webp' : 'image/png';
      const blob = await encodeCanvasBlob(canvas, mime, 0.95);
      if (run !== revision.current) return;
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `${file.name.replace(/\.[^.]+$/, '') || 'image'}_${suffix}.${imageExportExtension(blob.type)}`;
      link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      onShowToast('Image downloaded!');
    } catch (cause) {
      if (run === revision.current) setError(cause instanceof Error ? cause.message : 'Unable to export this image.');
    } finally { if (run === revision.current) { exporting.current = false; setIsProcessing(false); } }
  };
  return {file, imageObj, metadata, isProcessing, ready, error, canvasRef, handleImageSelected, handleDownload, reset};
}
