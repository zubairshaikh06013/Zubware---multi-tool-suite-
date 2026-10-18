import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Copy, Check, RefreshCw } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { getLinkUrl } from '../../../lib/paths';
import {decodeBrowserImage} from '../../../lib/browserImageDecode';
import {colorSample,imagePixelCoordinates} from '../../../lib/colorSample';
import {MAX_RESIZE_EDGE,MAX_RESIZE_PIXELS} from '../../../lib/imageResize';

interface ColorPickerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

type ColorSample=ReturnType<typeof colorSample>;

export const ColorPickerTool: React.FC<ColorPickerToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [currentColor,setCurrentColor]=useState<ColorSample|null>(null);

  const [recentColors, setRecentColors] = useState<ColorSample[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const imageRef=useRef<HTMLImageElement>(null);
  const sampleContext=useRef<CanvasRenderingContext2D|null>(null);
  const sourceRef=useRef('');
  const loadRun=useRef(0),eyeRun=useRef(0),copyRun=useRef(0);
  const copyTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  useEffect(()=>()=>{loadRun.current++;eyeRun.current++;copyRun.current++;if(sourceRef.current) URL.revokeObjectURL(sourceRef.current);if(copyTimer.current) clearTimeout(copyTimer.current);},[]);
  const reset=()=>{
    loadRun.current++;eyeRun.current++;copyRun.current++;
    if(sourceRef.current) URL.revokeObjectURL(sourceRef.current);sourceRef.current='';sampleContext.current=null;
    if(copyTimer.current) clearTimeout(copyTimer.current);
    setFile(null);setMetadata(null);setImageObj(null);setCurrentColor(null);setRecentColors([]);setCopiedKey(null);setError('');setLoading(false);
  };
  const selectColor=(sample:ColorSample)=>{
    copyRun.current++;setCopiedKey(null);setCurrentColor(sample);
    setRecentColors(previous=>[sample,...previous.filter(color=>color.hex!==sample.hex).slice(0,11)]);
  };
  const handleImageSelected=async(files:File[])=>{
    if(!files.length) return;
    reset();const run=++loadRun.current,selected=files[0];setFile(selected);setLoading(true);
    let temporaryUrl:string|undefined;
    try {
      const decoded=await decodeBrowserImage(selected);temporaryUrl=decoded.url;
      const width=decoded.image.naturalWidth,height=decoded.image.naturalHeight;
      if(width>MAX_RESIZE_EDGE || height>MAX_RESIZE_EDGE || width*height>MAX_RESIZE_PIXELS) throw new Error('Choose images up to 16,384 px per side and 40 megapixels.');
      const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx) throw new Error('Could not create the color sampling canvas.');
      ctx.drawImage(decoded.image,0,0);
      const meta=await getImageMetadata(selected,decoded.image);
      if(run!==loadRun.current) return;
      sourceRef.current=decoded.url;temporaryUrl=undefined;sampleContext.current=ctx;setImageObj(decoded.image);setMetadata(meta);
    } catch(failure) {if(run===loadRun.current) {setFile(null);setError(failure instanceof Error?failure.message:'Could not open this image.');}}
    finally {if(temporaryUrl) URL.revokeObjectURL(temporaryUrl);if(run===loadRun.current) setLoading(false);}
  };
  const samplePixelColor=(event:React.MouseEvent<HTMLImageElement>)=>{
    const image=imageRef.current,ctx=sampleContext.current;
    if(!image || !ctx) return;
    try {
      const {x,y}=imagePixelCoordinates(event.clientX,event.clientY,image.getBoundingClientRect(),image.naturalWidth,image.naturalHeight);
      const pixel=ctx.getImageData(x,y,1,1).data;
      selectColor(colorSample(pixel[0],pixel[1],pixel[2],pixel[3]));setError('');
    } catch {setError('Could not read this pixel. Try a local PNG or JPG image.');}
  };
  const handleEyeDropper=async()=>{
    if(!('EyeDropper' in window)) {onShowToast('Click the uploaded image to sample a pixel.');return;}
    const run=++eyeRun.current;
    try {
      const eyeDropper=new (window as any).EyeDropper();
      const result=await eyeDropper.open();
      if(run!==eyeRun.current || !/^#[0-9a-f]{6}$/i.test(result.sRGBHex)) return;
      const hex=result.sRGBHex;selectColor(colorSample(parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)));
    } catch(failure) {if(run===eyeRun.current && !(failure instanceof DOMException && failure.name==='AbortError')) setError('Screen sampling is unavailable. Click the uploaded image instead.');}
  };
  const copyToClipboard=async(text:string,key:string)=>{
    const run=++copyRun.current;
    try {
      await navigator.clipboard.writeText(text);
      if(run!==copyRun.current) return;
      setCopiedKey(key);onShowToast(`Copied ${key}: ${text}`);
      if(copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current=setTimeout(()=>{if(run===copyRun.current) setCopiedKey(null);},1500);
    } catch {if(run===copyRun.current) {setCopiedKey(null);onShowToast('Could not copy. Select the color value and copy it manually.');}}
  };

  return (
    <div className="space-y-6">
      

      {error && <p role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-sm">{error}</p>}
      {!file ? (
        <ImageUploadArea onImageSelected={handleImageSelected} />
      ) : (
        <div className="space-y-6">
          <button type="button" onClick={reset} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex gap-2"><RefreshCw className="w-4 h-4"/>Select Different Image</button>
          {loading && <p role="status" className="text-sm text-slate-500">Reading image…</p>}
          {metadata && (
            <ImageFileInfoPanel
              fileName={metadata.fileName}
              originalSize={metadata.fileSize}
              format={metadata.format}
              width={metadata.width}
              height={metadata.height}
              hasTransparency={metadata.hasTransparency}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Canvas View */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Click image to sample pixel color</span>
                {'EyeDropper' in window && (
                  <button
                    type="button"
                    onClick={handleEyeDropper}
                    disabled={loading}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Pipette className="w-3.5 h-3.5" /> EyeDropper Tool
                  </button>
                )}
              </div>

              {imageObj && <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800 cursor-crosshair">
                <img
                  ref={imageRef}
                  src={imageObj?.src}
                  alt="Sample"
                  onClick={samplePixelColor}
                  className="max-h-80 object-contain rounded-xl"
                />
              </div>}
            </div>

            {/* Color Values & Recent Palette */}
            <div className="space-y-6">
              {/* Active Color Card */}
              {currentColor ? <><div className="p-6 rounded-3xl glass-card space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl border-2 border-white/80 dark:border-slate-700 shadow-lg"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Selected Color</span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{currentColor.hex}</h3>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
                  {[
                    { label: 'HEX', val: currentColor.hex },
                    { label: 'RGB', val: currentColor.rgb },
                    { label: 'HSL', val: currentColor.hsl },
                    { label: 'HSV', val: currentColor.hsv },
                    { label: 'CMYK', val: currentColor.cmyk }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-2 rounded-xl bg-slate-100/60 dark:bg-slate-900/60">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">{item.label}:</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.val}</span>
                      </div>
                      <button
                        type="button"
                        aria-label={`Copy ${item.label}`}
                        onClick={() => copyToClipboard(item.val, item.label)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                      >
                        {copiedKey === item.label ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {currentColor.alpha<255 && <p className="text-xs text-slate-500">Pixel opacity: {Math.round(currentColor.alpha/255*100)}%. HEX, RGB and HSL include alpha; HSV and CMYK describe the color channels.</p>}
              </> : <p className="p-6 text-sm text-slate-500">Click a pixel in the image or use EyeDropper to see its color values.</p>}
              {/* Recent Colors Grid */}
              {recentColors.length > 0 && (
                <div className="p-5 rounded-3xl glass-card space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Colors</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {recentColors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectColor(c)}
                        className="w-full h-8 rounded-xl border border-white/60 dark:border-slate-700 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: c.hex }}
                        title={c.hex}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
