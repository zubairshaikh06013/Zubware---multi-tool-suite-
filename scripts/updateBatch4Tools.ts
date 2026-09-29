import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface HowToStep {
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ToolUpdate {
  howTo: HowToStep[];
  faq: FaqItem[];
}

export const BATCH_4_TOOLS: Record<string, ToolUpdate> = {
  'video-compressor': {
    howTo: [
      {
        title: "Upload Your Video File",
        desc: "Select or drag and drop an MP4, WebM, or MOV video file from your computer or phone into the upload area."
      },
      {
        title: "Choose Quality Preset & Scale",
        desc: "Select a compression preset (High, Medium, Low) or downscale resolution to 75% or 50% to hit your target file size."
      },
      {
        title: "Compress and Save Video",
        desc: "Click Start Compression to re-encode the video locally in browser memory and download the smaller video file."
      }
    ],
    faq: [
      {
        question: "How does in-browser video compression work without server uploads?",
        answer: "The compressor uses HTML5 video elements, HTML5 Canvas, and the native MediaRecorder API to decode and re-encode video frames locally on your device's hardware, never transmitting video frames across the network."
      },
      {
        question: "Which video file formats are supported for compression?",
        answer: "The tool supports modern browser-decodable formats including MP4 (H.264/AAC), WebM (VP8/VP9/Opus), and compatible MOV files from smartphones and digital cameras."
      },
      {
        question: "Does lowering resolution reduce file size faster than lowering bitrate?",
        answer: "Yes. Downscaling resolution (such as from 1080p to 720p or 50% scale) reduces the total number of pixels per frame by up to 75%, resulting in substantial file size savings alongside bitrate adjustments."
      },
      {
        question: "Is there a recommended file size limit for browser video compression?",
        answer: "Because video re-encoding occurs inside your browser's allocated RAM, video clips under 500MB perform most reliably across modern desktop computers and high-end mobile devices."
      },
      {
        question: "Are my personal or proprietary video files sent to a server?",
        answer: "No. All video decoding, compression, and file assembly execute strictly within your local browser session. No video data or audio tracks are uploaded to Zubware servers."
      }
    ]
  },

  'video-aspect-ratio': {
    howTo: [
      {
        title: "Upload Your Source Video",
        desc: "Drag and drop your video clip into the converter workspace to inspect its current aspect ratio and dimensions."
      },
      {
        title: "Select Target Ratio & Framing Style",
        desc: "Choose 9:16 (Shorts/Reels/TikTok), 16:9 (YouTube), 1:1, or 4:5, and select blurred background padding, solid fill, or crop-to-fit."
      },
      {
        title: "Export Converted Aspect Ratio Video",
        desc: "Preview the re-framed playback in real-time and click Export Video to save the reframed clip directly to your machine."
      }
    ],
    faq: [
      {
        question: "How does the blurred background padding mode work?",
        answer: "Blurred background mode duplicates your source video into a background canvas layer, scales it up, and applies an aesthetic Gaussian blur, cleanly filling the empty letterbox or pillarbox bars without harsh black borders."
      },
      {
        question: "Can I convert a 16:9 horizontal YouTube video into a 9:16 vertical Short?",
        answer: "Yes. Select the 9:16 preset. You can either use blurred background padding to show the entire original widescreen video in the center, or choose crop mode to zoom in and fill the full vertical frame."
      },
      {
        question: "What is the difference between Fit mode and Crop mode?",
        answer: "Fit mode keeps 100% of your source video visible by adding padded borders to match the target ratio. Crop mode enlarges the video to eliminate all borders, cutting away outer edges that fall outside the new frame."
      },
      {
        question: "What output video format is produced by the converter?",
        answer: "The browser exports a web-ready WebM or MP4 video container recorded directly from the canvas stream at the target dimensions."
      },
      {
        question: "Does changing video aspect ratios upload my footage to any cloud service?",
        answer: "No. All frame manipulation, aspect ratio calculations, and canvas recordings occur locally in your web browser with zero server data transfer."
      }
    ]
  },

  'video-trimmer': {
    howTo: [
      {
        title: "Load Video into Interactive Timeline",
        desc: "Select or drop your video file into the trimmer to display the playable scrubber timeline."
      },
      {
        title: "Set Exact Start and End Cut Points",
        desc: "Drag the visual timeline handles or type exact second timestamps into the start and end input fields."
      },
      {
        title: "Preview Range & Download Trimmed Clip",
        desc: "Play the isolated segment loop to confirm the cut, then click Trim Video to export and download your clipped video."
      }
    ],
    faq: [
      {
        question: "Can I specify exact second and millisecond timestamps for trimming?",
        answer: "Yes. In addition to dragging the interactive visual timeline scrubber handles, you can manually type precise start and end times into the timestamp input boxes for frame-level accuracy."
      },
      {
        question: "Can I preview only the selected trimmed portion before exporting?",
        answer: "Yes. Clicking Play in the trimmer interface loops playback strictly between your specified start and end cut points, allowing you to verify the edit before rendering."
      },
      {
        question: "Does trimming a video re-upload it to a remote server?",
        answer: "No. The trimmer processes media directly in your browser using HTML5 media elements and client-side canvas capture, keeping your files completely on your device."
      },
      {
        question: "Are audio and video kept in sync in the trimmed output?",
        answer: "Yes. The MediaRecorder stream captures both synchronized video frames and the active audio track from the media element during the selected time range."
      },
      {
        question: "What is the maximum video duration I can trim in the browser?",
        answer: "You can trim videos of several minutes to half an hour depending on your device's available memory. For optimal performance, trim clips from source files under 500MB."
      }
    ]
  },

  'video-to-gif': {
    howTo: [
      {
        title: "Upload Video Clip",
        desc: "Select an MP4, WebM, or MOV video file to load the video playback and animation controls."
      },
      {
        title: "Configure Trim, Resolution & Frame Rate",
        desc: "Set the start and end trim timestamps, choose target pixel width (e.g., 320px, 480px, 640px), and set frame rate (10 to 20 FPS)."
      },
      {
        title: "Render & Download Animated GIF",
        desc: "Click Convert to GIF to extract frames, compile the color palette, and download your animated GIF image."
      }
    ],
    faq: [
      {
        question: "Why should video clips for GIF conversion be kept short?",
        answer: "The GIF format does not use modern inter-frame compression algorithms. Every frame stores individual bitmap color tables, meaning long clips or high resolutions quickly result in multi-megabyte files."
      },
      {
        question: "How does the frame rate (FPS) setting affect GIF file size?",
        answer: "Higher FPS (such as 20 FPS) delivers ultra-smooth animation but doubles the total frame count and file size compared to 10 FPS. For memes and website embeds, 10 to 12 FPS provides great motion at a lightweight file size."
      },
      {
        question: "Does the converted GIF file include audio?",
        answer: "No. The GIF specification (GIF89a) is strictly an animated image standard that does not support audio tracks. If you need sound, use the Video Trimmer tool to create short video clips."
      },
      {
        question: "What is the best width setting for web and email GIFs?",
        answer: "A width between 320px and 480px is optimal for newsletters, email signatures, and web articles, providing crisp visual clarity without causing slow email loading."
      },
      {
        question: "Are video frames sent to an external server during GIF conversion?",
        answer: "No. Frame sampling, color quantization, and GIF binary encoding execute entirely in your browser's JavaScript environment."
      }
    ]
  },

  'video-to-audio': {
    howTo: [
      {
        title: "Select Video File",
        desc: "Choose or drop an MP4, WebM, or MOV video containing the audio track you wish to extract."
      },
      {
        title: "Choose Audio Format & Bitrate",
        desc: "Select high-fidelity uncompressed WAV audio for studio editing or lightweight WebM audio for quick listening."
      },
      {
        title: "Extract and Download Audio Track",
        desc: "Click Extract Audio to decode the sound stream with Web Audio APIs and save the audio file directly to your device."
      }
    ],
    faq: [
      {
        question: "Does extracting audio from a video reduce sound quality?",
        answer: "Exporting to WAV produces lossless uncompressed PCM audio decoded directly from the source video's audio stream without adding extra compression artifacts."
      },
      {
        question: "Can I extract stereo channels and background music accurately?",
        answer: "Yes. The browser's native Web Audio API preserves multichannel stereo sound, vocal tracks, and background music at the original sampling rate (typically 44.1kHz or 48kHz)."
      },
      {
        question: "What happens if I upload a video that does not contain audio?",
        answer: "The extractor will inspect the video container; if no active audio stream is detected, it will display a notification informing you that the file contains no audio to extract."
      },
      {
        question: "Can I import the extracted WAV audio into audio editing software?",
        answer: "Yes. Standard WAV audio files are universally compatible with Audacity, Adobe Audition, Premiere Pro, DaVinci Resolve, Final Cut Pro, and mobile editing applications."
      },
      {
        question: "Is my video uploaded to any server during the extraction process?",
        answer: "No. Audio stream extraction and WAV file generation run 100% locally on your computer or phone using native Web Audio and TypedArray buffers."
      }
    ]
  },

  'subtitle-generator': {
    howTo: [
      {
        title: "Load Video File into Player",
        desc: "Upload your video to activate the interactive timeline player and synchronized caption editor."
      },
      {
        title: "Add & Sync Subtitle Timestamps",
        desc: "Type captions manually or use voice recognition speech-to-text, setting exact start and end timestamps for each dialogue cue."
      },
      {
        title: "Export Standard SRT or VTT File",
        desc: "Click Download SRT or Download VTT to save standard timed subtitle files ready for YouTube Studio or video players."
      }
    ],
    faq: [
      {
        question: "What is the difference between SRT and WebVTT subtitle files?",
        answer: "SRT (.srt) is the universal subtitle format supported by YouTube, Premiere Pro, and desktop players. WebVTT (.vtt) is the modern HTML5 web standard used for responsive online video elements and browser playback."
      },
      {
        question: "How does the built-in speech-to-text captioning work?",
        answer: "It utilizes your browser's native Web Speech API to transcribe spoken audio during playback directly into timestamped subtitle cues without third-party API keys."
      },
      {
        question: "How do I upload the generated SRT file to YouTube?",
        answer: "In YouTube Studio, open your video's Subtitles section, click Add Language, select Upload File -> With Timing, and choose your exported .srt file."
      },
      {
        question: "Can I edit subtitle timings down to milliseconds?",
        answer: "Yes. You can edit the exact start and end millisecond timestamps on each subtitle block to ensure precise synchronization with on-screen dialogue."
      },
      {
        question: "Are my subtitle scripts or video files sent to a remote database?",
        answer: "No. All video playback, speech recognition buffers, and subtitle cues are managed entirely within your local browser session."
      }
    ]
  },

  'matching-parts-video-maker': {
    howTo: [
      {
        title: "Upload Character Artwork & Select Layout",
        desc: "Upload your main puzzle character graphic, choose 9:16 Shorts canvas dimensions, and select background colors."
      },
      {
        title: "Configure Puzzle Pieces & Timer Countdown",
        desc: "Position cutout puzzle pieces, designate the correct match, set the countdown timer duration, and add reveal effects."
      },
      {
        title: "Preview Animation & Render Video",
        desc: "Play the interactive puzzle simulation in real-time, then click Render Video to record and export the MP4/WebM video."
      }
    ],
    faq: [
      {
        question: "What are 'Matching Parts' puzzle videos on YouTube Shorts and TikTok?",
        answer: "They are viral, high-retention short-form videos where viewers are challenged to guess which cutout piece fits into an incomplete character graphic before a countdown timer runs out."
      },
      {
        question: "What video aspect ratio is generated by the puzzle maker?",
        answer: "The studio defaults to a standard 9:16 vertical resolution (1080x1920 pixels), optimized specifically for YouTube Shorts, Instagram Reels, and TikTok feeds."
      },
      {
        question: "Can I customize the countdown duration and decoy pieces?",
        answer: "Yes. You can set the countdown length (such as 3 to 10 seconds), rearrange multiple decoy pieces, and configure the winning match reveal timing."
      },
      {
        question: "Can I add background music and sound effects to the puzzle animation?",
        answer: "Yes. You can attach custom background music tracks and audio cues that play in sync with the countdown ticks and the final puzzle snap."
      },
      {
        question: "How is the puzzle animation exported without server processing?",
        answer: "The canvas animation is recorded in real time directly inside your browser using the MediaStream Recording API, producing a downloadable video file on your device."
      }
    ]
  },

  'script-to-video-maker': {
    howTo: [
      {
        title: "Input Story or Script Paragraphs",
        desc: "Type or paste your narrative text into the editor and choose font styling, text colors, and emphasis highlight boxes."
      },
      {
        title: "Customize Background, Overlay & Audio",
        desc: "Pick an aesthetic gradient or upload custom background media, add a draggable brand logo watermark, and attach optional voiceover audio."
      },
      {
        title: "Preview & Render Video File",
        desc: "Select your target aspect ratio (9:16 Shorts, 1:1 Square, 16:9 Landscape), preview scrolling animation, and download the MP4/WebM video."
      }
    ],
    faq: [
      {
        question: "What video aspect ratios are supported by the Script to Video Maker?",
        answer: "You can render 9:16 vertical video (1080x1920) for TikTok, Reels, and YouTube Shorts; 1:1 square (1080x1080) for Instagram feeds; or 16:9 landscape (1920x1080) for standard YouTube videos."
      },
      {
        question: "Can I synchronize text scrolling speed with a voiceover recording?",
        answer: "Yes. When you attach an audio voiceover file, enabling the Auto-Sync feature automatically adjusts the text scroll rate to match the exact duration of your audio track."
      },
      {
        question: "Can I use custom video loops or photos as the background?",
        answer: "Yes. You can choose from built-in colorful gradient themes or upload your own looping video background or still photography to display behind the text."
      },
      {
        question: "How do I add a brand logo or social media watermark?",
        answer: "Upload a transparent PNG logo in the branding section; you can resize it, adjust opacity, and drag it anywhere on the video preview canvas."
      },
      {
        question: "Are my scripts or uploaded media stored on external servers?",
        answer: "No. All typography layout, canvas animation, audio mixing, and video encoding operate 100% locally in your web browser with zero server uploads."
      }
    ]
  },

  'youtube-thumbnail-simulator': {
    howTo: [
      {
        title: "Upload Thumbnail Image",
        desc: "Select or drag your 1280x720 thumbnail file to load it into the authentic YouTube feed mockup."
      },
      {
        title: "Input & Compare Video Titles",
        desc: "Enter up to three title variations to evaluate side-by-side character counts, keyword placement, and mobile two-line truncation."
      },
      {
        title: "Inspect Readability & Theme Contrast",
        desc: "Toggle between Dark and Light mode, review visual contrast metrics, and inspect the 140px mobile mini-scale preview."
      }
    ],
    faq: [
      {
        question: "How does the YouTube thumbnail simulator work?",
        answer: "The simulator renders your uploaded thumbnail and video title inside an authentic mobile device container that emulates YouTube mobile Home Feed and Search Result layouts. It uses browser-native Canvas 2D image processing to measure tonal contrast, perceived luminance, edge sharpness, and theme compatibility—giving you instant, deterministic feedback before you upload to YouTube."
      },
      {
        question: "Can I preview my YouTube thumbnail on mobile screens?",
        answer: "Yes. Over 70% of YouTube views occur on mobile smartphones. Our simulator lets you inspect how your thumbnail scales on mobile displays, including a dedicated 140px small-size preview mode to ensure your main subject, text badge, and facial expressions remain recognizable at miniature scale."
      },
      {
        question: "How does the title truncation simulation work?",
        answer: "Rather than simply counting characters, the simulator measures the title inside real mobile container dimensions with standard YouTube two-line clamping. It indicates whether your title fits within 2 lines or may be truncated with an ellipsis on smaller phone screens, allowing you to front-load vital keywords in the first 40–50 characters."
      },
      {
        question: "Can I test both YouTube Light Mode and Dark Mode?",
        answer: "Yes! You can toggle between Light Mode and Dark Mode with one click. The analysis engine calculates separate edge contrast scores for both dark backgrounds (#0f0f0f) and light backgrounds (#ffffff) to warn you if dark borders or white text blend into the viewer’s interface."
      },
      {
        question: "Can I compare multiple video title options?",
        answer: "Yes. You can enter up to three title variations (Primary Title, Option 2, and Option 3). The comparison table displays character counts, word counts, and estimated truncation states side-by-side, and lets you activate any option in the live phone preview with a single click."
      },
      {
        question: "Does this tool predict actual YouTube CTR (Click-Through Rate)?",
        answer: "No tool can predict real viewer CTR or algorithmic ranking because audience interest, niche competition, topic timing, and viewer intent vary widely. Our Feed Standout and Readability scores measure mathematical visual characteristics (luminance, tonal contrast, color saturation, and edge clarity) to help you optimize visual clarity, not make algorithmic promises."
      },
      {
        question: "Are my thumbnail images uploaded to any server?",
        answer: "No. The simulator operates 100% locally inside your web browser using HTML5 File APIs and Canvas 2D. Your images are never transmitted to any external server or third-party service, guaranteeing complete privacy for unpublished creator assets."
      },
      {
        question: "What is the optimal YouTube thumbnail size and aspect ratio?",
        answer: "YouTube recommends an aspect ratio of 16:9 with a resolution of 1280×720 pixels (minimum 640 pixels wide) in JPG, PNG, or WebP format with a file size under 2MB. Our tool automatically checks your uploaded image dimensions and flags non-16:9 ratios so you can avoid awkward letterboxing or cropping."
      }
    ]
  },

  'youtube-banner-safe-area': {
    howTo: [
      {
        title: "Upload Channel Banner Graphic",
        desc: "Select or drag your 2560x1440 channel art file into the interactive safe area simulator."
      },
      {
        title: "Inspect Multi-Device Crop Zones",
        desc: "Switch between Mobile (1546x423), Desktop (2560x423), Tablet, and TV views or enable simultaneous 3-Way Comparison mode."
      },
      {
        title: "Align Artwork to Safe Boundaries",
        desc: "Adjust pan position and scale to ensure your logo, text, and faces sit entirely within the emerald safe zone before uploading."
      }
    ],
    faq: [
      {
        question: "Why does YouTube crop my channel banner differently on mobile, desktop, and TV?",
        answer: "YouTube serves a single responsive banner image across smart TVs, desktop computers, tablets, and mobile phones. On TVs, the entire 2560 × 1440 pixel image is shown. On desktop browsers, YouTube crops the image into a wide, shallow horizontal strip of 2560 × 423 pixels. On smartphones, YouTube crops the sides even further to fit narrow phone screens, displaying only the central 1546 × 423 pixel safe area. If your important text or logos are placed near the edges, they will be cut off on mobile devices."
      },
      {
        question: "What size should a YouTube channel banner be?",
        answer: "According to official YouTube guidelines, the recommended banner upload dimensions are 2560 × 1440 pixels with a 16:9 aspect ratio. The minimum required upload dimension is 2048 × 1152 pixels. YouTube accepts JPG, PNG, GIF, and WebP files up to 6MB in size."
      },
      {
        question: "What is the YouTube banner safe area?",
        answer: "The YouTube banner safe area is the central 1546 × 423 pixel zone of a standard 2560 × 1440 pixel canvas (or 1235 × 338 pixels at minimum upload resolution). Any text, logos, social handles, faces, or call-to-actions placed inside this central safe zone are guaranteed to remain fully visible across all device types—including smartphones, tablets, laptops, and 4K TVs."
      },
      {
        question: "How can I prevent my logo from being cropped?",
        answer: "To prevent your logo and text from being cropped, always keep them centered horizontally and vertically within the 1546 × 423 pixel safe area. Use our simulator’s 'Safe Area Outline' and 'Center Alignment Guides' to verify that none of your essential branding touches or crosses outside the emerald safe boundary."
      },
      {
        question: "Can I check my banner before uploading it?",
        answer: "Yes! That is the exact purpose of this tool. Simply upload your drafted channel art to test how it appears in realistic YouTube-style Mobile, Desktop, and TV contexts. You can also use our 3-Way Crop Comparison mode to simultaneously inspect where the mobile and desktop cutoffs occur."
      },
      {
        question: "Does the simulator upload my image?",
        answer: "No. This tool runs 100% client-side in your web browser. Your banner image is loaded directly into browser memory and is never uploaded, stored, or transmitted to any server or third-party service. Your unpublished creator designs remain completely private."
      },
      {
        question: "Does this tool guarantee the exact YouTube crop?",
        answer: "No. This is a visual simulation based on current official YouTube banner guidance and standard device aspect ratios. YouTube periodically updates its web and mobile app interfaces, and different smartphone screen aspect ratios (such as 19.5:9 or foldable screens) may apply minor visual variations. Always verify the live result on your channel after uploading."
      }
    ]
  },

  'youtube-thumbnail-preview': {
    howTo: [
      {
        title: "Upload Thumbnail or Paste Video URL",
        desc: "Upload a local image file or enter any YouTube video link to automatically retrieve its official high-resolution thumbnail."
      },
      {
        title: "Customize Title & Channel Information",
        desc: "Enter your video title, channel name, view count, and upload time ago to populate the realistic YouTube card."
      },
      {
        title: "Preview Across Layouts & Color Themes",
        desc: "Toggle between Desktop card view, Mobile feed format, Dark theme, and Light theme to evaluate presentation."
      }
    ],
    faq: [
      {
        question: "Can I preview thumbnails from published YouTube videos by entering a link?",
        answer: "Yes. Pasting any standard YouTube video URL or 11-character video ID automatically loads its official maxresdefault or hqdefault thumbnail image into the preview card."
      },
      {
        question: "Why should I test thumbnails in both Dark and Light themes?",
        answer: "YouTube's Dark Mode background (#0f0f0f) can swallow thumbnails with dark outer borders, while Light Mode (#ffffff) reveals contrast against light backgrounds. Testing both ensures your artwork stands out in either user setting."
      },
      {
        question: "What is the recommended resolution for YouTube thumbnail uploads?",
        answer: "YouTube recommends a 16:9 aspect ratio at 1280x720 pixels (minimum 640 pixels wide) in JPG, PNG, or WebP format with a file size under 2MB."
      },
      {
        question: "Does this preview tool display the bottom-right video duration badge?",
        answer: "Yes. The preview card displays the bottom-right timestamp overlay so you can verify that essential text, faces, or brand badges are not obscured by the duration clock."
      },
      {
        question: "Are my uploaded thumbnail concepts saved or uploaded to external servers?",
        answer: "No. Uploaded preview graphics and metadata are handled locally in your browser memory with zero tracking or server-side caching."
      }
    ]
  },

  'thumbnail-text-generator': {
    howTo: [
      {
        title: "Enter Your Video Topic",
        desc: "Type the main topic, niche, or keyword of your YouTube video into the text input field."
      },
      {
        title: "Browse Short-Form Hook Formulas",
        desc: "Explore generated 2-to-4 word thumbnail hook categories including curiosity gaps, shock, numbers, and warnings."
      },
      {
        title: "Copy Text for Graphic Design",
        desc: "Click any hook idea to copy it to your clipboard and paste it directly into your thumbnail design in Photoshop, Canva, or Zubware."
      }
    ],
    faq: [
      {
        question: "Why should thumbnail text be limited to 2 to 4 words?",
        answer: "Viewers scan YouTube feeds in less than a second on small mobile screens. Short 2–4 word phrases in bold, high-contrast fonts grab immediate attention without cluttering the visual image."
      },
      {
        question: "Should thumbnail text repeat the video title word-for-word?",
        answer: "No. The highest-performing YouTube videos use thumbnail text as a punchy curiosity hook or emotional question, allowing the video title to provide the descriptive context and SEO keywords."
      },
      {
        question: "How do these short hooks improve YouTube CTR (Click-Through Rate)?",
        answer: "Formulas based on curiosity gaps, emotional stakes, and contrasting outcomes create an irresistible impulse for viewers to click and discover the answer."
      },
      {
        question: "Which font styles work best with these generated thumbnail phrases?",
        answer: "Heavy, bold sans-serif typefaces (such as Impact, Montserrat ExtraBold, Anton, or Bebas Neue) with high-contrast outlines or drop shadows offer maximum readability on mobile devices."
      },
      {
        question: "Can I use these hooks for YouTube Shorts and TikTok cover text?",
        answer: "Yes. These short hooks work exceptionally well for vertical 9:16 Shorts cover frames, TikTok preview text, and Instagram Reel covers."
      }
    ]
  },

  'youtube-title-generator': {
    howTo: [
      {
        title: "Enter Topic & Select Channel Niche",
        desc: "Type your target subject keywords and choose your content category (Tech, Gaming, Education, Lifestyle, Business)."
      },
      {
        title: "Select Copywriting Formula Style",
        desc: "Filter by How-To, Listicle, Curiosity Gap, Shock/Extreme, or Beginner Guide styles to match your video's mood."
      },
      {
        title: "Monitor Character Limits & Copy",
        desc: "Check the character count gauge to stay within the recommended 50–70 character sweet spot, then click to copy your favorite title."
      }
    ],
    faq: [
      {
        question: "What is the optimal character length for a YouTube video title?",
        answer: "Between 50 and 70 characters. Although YouTube allows up to 100 characters, titles longer than 60–70 characters get truncated with an ellipsis on mobile home feeds and search result cards."
      },
      {
        question: "Why is keyword front-loading critical for YouTube SEO?",
        answer: "Placing your primary target keyword in the first 30–40 characters ensures viewers immediately recognize the video's relevance even if the end of the title is clipped on smaller screens."
      },
      {
        question: "Can I include numbers and brackets in my YouTube titles?",
        answer: "Yes. Data shows titles with specific numbers (e.g., '7 Mistakes', '2026 Edition') and brackets (e.g., '[Step-by-Step]') frequently achieve higher click-through rates by setting concrete expectations."
      },
      {
        question: "Should I use ALL CAPS in YouTube titles?",
        answer: "Capitalizing one or two key impact words (e.g. 'STOP Doing This') adds punchy emphasis, but typing an entire title in all caps often looks spammy and can discourage discerning viewers."
      },
      {
        question: "Does this tool guarantee YouTube search rankings or CTR?",
        answer: "No tool can guarantee algorithmic rankings. These formulas are based on proven copywriting psychology, but real performance depends on audience demand, viewer retention, and thumbnail synergy."
      }
    ]
  },

  'youtube-description-generator': {
    howTo: [
      {
        title: "Enter Video Overview & Key Points",
        desc: "Fill in your video title, an engaging 2-to-3 sentence hook paragraph, and your main discussion points."
      },
      {
        title: "Add Links, Socials & Call-to-Action",
        desc: "Include your channel subscribe link, relevant product or resource URLs, social handles, and viewer call-to-action."
      },
      {
        title: "Generate & Copy Complete Description",
        desc: "Review the structured, formatted description blocks and click Copy All to paste directly into YouTube Studio."
      }
    ],
    faq: [
      {
        question: "Why are the first three lines of a YouTube description the most critical?",
        answer: "YouTube displays only the first 2–3 lines (about 100–150 characters) above the '...more' fold. This snippet is also indexed in search engine snippets and determines whether viewers expand the full description."
      },
      {
        question: "How many hashtags should I include in a YouTube description?",
        answer: "YouTube recommends 3 to 5 targeted hashtags. If a video includes more than 15 hashtags, YouTube ignores all hashtags on the video and may flag the upload for keyword stuffing."
      },
      {
        question: "What is the maximum character limit for YouTube video descriptions?",
        answer: "YouTube allows up to 5,000 characters per video description, providing plenty of room for chapters, reference links, transcripts, affiliate disclosures, and channel credits."
      },
      {
        question: "Can I include clickable timestamps in the generated description?",
        answer: "Yes. Any timestamp formatted with standard digits (such as 00:00 Intro or 02:45 Chapter Name) is automatically recognized by YouTube's player as an interactive clickable chapter."
      },
      {
        question: "Does Zubware store my video descriptions or channel links?",
        answer: "No. The entire description is formatted in your browser memory and is never saved, tracked, or stored on external servers."
      }
    ]
  },

  'youtube-tags-generator': {
    howTo: [
      {
        title: "Input Target Topic or Keyword",
        desc: "Enter your video's core topic to generate relevant semantic tags, related queries, and phrase variations."
      },
      {
        title: "Select Categorized Tag Sets",
        desc: "Choose from primary exact matches, long-tail search phrases, broad topic tags, and common search query variations."
      },
      {
        title: "Copy Comma-Separated Tag String",
        desc: "Monitor the 500-character limit gauge and click Copy All to paste all tags into YouTube Studio's tag box in one click."
      }
    ],
    faq: [
      {
        question: "Do YouTube tags still help video search rankings?",
        answer: "According to YouTube, tags play a modest role compared to the title, thumbnail, and description, but they are specifically valuable for common misspellings, abbreviations, and related synonyms."
      },
      {
        question: "What is the total character limit for tags in YouTube Studio?",
        answer: "YouTube allows up to 500 characters across all tags combined, including separating commas."
      },
      {
        question: "How does this tool format tags for YouTube Studio?",
        answer: "It outputs tags as a clean, comma-separated list so you can copy and paste the entire block into YouTube Studio's tag field in a single operation."
      },
      {
        question: "Should I prioritize long-tail tags or single words?",
        answer: "A combination of 2-to-4 word specific phrases (long-tail keywords) along with 2–3 broad category tags gives YouTube's algorithm much better semantic context than generic single words."
      },
      {
        question: "Can using irrelevant or trending tags hurt my channel?",
        answer: "Yes. YouTube's Community Guidelines strictly prohibit adding tags unrelated to your video content. Always ensure all generated tags accurately describe what happens in your video."
      }
    ]
  },

  'youtube-hashtag-generator': {
    howTo: [
      {
        title: "Enter Video Topic or Niche",
        desc: "Type your primary video topic or keyword into the search bar to generate curated hashtags."
      },
      {
        title: "Select Relevant Hashtags",
        desc: "Choose from categorized Trending, Evergreen, Niche, and High-Volume hashtag groupings."
      },
      {
        title: "Copy Formatted Hashtags",
        desc: "Click Copy All to paste the formatted hashtags directly into your YouTube video title or description."
      }
    ],
    faq: [
      {
        question: "Where should I place hashtags on YouTube—in the title or the description?",
        answer: "You can place hashtags in either location. The first 3 hashtags in your description appear prominently above your title or in the description header on mobile and desktop."
      },
      {
        question: "How many hashtags should I include on a YouTube video?",
        answer: "Using 3 to 5 targeted hashtags is optimal. If you include more than 15 hashtags, YouTube ignores all hashtags on the video and may penalize your video's search visibility."
      },
      {
        question: "Are hashtags effective for YouTube Shorts?",
        answer: "Yes! Including targeted hashtags like #shorts along with 2–3 niche-specific tags in your Shorts title and description helps YouTube's recommendation engine categorize your video quickly."
      },
      {
        question: "What is the difference between tags and hashtags on YouTube?",
        answer: "Tags are hidden metadata in the YouTube Studio backend (up to 500 characters), while hashtags are visible, clickable links with a '#' symbol that lead to dedicated hashtag search pages."
      },
      {
        question: "Can I use custom branded hashtags for my channel?",
        answer: "Yes. Many creators include a unique channel hashtag (such as #YourChannelName) across all video descriptions to link their entire catalog together."
      }
    ]
  },

  'youtube-channel-name-generator': {
    howTo: [
      {
        title: "Enter Seed Keyword & Select Niche",
        desc: "Type a keyword representing your personal name, topic, or theme and choose your channel category."
      },
      {
        title: "Pick a Naming Formula Style",
        desc: "Filter results by Modern, Brandable, Catchy, Two-Word, or Minimalist naming styles."
      },
      {
        title: "Save Favorites & Check Handles",
        desc: "Click the star icon to save names to your shortlist and click Check Handle to verify availability on YouTube."
      }
    ],
    faq: [
      {
        question: "What makes a memorable YouTube channel name?",
        answer: "A great channel name is easy to spell, pronounceable, memorable, relevant to your content theme, and flexible enough to grow with your channel over time."
      },
      {
        question: "Can I change my YouTube channel name later without losing subscribers?",
        answer: "Yes. You can update your channel name and handle in YouTube Studio under Customization -> Basic Info without losing subscribers, videos, or watch hours."
      },
      {
        question: "What is the difference between a Channel Name and a YouTube Handle?",
        answer: "Your Channel Name is your public display title (e.g. 'Tech Studio'), while your Handle is your unique identifier starting with '@' (e.g. '@TechStudioOfficial') used for mentions and custom URLs."
      },
      {
        question: "Should my channel name include my personal name or a brand name?",
        answer: "If you plan to build a personal brand, personality-driven vlog, or coaching business, using your name works well. If you are creating topical tutorials, gaming, or company content, a descriptive brandable name is often easier for new audiences to remember."
      },
      {
        question: "Does this tool guarantee trademark or handle availability?",
        answer: "No. It provides creative name concepts and quick search links. You should always verify handle availability on YouTube and conduct trademark searches before commercializing a brand."
      }
    ]
  },

  'youtube-video-idea-generator': {
    howTo: [
      {
        title: "Select Channel Niche",
        desc: "Choose your content category from Tech, Gaming, Lifestyle, Education, Business, Fitness, and more."
      },
      {
        title: "Filter by Content Format",
        desc: "Narrow ideas by format type—such as Beginner Tutorials, Common Mistakes, Deep Dives, or Challenge concepts."
      },
      {
        title: "Save Favorites & Plan Production",
        desc: "Click the star icon to save your favorite concepts to your personal production shortlist or copy them to your notes."
      }
    ],
    faq: [
      {
        question: "How do I choose which video idea to produce first?",
        answer: "Look for ideas that combine high audience search interest with low competition, or concepts that address a specific painful problem your target viewers frequently encounter."
      },
      {
        question: "How can I adapt these ideas for YouTube Shorts vs Long-Form videos?",
        answer: "Shorts focus on a single quick tip, shocking stat, or 30-second demonstration, whereas long-form videos allow deep step-by-step explanations, stories, and multi-part breakdowns."
      },
      {
        question: "Why do 'Common Mistakes' video concepts perform so well?",
        answer: "Negative curiosity hooks (such as '5 Mistakes Beginners Make') trigger curiosity and loss aversion, often outperforming positive titles like '5 Tips for Beginners' in click-through rate."
      },
      {
        question: "Can I customize these ideas with my own personal twist?",
        answer: "Yes! Treat these concepts as structural frameworks. Infuse them with your unique personal experiences, case studies, and channel personality."
      },
      {
        question: "Does Zubware claim ownership of generated video ideas?",
        answer: "No. All generated ideas are free for creators to use, adapt, script, and monetize without attribution or restrictions."
      }
    ]
  },

  'youtube-playlist-name-generator': {
    howTo: [
      {
        title: "Enter Topic or Series Subject",
        desc: "Type the core topic of your video series or themed collection into the generator."
      },
      {
        title: "Select Playlist Architecture",
        desc: "Browse generated titles organized by Course Series, Bingeable Themes, Best-Of Compilations, and Challenge arcs."
      },
      {
        title: "Copy Selected Playlist Title",
        desc: "Click your preferred playlist name to copy it and paste it into YouTube Studio under Playlists."
      }
    ],
    faq: [
      {
        question: "How do YouTube playlists improve channel watch time and SEO?",
        answer: "Playlists automatically play consecutive videos, increasing average session duration—a critical metric YouTube's algorithm rewards with increased recommendations across your channel."
      },
      {
        question: "What should be included in an effective YouTube playlist title?",
        answer: "Include your primary search keyword along with clear series indicators such as 'Complete Guide', 'Full Course', or 'Step-by-Step Series' so viewers know it's a curated progression."
      },
      {
        question: "Can playlists rank in YouTube and Google search results independently?",
        answer: "Yes! Playlists rank separately in both YouTube and Google Search, giving your channel an additional opportunity to capture search traffic for broad queries."
      },
      {
        question: "Should I write a description for my YouTube playlists?",
        answer: "Yes. Adding a 2–3 sentence description to your playlist containing relevant keywords helps YouTube understand the collective topic of the videos and boosts indexing."
      },
      {
        question: "How many videos should a YouTube playlist contain?",
        answer: "Playlists with 4 to 12 videos are ideal for binge-watching without overwhelming viewers; for longer courses, consider breaking them into Part 1 and Part 2 series."
      }
    ]
  },

  'youtube-timestamp-generator': {
    howTo: [
      {
        title: "Add Video Chapters & Start Times",
        desc: "Enter the minutes and seconds along with a descriptive title for each video section."
      },
      {
        title: "Validate YouTube Chapter Rules",
        desc: "Ensure your first timestamp starts at 00:00, each chapter is at least 10 seconds long, and you have at least 3 chapters."
      },
      {
        title: "Copy Formatted Timestamps",
        desc: "Click Copy All to copy the timestamp block and paste it directly into your YouTube video description."
      }
    ],
    faq: [
      {
        question: "What are the official YouTube rules for clickable video chapters?",
        answer: "To activate video chapters: 1) Your first chapter must start at 00:00, 2) You must list at least 3 chapters in ascending order, and 3) Each chapter must be at least 10 seconds long."
      },
      {
        question: "How do chapters help viewers and YouTube SEO?",
        answer: "Chapters let viewers jump directly to the exact answer they need, and Google search displays chapters as interactive key moments in search results."
      },
      {
        question: "Can I use YouTube timestamps for single-song music tracks or podcasts?",
        answer: "Yes. Timestamps are commonly used for podcast topic breakdowns, interview question marks, and tracklists for DJ mixes and albums."
      },
      {
        question: "What is the standard timestamp format YouTube recognizes?",
        answer: "Use standard MM:SS format (e.g., 03:45) for videos under one hour, and HH:MM:SS (e.g., 01:15:30) for videos that exceed 60 minutes."
      },
      {
        question: "What happens if I forget to start at 00:00?",
        answer: "If the first timestamp does not begin at 00:00, YouTube's player will not parse the timestamps as interactive scrubber chapters on the video progress bar."
      }
    ]
  },

  'youtube-description-formatter': {
    howTo: [
      {
        title: "Paste Raw Text into Editor",
        desc: "Enter or paste your unformatted notes, links, or video summary into the input box."
      },
      {
        title: "Select Bullet Styles & Section Dividers",
        desc: "Choose your preferred bullet symbols (arrows, dashes, emojis) and decorative separator lines."
      },
      {
        title: "Format & Copy Polished Description",
        desc: "Click to clean and format the text, preview the organized layout, and copy it ready for YouTube Studio."
      }
    ],
    faq: [
      {
        question: "Why is a well-formatted YouTube description important?",
        answer: "Clear section dividers, bulleted lists, and structured headers make long descriptions easy to skim, increasing click-through rates on your links and affiliate recommendations."
      },
      {
        question: "How does the formatter handle website and social URLs?",
        answer: "It identifies URLs in your text and ensures they are placed on dedicated lines with proper spacing so YouTube renders them as clickable links."
      },
      {
        question: "Can I customize the style of bullet points and divider lines?",
        answer: "Yes. You can toggle between modern arrows, traditional bullet dots, clean dashes, or emojis, and choose subtle or bold horizontal section dividers."
      },
      {
        question: "Does formatting affect search engine optimization (SEO)?",
        answer: "Clean descriptions with well-spaced keyword sections and readable text help YouTube's natural language processing algorithms accurately categorize your content."
      },
      {
        question: "Is any of my copied text or links stored on Zubware servers?",
        answer: "No. All text parsing, regex replacement, and formatting run entirely in your local browser memory."
      }
    ]
  },

  'islamic-shorts-maker': {
    howTo: [
      {
        title: "Select Template or Content Preset",
        desc: "Choose a curated Quran verse, authentic Hadith, or Dua preset, or type custom text in Arabic, Urdu, Hindi, or English."
      },
      {
        title: "Customize Islamic Borders, Fonts & Media",
        desc: "Pick elegant gold borders, Islamic geometric backgrounds, typography styles, and optional voiceover audio."
      },
      {
        title: "Animate & Export Video or PNG",
        desc: "Preview the 9:16 vertical canvas with subtle zoom/pan animations, and export directly as an MP4/WebM video or high-res PNG."
      }
    ],
    faq: [
      {
        question: "Can I create both animated videos and static image slides with this tool?",
        answer: "Yes. You can export animated 9:16 vertical videos (WebM/MP4) with motion presets and background audio, or download high-resolution PNG images for community posts and Stories."
      },
      {
        question: "Are the Quranic verses and Hadith texts customizable?",
        answer: "Yes. You can choose from our curated library of verses and Hadiths or write your own custom text in Arabic, English, Urdu, Hindi, or other languages."
      },
      {
        question: "What aspect ratio is used for Islamic Shorts?",
        answer: "The canvas is locked to standard 9:16 vertical resolution (1080x1920 pixels), designed specifically for YouTube Shorts, Instagram Reels, and TikTok."
      },
      {
        question: "Can I add custom nasheed or recitation audio to the video?",
        answer: "Yes. You can upload an MP3 or WAV audio track to synchronize with the animated text and visual background."
      },
      {
        question: "Are my designs, audio, or texts uploaded to any server?",
        answer: "No. The Islamic Shorts Maker operates 100% locally in your web browser. Your text, audio, and visual exports remain completely private on your device."
      }
    ]
  }
};

export function updateBatch4InToolsData() {
  const filePath = path.resolve(__dirname, '../src/data/toolsData.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  let updatedCount = 0;

  for (const [toolId, update] of Object.entries(BATCH_4_TOOLS)) {
    // Locate the tool definition in RAW_TOOLS_DATA
    // Tool starts with: id: 'toolId', or id: "toolId",
    const idRegex = new RegExp(`(\\n\\s*id:\\s*['"]${toolId}['"],)`);
    const match = content.match(idRegex);
    if (!match || match.index === undefined) {
      console.error(`Tool ID not found: ${toolId}`);
      continue;
    }

    const startIndex = match.index;
    // Find the end of this tool object. In RAW_TOOLS_DATA, each tool is separated by \n  }, or \n  }
    // We look for the closing \n  }, or \n  }\n];
    const afterId = content.slice(startIndex);
    const endMatch = afterId.match(/\n  \}(,?)/);
    if (!endMatch || endMatch.index === undefined) {
      console.error(`Could not find end of tool object: ${toolId}`);
      continue;
    }

    const toolBlockLength = endMatch.index + endMatch[0].length;
    let toolChunk = afterId.slice(0, toolBlockLength);

    // Format howTo string
    const howToIndent = '    ';
    const howToFormatted = `${howToIndent}howTo: [\n` +
      update.howTo.map(step => 
        `${howToIndent}  { title: ${JSON.stringify(step.title)}, desc: ${JSON.stringify(step.desc)} }`
      ).join(',\n') +
      `\n${howToIndent}]`;

    // Format faq string
    const faqFormatted = `${howToIndent}faq: [\n` +
      update.faq.map(item =>
        `${howToIndent}  { question: ${JSON.stringify(item.question)}, answer: ${JSON.stringify(item.answer)} }`
      ).join(',\n') +
      `\n${howToIndent}]`;

    // If toolChunk already has howTo, replace it
    if (toolChunk.includes('howTo:')) {
      toolChunk = toolChunk.replace(/\n\s*howTo:\s*\[[\s\S]*?\n\s*\]/, `\n${howToFormatted}`);
    } else {
      // Insert howTo right before features: or right after features:
      if (toolChunk.includes('features:')) {
        // match features: [...],\n
        const featMatch = toolChunk.match(/\n\s*features:\s*\[[\s\S]*?\],?/);
        if (featMatch && featMatch.index !== undefined) {
          const insertPos = featMatch.index + featMatch[0].length;
          // ensure trailing comma on features if not present
          let before = toolChunk.slice(0, insertPos);
          if (!before.endsWith(',')) before += ',';
          toolChunk = before + `\n${howToFormatted},` + toolChunk.slice(insertPos);
        } else {
          toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${howToFormatted}\n  }$1`);
        }
      } else {
        toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${howToFormatted}\n  }$1`);
      }
    }

    // If toolChunk already has faq, replace it
    if (toolChunk.includes('faq:')) {
      toolChunk = toolChunk.replace(/\n\s*faq:\s*\[[\s\S]*?\n\s*\]/, `\n${faqFormatted}`);
    } else {
      // Insert faq right after howTo: [...]
      const howToMatch = toolChunk.match(/\n\s*howTo:\s*\[[\s\S]*?\],?/);
      if (howToMatch && howToMatch.index !== undefined) {
        const insertPos = howToMatch.index + howToMatch[0].length;
        let before = toolChunk.slice(0, insertPos);
        if (!before.endsWith(',')) before += ',';
        toolChunk = before + `\n${faqFormatted},` + toolChunk.slice(insertPos);
      } else {
        toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${faqFormatted}\n  }$1`);
      }
    }

    // Clean up any double commas or trailing commas before closing brace
    toolChunk = toolChunk.replace(/,(\s*\n\s*\},?)$/, '$1');
    toolChunk = toolChunk.replace(/,\s*,/g, ',');

    // Replace the tool chunk in the overall content
    content = content.slice(0, startIndex) + toolChunk + content.slice(startIndex + toolBlockLength);
    updatedCount++;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${updatedCount} Batch 4 tools in toolsData.ts.`);
}

if (process.argv[1] && process.argv[1].endsWith('updateBatch4Tools.ts')) {
  updateBatch4InToolsData();
}
