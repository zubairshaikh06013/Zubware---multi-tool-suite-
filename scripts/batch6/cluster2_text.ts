import { ToolUpdate } from './types';

export const CLUSTER_2_TEXT_TOOLS: Record<string, ToolUpdate> = {
  'case-converter': {
    howTo: [
      {
        title: "Paste or Type Text",
        desc: "Enter your raw text into the input editor or paste paragraphs directly from your clipboard."
      },
      {
        title: "Select Desired Case Transformation",
        desc: "Click UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, or aLtErNaTiNg cAsE."
      },
      {
        title: "Copy or Download Transformed Text",
        desc: "Review the instant conversion in the output pane and click Copy to clipboard or download as a .txt file."
      }
    ],
    faq: [
      {
        question: "How does the Title Case transformation handle minor words and prepositions?",
        answer: "The title-casing algorithm capitalizes major words while respecting standard stylistic conventions for short conjunctions and prepositions unless they appear at the start of a sentence."
      },
      {
        question: "What is the difference between camelCase, PascalCase, and kebab-case?",
        answer: "camelCase starts with a lowercase letter and capitalizes subsequent word initials without delimiters. PascalCase capitalizes all word initials including the first. kebab-case joins all lowercase tokens with hyphens, ideal for URLs and CSS classes."
      },
      {
        question: "Does Case Converter support accented and Unicode characters?",
        answer: "Yes. Transformation methods use standard Unicode-aware JavaScript string manipulation functions, correctly casing characters like é, ñ, and ü."
      },
      {
        question: "Is there a character limit when converting text cases?",
        answer: "No practical limit exists. Processing takes place locally in browser memory, easily converting large documents containing tens of thousands of words in milliseconds."
      },
      {
        question: "Is my text saved or uploaded to an external server?",
        answer: "No. The casing logic operates strictly within your local browser runtime. No text data is transmitted over the network."
      }
    ]
  },

  'word-counter': {
    howTo: [
      {
        title: "Enter or Paste Document Content",
        desc: "Type directly into the text editor or paste articles, essays, and manuscripts."
      },
      {
        title: "Inspect Real-Time Statistics",
        desc: "View live tallies for total words, characters with/without spaces, sentences, paragraphs, and reading/speaking duration estimates."
      },
      {
        title: "Review Keyword Density & Copy Stats",
        desc: "Check the top repeated keywords and frequency breakdown, then copy the metrics summary to your clipboard."
      }
    ],
    faq: [
      {
        question: "How does the tool calculate reading time and speaking duration?",
        answer: "Reading time is calculated using an average silent reading speed of 200 words per minute (WPM), while speaking duration is estimated at 130 WPM, typical for public presentations."
      },
      {
        question: "How are hyphenated words and contractions counted?",
        answer: "Contractions such as 'don't' count as single lexical words. Hyphenated compounds like 'well-known' are evaluated as one word unless broken across whitespace."
      },
      {
        question: "Does the word counter detect sentence and paragraph boundaries accurately?",
        answer: "Yes. Sentences are parsed by punctuation markers (. ! ?) followed by whitespace or quotes, and paragraphs are detected via distinct newline delimiters."
      },
      {
        question: "What does the keyword density analysis show?",
        answer: "It filters out common grammatical stop words (the, is, and) to reveal your most frequently repeated substantive keywords and their percentage frequency."
      },
      {
        question: "Is my pasted document content private?",
        answer: "Yes. All word frequency counting and readability metric calculations execute entirely client-side inside your browser."
      }
    ]
  },

  'character-counter': {
    howTo: [
      {
        title: "Input Text Content",
        desc: "Paste your text or type directly into the counter input box."
      },
      {
        title: "Analyze Character Metrics",
        desc: "Inspect counts for total characters, characters excluding spaces, vowels, consonants, numbers, symbols, and whitespace."
      },
      {
        title: "Check Social Platform Limits",
        desc: "Compare your current character count against platform presets like Twitter/X (280), SMS (160), and meta descriptions (160)."
      }
    ],
    faq: [
      {
        question: "Why is tracking characters without spaces important?",
        answer: "Many academic submissions, translation rate quotes, and publishing guidelines charge or evaluate length strictly based on non-whitespace glyphs."
      },
      {
        question: "How does this tool handle multi-byte Unicode characters and emojis?",
        answer: "The counter accurately parses Unicode code points and emoji sequences so composite glyphs do not trigger misleading double counts."
      },
      {
        question: "Does the character counter support live typing updates?",
        answer: "Yes. Event listeners evaluate state on every keystroke, keeping metrics instantly synchronized without needing to click a calculate button."
      },
      {
        question: "Can I use this tool to verify social media character limits?",
        answer: "Yes. Pre-configured indicator bars show your remaining character headroom for Twitter/X posts, Instagram bios, LinkedIn summaries, and SMS messaging limits."
      },
      {
        question: "Does the tool retain or store pasted text?",
        answer: "No. Input text remains solely in component state in your active browser session and disappears upon page reload."
      }
    ]
  },

  'remove-duplicate-lines': {
    howTo: [
      {
        title: "Paste Multi-Line List",
        desc: "Enter your raw list of URLs, emails, product SKUs, or text items into the input field."
      },
      {
        title: "Configure Deduplication Options",
        desc: "Toggle Case Sensitive matching, Trim Whitespace, and Preserve Original Order depending on your list requirements."
      },
      {
        title: "Copy Clean Deduplicated Output",
        desc: "Review the unique lines count and reduction percentage, then click Copy or download the sanitized list."
      }
    ],
    faq: [
      {
        question: "Does deduplication preserve the original order of list items?",
        answer: "Yes. By default, the tool retains the first occurrence of each unique item in its original sequence while discarding subsequent duplicates."
      },
      {
        question: "How does the Case Sensitive toggle affect duplicate removal?",
        answer: "When enabled, 'Item' and 'item' are treated as two distinct unique lines. When disabled, case differences are normalized so only one instance remains."
      },
      {
        question: "Can leading and trailing spaces cause false duplicate mismatches?",
        answer: "Enabling the 'Trim Whitespace' option strips invisible leading or trailing spaces before comparison, ensuring clean matches across formatted lists."
      },
      {
        question: "Can this tool handle lists with thousands of entries?",
        answer: "Yes. Using a high-performance JavaScript Set data structure, lists with tens of thousands of rows are deduplicated in fractions of a second."
      },
      {
        question: "Is any list data sent to Zubware servers?",
        answer: "No. Array filtering and Set lookups are computed in your browser without any network requests."
      }
    ]
  },

  'remove-empty-lines': {
    howTo: [
      {
        title: "Paste Raw Text with Blank Lines",
        desc: "Input or paste your document, code snippet, or dataset containing unwanted empty rows."
      },
      {
        title: "Select Line Removal Mode",
        desc: "Choose whether to remove all blank lines completely, or collapse multiple consecutive empty lines into a single clean line break."
      },
      {
        title: "Copy Cleaned Result",
        desc: "Inspect the sanitized output in the preview window and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "Does the tool remove lines that only contain spaces or tabs?",
        answer: "Yes. The regex engine detects lines containing only whitespace (spaces, tabs, carriage returns) and removes them alongside completely empty lines."
      },
      {
        question: "What is the difference between Remove All and Collapse Blank Lines?",
        answer: "Remove All eliminates every empty line to produce a continuous compact block. Collapse Blank Lines condenses 2 or more consecutive blank lines down to 1 single blank separator line."
      },
      {
        question: "Can I use this on programming source code without breaking indentation?",
        answer: "Yes. Code indentation on non-empty lines is completely preserved; only entirely blank or whitespace-only lines are eliminated."
      },
      {
        question: "Does this utility handle Windows (CRLF) and Unix (LF) line endings?",
        answer: "Yes. The parser normalizes CRLF and LF delimiters before stripping empty rows, outputting consistent clean line breaks."
      },
      {
        question: "Is my text data processed securely in the browser?",
        answer: "Yes. String manipulation is executed locally in client-side memory with zero server-side storage or transmission."
      }
    ]
  },

  'find-and-replace': {
    howTo: [
      {
        title: "Input Source Text",
        desc: "Paste the document or paragraph you want to modify into the main text area."
      },
      {
        title: "Set Search and Replacement Terms",
        desc: "Type the target string or regular expression in Find, specify the new text in Replace, and toggle Match Case or Whole Word."
      },
      {
        title: "Execute & Copy Updated Text",
        desc: "Click Replace All to see highlighted match counts and instant substitutions, then copy the result."
      }
    ],
    faq: [
      {
        question: "Does the tool support regular expression (RegEx) search patterns?",
        answer: "Yes. Check the 'Use RegEx' toggle to search using regular expressions, character classes, lookaheads, and capture groups."
      },
      {
        question: "How do capture groups work in the replacement field?",
        answer: "When RegEx mode is active, you can reference captured subpatterns using $1, $2, etc., in your replacement text for advanced reformatting."
      },
      {
        question: "What does the Whole Word matching option do?",
        answer: "Whole Word prevents partial matches inside larger words (e.g. searching for 'cat' will not alter 'caterpillar' or 'scatter')."
      },
      {
        question: "How many replacements can be executed simultaneously?",
        answer: "The global replacement handles thousands of matches instantly across lengthy documents without crashing or lagging."
      },
      {
        question: "Are my sensitive search strings uploaded anywhere?",
        answer: "No. All search, match, and replace operations run locally in your browser memory."
      }
    ]
  },

  'text-compare': {
    howTo: [
      {
        title: "Paste Original and Modified Texts",
        desc: "Enter your base text into the left pane and the updated version into the right pane."
      },
      {
        title: "Choose Diff Comparison Mode",
        desc: "Select Line-by-Line, Word-by-Word, or Character-level diff comparison and toggle whitespace ignore options."
      },
      {
        title: "Inspect Visual Highlight Differences",
        desc: "Review added lines (green) and removed lines (red) side-by-side or in inline unified view."
      }
    ],
    faq: [
      {
        question: "Which diff algorithm is used to calculate differences?",
        answer: "The tool utilizes Myers' diff algorithm to compute the shortest edit script between original and modified strings."
      },
      {
        question: "Can I view differences inline as well as side-by-side?",
        answer: "Yes. You can switch between split side-by-side view (ideal for wide screens) and unified inline view (ideal for compact review)."
      },
      {
        question: "Can the comparison ignore indentation and trailing whitespace?",
        answer: "Yes. Toggle 'Ignore Whitespace' to prevent formatting differences from highlighting as content changes."
      },
      {
        question: "Is this suitable for comparing source code and configuration files?",
        answer: "Yes. Developers frequently use it to diff JSON schemas, YAML configs, markdown drafts, and source code files."
      },
      {
        question: "Is my compared text sent to any cloud server?",
        answer: "No. The diff engine is executed entirely within your browser runtime, ensuring confidentiality."
      }
    ]
  },

  'text-cleaner': {
    howTo: [
      {
        title: "Paste Dirty or Scraped Text",
        desc: "Input unformatted text copied from PDFs, websites, or legacy text files."
      },
      {
        title: "Select Cleaning Rules",
        desc: "Check desired cleanup filters: Strip HTML tags, remove emojis, decode HTML entities, normalize smart quotes, or strip extra spaces."
      },
      {
        title: "Copy Sanitized Plain Text",
        desc: "Review the cleaned output in the preview panel and copy it with a single click."
      }
    ],
    faq: [
      {
        question: "Does the cleaner remove HTML tags without destroying tag content?",
        answer: "Yes. It strips HTML tags (such as <div>, <p>, <span>) while retaining the inner readable text content cleanly."
      },
      {
        question: "What does smart quote normalization do?",
        answer: "It replaces curly quotes (“ ” ‘ ’) and em-dashes with standard ASCII straight quotes (\" ') and hyphens, preventing syntax errors in code and databases."
      },
      {
        question: "Can this tool strip non-ASCII characters and emojis?",
        answer: "Yes. You can toggle emoji removal and non-ASCII character stripping to prepare pure plain text for strict legacy systems."
      },
      {
        question: "How does it handle mixed line breaks from copied PDF text?",
        answer: "It unifies carriage returns and joins soft hyphenated line wraps into smooth, readable continuous paragraphs."
      },
      {
        question: "Is my cleaned text stored in any cloud database?",
        answer: "No. All text scrubbing regexes run client-side in browser memory."
      }
    ]
  },

  'sort-lines': {
    howTo: [
      {
        title: "Paste Unsorted Lines",
        desc: "Enter your list of names, numbers, keywords, or filenames into the editor."
      },
      {
        title: "Select Sorting Criteria",
        desc: "Choose Alphabetical (A-Z or Z-A), Natural Numeric sorting, Line Length, or Random Shuffle, and toggle case sensitivity."
      },
      {
        title: "Copy or Export Sorted List",
        desc: "Review the reordered list and click Copy to clipboard or download as text."
      }
    ],
    faq: [
      {
        question: "What is Natural Numeric sorting?",
        answer: "Natural sorting treats multi-digit numbers intelligently so that 'item 2' appears before 'item 10', unlike standard ASCII sorting which places '10' before '2'."
      },
      {
        question: "Can I sort lines by character length?",
        answer: "Yes. You can sort from shortest line to longest line, or descending from longest to shortest, useful for domain naming and keyword research."
      },
      {
        question: "Can I shuffle lines randomly?",
        answer: "Yes. The Shuffle option uses the Fisher-Yates randomization algorithm to randomize row order for giveaways or randomized test lists."
      },
      {
        question: "Does the sorter preserve leading numbers and formatting?",
        answer: "Yes. Text on each line remains unaltered; only the sequence of the rows is reorganized."
      },
      {
        question: "Is the sorting performed locally on my computer?",
        answer: "Yes. Array sorting executes in your local JavaScript runtime without external server communication."
      }
    ]
  },

  'lorem-ipsum-generator': {
    howTo: [
      {
        title: "Choose Output Unit & Quantity",
        desc: "Select whether to generate Paragraphs, Sentences, Words, or List Items, and enter your desired quantity."
      },
      {
        title: "Configure Generation Options",
        desc: "Toggle whether to start with standard 'Lorem ipsum dolor sit amet...' and whether to wrap output in HTML <p> tags."
      },
      {
        title: "Copy Generated Placeholder Text",
        desc: "Click Generate, review the dummy text, and click Copy to clipboard for immediate use in mockups and wireframes."
      }
    ],
    faq: [
      {
        question: "Where does traditional Lorem Ipsum text originate?",
        answer: "It derives from sections of Cicero's 45 BC philosophical treatise 'De finibus bonorum et malorum', randomized to simulate natural reading cadence."
      },
      {
        question: "Can I wrap generated dummy text in HTML markup?",
        answer: "Yes. Check the 'HTML Tags' option to automatically wrap paragraphs in <p>...</p> tags or generate ready-to-use <ul><li>...</li></ul> lists."
      },
      {
        question: "Why use placeholder dummy text instead of real copy?",
        answer: "Dummy text prevents visual designers, clients, and reviewers from getting distracted by readable copy, keeping focus on layout, typography, and hierarchy."
      },
      {
        question: "Can I generate specific word counts for tight layout mockups?",
        answer: "Yes. Select 'Words' mode and set your exact word count threshold to test tight button labels, card snippets, or metadata fields."
      },
      {
        question: "Does the generator require an active internet connection?",
        answer: "No. The Latin vocabulary dictionary is stored locally in the application bundle, allowing instant offline text generation."
      }
    ]
  },

  'markdown-editor': {
    howTo: [
      {
        title: "Write or Paste Markdown",
        desc: "Type markdown syntax in the left editor or use formatting toolbar shortcuts for headings, lists, bold, and code blocks."
      },
      {
        title: "Preview Formatted Output Live",
        desc: "Inspect real-time HTML rendering in the right preview pane with synchronized scroll and syntax highlighting."
      },
      {
        title: "Export as MD, HTML, or PDF",
        desc: "Copy the rendered HTML or raw Markdown, or click Download to save a formatted .html or .md file."
      }
    ],
    faq: [
      {
        question: "Which Markdown specifications are supported?",
        answer: "The editor supports CommonMark and GitHub Flavored Markdown (GFM), including tables, strikethrough, task lists, and fenced code blocks."
      },
      {
        question: "Can I export the rendered preview as standalone HTML?",
        answer: "Yes. You can copy the generated raw HTML markup or export a complete self-contained HTML document with default styling."
      },
      {
        question: "Does the editor include syntax shortcuts?",
        answer: "Yes. The top toolbar provides single-click insertion for H1-H3 headings, bold, italics, links, blockquotes, code snippets, and data tables."
      },
      {
        question: "Is my document saved automatically?",
        answer: "The editor saves active document drafts to browser localStorage, so your work persists across tab refreshes."
      },
      {
        question: "Are my private notes and drafts transmitted to a server?",
        answer: "No. Parsing and rendering are performed entirely client-side using JavaScript parser libraries."
      }
    ]
  },

  'url-extractor': {
    howTo: [
      {
        title: "Paste Raw Text or Source Code",
        desc: "Paste articles, emails, server logs, or HTML page source containing hyperlinks into the input box."
      },
      {
        title: "Configure Extraction Filters",
        desc: "Choose to extract all URLs, filter by domain extension, remove duplicate links, or strip query parameters."
      },
      {
        title: "Copy Extracted URL List",
        desc: "Review the extracted link count and copy the clean newline-separated list or download as text."
      }
    ],
    faq: [
      {
        question: "Can the extractor detect URLs without http:// or https:// prefixes?",
        answer: "Yes. The regular expression recognizes standard http/https links, www. subdomains, and standalone web domains."
      },
      {
        question: "Can I strip tracking parameters (like UTM tags) from extracted links?",
        answer: "Yes. Enabling the 'Strip Query Parameters' filter removes tracking parameters from URLs, giving you clean canonical domain paths."
      },
      {
        question: "How does the tool handle malformed or nested links in raw HTML?",
        answer: "It parses href attributes as well as raw text occurrences, extracting clean URLs while discarding HTML tag markup."
      },
      {
        question: "Can I deduplicate extracted URLs automatically?",
        answer: "Yes. The deduplication filter automatically discards repeated URLs and displays unique link counts."
      },
      {
        question: "Is my scanned text private?",
        answer: "Yes. The regex scan runs locally in your browser. No URLs or source texts are uploaded."
      }
    ]
  },

  'wide-text-generator': {
    howTo: [
      {
        title: "Type Standard Text",
        desc: "Input alphanumeric text or messages into the text editor."
      },
      {
        title: "Select Fullwidth Aesthetic Style",
        desc: "Choose classic Fullwidth Vaporwave spacing, spaced letters, or aesthetic block characters."
      },
      {
        title: "Copy Wide Text for Social Media",
        desc: "Click Copy to grab the transformed fullwidth Unicode string ready for Discord, Twitter, or Instagram bios."
      }
    ],
    faq: [
      {
        question: "How does the Wide Text Generator create aesthetic vaporwave text?",
        answer: "It maps standard ASCII character codes to the Unicode Halfwidth and Fullwidth Forms block (U+FF01 to U+FF5E), creating wide monospace characters."
      },
      {
        question: "Will wide text display correctly across all devices and phones?",
        answer: "Yes. Fullwidth glyphs are part of the universal Unicode standard supported natively on iOS, Android, macOS, Windows, and Linux."
      },
      {
        question: "Can I use wide text in Discord nicknames, usernames, and game handles?",
        answer: "Yes. Most gaming platforms and social apps accept fullwidth Unicode characters in status messages, bios, and display names."
      },
      {
        question: "Does the generator alter numbers and punctuation?",
        answer: "Yes. Fullwidth numbers (０-９) and punctuation marks (！, ？, ：) are mapped alongside alphabetical letters for consistent wide spacing."
      },
      {
        question: "Is text conversion performed locally?",
        answer: "Yes. Character mapping is computed instantly client-side without any server API calls."
      }
    ]
  },

  'text-reverser': {
    howTo: [
      {
        title: "Input Text to Reverse",
        desc: "Type or paste words, phrases, or multi-line paragraphs into the input box."
      },
      {
        title: "Choose Reversal Direction",
        desc: "Select Reverse Entire Text, Reverse Each Word, Reverse Word Order Only, or Flip Upside Down."
      },
      {
        title: "Copy Reversed Output",
        desc: "Inspect the flipped or reversed text and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "What is the difference between reversing text and reversing word order?",
        answer: "Reversing text turns 'hello world' into 'dlrow olleh' (character level). Reversing word order turns 'hello world' into 'world hello' while keeping individual words readable."
      },
      {
        question: "How does the Reverse Each Word mode work?",
        answer: "It preserves sentence word sequence while reversing the internal letters of each individual word (e.g. 'hello world' becomes 'olleh dlrow')."
      },
      {
        question: "Does the reverser support multi-line poems and paragraphs?",
        answer: "Yes. You can choose whether to reverse line order from bottom to top or maintain paragraph line structure."
      },
      {
        question: "How does upside-down text flipping work?",
        answer: "It maps standard Latin alphabet characters to phonetic upside-down Unicode equivalents (such as ɐ for a and ɥ for h)."
      },
      {
        question: "Are my messages processed securely?",
        answer: "Yes. String reversal algorithms run client-side in browser memory with zero network footprint."
      }
    ]
  },

  'remove-line-breaks': {
    howTo: [
      {
        title: "Paste Segmented Text",
        desc: "Input paragraphs copied from PDF columns, OCR scans, or emails that have broken lines."
      },
      {
        title: "Select Line Break Replacement",
        desc: "Choose to replace line breaks with spaces, completely remove them, or preserve double paragraph breaks while removing single wraps."
      },
      {
        title: "Copy Reflowed Paragraphs",
        desc: "Review the unified, continuous text block and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "Why do texts copied from PDF documents contain unwanted line breaks?",
        answer: "PDF files store text using physical print coordinates rather than semantic paragraph flow, causing line breaks at every visual margin wrap."
      },
      {
        question: "Can I preserve paragraph separations while fixing broken single lines?",
        answer: "Yes. The 'Preserve Paragraphs' option retains double line breaks (\n\n) while joining single broken line ends into smooth continuous sentences."
      },
      {
        question: "Does the tool automatically clean up hyphenated words broken across lines?",
        answer: "Yes. It detects trailing hyphens at line endings (e.g. 'infor-\nmation') and merges them back into single unbroken words ('information')."
      },
      {
        question: "Can I replace line breaks with custom delimiters like commas or semicolons?",
        answer: "Yes. You can specify a custom character or string delimiter to replace every newline character."
      },
      {
        question: "Is any text stored on external servers?",
        answer: "No. Regex string normalization executes completely in your web browser."
      }
    ]
  },

  'remove-extra-spaces': {
    howTo: [
      {
        title: "Paste Spaced Text",
        desc: "Enter text containing multiple spaces between words, uneven indents, or trailing whitespace."
      },
      {
        title: "Select Space Cleanup Rules",
        desc: "Toggle Remove Multiple Spaces to Single Space, Trim Leading/Trailing Whitespace, and Remove Empty Lines."
      },
      {
        title: "Copy Compact Clean Text",
        desc: "Review the normalized spacing and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "How does this tool collapse repeated spaces?",
        answer: "It uses regular expressions to replace instances of two or more consecutive spaces with a single standard ASCII space."
      },
      {
        question: "Does it remove invisible non-breaking spaces (NBSP)?",
        answer: "Yes. The cleaner normalizes non-breaking spaces (&nbsp; / U+00A0) and zero-width spaces into standard ASCII spacing."
      },
      {
        question: "Can I trim trailing spaces from the end of every line?",
        answer: "Yes. The line-trimming feature strips redundant spaces from the end of each line without altering word spacing inside lines."
      },
      {
        question: "Will this break intentional multi-line paragraphs?",
        answer: "No. Unless you specifically choose to collapse line breaks, existing newlines are preserved while horizontal space between words is normalized."
      },
      {
        question: "Is text processing private and safe?",
        answer: "Yes. Whitespace normalization occurs 100% locally in browser memory."
      }
    ]
  },

  'text-repeater': {
    howTo: [
      {
        title: "Enter Message or Text to Repeat",
        desc: "Type words, phrases, or emojis that you want to duplicate."
      },
      {
        title: "Set Repetition Count & Delimiter",
        desc: "Specify the number of repeats (e.g. 10 to 10,000) and choose separation: Space, Newline, Comma, or Custom delimiter."
      },
      {
        title: "Generate and Copy Repeated Text",
        desc: "Click Repeat, inspect the output character count, and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "What is the maximum number of times I can repeat text?",
        answer: "You can repeat text up to 10,000 times safely without browser freezing or memory overflow."
      },
      {
        question: "Can I add numbering or index tags to each repeated line?",
        answer: "Yes. Toggling the 'Add Line Numbers' option prepends sequential numbers (1., 2., 3.) before each repeated instance."
      },
      {
        question: "Can I repeat emojis and special characters?",
        answer: "Yes. Full Unicode and emoji sequences are supported without corruption or encoding issues."
      },
      {
        question: "How fast is generating thousands of repeated words?",
        answer: "Generation is virtually instantaneous, utilizing native JavaScript array creation and string joining."
      },
      {
        question: "Is repeated text sent to any server?",
        answer: "No. All text repetition string construction executes client-side in browser memory."
      }
    ]
  },

  'text-splitter': {
    howTo: [
      {
        title: "Paste Raw Text Block",
        desc: "Enter a large block of text, CSV records, or code into the input pane."
      },
      {
        title: "Choose Splitting Delimiter or Size",
        desc: "Split by Newline, Comma, Custom Character/Regex, or by fixed Character/Word count chunks."
      },
      {
        title: "Inspect Segments & Copy Results",
        desc: "Review individual segment cards, view chunk counts, and copy individual pieces or export all chunks as files."
      }
    ],
    faq: [
      {
        question: "Can I split text into chunks suitable for AI prompt token limits?",
        answer: "Yes. You can specify a maximum character or word threshold per chunk to partition large documents into manageable sections for AI chat tools."
      },
      {
        question: "Does the splitter support regular expressions as delimiters?",
        answer: "Yes. You can enter custom regex patterns (like \\d+\\. or ;\\s*) to split on complex headings or numbering systems."
      },
      {
        question: "How does word-aware chunk splitting work?",
        answer: "When splitting by size, word-boundary preservation ensures the tool does not chop words in half, finding the nearest preceding space."
      },
      {
        question: "Can I download each chunk as an individual text file?",
        answer: "Yes. You can export all split parts as a zipped archive of individual .txt files for batch processing."
      },
      {
        question: "Is my document data kept private?",
        answer: "Yes. All string partitioning and array transformations occur strictly in browser memory."
      }
    ]
  },

  'text-joiner': {
    howTo: [
      {
        title: "Input Lines or Segments",
        desc: "Paste individual lines, list items, or sentences that need combining."
      },
      {
        title: "Select Join Delimiter & Enclosure",
        desc: "Choose join delimiter: Comma, Semicolon, Space, Pipe (|), or Custom string, and optionally wrap each item in quotes."
      },
      {
        title: "Copy Merged Single-Line Output",
        desc: "Review the joined string in the output box and click Copy to clipboard for SQL IN queries, CSV arrays, or code lists."
      }
    ],
    faq: [
      {
        question: "Can this tool format items for SQL IN clauses?",
        answer: "Yes. Select comma as delimiter and enable single quote enclosure to format items instantly as 'val1', 'val2', 'val3'."
      },
      {
        question: "Does the joiner skip empty lines automatically?",
        answer: "Yes. An optional 'Ignore Empty Lines' toggle prevents redundant adjacent delimiters from appearing in your joined output."
      },
      {
        question: "Can I wrap items in custom prefix and suffix characters?",
        answer: "Yes. You can specify custom prefixes and suffixes (such as parentheses, brackets, or double quotes) around each individual line item."
      },
      {
        question: "Can I sort lines before joining them?",
        answer: "Yes. An integrated sort toggle organizes list items alphabetically before merging."
      },
      {
        question: "Are list items transmitted to an external server?",
        answer: "No. Array filtering, mapping, and joining execute entirely in client-side JavaScript."
      }
    ]
  },

  'email-extractor': {
    howTo: [
      {
        title: "Paste Raw Text or Document Source",
        desc: "Input raw text, scraped web pages, email correspondence, or support ticket dumps."
      },
      {
        title: "Configure Extraction and Filter Rules",
        desc: "Toggle Deduplicate Emails, Sort Alphabetically, and filter by specific top-level domain or company domain name."
      },
      {
        title: "Copy Clean Email Addresses",
        desc: "Review the verified address count and click Copy or download a newline-separated list."
      }
    ],
    faq: [
      {
        question: "What regular expression standard is used to identify email addresses?",
        answer: "The extractor uses an RFC-5322 compliant regex pattern that reliably matches standard alphanumeric usernames, subdomains, and modern generic TLDs."
      },
      {
        question: "Can I filter extracted emails to specific domain names?",
        answer: "Yes. Enter a domain filter (e.g. 'gmail.com' or 'company.org') to isolate only emails matching your target organization."
      },
      {
        question: "How does the tool handle obfuscated emails (like user [at] domain [dot] com)?",
        answer: "The de-obfuscation feature normalizes common anti-spam formatting into standard usable email syntax before extraction."
      },
      {
        question: "Does the email extractor eliminate duplicates?",
        answer: "Yes. Case-insensitive deduplication ensures each distinct email address appears only once in your final output."
      },
      {
        question: "Are extracted emails uploaded or harvested to a server?",
        answer: "No. Scanning and extraction occur 100% locally in your browser session. Zubware does not collect, record, or store extracted addresses."
      }
    ]
  },

  'keyword-extractor': {
    howTo: [
      {
        title: "Paste Article or Copy",
        desc: "Enter your blog post, product description, or competitor text into the analysis editor."
      },
      {
        title: "Configure Minimum Length & Stopwords",
        desc: "Set minimum word length, select 1-word, 2-word, or 3-word n-gram phrases, and enable stopword filtering."
      },
      {
        title: "Review Keyword Density & Export",
        desc: "Inspect frequency counts, percentage density metrics, and copy the top SEO keywords list."
      }
    ],
    faq: [
      {
        question: "How are stop words handled in keyword extraction?",
        answer: "A comprehensive English stopword dictionary filters out common grammatical fillers (e.g., 'the', 'with', 'about') so only meaningful topical keywords appear."
      },
      {
        question: "Can this tool extract multi-word keyword phrases (n-grams)?",
        answer: "Yes. You can switch between unigrams (single words), bigrams (2-word phrases), and trigrams (3-word phrases) to detect long-tail keywords."
      },
      {
        question: "What is keyword density and how is it calculated?",
        answer: "Keyword density measures the percentage frequency of a term relative to total document words: (keyword occurrences / total word count) * 100."
      },
      {
        question: "How does keyword extraction help SEO content writing?",
        answer: "It reveals overused terms (preventing keyword stuffing penalties) and verifies that primary search intent topics appear naturally throughout the text."
      },
      {
        question: "Is my proprietary article text uploaded to a server?",
        answer: "No. Tokenization, frequency mapping, and density calculations execute entirely in local browser memory."
      }
    ]
  },

  'random-text-generator': {
    howTo: [
      {
        title: "Choose Generation Type & Length",
        desc: "Select Random Words, Alphanumeric Strings, Hexadecimal Hashes, or Mixed Passwords, and set length."
      },
      {
        title: "Configure Character Set Options",
        desc: "Toggle uppercase letters, lowercase letters, numbers, and special symbols to customize the generated string."
      },
      {
        title: "Generate and Copy Random Text",
        desc: "Click Generate, inspect the entropy strength, and copy the randomized string to your clipboard."
      }
    ],
    faq: [
      {
        question: "How random are the generated strings?",
        answer: "Strings are produced using the browser's cryptographically secure pseudo-random number generator (window.crypto.getRandomValues), ensuring high cryptographic entropy."
      },
      {
        question: "Can I generate pronounceable random words for testing?",
        answer: "Yes. Switch to 'Word' mode to generate pseudo-pronounceable syllable chains or random dictionary terms for mockup placeholder data."
      },
      {
        question: "What character sets are supported?",
        answer: "You can toggle uppercase Latin (A-Z), lowercase (a-z), digits (0-9), and special ASCII symbols (!@#$%^&*), or provide a custom character pool."
      },
      {
        question: "Can I generate multiple random strings at once?",
        answer: "Yes. Set the batch count to generate up to 1,000 distinct random strings formatted on separate lines."
      },
      {
        question: "Are generated random strings stored or transmitted?",
        answer: "No. All randomization occurs client-side in browser memory with zero server transmission."
      }
    ]
  }
};
