import React from 'react';
import { ToolMeta } from '../../types';
import { getLinkUrl } from '../../lib/paths';
import {
  Subtitles,
  Video,
  Sliders,
  Scissors,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Barcode,
  DollarSign,
  Calculator,
  Percent,
  Calendar,
  TrendingUp,
  PiggyBank,
  Sparkles,
  Clock,
  Printer,
  Download,
  Layers,
  Lock,
  Scale,
  Smartphone,
  Laptop,
  Info,
  HelpCircle,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';

interface VideoBusinessSEOSectionProps {
  tool: ToolMeta;
  onNavigate: (path: string) => void;
}

export const VideoBusinessSEOSection: React.FC<VideoBusinessSEOSectionProps> = ({ tool, onNavigate }) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(getLinkUrl(path));
  };

  switch (tool.id) {
    /* =========================================================================
       1. VIDEO SUBTITLE & SRT GENERATOR (subtitle-generator)
       ========================================================================= */
    case 'subtitle-generator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Video Accessibility &amp; Captioning Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Video Subtitle &amp; SRT Generator: Create, Time &amp; Sync Captions Online
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Closed captions and subtitles boost audience retention by over 80% on muted social feeds and are legally mandated for accessibility under Section 508 and WCAG 2.1 guidelines. Zubware’s Video Subtitle &amp; SRT Generator allows you to load video clips into a frame-accurate player, dictate dialogue in real time using the browser Web Speech API, synchronize cue timestamps down to tenths of a second, and export industry-standard SubRip (.srt) and WebVTT (.vtt) caption tracks—100% locally in browser memory with zero cloud video uploads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Interactive Timestamp Synchronization
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Play your video and pin cue start and end times with one click using the &quot;Set Start to Current&quot; and &quot;Set End to Current&quot; buttons. Fine-tune duration numbers manually down to tenths of a second to eliminate audio drift and align spoken dialogue with lip movement.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Browser Web Speech Dictation
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Toggle the microphone icon to transcribe spoken words directly into caption cards via your browser&apos;s native Web Speech API (in Chrome, Edge, and Safari). Optional dictation listens to your microphone, not the uploaded video. Your browser may send audio to its speech recognition provider. Manual captions remain available without microphone access.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Download className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Dual Format Export: .SRT &amp; .VTT
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Export universal SubRip (.srt) files formatted with standard sequential indexes and comma millisecond delimiters (<code className="text-xs">00:00:02,500</code>), or WebVTT (.vtt) files formatted with period millisecond delimiters (<code className="text-xs">00:02.500</code>) for HTML5 <code className="text-xs">&lt;track&gt;</code> elements.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Subtitle Format</th>
                  <th className="p-3.5">Timestamp Syntax</th>
                  <th className="p-3.5">Primary Compatibility</th>
                  <th className="p-3.5">Styling &amp; Headers</th>
                  <th className="p-3.5">Best Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">SubRip (.srt)</td>
                  <td className="p-3.5 font-mono">00:01:24,500 --&gt; 00:01:28,200</td>
                  <td className="p-3.5">YouTube Studio, Premiere Pro, Final Cut, VLC, DaVinci</td>
                  <td className="p-3.5">Sequential numbered blocks; plain text</td>
                  <td className="p-3.5">Broadcasting, YouTube uploads, video editing timelines</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">WebVTT (.vtt)</td>
                  <td className="p-3.5 font-mono">01:24.500 --&gt; 01:28.200</td>
                  <td className="p-3.5">HTML5 Video players, Video.js, Safari, Chrome, LMS</td>
                  <td className="p-3.5">&apos;WEBVTT&apos; header identifier; CSS cue classes</td>
                  <td className="p-3.5">Web publishing, e-learning courses, responsive video tags</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Workflow Verification &amp; Privacy Architecture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unlike cloud SaaS transcription platforms that store confidential product videos and customer interviews on third-party servers, Zubware creates in-browser blob URLs. Video playback runs inside an HTML5 video element on your graphics card. Uploaded video playback and manual caption editing stay local. Optional microphone dictation may send audio to the browser provider for speech recognition.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Complementary Video Workflows:</span>
              <button onClick={(e) => handleNav(e, '/video-trimmer')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Video Trimmer &amp; Cutter
              </button>
              <span className="text-slate-400">•</span>
              <button onClick={(e) => handleNav(e, '/video-aspect-ratio')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Video Aspect Ratio Converter
              </button>
              <span className="text-slate-400">•</span>
              <button onClick={(e) => handleNav(e, '/video-compressor')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Video Compressor
              </button>
            </div>
          </div>
        </section>
      );

    /* =========================================================================
       2. VIDEO ASPECT RATIO CONVERTER (video-aspect-ratio)
       ========================================================================= */
    case 'video-aspect-ratio':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Social Media Video Reframing &amp; Repurposing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Video Aspect Ratio Converter: Convert 16:9 to 9:16 Reels &amp; TikTok Online
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Content creators and social media marketers need to repurpose horizontal landscape videos into vertical 9:16 formats for TikTok, Instagram Reels, and YouTube Shorts. Zubware’s Video Aspect Ratio Converter uses hardware-accelerated canvas capture to reframe video clips into 9:16, 16:9, 1:1 square, 4:5 portrait, or 4:3 classic dimensions. Choose between Contain mode with real-time dynamic Gaussian blur padding or Cover mode for center cropping, preserving original audio tracks with zero server uploads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Smartphone className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  9:16 Vertical Mobile Presets
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Render crisp 720×1280 px vertical video optimized for mobile discovery feeds on TikTok, Instagram Reels, and YouTube Shorts. Eliminate awkward black bars by duplicating your video with smooth blurred ambient background padding.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Layers className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Contain vs. Cover Framing
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Contain mode preserves 100% of your source video frame, centering it within the new canvas and padding the edges with blurred video or solid hex color. Cover mode scales the video to fill the screen edge-to-edge without borders by cropping outer margins.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Video className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Hardware-Accelerated WebM Capture
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The engine records 30 frames per second directly from an HTML5 canvas stream via MediaRecorder (using VP9 or VP8 codecs at 3.5 Mbps high bitrate), simultaneously capturing the original soundtrack for perfect lip sync.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Target Ratio</th>
                  <th className="p-3.5">Export Resolution</th>
                  <th className="p-3.5">Primary Platform</th>
                  <th className="p-3.5">Recommended Framing</th>
                  <th className="p-3.5">Key Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">9:16 Vertical</td>
                  <td className="p-3.5 font-mono">720 × 1280 px</td>
                  <td className="p-3.5">TikTok, IG Reels, YouTube Shorts</td>
                  <td className="p-3.5">Contain + Blurred Padding</td>
                  <td className="p-3.5">Full horizontal content visible with ambient backdrop</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">16:9 Widescreen</td>
                  <td className="p-3.5 font-mono">1280 × 720 px</td>
                  <td className="p-3.5">YouTube, Vimeo, TV Displays</td>
                  <td className="p-3.5">Contain (from vertical sources)</td>
                  <td className="p-3.5">Adapts smartphone footage for desktop/TV screens</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">1:1 Square</td>
                  <td className="p-3.5 font-mono">1080 × 1080 px</td>
                  <td className="p-3.5">Instagram Feed, LinkedIn, Twitter/X</td>
                  <td className="p-3.5">Contain or Cover</td>
                  <td className="p-3.5">Maximizes vertical and desktop feed real estate</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">4:5 Portrait</td>
                  <td className="p-3.5 font-mono">1080 × 1350 px</td>
                  <td className="p-3.5">Instagram Timeline Posts</td>
                  <td className="p-3.5">Contain + Padding</td>
                  <td className="p-3.5">Occupies maximum vertical height allowed on Instagram</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Pro-Tip: Avoiding Blur in Repurposed Social Media Videos
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When converting a 16:9 video to 9:16 using Cover mode, the center 33% of the image is magnified 300% to fill the vertical frame. If your source video is lower than 1080p, this can introduce pixelation. For best results, use Contain mode with Blurred Background enabled; this preserves crisp 100% native resolution for text overlays, graphics, and demonstrations while creating an aesthetically rich background.
            </p>
          </div>
        </section>
      );

    /* =========================================================================
       3. VIDEO COMPRESSOR (video-compressor)
       ========================================================================= */
    case 'video-compressor':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Video Compression &amp; Bandwidth Optimization
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Video Compressor Online: Shrink MP4 &amp; WebM Files in Your Browser Free
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              High-definition smartphone footage (4K and 1080p60) routinely produces file sizes of several hundred megabytes per minute, triggering strict upload rejections on Discord (25 MB cap), Gmail (25 MB attachment ceiling), WhatsApp, and company portals. Zubware’s Video Compressor re-encodes MP4, WebM, and MOV video clips locally using native MediaRecorder and canvas stream downscaling. Fine-tune bitrate presets and resolution scaling to reduce file size by 50% to 80% without cloud uploads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Sliders className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Three Curated Bitrate Presets
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose High Quality (2.5 Mbps) for client presentations and high-motion sports; Medium Quality (1.2 Mbps) for balanced 50–70% compression savings on social posts; or Low Quality (600 Kbps) for compact ~4.5 MB/minute files suitable for email and Discord.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Laptop className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Resolution Downscaling
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Downscale resolution to 75% or 50% scale. Downscaling a 1080p frame to 720p reduces the total number of pixels by over 55%, yielding massive byte savings without noticeable blur on mobile phone screens.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  100% Client-Side Privacy
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional video compressors upload your private footage to external servers, creating privacy risks and download delays. Zubware executes all discrete cosine transforms and container muxing inside your device RAM with zero network latency.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Quality Preset</th>
                  <th className="p-3.5">Target Bitrate</th>
                  <th className="p-3.5">Estimated File Size per Min</th>
                  <th className="p-3.5">Recommended Resolution Scale</th>
                  <th className="p-3.5">Target Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">High Quality</td>
                  <td className="p-3.5 font-mono">2.5 Mbps</td>
                  <td className="p-3.5">~18.5 MB / minute</td>
                  <td className="p-3.5">100% (Native Dimensions)</td>
                  <td className="p-3.5">Portfolio clips, software demos, YouTube uploads</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Medium Quality</td>
                  <td className="p-3.5 font-mono">1.2 Mbps</td>
                  <td className="p-3.5">~9.0 MB / minute</td>
                  <td className="p-3.5">75% Scale</td>
                  <td className="p-3.5">Slack channels, website background video, mobile sharing</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Low Quality</td>
                  <td className="p-3.5 font-mono">600 Kbps</td>
                  <td className="p-3.5">~4.5 MB / minute</td>
                  <td className="p-3.5">50% Scale</td>
                  <td className="p-3.5">Discord free tier (25MB), Gmail attachments, WhatsApp</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Performance Recommendation: In-Browser Video Re-Encoding Limits
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Because video encoding is handled by your browser&apos;s allocated memory sandbox, input video files under 500 MB perform best. When compressing longer lectures or high-bitrate phone recordings, keep the browser tab active in the foreground to prevent OS background memory throttling.
            </p>
          </div>
        </section>
      );

    /* =========================================================================
       4. VIDEO TRIMMER & CUTTER (video-trimmer)
       ========================================================================= */
    case 'video-trimmer':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Precision Video Slicing &amp; Clip Extraction
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Video Trimmer &amp; Cutter: Cut &amp; Extract Video Clips Online Free
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Extracting a 15-second teaser or removing unwanted dead air from an interview should not require heavy desktop video editing software or cloud subscription paywalls. Zubware’s Video Trimmer &amp; Cutter lets you scrub through video footage, drag start and end boundary handles, type exact decimal timestamps for frame accuracy, test looping segment previews, and export pristine trimmed WebM video clips with synchronized audio—100% locally in your browser with zero watermarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <Scissors className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Frame-Level Timestamp Entry
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Combine the speed of interactive visual timeline scrubbing with numerical decimal input boxes. Enter exact start and end seconds (e.g. 14.5s to 32.8s) to cleanly cut unwanted lead-in silence or abrupt camera movements.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Video className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Isolated Playback Loop Preview
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Press Play to audition the exact trimmed cut. Playback automatically loops between your specified start and end markers, letting you confirm audio flow and dialogue endpoints before spending time re-encoding.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Zero Watermarks &amp; Full Privacy
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Many online video editors stamp an unsightly logo watermark on exported clips unless you pay a monthly fee. Zubware is completely free and stamps zero watermarks. Your source video remains strictly on your device.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Common Trimming Pitfalls to Avoid
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Cutting dialogue mid-syllable:</strong> Always leave 0.2 to 0.4 seconds of padding before the speaker begins talking and after they stop to avoid clipped consonants.</li>
              <li><strong>Browser tab backgrounding:</strong> Modern browsers pause background canvas rendering to conserve laptop battery. Keep the trimmer tab visible while the progress bar runs.</li>
              <li><strong>Missing audio:</strong> Ensure your source video is unmuted in the player preview before initiating trim export so the media stream captures the active audio track.</li>
            </ul>
          </div>
        </section>
      );

    /* =========================================================================
       5. GST INVOICE GENERATOR (gst-invoice-generator)
       ========================================================================= */
    case 'gst-invoice-generator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Indian Taxation &amp; GST Compliance Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              GST Invoice Generator Online: Free Indian Tax Invoice &amp; Bill of Supply Maker
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Every GST-registered business in India is required by Section 31 of the CGST Act and Rule 46 of CGST Rules to issue standardized tax invoices with consecutive serial numbering, supplier and buyer GSTIN details, mandatory HSN/SAC codes, and accurate bifurcated tax calculations. Zubware’s GST Invoice Generator automates intra-state (CGST + SGST) versus inter-state (IGST) tax calculation, embeds dynamic UPI payment QR codes, manages reverse charge indicators, and renders print-ready vector PDF invoices directly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Calculator className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Automatic CGST / SGST vs IGST Split
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The engine compares the Supplier State code with the Place of Supply (POS). If both match, the tax slab (0%, 5%, 12%, 18%, 28%) is split 50/50 into Central GST and State GST. If they differ, the full rate is applied as Integrated GST (IGST).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Building2 className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  37 States &amp; Union Territories Support
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pre-configured with all 37 Indian state and Union Territory GST codes (01 Jammu &amp; Kashmir to 38 Ladakh). Entering a 15-character GSTIN automatically parses and validates the 2-digit state prefix.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Receipt className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Dynamic UPI Payment QR Integration
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Input your business UPI ID (VPA) to automatically render a scannable payment QR code on the invoice with the exact calculated invoice total. Customers scan with PhonePe, Google Pay, or Paytm for instant bank-to-bank settlement.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Standard GST Slab</th>
                  <th className="p-3.5">Intra-State Bifurcation</th>
                  <th className="p-3.5">Inter-State Bifurcation</th>
                  <th className="p-3.5">Typical Goods / Services Covered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">0% (Nil Rated)</td>
                  <td className="p-3.5">0% CGST + 0% SGST</td>
                  <td className="p-3.5">0% IGST</td>
                  <td className="p-3.5">Fresh milk, eggs, fresh vegetables, unbranded grains, books</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">5% Slab</td>
                  <td className="p-3.5">2.5% CGST + 2.5% SGST</td>
                  <td className="p-3.5">5% IGST</td>
                  <td className="p-3.5">Packaged food, tea, coffee, edible oil, economy air transport</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">12% Slab</td>
                  <td className="p-3.5">6.0% CGST + 6.0% SGST</td>
                  <td className="p-3.5">12% IGST</td>
                  <td className="p-3.5">Processed food, butter, cheese, business class air tickets</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">18% Slab (Standard)</td>
                  <td className="p-3.5">9.0% CGST + 9.0% SGST</td>
                  <td className="p-3.5">18% IGST</td>
                  <td className="p-3.5">Software services, consulting, electronics, telecom, hotel stays</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">28% Slab (Luxury)</td>
                  <td className="p-3.5">14.0% CGST + 14.0% SGST</td>
                  <td className="p-3.5">28% IGST</td>
                  <td className="p-3.5">Automobiles, air conditioners, cement, gaming, luxury goods</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border-l-4 border-amber-500">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Statutory Disclaimer &amp; E-Invoicing Scope
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zubware’s GST Invoice Generator produces formatted PDF tax invoices and bills of supply for business recordkeeping, quotation delivery, and billing clients. It is not an authorized GST Suvidha Provider (GSP) and does not automatically upload invoices to the Government Invoice Registration Portal (IRN portal). Businesses whose aggregate turnover exceeds the mandatory e-invoicing statutory threshold (₹5 Crores) must generate their Invoice Reference Number (IRN) and signed QR code through the government portal.
            </p>
          </div>
        </section>
      );

    /* =========================================================================
       6. OMR SHEET GENERATOR (omr-sheet-generator)
       ========================================================================= */
    case 'omr-sheet-generator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Assessment Administration &amp; Examination Logistics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              OMR Sheet Generator: Create Printable MCQ Answer Sheets &amp; Keys in PDF
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Conducting offline competitive practice exams, university mid-terms, and classroom quizzes requires structured Optical Mark Recognition (OMR) response sheets with standard bubble spacing and optical alignment anchors. Zubware’s OMR Sheet Generator lets educators and students customize institution headers, question counts (20 to 150), bubble options (4 to 6 choices), roll number grids, and test booklet set codes. Export 300 DPI vector A4 PDFs for printing, or toggle to Answer Key mode to generate master evaluation sheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Printer className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Print-Ready ISO A4 Dimensions
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rendered at 1240 × 1754 px canvas resolution specifically calibrated for 150–300 DPI printing on standard 210 × 297 mm A4 paper. Four solid black corner fiducial registration marks provide optical alignment anchors for grading scanners.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Interactive Answer Key Mode
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Switch from Blank Sheet to Answer Key mode to click and darken correct bubbles directly on the canvas preview. Download an authoritative shaded master answer key to assist teachers during manual grading or physical transparent overlay evaluation.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Layers className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Custom Student Info Grids
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enable roll number bubble grids with 4 to 10 numerical digit columns (0–9), test booklet set selectors (Set A, B, C, D), candidate and invigilator signature boxes, and standard pen-shading instruction notices.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Question Preset</th>
                  <th className="p-3.5">Column Layout</th>
                  <th className="p-3.5">Options Supported</th>
                  <th className="p-3.5">Ideal Examination Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">20–25 Questions</td>
                  <td className="p-3.5 font-mono">1 Column</td>
                  <td className="p-3.5">4 Options (A–D)</td>
                  <td className="p-3.5">Classroom pop quizzes, driving licence mock tests, unit reviews</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">50 Questions</td>
                  <td className="p-3.5 font-mono">2 Columns</td>
                  <td className="p-3.5">4 or 5 Options (A–E)</td>
                  <td className="p-3.5">Mid-term school exams, certification practice, language tests</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">100 Questions</td>
                  <td className="p-3.5 font-mono">3 Columns</td>
                  <td className="p-3.5">4 Options (A–D)</td>
                  <td className="p-3.5">SSC CGL Tier 1, Banking Prelims, State PSC mock examinations</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">120–150 Questions</td>
                  <td className="p-3.5 font-mono">4 Columns</td>
                  <td className="p-3.5">4 Options (A–D)</td>
                  <td className="p-3.5">NEET mock practice, JEE Mains, comprehensive university finals</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border-l-4 border-amber-500">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Scanning &amp; Evaluation Capability Notice
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This tool is a layout and generation engine designed to create printable test sheets and master answer keys. It does not perform smartphone camera scanning, OCR evaluation, or automated scoring of completed physical answer sheets. For grading, use standard OMR scanner hardware or manual answer key overlay comparison.
            </p>
          </div>
        </section>
      );

    /* =========================================================================
       7. FREE BARCODE GENERATOR (barcode-generator)
       ========================================================================= */
    case 'barcode-generator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Supply Chain &amp; 1D Linear Barcode Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Free Barcode Generator: Create Code 128, EAN-13, UPC-A in Vector SVG &amp; PNG
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Linear 1D barcodes remain the foundational standard for warehouse asset tagging, retail point-of-sale checkout, logistics transit cartons, and library inventory tracking. Zubware’s Free Barcode Generator encodes strings across 9 standardized linear symbologies including Code 128, EAN-13, UPC-A, Code 39, and ITF-14. Customize bar dimensions, colors, and human-readable text labels, and download infinitely scalable vector SVG or high-resolution PNG barcodes with 100% private in-browser generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Barcode className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  9 Supported Symbologies
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate universal Code 128 (alphanumeric logistics), EAN-13 (global retail), UPC-A (North American retail), EAN-8 (small goods), Code 39, ITF-14 (cartons), MSI Plessey, Pharmacode, and Codabar.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Download className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Scalable Vector SVG &amp; High-Res PNG
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Download vector SVG files with mathematically crisp bar boundaries that never pixelate when scaled for commercial flexographic packaging printing, or export raster PNG files for direct thermal label printers.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Automated Checksum Validation
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The generator checks modulo-10 check digits required by EAN and UPC retail specifications in real time, preventing unreadable or rejected barcodes before you commit to printing bulk product packaging.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border-l-4 border-amber-500">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Generating Barcode Images vs. Official GS1 Product Registration
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This tool generates the visual barcode image (SVG/PNG) from numbers you input. However, to sell physical consumer products in major retail supermarkets or marketplaces (Amazon, Walmart, Target, Reliance Retail), your GTIN/EAN number must be officially licensed from GS1 with an authorized Company Prefix. Generating an unassigned retail barcode does not grant legal ownership of a product identifier. For internal inventory, asset tags, library cards, and shipping cartons, you can freely generate barcodes using any internal numbering scheme.
            </p>
          </div>
        </section>
      );

    /* =========================================================================
       8. LOAN ELIGIBILITY CALCULATOR (loan-eligibility-calculator)
       ========================================================================= */
    case 'loan-eligibility-calculator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Mortgage &amp; Personal Credit Underwriting Math
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Loan Eligibility Calculator: Check Maximum Borrowing Power &amp; DTI Limits
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Before submitting formal loan applications, borrowers need to know their maximum loan ceiling to avoid loan rejections that negatively impact credit scores. Zubware’s Loan Eligibility Calculator uses the standard financial Present Value formula to calculate maximum borrowing capacity based on net monthly income, existing debt commitments, annual interest rate, tenure, and lender Debt-to-Income (DTI / FOIR) ratios. Evaluate borrowing headroom with 100% financial privacy in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Calculator className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Present Value Annuity Math
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates loan capacity using: <code className="text-xs">P = EMI × [(1+r)^n - 1] ÷ [r × (1+r)^n]</code>, where r is the monthly interest rate and n is loan tenure in months. This models the exact mathematical discounting algorithm used by institutional loan underwriters.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Scale className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  DTI / FOIR Cap Analysis
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Lenders strictly limit combined monthly debt to 40%–50% of net income (known as FOIR in India or DTI in the US). The calculator displays your current debt ratio versus projected debt ratio to ensure you remain within conservative lending guidelines.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Private Financial Modeling
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Lead generation loan websites frequently require personal phone numbers and trigger unwanted marketing calls from loan agents. Zubware calculates your borrowing capacity 100% locally in browser memory with zero tracking or lead capture.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border-l-4 border-amber-500">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Underwriting Disclaimer: Why Eligibility Does Not Guarantee Loan Approval
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This calculator provides mathematical borrowing estimates based on income and stated ratios. Actual lender approval depends on credit bureau history (CIBIL 750+ or FICO 700+), continuous employment stability, age, and property valuation. Lenders also enforce Loan-to-Value (LTV) limits, meaning they will not lend more than 75% to 90% of an appraised property value regardless of how high your salary qualifies you.
            </p>
          </div>
        </section>
      );

    /* =========================================================================
       9. DOWN PAYMENT CALCULATOR (down-payment-calculator)
       ========================================================================= */
    case 'down-payment-calculator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Homeownership Planning &amp; Cash to Close
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Down Payment Calculator: Home Savings Goal &amp; Mortgage Cash Needed
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Buying a home requires more than just meeting monthly mortgage payment requirements—you must assemble upfront cash for the down payment and estimated closing costs. Zubware’s Down Payment Calculator evaluates standard loan presets (Conventional 20% no PMI, 3% minimum, FHA 3.5%, VA 0%, Jumbo 15%), factors in 2% to 5% closing costs, and projects compound interest growth in a High-Yield Savings Account (HYSA) to calculate your exact monthly savings target.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <PiggyBank className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Loan Type Presets &amp; PMI Check
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluate conventional loans requiring 20% down to eliminate Private Mortgage Insurance (PMI), alongside first-time homebuyer programs (Conventional 3%, FHA 3.5%, and VA 0%). The calculator flags whether your down payment triggers monthly PMI requirements.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Receipt className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Total Cash to Close Accounting
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Many first-time buyers forget that lender origination fees, appraisal, title insurance, and property tax escrows add 2% to 5% to the required cash. The calculator computes Down Payment + Closing Costs to display true Total Cash to Close.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <TrendingUp className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  HYSA Compound Growth Model
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Models the compound growth of your existing savings plus monthly deposits at your specified High-Yield Savings Account APY (e.g. 4.25%), showing how interest earnings help you reach your down payment goal faster than linear cash saving.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Mathematically Verified Down Payment Example ($400,000 Home Purchase)
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>Consider a $400,000 home purchase with a 24-month savings target and $20,000 in existing liquid savings:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>20% Conventional Down Payment:</strong> $80,000 down payment + $12,000 estimated closing costs (3%) = <strong>$92,000 Total Cash to Close</strong>. Mortgage loan balance is $320,000 with zero monthly PMI.</li>
                <li><strong>3.5% FHA Down Payment:</strong> $14,000 down payment + $12,000 closing costs = <strong>$26,000 Total Cash to Close</strong>. Mortgage loan balance is $386,000 with monthly mortgage insurance premiums.</li>
                <li><strong>Compound Savings Effect:</strong> At 4.25% HYSA APY, your existing $20,000 grows to approximately $21,760 in 24 months, reducing the remaining shortfall that must be funded from salary.</li>
              </ul>
            </div>
          </div>
        </section>
      );

    /* =========================================================================
       10. US INCOME TAX CALCULATOR (us-income-tax-calculator)
       ========================================================================= */
    case 'us-income-tax-calculator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              United States Federal &amp; State Taxation Modeling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              US Income Tax Calculator: 2025–2026 Federal Brackets &amp; Employee FICA
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Understanding paycheck withholding requires modeling progressive federal tax brackets, standard deductions, FICA payroll taxes, and an optional effective state tax rate. Zubware’s US Income Tax Calculator implements official IRS Tax Year 2025 brackets (IRS Revenue Procedure 2024-40) and official 2026 brackets (IRS Revenue Procedure 2025-32). Compute taxable income across Single, Married Filing Jointly, Married Separate, and Head of Household statuses, evaluate effective versus marginal rates, and calculate take-home pay per paycheck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Calculator className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Official 2025 &amp; 2026 IRS Brackets
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Implements official IRS inflation-adjusted progressive brackets (10%, 12%, 22%, 24%, 32%, 35%, 37%) and standard deductions: Single ($15,750 for 2025 / $16,100 for 2026) and Married Filing Jointly ($31,500 for 2025 / $32,200 for 2026).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Receipt className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  FICA Social Security &amp; Medicare
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates mandatory federal payroll deductions: 6.2% Social Security up to the SSA wage base ($176,100 for 2025; $184,500 for 2026), 1.45% Medicare on all earned income, and the 0.9% Additional Medicare surtax on income over $200,000 ($250,000 MFJ).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Building2 className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Optional Effective State Rate
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enter your own effective state rate for a rough estimate applied to federal taxable income. State-specific brackets, deductions and local taxes are not modeled. Leaving this at zero excludes state tax from the estimate.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">2025 Bracket</th>
                  <th className="p-3.5">Single Taxable Range</th>
                  <th className="p-3.5">Married Joint Range</th>
                  <th className="p-3.5">Head of Household Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">10%</td>
                  <td className="p-3.5 font-mono">$0 to $11,925</td>
                  <td className="p-3.5 font-mono">$0 to $23,850</td>
                  <td className="p-3.5 font-mono">$0 to $17,000</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">12%</td>
                  <td className="p-3.5 font-mono">$11,925 to $48,475</td>
                  <td className="p-3.5 font-mono">$23,850 to $96,950</td>
                  <td className="p-3.5 font-mono">$17,000 to $64,850</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">22%</td>
                  <td className="p-3.5 font-mono">$48,475 to $103,350</td>
                  <td className="p-3.5 font-mono">$96,950 to $206,700</td>
                  <td className="p-3.5 font-mono">$64,850 to $103,350</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">24%</td>
                  <td className="p-3.5 font-mono">$103,350 to $197,300</td>
                  <td className="p-3.5 font-mono">$206,700 to $394,600</td>
                  <td className="p-3.5 font-mono">$103,350 to $197,300</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">32%</td>
                  <td className="p-3.5 font-mono">$197,300 to $250,525</td>
                  <td className="p-3.5 font-mono">$394,600 to $501,050</td>
                  <td className="p-3.5 font-mono">$197,300 to $250,500</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">35%</td>
                  <td className="p-3.5 font-mono">$250,525 to $626,350</td>
                  <td className="p-3.5 font-mono">$501,050 to $751,600</td>
                  <td className="p-3.5 font-mono">$250,500 to $626,350</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">37%</td>
                  <td className="p-3.5 font-mono">Over $626,350</td>
                  <td className="p-3.5 font-mono">Over $751,600</td>
                  <td className="p-3.5 font-mono">Over $626,350</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Key Clarification: Marginal vs. Effective Tax Rates
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If a single taxpayer earns $80,000, their marginal tax rate is 22%. However, after taking the $15,750 standard deduction, their taxable income is $64,250. Their first $11,925 is taxed at only 10%, the next $36,550 at 12%, and only the remaining $15,775 at 22%. Their total federal tax is approximately $9,049, representing an <strong>effective federal tax rate of just ~11.3%</strong>. Never assume your entire salary is taxed at your top bracket rate.
            </p>
          </div>
        </section>
      );

    /* =========================================================================
       11. PERSONAL LOAN CALCULATOR (personal-loan-calculator)
       ========================================================================= */
    case 'personal-loan-calculator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Personal Debt Amortization &amp; Payoff Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Personal Loan Calculator: Monthly EMI, True APR &amp; Amortization Schedule
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Unsecured personal loans are widely used for credit card consolidation, emergency medical bills, home improvements, and major expenses. However, upfront origination fees and multi-year interest accumulation can drastically alter the true cost of borrowing. Zubware’s Personal Loan Calculator computes fixed monthly installments (EMI), total interest paid, net funded cash proceeds, and the true APR incorporating upfront fees. Model extra monthly payments to accelerate debt-free dates and export full month-by-month amortization tables to CSV.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Calculator className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Standard Amortization Formula
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computes fixed monthly installments using: <code className="text-xs">EMI = P × [r × (1+r)^n] ÷ [(1+r)^n - 1]</code>. Calculates the exact monthly principal and interest split for loan terms between 12 and 84 months.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Receipt className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Origination Fee &amp; Net Disbursed Cash
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Online lenders often deduct an upfront administrative origination fee (1% to 8%) from your payout. If you borrow $20,000 with a 3% fee, $600 is withheld upfront and you receive $19,400 in cash while paying interest on the full $20,000.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <TrendingUp className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Early Payoff Prepayment Modeling
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Add an optional extra monthly principal payment (such as $50/month) to calculate the exact number of months shaved off your loan term and total interest dollars saved over the life of the loan.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              Full Amortization Schedule &amp; CSV Export
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Toggle the Amortization Breakdown table to inspect the month-by-month trajectory of your debt. See exactly how each monthly payment is divided between interest and principal reduction, track your declining balance, and click Export CSV to download the complete spreadsheet for financial planning in Microsoft Excel or Google Sheets.
            </p>
          </div>
        </section>
      );

    /* =========================================================================
       12. SALE PRICE CALCULATOR (sale-price-calculator)
       ========================================================================= */
    case 'sale-price-calculator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Consumer Math &amp; Stacked Retail Discount Logic
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Sale Price Calculator: Calculate Markdown Discounts &amp; Stacked Coupons Online
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
              Retail promotional events often combine primary clearance markdowns with additional promo code coupons, leaving shoppers confused about their true checkout price. Crucially, retail point-of-sale registers apply stacked discounts sequentially rather than additively. Zubware’s Sale Price Calculator computes primary discounts, secondary stacked promo codes, sales tax / VAT across international currencies, and total out-of-pocket register totals with 100% private in-browser math.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Percent className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Sequential Stacked Discount Logic
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Applies the primary markdown to the original price, and then calculates the secondary promo code on the already-discounted subtotal. For a $100 item with 25% off + 10% coupon: $100 &rarr; $75 &rarr; $67.50 (32.5% effective savings, not 35%).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Receipt className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Sales Tax &amp; VAT Integration
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Select quick tax presets for US average (~8.25%), California/New York (~8.875%), UK VAT (20%), India GST (18%), or EU average (21%) to calculate true register checkout totals including applicable sales tax.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <DollarSign className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Multi-Currency &amp; Quantity Support
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Switch currencies between USD ($), EUR (€), GBP (£), INR (₹), CAD (CA$), and AUD (AU$). Increase the item quantity to compute aggregate shopping cart savings and final multi-item checkout totals.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Mathematically Verified Stacked Discount Example
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>Consider an item with an original list price of $120, a primary store markdown of 25%, an additional 10% member coupon, and 8.25% sales tax:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Step 1 (Primary Markdown):</strong> 25% off $120 saves $30.00 &rarr; Subtotal is $90.00.</li>
                <li><strong>Step 2 (Stacked Promo Coupon):</strong> 10% coupon applied to $90.00 saves $9.00 &rarr; Pre-tax sale price is $81.00.</li>
                <li><strong>Total Dollar Savings:</strong> $30.00 + $9.00 = <strong>$39.00 total discount</strong> (effective 32.5% discount, not 35%).</li>
                <li><strong>Step 3 (Sales Tax):</strong> 8.25% sales tax on $81.00 is $6.68.</li>
                <li><strong>Final Register Out-of-Pocket:</strong> $81.00 + $6.68 = <strong>$87.68</strong>.</li>
              </ul>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};
