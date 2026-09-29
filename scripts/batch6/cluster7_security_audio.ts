import { ToolUpdate } from './types';

export const CLUSTER_7_SECURITY_AUDIO_TOOLS: Record<string, ToolUpdate> = {
  'lofi-song-maker': {
    howTo: [
      {
        title: "Select Mood, Key & Chord Progression",
        desc: "Choose from chillhop, rainy day, or midnight study moods, and pick musical keys and chord progressions."
      },
      {
        title: "Layer Ambient Sounds & Vinyl FX",
        desc: "Blend customizable ambient layers including vinyl crackle, gentle rain, cafe chatter, and tape flutter."
      },
      {
        title: "Generate & Export Lofi Audio Track",
        desc: "Play real-time synthesized beats using the Web Audio engine and export as a high-quality WAV audio file."
      }
    ],
    faq: [
      {
        question: "How does the Lofi Song Maker generate music without samples?",
        answer: "It uses the browser's native Web Audio API (AudioContext) to synthesize musical chords, Rhodes piano tones, analog basslines, and drum patterns algorithmically in real time."
      },
      {
        question: "Can I adjust individual volume levels for ambient background layers?",
        answer: "Yes. Independent audio mixer faders let you balance rain, vinyl static, tape hiss, and cafe ambience against the musical melody."
      },
      {
        question: "Are the generated lofi tracks royalty-free for YouTube and streaming?",
        answer: "Yes. Music synthesized by this tool is dynamically generated royalty-free audio that you can use in study streams, videos, and podcasts without copyright strikes."
      },
      {
        question: "What audio export format is generated?",
        answer: "You can download uncompressed 44.1kHz stereo WAV audio files directly to your device."
      },
      {
        question: "Does the audio generator require an internet connection?",
        answer: "No. The algorithmic audio synthesis and DSP effects operate completely offline in your web browser."
      }
    ]
  },

  'lofi-maker': {
    howTo: [
      {
        title: "Upload Any Audio Track",
        desc: "Select an MP3, WAV, or OGG audio file from your device to transform into a lofi version."
      },
      {
        title: "Apply Lofi DSP Effects & Filters",
        desc: "Adjust vintage tape pitch wobble, low-pass telephone EQ filter, slow down tempo, and mix vinyl crackle."
      },
      {
        title: "Render & Download Lofi Audio",
        desc: "Preview your customized sound in real time and export the processed audio file directly to your device."
      }
    ],
    faq: [
      {
        question: "How does the tool transform standard music into vintage lofi audio?",
        answer: "It applies digital signal processing (DSP) filters: a Biquad low-pass filter cutting harsh highs, an LFO modulating subtle pitch vibrato (tape flutter), and mixed vinyl surface noise."
      },
      {
        question: "Can I slow down the playback speed and pitch?",
        answer: "Yes. The tempo and pitch slider lets you slow down playback by 5% to 25% for a signature relaxed chillhop feel."
      },
      {
        question: "Is there a file size limit for uploaded audio?",
        answer: "The tool processes audio files up to 50MB smoothly using Web Audio API buffer decoding directly in browser memory."
      },
      {
        question: "Can I toggle individual effects on and off?",
        answer: "Yes. You can independently enable or disable vinyl crackle, cassette tape noise, room reverb, and EQ filtering."
      },
      {
        question: "Is my uploaded song uploaded to any server?",
        answer: "No. All audio decoding, effects processing, and WAV rendering occur client-side on your computer."
      }
    ]
  },

  'slowed-and-reverb': {
    howTo: [
      {
        title: "Upload Your Song File",
        desc: "Drag and drop or select an MP3, WAV, or AAC audio track to process."
      },
      {
        title: "Configure Slowdown Speed & Reverb Space",
        desc: "Adjust the playback speed slider (0.75x to 0.95x) and select reverb space: Bedroom, Church, Cathedral, or Cosmic Echo."
      },
      {
        title: "Process & Export Slowed Audio",
        desc: "Listen to the live processed audio preview and click Export to download your slowed-and-reverb audio file."
      }
    ],
    faq: [
      {
        question: "What is the 'Slowed and Reverb' aesthetic?",
        answer: "Popularized on TikTok and YouTube, slowed and reverb (also known as chopped and screwed derivative) lowers the tempo and pitch of a song while routing it through lush atmospheric reverberation."
      },
      {
        question: "Which reverb algorithm is used by this tool?",
        answer: "The tool utilizes a Web Audio ConvolverNode with synthetic impulse response convolution, simulating realistic spatial acoustic reflections without robotic metallic artifacts."
      },
      {
        question: "Does slowing down the audio lower its musical pitch?",
        answer: "Yes. By default, slowing playback resamples the waveform, dropping the pitch proportionately to create a deeper, dreamy vocal timbre."
      },
      {
        question: "What audio output format is generated?",
        answer: "The processed audio renders into a clean 16-bit 44.1kHz stereo WAV audio file ready for video editing."
      },
      {
        question: "Are my audio files uploaded to a remote cloud server?",
        answer: "No. File processing is performed entirely within your browser using Web Audio API buffers; your files never leave your computer."
      }
    ]
  },

  'qr-generator': {
    howTo: [
      {
        title: "Select Content Type & Enter Data",
        desc: "Choose URL, Plain Text, WiFi Network, Email, Phone, or vCard, and input your data."
      },
      {
        title: "Customize QR Design & Colors",
        desc: "Set foreground/background colors, choose corner square shapes (rounded or sharp), and set error correction level (L, M, Q, H)."
      },
      {
        title: "Download Print-Ready QR Code",
        desc: "Inspect the instant live preview and download as high-resolution PNG or scalable SVG vector."
      }
    ],
    faq: [
      {
        question: "What QR error correction levels are supported and why do they matter?",
        answer: "The generator supports levels L (7%), M (15%), Q (25%), and H (30%). Higher error correction (Q or H) allows the QR code to remain scannable even if damaged, smudged, or partially covered by a logo."
      },
      {
        question: "How does the WiFi QR code connection work?",
        answer: "Selecting WiFi generates a standardized WIFI: protocol string (SSID, encryption type, password) that smartphones scan to connect to your wireless network automatically without typing passwords."
      },
      {
        question: "Do QR codes generated here ever expire?",
        answer: "No. These are static direct QR codes where the data is embedded directly into the matrix. They have no expiration date, no scan limits, and no redirect intermediaries."
      },
      {
        question: "Can I download vector SVG files for billboard and packaging printing?",
        answer: "Yes. SVG vector download guarantees razor-sharp edges at any physical print size from business cards to giant banners."
      },
      {
        question: "Is any tracking data recorded when users scan my QR code?",
        answer: "No. Because these are direct static QR codes without intermediary redirect servers, scans are completely private and untracked."
      }
    ]
  },

  'qr-code-safety-checker': {
    howTo: [
      {
        title: "Upload QR Image or Scan via Camera",
        desc: "Upload a photo/screenshot of a QR code or scan it live using your device's webcam."
      },
      {
        title: "Inspect Decoded URL & Security Audit",
        desc: "Review the full decoded destination URL, domain reputation, protocol safety (HTTPS), and URL redirect hops."
      },
      {
        title: "Verify Safety Before Visiting",
        desc: "Check security indicators for deceptive homograph domains, executable downloads, and known phishing patterns."
      }
    ],
    faq: [
      {
        question: "Why should I inspect a QR code with a safety checker before opening it on my phone?",
        answer: "Malicious QR codes (quishing) can disguise harmful phishing websites, malicious app installation links, or payment redirect traps behind innocent-looking physical stickers."
      },
      {
        question: "Can the checker detect deceptive lookalike (homograph) domain attacks?",
        answer: "Yes. It inspects internationalized domain names (IDN) and Punycode representations to detect deceptive lookalike characters used to impersonate legitimate brands."
      },
      {
        question: "Does the tool automatically expand shortened redirect links?",
        answer: "The audit analyzes known short-link services and displays destination parameters to alert you to multi-hop redirects."
      },
      {
        question: "Can I scan QR codes using my laptop or phone camera?",
        answer: "Yes. You can use your device's camera stream with client-side barcode scanning, or simply drop a screenshot into the tool."
      },
      {
        question: "Is the scanned QR image uploaded to a server?",
        answer: "No. Image decoding runs locally in your browser using JavaScript QR matrix parsers."
      }
    ]
  },

  'typing-speed-test': {
    howTo: [
      {
        title: "Select Test Duration & Difficulty",
        desc: "Choose 1-minute, 2-minute, or 3-minute timed tests with common words, quotes, or coding syntax."
      },
      {
        title: "Type the Displayed Text",
        desc: "Type words as they highlight in real time, with immediate color feedback for correct (green) and incorrect (red) keystrokes."
      },
      {
        title: "Review WPM & Accuracy Metrics",
        desc: "Inspect your net Words Per Minute (WPM), Gross WPM, raw keystroke accuracy percentage, and error breakdown."
      }
    ],
    faq: [
      {
        question: "How is net Words Per Minute (WPM) calculated?",
        answer: "Standard typing speed calculates 1 word as 5 keystrokes: Net WPM = (Total Keystrokes / 5 - Uncorrected Errors) / Time in Minutes."
      },
      {
        question: "What is the difference between Gross WPM and Net WPM?",
        answer: "Gross WPM measures raw typing speed regardless of mistakes. Net WPM penalizes typographical errors, providing a realistic measure of productive typing throughput."
      },
      {
        question: "Can I practice typing programming code snippets?",
        answer: "Yes. Switch to 'Coding Mode' to practice typing JavaScript, Python, HTML, and syntax symbols like brackets, braces, and semicolons."
      },
      {
        question: "Can I view my typing history and improvement streaks?",
        answer: "Yes. Your recent test scores and accuracy metrics are saved in local browser storage to track your typing improvement over time."
      },
      {
        question: "Does the test require any software installation?",
        answer: "No. The typing engine runs 100% in your web browser with millisecond keystroke latency tracking."
      }
    ]
  },

  'barcode-scanner': {
    howTo: [
      {
        title: "Allow Camera Access or Upload Image",
        desc: "Point your smartphone or webcam at any barcode, or upload a photo containing a barcode."
      },
      {
        title: "Align Barcode in Scanner Viewfinder",
        desc: "Position the 1D barcode or 2D QR code within the visual bounding box for instant recognition."
      },
      {
        title: "Copy Decoded Data or Open Link",
        desc: "Review the decoded alphanumeric payload, detect barcode symbology type, and copy or search the code."
      }
    ],
    faq: [
      {
        question: "Which barcode formats can this scanner decode?",
        answer: "It scans 1D formats including EAN-13, UPC-A, Code 128, Code 39, and ITF, as well as 2D formats including QR Code, Data Matrix, and PDF417."
      },
      {
        question: "Can I scan barcodes from saved image files and photos?",
        answer: "Yes. You can upload or paste image files (JPG, PNG, WebP) directly without using a live camera."
      },
      {
        question: "How does the scanner achieve instant detection?",
        answer: "It uses modern WebAssembly-accelerated barcode decoding libraries and the browser's native BarcodeDetector API when available."
      },
      {
        question: "Is camera video recorded or sent to a server?",
        answer: "No. Video frames are processed in volatile memory on your device; no video streams or captured photos are transmitted over the internet."
      },
      {
        question: "Does the tool support continuous scanning for inventory counts?",
        answer: "Yes. Toggle 'Continuous Scan' to rapidly beep and log sequential product barcodes into an exportable list."
      }
    ]
  },

  'calendar-notes': {
    howTo: [
      {
        title: "Select Calendar Date",
        desc: "Navigate through months and click any day on the interactive monthly calendar grid."
      },
      {
        title: "Write Date-Specific Notes & Reminders",
        desc: "Add rich text notes, checklists, meeting notes, and tag items with color-coded categories."
      },
      {
        title: "Review Monthly Schedule & Export",
        desc: "Inspect calendar badges showing days with active notes and export your notes as a backup file."
      }
    ],
    faq: [
      {
        question: "Are my calendar notes stored privately on my device?",
        answer: "Yes. All notes, dates, and event tags are stored exclusively in your browser's local storage (localStorage) with zero server synchronization."
      },
      {
        question: "Can I color-code notes by category (e.g. Work, Personal, Health)?",
        answer: "Yes. You can assign custom color badges to organize different categories across the calendar grid."
      },
      {
        question: "Can I export all my calendar notes to a backup file?",
        answer: "Yes. The 'Export Backup' button lets you save a clean JSON file of all your notes, which you can restore anytime."
      },
      {
        question: "Does the calendar highlight today's date automatically?",
        answer: "Yes. Today's date is dynamically highlighted, and days with recorded notes display visual indicator dots."
      },
      {
        question: "Does this calendar tool require an account or login?",
        answer: "No. It is a completely private, offline-capable calendar tool requiring no email, account, or cloud subscription."
      }
    ]
  },

  'clipboard-history': {
    howTo: [
      {
        title: "Save Copied Text Snippets",
        desc: "Paste or capture text snippets, code blocks, URLs, and templates into the clipboard manager."
      },
      {
        title: "Organize, Pin & Search Snippets",
        desc: "Pin frequently used items to the top, tag snippets by category, and search your clipboard archive."
      },
      {
        title: "One-Click Copy Back to Clipboard",
        desc: "Click any snippet card to copy it back to your active system clipboard instantly."
      }
    ],
    faq: [
      {
        question: "Where is my clipboard history stored?",
        answer: "All snippets are stored locally in your browser's local storage; no text is ever uploaded to Zubware servers."
      },
      {
        question: "Can I pin frequently used boilerplate text to the top?",
        answer: "Yes. Click the Pin icon on any snippet to keep key email templates, addresses, or code snippets permanently at the top of your list."
      },
      {
        question: "Is there a limit on how many items I can save?",
        answer: "The manager stores up to 200 recent snippets smoothly with instant instant-search filtering."
      },
      {
        question: "Can I clear my entire clipboard history with one click?",
        answer: "Yes. Click 'Clear History' to wipe all unpinned snippets from your local browser storage immediately."
      },
      {
        question: "Can I export my saved snippets to a text or JSON file?",
        answer: "Yes. You can export your curated clipboard collection as a backup file to transfer between devices."
      }
    ]
  },

  'daily-planner': {
    howTo: [
      {
        title: "Set Daily Top 3 Priority Goals",
        desc: "Define your primary focus tasks for the day to anchor your productivity."
      },
      {
        title: "Schedule Hourly Time Blocks",
        desc: "Assign tasks across Morning, Afternoon, and Evening time slots from 6:00 AM to 10:00 PM."
      },
      {
        title: "Track Water, Habits & Daily Notes",
        desc: "Check off hydration glasses, daily habit streaks, and jot evening reflections."
      }
    ],
    faq: [
      {
        question: "Why does the planner emphasize the 'Rule of 3' daily priorities?",
        answer: "Focusing on 3 high-impact outcomes prevents task overwhelm and ensures key objectives get accomplished before secondary busywork."
      },
      {
        question: "Is my daily schedule stored locally and privately?",
        answer: "Yes. All schedule items, checkboxes, and reflection notes persist securely in your browser's local storage."
      },
      {
        question: "Can I print my daily plan onto paper?",
        answer: "Yes. The print-optimized layout formats your daily agenda cleanly onto standard A4 or Letter paper for physical desk planning."
      },
      {
        question: "Can I clear completed items for tomorrow with one click?",
        answer: "Yes. Click 'Reset Day' to clear completed checkboxes and start a fresh daily schedule while keeping recurring habits."
      },
      {
        question: "Does the planner work offline without an internet connection?",
        answer: "Yes. The daily planner functions completely offline as a standalone browser productivity workspace."
      }
    ]
  },

  'file-checksum-verifier': {
    howTo: [
      {
        title: "Select File to Verify",
        desc: "Drag and drop any installer, ISO image, document, or archive into the verifier."
      },
      {
        title: "Select Hash Algorithm & Compute Checksum",
        desc: "Calculate cryptographic hashes using SHA-256, SHA-1, SHA-512, or MD5 via the Web Crypto API."
      },
      {
        title: "Paste Expected Hash to Compare",
        desc: "Input the developer's published checksum to see an instant match (green checkmark) or mismatch warning."
      }
    ],
    faq: [
      {
        question: "What is a cryptographic file checksum?",
        answer: "A checksum is a unique mathematical fingerprint calculated from a file's binary contents. Even a single changed bit in the file produces a completely different hash value."
      },
      {
        question: "How does this tool calculate checksums for large files without crashing?",
        answer: "It reads files in streaming chunks using the browser's native FileReader and Web Crypto APIs (SubtleCrypto), verifying multi-gigabyte files efficiently without uploading them."
      },
      {
        question: "Is my file uploaded to a server to calculate the hash?",
        answer: "No. Your file never leaves your computer; all hash calculations execute 100% locally in your browser."
      },
      {
        question: "Why is verifying checksums essential for downloaded software?",
        answer: "Matching the publisher's published SHA-256 hash confirms the file was downloaded completely without corruption and has not been tampered with by malicious actors."
      },
      {
        question: "Does the tool ignore uppercase and lowercase differences when comparing?",
        answer: "Yes. Hash comparison is case-insensitive, ensuring accurate matches regardless of whether the developer published lowercase or uppercase hex strings."
      }
    ]
  },

  'habit-tracker': {
    howTo: [
      {
        title: "Create Daily Habits & Goals",
        desc: "Add habits you want to build (e.g. Exercise, Read 20 Mins, Drink 2L Water, Meditate) and assign color tags."
      },
      {
        title: "Check Off Daily Completions",
        desc: "Click the completion circles for each day of the week to record your consistency."
      },
      {
        title: "Track Consecutive Streaks & Trends",
        desc: "Monitor your current active streak, best streak, and monthly completion rate percentages."
      }
    ],
    faq: [
      {
        question: "How does the habit streak calculation work?",
        answer: "The streak counter tallies consecutive daily completions; missing a scheduled day resets the active streak counter while preserving your all-time best record."
      },
      {
        question: "Are my personal habits and routines private?",
        answer: "Yes. All habit names, completion checkboxes, and streak analytics are stored strictly in your browser's local storage."
      },
      {
        question: "Can I set habits for specific days of the week (e.g. weekdays only)?",
        answer: "Yes. You can configure habit frequency to daily, weekdays only, or custom weekly target counts."
      },
      {
        question: "Can I export my habit tracking data as a backup?",
        answer: "Yes. Export your habit log as a JSON file to prevent accidental data loss if you clear browser cache."
      },
      {
        question: "Is there any limit to the number of habits I can track?",
        answer: "No. You can track unlimited daily routines simultaneously with zero performance degradation."
      }
    ]
  },

  'passphrase-generator': {
    howTo: [
      {
        title: "Set Word Count & Separator",
        desc: "Choose number of words (4 to 8 words) and select delimiter: Hyphen (-), Space, Period (.), or Underscore (_)."
      },
      {
        title: "Configure Capitalization & Numbers",
        desc: "Toggle Title Case capitalization and append random numbers or symbols for enhanced credential complexity."
      },
      {
        title: "Generate & Copy Memorable Passphrase",
        desc: "Inspect the calculated bit-entropy security rating and copy your secure, easy-to-remember passphrase."
      }
    ],
    faq: [
      {
        question: "What is a Diceware-style passphrase and why is it superior?",
        answer: "Diceware passphrases combine several random dictionary words (e.g. 'correct-horse-battery-staple'). They provide high mathematical entropy against automated cracking while being easy for humans to remember and type."
      },
      {
        question: "How much entropy does a 5-word passphrase provide?",
        answer: "A 5-word passphrase drawn from a curated dictionary of 7,776 words provides approximately 65 bits of entropy, which would take modern supercomputers billions of years to brute-force."
      },
      {
        question: "How are the random words chosen?",
        answer: "Words are selected using the cryptographically secure pseudo-random number generator (crypto.getRandomValues), ensuring non-predictable outcomes."
      },
      {
        question: "Does the wordlist exclude offensive or confusing words?",
        answer: "Yes. The dictionary is curated to remove profanity, ambiguous spellings, and homophones for clean professional memorability."
      },
      {
        question: "Is my generated passphrase transmitted to Zubware?",
        answer: "No. All passphrase assembly occurs entirely in volatile client-side browser memory with zero network logging."
      }
    ]
  },

  'password-strength-checker': {
    howTo: [
      {
        title: "Enter Password to Audit",
        desc: "Type or paste your password into the secure evaluation input box."
      },
      {
        title: "Inspect Entropy & Crack-Time Estimate",
        desc: "Review the calculated bits of entropy, estimated brute-force crack time, and visual strength meter."
      },
      {
        title: "Review Security Checklist & Vulnerabilities",
        desc: "Check for common vulnerabilities: length deficiencies, dictionary words, sequential numbers, and repeated patterns."
      }
    ],
    faq: [
      {
        question: "Is it safe to test sensitive passwords on this web page?",
        answer: "Yes. The strength algorithm runs 100% locally in your browser using client-side JavaScript. Your password is never sent across the internet, logged, or transmitted anywhere."
      },
      {
        question: "How is the estimated brute-force crack time calculated?",
        answer: "The tool estimates total search space entropy (based on character pool variety and length) and calculates time to crack assuming an offline cluster attempting 100 billion guesses per second."
      },
      {
        question: "Does the tool check against common leaked password lists?",
        answer: "Yes. It checks against a local dictionary of the most common breached passwords and keyboard walk patterns (e.g. 'qwerty', '123456', 'password')."
      },
      {
        question: "What makes a password rated 'Very Strong'?",
        answer: "A score of 'Very Strong' requires at least 80+ bits of entropy, typically achieved by 16+ characters with a mixture of uppercase, lowercase, numbers, and symbols, or a 5-word random passphrase."
      },
      {
        question: "Can I toggle password visibility while typing?",
        answer: "Yes. Click the eye icon to toggle between masked bullet points and visible plain text."
      }
    ]
  },

  'pomodoro-timer': {
    howTo: [
      {
        title: "Select Session Mode",
        desc: "Choose Focus (25 mins), Short Break (5 mins), or Long Break (15 mins), or configure custom session durations."
      },
      {
        title: "Start Timer & Work on Single Task",
        desc: "Click Start or press Spacebar to begin countdown with visual progress ring and audio chime alerts."
      },
      {
        title: "Complete Pomodoro Rounds & Take Breaks",
        desc: "Track completed focus sessions, take prescribed rest intervals, and maintain productivity momentum."
      }
    ],
    faq: [
      {
        question: "What is the Pomodoro Technique?",
        answer: "Developed by Francesco Cirillo, the Pomodoro Technique structures work into 25-minute uninterrupted focus intervals followed by 5-minute restorative breaks to sustain mental stamina."
      },
      {
        question: "Does the timer play an audible completion alert?",
        answer: "Yes. The timer uses the Web Audio API to play gentle, pleasant synthesized chime notifications when focus and break intervals conclude."
      },
      {
        question: "Can I customize the focus and break lengths?",
        answer: "Yes. You can adjust focus sessions (e.g. 50 minutes for deep work) and break times (e.g. 10 minutes) to fit your personal workflow."
      },
      {
        question: "Does the timer continue running if I switch browser tabs?",
        answer: "Yes. The timer calculates elapsed time against system clock timestamps, keeping time completely accurate even when the tab is running in the background."
      },
      {
        question: "Does the page title show the remaining countdown time?",
        answer: "Yes. The browser tab title updates continuously (e.g. '24:59 - Focus') so you can monitor progress while working in other windows."
      }
    ]
  },

  'secure-notes': {
    howTo: [
      {
        title: "Set Master Encryption Password",
        desc: "Create a strong personal passphrase used to derive cryptographic AES-256 encryption keys."
      },
      {
        title: "Write Private Notes & Credentials",
        desc: "Compose sensitive notes, code snippets, recovery keys, and confidential checklists in the private editor."
      },
      {
        title: "Lock Notes with AES-256 Encryption",
        desc: "Click Lock to encrypt all note data in browser storage; notes cannot be decrypted without your master password."
      }
    ],
    faq: [
      {
        question: "What encryption standard is used to protect secure notes?",
        answer: "Notes are encrypted with AES-256-GCM using keys derived from your master password via PBKDF2 with 100,000 hashing iterations using the browser's native Web Crypto API."
      },
      {
        question: "Can Zubware or server administrators recover my forgotten master password?",
        answer: "No. This is a zero-knowledge local architecture. Your password is never stored or transmitted; if you lose your master password, encrypted notes cannot be decrypted by anyone."
      },
      {
        question: "Where are the encrypted notes saved?",
        answer: "Encrypted ciphertext blobs are saved exclusively in your browser's local storage (localStorage)."
      },
      {
        question: "Can I export an encrypted backup file to my computer?",
        answer: "Yes. You can export an encrypted JSON backup file that can be restored on another device using your master password."
      },
      {
        question: "Does the tool auto-lock after a period of inactivity?",
        answer: "Yes. You can configure an inactivity auto-lock timer to lock your notes automatically if you step away from your computer."
      }
    ]
  },

  'text-encrypt-decrypt': {
    howTo: [
      {
        title: "Paste Text & Enter Secret Key",
        desc: "Input your plain message to encrypt (or cipher text to decrypt) and enter your private secret key passphrase."
      },
      {
        title: "Choose Encryption Algorithm",
        desc: "Select military-grade AES-256-GCM, AES-CBC, or Base64 / ROT13 encoding."
      },
      {
        title: "Execute & Copy Secure Ciphertext",
        desc: "Click Encrypt or Decrypt and copy the Base64-encoded encrypted ciphertext to your clipboard."
      }
    ],
    faq: [
      {
        question: "How does AES-256-GCM encryption ensure confidentiality and integrity?",
        answer: "AES-GCM (Galois/Counter Mode) provides both authenticated encryption and data integrity verification, ensuring encrypted text cannot be read or secretly modified without the secret key."
      },
      {
        question: "Is an initialization vector (IV) generated for each encryption?",
        answer: "Yes. A fresh, cryptographically random 12-byte initialization vector (IV) is generated via window.crypto.getRandomValues for every encryption operation."
      },
      {
        question: "Can I decrypt text encrypted by this tool on other standard cryptographic platforms?",
        answer: "Yes. Because it uses standard AES-GCM and PBKDF2 key derivation, ciphertexts can be decrypted using standard OpenSSL, Python cryptography libraries, or Web Crypto."
      },
      {
        question: "Does Zubware have access to my secret key or decrypted messages?",
        answer: "No. The entire cryptographic lifecycle is handled strictly within your local browser's Web Crypto API subsystem."
      },
      {
        question: "What happens if someone enters the wrong secret key during decryption?",
        answer: "The decryption algorithm detects the authentication tag mismatch and immediately halts with a clean error, preventing corrupted data output."
      }
    ]
  },

  'todo-list': {
    howTo: [
      {
        title: "Add Tasks with Priority & Due Dates",
        desc: "Type task names, select priority (High, Medium, Low), and assign optional due dates and project tags."
      },
      {
        title: "Organize, Filter & Reorder Checklist",
        desc: "Filter tasks by status (All, Active, Completed), drag to prioritize, and search across your task list."
      },
      {
        title: "Check Off Completed Tasks",
        desc: "Click task checkboxes to mark items done and review completion metrics and progress bars."
      }
    ],
    faq: [
      {
        question: "Are my tasks and to-do lists stored privately?",
        answer: "Yes. All task data, priorities, and completion timestamps are stored exclusively in your browser's local storage (localStorage) with zero external tracking."
      },
      {
        question: "Can I categorize tasks by project or category tags?",
        answer: "Yes. You can assign custom category tags (e.g. Work, Personal, Errands) and filter your task view by tag."
      },
      {
        question: "Does the to-do list support drag-and-drop reordering?",
        answer: "Yes. You can drag and drop tasks vertically to organize your immediate daily execution order."
      },
      {
        question: "Can I export my task list as a backup or to-do file?",
        answer: "Yes. You can export your tasks as a JSON backup or clean text checklist."
      },
      {
        question: "Does this to-do app require creating an account?",
        answer: "No. It is completely free, privacy-first, and requires no account, email, or login."
      }
    ]
  },

  'weekly-planner': {
    howTo: [
      {
        title: "View 7-Day Weekly Grid",
        desc: "Inspect the organized Monday-to-Sunday weekly view with daily schedule columns."
      },
      {
        title: "Schedule Tasks, Meetings & Objectives",
        desc: "Add specific appointments, deadlines, and workout plans under each day of the week."
      },
      {
        title: "Check Off Items & Roll Over Pending Tasks",
        desc: "Mark completed items and roll unfinished tasks forward to upcoming days to maintain momentum."
      }
    ],
    faq: [
      {
        question: "How does the weekly planner help manage workload balance?",
        answer: "Seeing all 7 days side-by-side allows you to distribute deadlines evenly, prevent meeting congestion on single days, and reserve designated focus blocks."
      },
      {
        question: "Are weekly planner entries stored locally on my device?",
        answer: "Yes. All entries, schedules, and checklists persist safely in browser local storage without server synchronization."
      },
      {
        question: "Can I print a physical weekly agenda sheet?",
        answer: "Yes. The print stylesheet formats the full 7-day grid onto a clean landscape A4/Letter page for physical desk use."
      },
      {
        question: "Can I set recurring weekly routines?",
        answer: "Yes. You can designate recurring weekly items (e.g. Team Standup on Monday, Gym on Wednesday) that populate each week automatically."
      },
      {
        question: "Can I export a backup of my weekly plan?",
        answer: "Yes. You can download a JSON backup file to archive previous weeks or restore across devices."
      }
    ]
  }
};
