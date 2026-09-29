import { ToolUpdate } from './types';

export const CLUSTER_1B_DEV_TOOLS: Record<string, ToolUpdate> = {
  'xml-to-json': {
    howTo: [
      {
        title: "Paste Raw XML Document",
        desc: "Input your XML document, RSS feed, or SOAP response into the editor."
      },
      {
        title: "Configure Parsing Rules",
        desc: "Choose whether to prefix attributes with '@' or '_', collapse single-child arrays, and normalize text nodes."
      },
      {
        title: "Copy or Download Formatted JSON",
        desc: "Review the converted JSON tree with syntax color-coding and click Copy or download as a .json file."
      }
    ],
    faq: [
      {
        question: "How does the converter translate XML attributes into JSON?",
        answer: "Attributes are mapped to prefixed object properties (e.g. '@id' or '_id') inside the parent element, keeping attributes cleanly distinguished from child tags."
      },
      {
        question: "Can it convert XML repeating tags into JSON arrays?",
        answer: "Yes. Repeating sibling elements with the same tag name are automatically parsed into cohesive JSON arrays."
      },
      {
        question: "Does the tool handle XML CDATA sections?",
        answer: "Yes. CDATA text blocks are extracted and preserved as raw string values without entity corruption."
      },
      {
        question: "Can I convert large XML datasets?",
        answer: "Yes. Using the browser's native DOMParser, multi-megabyte XML files parse rapidly in client memory."
      },
      {
        question: "Is XML data transmitted to an external server?",
        answer: "No. Conversion runs 100% locally in your browser session with complete data confidentiality."
      }
    ]
  },

  'markdown-to-html': {
    howTo: [
      {
        title: "Paste or Write Markdown",
        desc: "Enter markdown text into the left pane or use formatting buttons for tables, code blocks, and headers."
      },
      {
        title: "Configure HTML Generation Options",
        desc: "Toggle GitHub Flavored Markdown (GFM), task lists, table generation, and standalone HTML document wrapper."
      },
      {
        title: "Copy Rendered HTML Markup",
        desc: "Review the live formatted preview and click Copy HTML to paste into your CMS, blog, or website."
      }
    ],
    faq: [
      {
        question: "Which Markdown flavor is supported by this converter?",
        answer: "It supports standard CommonMark and GitHub Flavored Markdown (GFM), including data tables, task checkboxes, strikethrough, and fenced code blocks with language tags."
      },
      {
        question: "Can I generate a complete standalone HTML document?",
        answer: "Yes. Check 'Standalone Document' to wrap the output in full <!DOCTYPE html><html><head><meta charset='UTF-8'></head><body> boilerplate."
      },
      {
        question: "How are code blocks formatted in the HTML output?",
        answer: "Code blocks are wrapped in semantic <pre><code class=\"language-*\"></pre> tags ready for highlight.js or Prism syntax highlighters."
      },
      {
        question: "Does the converter sanitize raw HTML for safety?",
        answer: "Yes. An optional sanitization toggle neutralizes dangerous <script> tags and malicious inline event handlers to prevent XSS."
      },
      {
        question: "Is parsing performed locally on my device?",
        answer: "Yes. Markdown tokenization and HTML rendering execute entirely in browser memory."
      }
    ]
  },

  'sql-formatter': {
    howTo: [
      {
        title: "Paste Unformatted SQL Query",
        desc: "Input minified, messy, or single-line SQL queries into the editor."
      },
      {
        title: "Select SQL Dialect & Indentation",
        desc: "Choose standard SQL, PostgreSQL, MySQL, SQLite, Oracle, or SQL Server, and select 2-space, 4-space, or tab indents."
      },
      {
        title: "Format, Beautify & Copy Query",
        desc: "Click Format SQL to align clauses (SELECT, FROM, WHERE, JOIN) and uppercase keywords, then click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "Which SQL dialects are supported by the formatter?",
        answer: "It supports Standard ANSI SQL, PostgreSQL, MySQL, MariaDB, SQLite, Microsoft SQL Server (T-SQL), and Oracle PL/SQL."
      },
      {
        question: "Can the formatter convert SQL keywords to uppercase automatically?",
        answer: "Yes. It normalizes all SQL keywords (SELECT, FROM, WHERE, GROUP BY, ORDER BY, INNER JOIN) to consistent uppercase for readability."
      },
      {
        question: "How does it handle complex nested subqueries and CTEs?",
        answer: "Common Table Expressions (WITH clauses) and nested subqueries are indented with hierarchical padding and aligned parentheses."
      },
      {
        question: "Can I format multi-statement database migration scripts?",
        answer: "Yes. The formatter detects semicolon statement delimiters and formats multiple sequential queries with clean vertical separation."
      },
      {
        question: "Are my database queries and table schemas logged on a server?",
        answer: "No. All SQL parsing and token formatting execute client-side in browser memory."
      }
    ]
  },

  'jwt-generator': {
    howTo: [
      {
        title: "Define JWT Payload Claims",
        desc: "Input claims JSON (e.g. sub, name, role, iat, exp) or use guided fields to set user ID and expiration duration."
      },
      {
        title: "Select Signing Algorithm & Enter Secret Key",
        desc: "Choose HS256, HS384, or HS512 and input your private HMAC secret signing key."
      },
      {
        title: "Generate & Copy Signed JWT Token",
        desc: "Click Generate Token to calculate the cryptographic HMAC signature and copy the three-part JWT token."
      }
    ],
    faq: [
      {
        question: "How are JWT tokens cryptographically signed in this tool?",
        answer: "Signatures are computed locally using the browser's native Web Crypto API (SubtleCrypto.sign) with HMAC SHA-256/384/512 algorithms."
      },
      {
        question: "Can I set custom token expiration times?",
        answer: "Yes. You can specify token expiration in minutes, hours, or days; the tool automatically calculates and sets the Unix exp timestamp."
      },
      {
        question: "Can I generate tokens for testing authentication in local development?",
        answer: "Yes. It is designed for developers building mock APIs, testing frontend OAuth/OIDC flows, and debugging microservice authentication."
      },
      {
        question: "Is it safe to enter real secret keys into this tool?",
        answer: "All cryptographic HMAC signing runs 100% locally in your browser memory without network calls. However, best practice is to use development secrets for testing."
      },
      {
        question: "Does the generator validate JSON payload syntax before signing?",
        answer: "Yes. The payload editor validates JSON syntax in real time, preventing invalid claim structures."
      }
    ]
  },

  'cron-expression-generator': {
    howTo: [
      {
        title: "Select Schedule Frequency",
        desc: "Choose Minutes, Hourly, Daily, Weekly, Monthly, or Custom cron intervals via visual dropdowns."
      },
      {
        title: "Configure Specific Times & Days",
        desc: "Select execution minutes, hours of the day, weekdays (Mon-Fri), or days of the month."
      },
      {
        title: "Copy 5-Part Cron String & Inspect Next Runs",
        desc: "Review the standard 5-part cron expression (e.g. 0 9 * * 1-5), read the plain-English translation, and copy the string."
      }
    ],
    faq: [
      {
        question: "What do the 5 fields of a standard cron expression represent?",
        answer: "The 5 fields correspond to: 1) Minute (0-59), 2) Hour (0-23), 3) Day of Month (1-31), 4) Month (1-12 or JAN-DEC), and 5) Day of Week (0-6 or SUN-SAT)."
      },
      {
        question: "Does the tool provide human-readable English explanations?",
        answer: "Yes. It translates any cron expression into clear English (e.g. 'At 09:00 AM, Monday through Friday') using standard cron-strue parsing."
      },
      {
        question: "Can I view upcoming scheduled execution timestamps?",
        answer: "Yes. The preview calculates and displays the next 5 upcoming scheduled execution dates and times in your local time zone."
      },
      {
        question: "Can I paste an existing cron expression to reverse-engineer it?",
        answer: "Yes. Paste any valid 5-part cron string into the expression bar to populate the visual controls and view its schedule."
      },
      {
        question: "Does this generator execute offline?",
        answer: "Yes. Cron calculation and natural language translation operate completely in your web browser."
      }
    ]
  },

  'json-viewer': {
    howTo: [
      {
        title: "Paste or Upload JSON File",
        desc: "Input JSON text or upload a .json file to inspect complex hierarchical data structures."
      },
      {
        title: "Navigate Interactive Tree & Filter Keys",
        desc: "Expand and collapse object nodes, search keys and values with live filtering, and inspect data types."
      },
      {
        title: "Copy JSON Paths or Value Nodes",
        desc: "Click any node to copy its exact JSONPath (such as $.users.address.city) or copy the node value."
      }
    ],
    faq: [
      {
        question: "Can I expand or collapse all JSON nodes with one click?",
        answer: "Yes. Global 'Expand All' and 'Collapse All' buttons let you navigate large nested trees effortlessly."
      },
      {
        question: "Does the viewer highlight data types with distinct colors?",
        answer: "Yes. Strings, numbers, booleans, nulls, keys, and array indices are color-coded for fast visual recognition."
      },
      {
        question: "How does the search and filter feature work?",
        answer: "The search box highlights matching object keys and string values in real time, auto-expanding parent branches that contain matches."
      },
      {
        question: "Can I copy JSONPath expressions for programming?",
        answer: "Yes. Clicking any node provides its dot-notation or JSONPath expression for immediate use in Python, JavaScript, or jq scripts."
      },
      {
        question: "Is large JSON data secure in the viewer?",
        answer: "Yes. All tree rendering and object navigation execute locally in your browser memory."
      }
    ]
  },

  'user-agent-parser': {
    howTo: [
      {
        title: "Inspect Current Browser User Agent",
        desc: "The tool automatically detects and populates your active browser's navigator.userAgent string."
      },
      {
        title: "Paste Custom User Agent String",
        desc: "Paste user agents from web server logs, mobile apps, or web crawlers to analyze external devices."
      },
      {
        title: "Review Deconstructed Device & Engine Details",
        desc: "Inspect parsed breakdown cards: Browser Name & Version, Operating System, Rendering Engine (Blink/Gecko/WebKit), and Device Type (Mobile/Desktop/Tablet)."
      }
    ],
    faq: [
      {
        question: "What client properties does this parser extract from a User Agent string?",
        answer: "It extracts Browser Name and Version, Operating System (Windows, macOS, iOS, Android, Linux) and Version, Device Vendor/Model, Architecture, and Rendering Engine."
      },
      {
        question: "Does the tool detect web crawlers and search engine bots?",
        answer: "Yes. It identifies major bot signatures including Googlebot, Bingbot, YandexBot, DuckDuckBot, and social media preview crawlers."
      },
      {
        question: "Can I analyze mobile smartphone user agents?",
        answer: "Yes. Pasting user agents from iPhones, iPads, or Android devices reveals exact hardware model identifiers and mobile Safari/Chrome versions."
      },
      {
        question: "What is User-Agent Client Hints (UA-CH)?",
        answer: "Modern browsers are gradually freezing traditional User-Agent strings in favor of Client Hints; this tool decodes available Client Hints and legacy strings."
      },
      {
        question: "Is my browser User Agent recorded on a server?",
        answer: "No. The User Agent analysis is parsed strictly within your local browser session."
      }
    ]
  },

  'json-to-yaml': {
    howTo: [
      {
        title: "Paste JSON Data",
        desc: "Input valid JSON objects, configs, or arrays into the left editor pane."
      },
      {
        title: "Configure Indentation & Formatting",
        desc: "Select 2-space or 4-space indentations and toggle quote wrapping for string values."
      },
      {
        title: "Copy or Download Clean YAML",
        desc: "Review the converted YAML document with clean block structure and click Copy or download as .yaml."
      }
    ],
    faq: [
      {
        question: "How does the converter handle nested arrays in YAML?",
        answer: "Nested arrays are formatted into clean YAML list syntax with dashes (-) indented according to standard YAML specification rules."
      },
      {
        question: "Are multiline strings formatted as YAML literal blocks?",
        answer: "Yes. Multiline string fields with newline characters are formatted using clean YAML pipe (|) or folded (>) literal block operators."
      },
      {
        question: "Is this suitable for Docker Compose and Kubernetes manifest files?",
        answer: "Yes. The generated YAML is strictly formatted for Kubernetes pod configs, GitHub Actions workflows, and Docker Compose specifications."
      },
      {
        question: "Does the converter validate JSON syntax before transforming?",
        answer: "Yes. If the JSON contains syntax errors, the parser alerts you to the exact error location before converting."
      },
      {
        question: "Is data sent to an external server?",
        answer: "No. The JSON-to-YAML conversion engine runs entirely in browser memory."
      }
    ]
  },

  'sha256-hash-generator': {
    howTo: [
      {
        title: "Input Text to Hash",
        desc: "Type or paste your string, password, payload, or token into the input editor."
      },
      {
        title: "Compute SHA-256 Checksum",
        desc: "The hash is calculated instantly via the Web Crypto API on every keystroke."
      },
      {
        title: "Copy 64-Character Hexadecimal Digest",
        desc: "Review the 256-bit hash string and click Copy to clipboard for verification or cryptographic signatures."
      }
    ],
    faq: [
      {
        question: "What is SHA-256 and how long is the output hash?",
        answer: "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a fixed 64-character hexadecimal string (256 bits) from any arbitrary input data."
      },
      {
        question: "How is the hash computed securely in this tool?",
        answer: "It uses the browser's hardware-accelerated Web Crypto API (crypto.subtle.digest('SHA-256', buffer)), ensuring cryptographic accuracy and speed."
      },
      {
        question: "Can SHA-256 hashes be reversed back into the original text?",
        answer: "No. Cryptographic hash functions are one-way mathematical functions; it is computationally infeasible to invert a SHA-256 digest back into its original input."
      },
      {
        question: "Can I toggle uppercase and lowercase hex output?",
        answer: "Yes. You can copy the standard lowercase hex string or toggle uppercase output for specific database requirements."
      },
      {
        question: "Is my plaintext input sent over the internet?",
        answer: "No. The hashing execution occurs 100% locally on your device with complete privacy."
      }
    ]
  },

  'md5-hash-generator': {
    howTo: [
      {
        title: "Enter String or Message",
        desc: "Input your text, identifier, or legacy checksum payload into the editor."
      },
      {
        title: "Compute MD5 128-Bit Digest",
        desc: "The tool processes the input through the MD5 hashing algorithm in real time."
      },
      {
        title: "Copy 32-Character Hex Digest",
        desc: "Review the 32-character hexadecimal hash and click Copy to clipboard for database lookups or file verification."
      }
    ],
    faq: [
      {
        question: "What is MD5 and what is its standard output length?",
        answer: "MD5 (Message Digest Algorithm 5) produces a 128-bit hash value, commonly represented as a 32-character hexadecimal string."
      },
      {
        question: "Is MD5 recommended for modern password security?",
        answer: "No. MD5 has known cryptographic collision vulnerabilities and should not be used for secure password storage or digital certificates; use SHA-256 or bcrypt instead. MD5 remains useful for non-security checksums and legacy database keys."
      },
      {
        question: "Does the generator support UTF-8 strings?",
        answer: "Yes. Multibyte UTF-8 characters and accented text are encoded properly into binary byte arrays prior to MD5 computation."
      },
      {
        question: "Can I generate uppercase and lowercase MD5 digests?",
        answer: "Yes. You can switch between standard lowercase and uppercase output formats with one click."
      },
      {
        question: "Are input messages uploaded to a server?",
        answer: "No. MD5 hashing executes client-side in browser memory with zero network requests."
      }
    ]
  },

  'html-entity-encoder-decoder': {
    howTo: [
      {
        title: "Enter Text or Entity Markup",
        desc: "Input raw text to encode into HTML entities, or paste encoded entities (&amp;, &lt;, &euro;) to decode."
      },
      {
        title: "Select Encoding Scope & Format",
        desc: "Choose Named Entities (e.g. &copy;), Decimal Entities (&#169;), or Hexadecimal Entities (&#xA9;), and set encoding scope (All characters vs Special symbols only)."
      },
      {
        title: "Copy Converted String",
        desc: "Review the converted result in the preview box and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "What is the difference between Named, Decimal, and Hexadecimal entities?",
        answer: "Named entities use mnemonic names (e.g. &amp; for &), decimal entities use character code points in base 10 (&#38;), and hex entities use base 16 (&#x26;)."
      },
      {
        question: "Why should special characters be converted to HTML entities?",
        answer: "Encoding reserved characters (<, >, &, \", ') prevents browsers from misinterpreting text as HTML tags, avoiding broken layouts and cross-site scripting vulnerabilities."
      },
      {
        question: "Can I encode all non-ASCII characters for strict email templates?",
        answer: "Yes. The 'Encode All Non-ASCII' mode converts foreign alphabets, symbols, and mathematical glyphs into safe ASCII entity references for legacy email clients."
      },
      {
        question: "Does decoding handle both named and numeric entities?",
        answer: "Yes. The decoder parses standard HTML5 named entities as well as decimal and hexadecimal numeric references."
      },
      {
        question: "Is processing performed locally?",
        answer: "Yes. String parsing executes client-side in browser memory with zero tracking."
      }
    ]
  },

  'text-to-binary': {
    howTo: [
      {
        title: "Type or Paste Plain Text",
        desc: "Enter words, letters, or sentences into the text conversion area."
      },
      {
        title: "Select Binary Formatting Options",
        desc: "Choose byte delimiter: Space (8-bit blocks), None, Comma, or Prefix (0b), and set byte padding to 8-bit."
      },
      {
        title: "Copy Converted Binary 0s and 1s",
        desc: "Review the binary string output and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "How does Text to Binary conversion work?",
        answer: "Each character is mapped to its ASCII or UTF-8 character code, which is converted into an 8-bit binary representation of 0s and 1s (e.g. 'A' = 65 = 01000001)."
      },
      {
        question: "Does the converter support multi-byte Unicode characters and emojis?",
        answer: "Yes. It uses UTF-8 byte serialization, encoding emojis and accented characters into their complete 2, 3, or 4-byte binary sequences."
      },
      {
        question: "Can I format output with 8-bit spacing?",
        answer: "Yes. By default, binary output is grouped into clean 8-bit octets separated by spaces for readability."
      },
      {
        question: "Is there a character limit when converting text?",
        answer: "No practical limit exists; thousands of characters convert to binary in milliseconds."
      },
      {
        question: "Are messages uploaded to external servers?",
        answer: "No. Character code conversions execute locally in your web browser."
      }
    ]
  },

  'binary-to-text': {
    howTo: [
      {
        title: "Paste Binary Numbers",
        desc: "Enter binary strings composed of 0s and 1s (with or without spaces between bytes)."
      },
      {
        title: "Select Byte Delimiter Mode",
        desc: "Choose Auto-Detect, 8-bit Spaced, or Continuous string mode to match your binary format."
      },
      {
        title: "Decode & Copy Readable Text",
        desc: "Review the decoded plaintext in the output area and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "Can the decoder handle binary strings without spaces?",
        answer: "Yes. In continuous mode, the parser slices the binary sequence into 8-bit chunks automatically to decode the characters."
      },
      {
        question: "What happens if a binary string contains invalid characters?",
        answer: "The decoder validates input and flags non-binary digits (any characters other than 0 and 1) before decoding."
      },
      {
        question: "Can it decode multi-byte UTF-8 character sequences?",
        answer: "Yes. Multi-byte sequences are reassembled into their original Unicode characters, correctly rendering accented letters and symbols."
      },
      {
        question: "Can I handle binary strings with 0b prefixes?",
        answer: "Yes. The parser automatically strips common programming prefixes like 0b before parsing byte values."
      },
      {
        question: "Is binary decoding performed client-side?",
        answer: "Yes. String decoding executes entirely in local browser memory with complete privacy."
      }
    ]
  },

  'text-to-hex': {
    howTo: [
      {
        title: "Enter Plaintext Input",
        desc: "Type or paste words, code, or strings into the text editor."
      },
      {
        title: "Choose Hex Delimiter & Prefix",
        desc: "Select delimiter: Space, None, Comma, Colon (:), or Prefix (0x or \\x), and toggle uppercase/lowercase hex."
      },
      {
        title: "Copy Converted Hexadecimal String",
        desc: "Review the hex byte representation and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "How does Text to Hex conversion work?",
        answer: "Each character's UTF-8 byte code is converted into its 2-digit base-16 hexadecimal representation (e.g. 'A' = 0x41)."
      },
      {
        question: "Can I format hex strings for C/C++ or Python code arrays?",
        answer: "Yes. You can select '0x' or '\\x' prefixing with comma separation to format byte arrays for programming languages."
      },
      {
        question: "Does it support UTF-8 multibyte characters?",
        answer: "Yes. Accented characters and emojis are converted into their full sequence of hex bytes."
      },
      {
        question: "Can I toggle uppercase and lowercase hex letters?",
        answer: "Yes. You can output standard lowercase (e.g. 4a 6f 62) or uppercase (4A 6F 62) hex characters."
      },
      {
        question: "Is my text data stored or sent to a server?",
        answer: "No. Conversion logic operates 100% locally in your browser memory."
      }
    ]
  },

  'hex-to-text': {
    howTo: [
      {
        title: "Paste Hexadecimal String",
        desc: "Enter hex byte values (e.g. '48 65 6c 6c 6f' or '48656c6c6f') into the decoder."
      },
      {
        title: "Configure Delimiter & Auto-Detection",
        desc: "The parser auto-strips spaces, colons, commas, 0x, and \\x prefixes before decoding bytes."
      },
      {
        title: "Copy Decoded Plaintext",
        desc: "Review the recovered ASCII/UTF-8 text in the output box and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "Can this tool decode hex strings with 0x or \\x prefixes?",
        answer: "Yes. It automatically cleans programming prefixes (0x, \\x) and separators (spaces, colons, commas) before decoding."
      },
      {
        question: "How does the tool handle odd-length hex strings?",
        answer: "If a hex string has an odd number of characters, the parser alerts you to an incomplete byte or prepends a leading zero."
      },
      {
        question: "Can it decode multi-byte UTF-8 characters and emojis?",
        answer: "Yes. Multi-byte hex sequences (e.g. 'f0 9f 9a 80') are decoded back into their original Unicode emojis and characters."
      },
      {
        question: "What if the hex string contains non-hex characters?",
        answer: "The validator flags characters outside the valid 0-9 and A-F range, identifying invalid byte entries."
      },
      {
        question: "Is hex decoding private?",
        answer: "Yes. Hex decoding executes client-side in browser memory with zero data transmission."
      }
    ]
  },

  'css-minifier': {
    howTo: [
      {
        title: "Paste CSS Stylesheet",
        desc: "Input unminified CSS files or stylesheet code into the compression pane."
      },
      {
        title: "Configure Minification Settings",
        desc: "Toggle stripping comments, removing redundant semicolons, collapsing zero units (0px to 0), and shortening hex colors (#ffffff to #fff)."
      },
      {
        title: "Copy Minified CSS & Inspect File Size Savings",
        desc: "Review the byte savings metric and click Copy or download your production-ready .min.css file."
      }
    ],
    faq: [
      {
        question: "How does CSS minification improve website page speed?",
        answer: "It removes comments, unnecessary whitespace, redundant semicolons, and shortens color codes, reducing stylesheet download size by 20% to 50% for faster First Contentful Paint (FCP)."
      },
      {
        question: "Does minifying CSS alter visual design or layout rules?",
        answer: "No. The minification process strictly strips non-functional whitespace and comments without modifying selector hierarchy, specificity, or property values."
      },
      {
        question: "Can I preserve copyright banners and license comments?",
        answer: "Yes. Check 'Keep Important Comments' to preserve license headers starting with /*! or /*@."
      },
      {
        question: "Does it optimize colors and zero values?",
        answer: "Yes. It converts 6-character hex codes to 3 characters where possible (#000000 to #000) and strips units from zero values (0px to 0)."
      },
      {
        question: "Is my stylesheet processed locally?",
        answer: "Yes. Minification executes 100% locally in your browser memory."
      }
    ]
  },

  'javascript-minifier': {
    howTo: [
      {
        title: "Paste JavaScript Code",
        desc: "Enter full JavaScript or TypeScript scripts into the input editor."
      },
      {
        title: "Select Minification & Strip Options",
        desc: "Toggle Remove Comments, Strip Console Logs (console.log), and Compress Whitespace."
      },
      {
        title: "Copy Production-Ready Script",
        desc: "Review the compressed one-line script and download a production .min.js file."
      }
    ],
    faq: [
      {
        question: "Does this minifier remove console.log statements?",
        answer: "Yes. You can enable the 'Strip Console Logs' option to remove debugging console calls from production builds."
      },
      {
        question: "How does JS minification reduce bundle size?",
        answer: "It strips comments, indentation, and unnecessary line breaks while preserving valid semicolon statement boundaries, significantly reducing file transfer size."
      },
      {
        question: "Does it support modern ES6+ syntax?",
        answer: "Yes. The parser supports modern ECMAScript features including arrow functions, classes, template literals, and async/await."
      },
      {
        question: "Can I preserve license header comments?",
        answer: "Yes. Comments marked with /*! are recognized as legal license headers and preserved at the top of the output file."
      },
      {
        question: "Is proprietary code uploaded to Zubware servers?",
        answer: "No. All minification executes client-side in browser memory with complete confidentiality."
      }
    ]
  },

  'html-minifier': {
    howTo: [
      {
        title: "Paste Raw HTML Markup",
        desc: "Input complete HTML pages or component templates into the compression box."
      },
      {
        title: "Select Compression Level",
        desc: "Toggle Remove HTML Comments, Collapse Whitespace, Strip Optional End Tags, and Minify Inline CSS/JS."
      },
      {
        title: "Copy Compact HTML & View Compression Ratio",
        desc: "Inspect the file size savings percentage and copy the compressed markup or download index.min.html."
      }
    ],
    faq: [
      {
        question: "How does HTML minification improve SEO and Core Web Vitals?",
        answer: "Smaller HTML documents reduce Time to First Byte (TTFB) and DOM parsing time, leading to faster First Contentful Paint (FCP) and improved mobile search rankings."
      },
      {
        question: "Does HTML minification break <pre> and <code> code blocks?",
        answer: "No. Text within <pre>, <code>, and <textarea> tags is protected to preserve code indentation and preformatted spacing."
      },
      {
        question: "Can it minify inline <style> and <script> tags simultaneously?",
        answer: "Yes. Enabling the inline minifier compresses embedded CSS stylesheets and JavaScript blocks within the HTML."
      },
      {
        question: "Does it remove conditional comments for legacy Internet Explorer?",
        answer: "You can choose to preserve conditional comments (<!--[if IE]>) or strip all comments completely."
      },
      {
        question: "Is my HTML source code secure?",
        answer: "Yes. All parsing and minification execute locally in your browser session."
      }
    ]
  },

  'sql-minifier': {
    howTo: [
      {
        title: "Paste Multi-Line SQL Script",
        desc: "Input formatted or indented SQL database queries and migration scripts."
      },
      {
        title: "Minify SQL Query",
        desc: "Click Minify SQL to strip line breaks, indentation, and single-line (-- ) and multi-line (/* */) comments."
      },
      {
        title: "Copy Single-Line Query String",
        desc: "Copy the compact single-line query string for embedding into application source code or API payloads."
      }
    ],
    faq: [
      {
        question: "Why minify SQL queries into single lines?",
        answer: "Single-line minified SQL strings are easy to embed into programming language source files, environment variables, and log strings without multi-line escaping errors."
      },
      {
        question: "Does the minifier remove SQL comments safely?",
        answer: "Yes. It removes single-line comments (-- comment) and block comments (/* comment */) without breaking string literals."
      },
      {
        question: "Are spaces preserved inside quoted text strings?",
        answer: "Yes. Spaces and punctuation inside single-quoted strings (e.g. 'New York City') are strictly preserved."
      },
      {
        question: "Does it support multiple SQL statements separated by semicolons?",
        answer: "Yes. Multiple queries separated by semicolons remain intact on a single line."
      },
      {
        question: "Is my SQL schema transmitted over the network?",
        answer: "No. Minification executes 100% locally in browser memory."
      }
    ]
  },

  'meta-tag-generator': {
    howTo: [
      {
        title: "Enter Webpage Title & Description",
        desc: "Input your target page title (50-60 characters) and compelling meta description (150-160 characters)."
      },
      {
        title: "Configure OpenGraph & Twitter Cards",
        desc: "Add canonical URL, social share image URL, site name, author, and select Twitter card format (summary_large_image)."
      },
      {
        title: "Copy HTML <head> Tags",
        desc: "Review live social card previews for Google, Facebook, and Twitter/X, and click Copy HTML Tags."
      }
    ],
    faq: [
      {
        question: "What are the recommended character lengths for SEO titles and meta descriptions?",
        answer: "Keep titles between 50 and 60 characters (to avoid search snippet truncation at 600px width) and meta descriptions between 140 and 160 characters for optimal display."
      },
      {
        question: "Which Open Graph (OG) tags are generated?",
        answer: "It generates og:title, og:description, og:url, og:image, og:type (website/article), and og:site_name for Facebook, LinkedIn, Discord, and Slack rich sharing previews."
      },
      {
        question: "What image dimensions are recommended for og:image?",
        answer: "The standard recommended Open Graph share image resolution is 1200 x 630 pixels (1.91:1 aspect ratio) for sharp display across mobile and desktop."
      },
      {
        question: "Does the generator include modern mobile viewport and robots tags?",
        answer: "Yes. It includes <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> and standard index/follow robots directives."
      },
      {
        question: "Is website metadata kept private during generation?",
        answer: "Yes. Tag synthesis runs client-side in your browser memory."
      }
    ]
  },

  'robots-txt-generator': {
    howTo: [
      {
        title: "Set Default Crawl Permissions",
        desc: "Choose Allow or Disallow as default crawler access and specify your crawl-delay rate."
      },
      {
        title: "Add Disallowed Directories & Bot Rules",
        desc: "Specify private paths to block (/admin/, /private/, /api/) and configure bot-specific rules (Googlebot, Bingbot, Baiduspider)."
      },
      {
        title: "Add Sitemap URL & Download robots.txt",
        desc: "Enter your full canonical XML sitemap URL (e.g. https://example.com/sitemap.xml) and download the validated robots.txt file."
      }
    ],
    faq: [
      {
        question: "Where should the robots.txt file be uploaded on a website?",
        answer: "The robots.txt file must be uploaded directly to the root directory of your website domain (e.g. https://yourdomain.com/robots.txt) so search crawlers can locate it."
      },
      {
        question: "Can I block specific directories while allowing others?",
        answer: "Yes. You can disallow private administrative sections (Disallow: /admin/) while allowing public content (Allow: /)."
      },
      {
        question: "How do I block AI scrapers in robots.txt?",
        answer: "You can add dedicated User-agent directives for AI scrapers (e.g. GPTBot, CCBot, ClaudeBot) with Disallow: / to prevent web crawling."
      },
      {
        question: "Does robots.txt guarantee that private pages won't be indexed?",
        answer: "Robots.txt tells ethical crawlers not to visit pages; if other sites link to the URL, search engines might still index the link. To completely prevent indexing, use a 'noindex' meta tag on the page."
      },
      {
        question: "Does this tool validate robots.txt syntax?",
        answer: "Yes. It formats standard User-agent, Disallow, Allow, Crawl-delay, and Sitemap directives conforming to Google Search specifications."
      }
    ]
  },

  'xml-sitemap-generator': {
    howTo: [
      {
        title: "Input Website URLs",
        desc: "Enter or paste your website's canonical URLs (one URL per line)."
      },
      {
        title: "Configure Priority, Frequency & Dates",
        desc: "Assign change frequency (daily, weekly, monthly), priority score (0.1 to 1.0), and last-modified dates."
      },
      {
        title: "Download Validated sitemap.xml",
        desc: "Review the compiled XML structure conforming to sitemaps.org protocols and download your sitemap.xml file."
      }
    ],
    faq: [
      {
        question: "What is the maximum number of URLs allowed in a single sitemap.xml file?",
        answer: "According to the official sitemaps.org protocol, a single sitemap file can contain up to 50,000 URLs and must not exceed 50MB uncompressed. Larger sites use sitemap index files."
      },
      {
        question: "What do the 'changefreq' and 'priority' tags signify?",
        answer: "changefreq provides a hint to search bots regarding how often page content updates; priority (0.0 to 1.0) signals the relative importance of a page within your own domain."
      },
      {
        question: "Does Google require the lastmod timestamp?",
        answer: "Google strongly recommends the lastmod attribute in W3C Datetime format (YYYY-MM-DD), using it to prioritize crawling newly published or updated pages."
      },
      {
        question: "Can I validate my generated sitemap before submitting to Google Search Console?",
        answer: "Yes. The generated XML strictly follows the http://www.sitemaps.org/schemas/sitemap/0.9 XML schema, ensuring immediate acceptance by Google and Bing."
      },
      {
        question: "Are my website URLs uploaded to a server?",
        answer: "No. XML sitemap generation runs client-side in browser memory with zero server access."
      }
    ]
  },

  'schema-markup-generator': {
    howTo: [
      {
        title: "Select Schema.org Structured Data Type",
        desc: "Choose from Article, Local Business, Product, FAQPage, Organization, Event, or Recipe."
      },
      {
        title: "Fill in Structured Schema Fields",
        desc: "Input required properties: Name, URL, Author, Pricing, Aggregate Rating, Reviews, or Questions & Answers."
      },
      {
        title: "Copy JSON-LD Script Tag",
        desc: "Review the formatted <script type=\"application/ld+json\"> snippet and click Copy for insertion into your page HTML."
      }
    ],
    faq: [
      {
        question: "Why is JSON-LD the recommended format for Schema.org markup?",
        answer: "Google explicitly recommends JSON-LD because it injects structured data cleanly inside a <script> block in the HTML head or body without interfering with visible page design."
      },
      {
        question: "What rich search snippets can Schema markup unlock in Google search results?",
        answer: "Proper schema can unlock rich snippets including star ratings, review counts, product pricing and stock status, interactive FAQ accordions, recipe cooking times, and event dates."
      },
      {
        question: "How do I test the generated JSON-LD code?",
        answer: "Copy the generated snippet and paste it directly into Google's official Rich Results Test or Schema.org Validator to verify compliance."
      },
      {
        question: "Can I generate FAQPage schema for multiple questions?",
        answer: "Yes. The FAQ generator lets you add unlimited question-and-answer pairs, outputting compliant Question and Answer entity arrays."
      },
      {
        question: "Is schema data generated locally?",
        answer: "Yes. All JSON serialization runs in your local browser runtime."
      }
    ]
  },

  'utm-builder': {
    howTo: [
      {
        title: "Enter Destination Webpage URL",
        desc: "Input the target landing page address (e.g. https://example.com/product)."
      },
      {
        title: "Configure Campaign UTM Parameters",
        desc: "Specify Campaign Source (google, newsletter), Medium (cpc, email, social), Campaign Name, and optional Term and Content."
      },
      {
        title: "Copy Tracked Campaign URL or Short Link",
        desc: "Inspect the validated campaign URL with encoded parameters and click Copy to clipboard for ads, emails, or social posts."
      }
    ],
    faq: [
      {
        question: "What are the core UTM parameters used for Google Analytics 4 (GA4)?",
        answer: "The core parameters are: utm_source (where traffic originates, e.g. twitter), utm_medium (marketing channel, e.g. cpc, email), and utm_campaign (specific campaign name, e.g. summer_sale)."
      },
      {
        question: "Are UTM parameters case-sensitive in Google Analytics?",
        answer: "Yes. Google Analytics treats 'Email', 'email', and 'EMAIL' as three separate mediums. The builder provides an option to force all parameters to lowercase for clean reporting."
      },
      {
        question: "How does the tool handle URLs that already contain existing query parameters?",
        answer: "It checks whether the base URL already contains a question mark (?); if so, it appends UTM parameters using ampersands (&) to preserve existing parameters."
      },
      {
        question: "What are utm_term and utm_content used for?",
        answer: "utm_term tracks paid search keywords; utm_content differentiates between distinct links or buttons pointing to the same URL in an A/B test or newsletter."
      },
      {
        question: "Are campaign URLs logged or tracked by Zubware?",
        answer: "No. URL construction is handled locally in your browser memory."
      }
    ]
  },

  'sha-checksum-generator': {
    howTo: [
      {
        title: "Enter Text or Select File",
        desc: "Type string data or upload any file to generate cryptographic checksum digests."
      },
      {
        title: "Calculate Multi-Algorithm SHA Digests",
        desc: "Compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes simultaneously in real time."
      },
      {
        title: "Copy Verified Checksum",
        desc: "Inspect the hexadecimal digests and click Copy next to your desired algorithm."
      }
    ],
    faq: [
      {
        question: "Which Secure Hash Algorithms (SHA) are computed by this tool?",
        answer: "It computes SHA-1 (160-bit), SHA-256 (256-bit), SHA-384 (384-bit), and SHA-512 (512-bit) hashes conforming to NIST FIPS PUB 180-4."
      },
      {
        question: "How does the browser calculate SHA digests without server uploads?",
        answer: "It utilizes the browser's native Web Crypto API (SubtleCrypto.digest), executing cryptographic hashing directly on your local hardware."
      },
      {
        question: "What is the difference between SHA-256 and SHA-512?",
        answer: "SHA-256 outputs a 64-character hex digest and is optimized for 32-bit architectures; SHA-512 outputs a 128-character hex digest with greater mathematical collision resistance and faster performance on 64-bit CPUs."
      },
      {
        question: "Can I generate checksums for large files?",
        answer: "Yes. Files are read via streaming FileReader chunks, allowing local hash generation for multi-gigabyte files."
      },
      {
        question: "Is my data or file uploaded to any external server?",
        answer: "No. All checksum calculations occur 100% locally in your browser."
      }
    ]
  }
};
