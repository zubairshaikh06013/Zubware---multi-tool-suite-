import { ToolUpdate } from './types';

export const CLUSTER_1A_DEV_TOOLS: Record<string, ToolUpdate> = {
  'uuid-generator': {
    howTo: [
      {
        title: "Select UUID Version & Quantity",
        desc: "Choose Version 4 (random cryptographically secure) or Version 1 (timestamp-based), and set the quantity from 1 to 500."
      },
      {
        title: "Configure Formatting Options",
        desc: "Toggle uppercase letters, hyphens, and brace enclosures ({uuid}) according to your database requirements."
      },
      {
        title: "Generate and Copy UUIDs",
        desc: "Click Generate to create collision-resistant identifiers and copy individual IDs or the complete batch."
      }
    ],
    faq: [
      {
        question: "How are UUID v4 identifiers generated in this tool?",
        answer: "UUID v4 identifiers are generated using the browser's native Web Crypto API (crypto.getRandomValues), providing 122 bits of cryptographic entropy."
      },
      {
        question: "What is the probability of a UUID v4 collision?",
        answer: "The collision probability is vanishingly small. Generating 1 billion UUIDs every second for 100 years yields a less than 50% chance of a single duplicate collision."
      },
      {
        question: "Can I generate bulk batches of UUIDs for database seeding?",
        answer: "Yes. You can generate up to 500 UUIDs in a single click, formatted as a newline-separated list or JSON array for SQL/NoSQL seeds."
      },
      {
        question: "What format options are supported?",
        answer: "You can toggle standard lowercase with hyphens (e.g. 550e8400-e29b-41d4-a716-446655440000), uppercase, hyphen-free 32-character strings, or braced formats."
      },
      {
        question: "Are generated UUIDs stored on a server?",
        answer: "No. All UUID string synthesis occurs 100% locally in your browser memory with zero network logging."
      }
    ]
  },

  'hash-generator': {
    howTo: [
      {
        title: "Enter Input Text or String",
        desc: "Type or paste your secret, password, or payload into the hash editor."
      },
      {
        title: "Select Cryptographic Hash Algorithm",
        desc: "Compute hashes across SHA-256, SHA-512, SHA-384, SHA-1, or MD5 simultaneously in real time."
      },
      {
        title: "Copy Hex Digest",
        desc: "Click Copy next to your desired algorithm hash to grab the verified hexadecimal checksum."
      }
    ],
    faq: [
      {
        question: "Which hash algorithms are supported by this generator?",
        answer: "It supports standard NIST algorithms including SHA-256, SHA-512, SHA-384, SHA-1, and legacy MD5 digests."
      },
      {
        question: "How does the hash generation execute securely?",
        answer: "Secure SHA-family hashes are computed directly via the browser's hardware-accelerated Web Crypto API (SubtleCrypto.digest)."
      },
      {
        question: "Can I hash UTF-8 characters and multi-line text?",
        answer: "Yes. The text is encoded using standard UTF-8 binary buffers before digest computation, ensuring cross-platform parity with OpenSSL and backend systems."
      },
      {
        question: "Is MD5 secure for password storage?",
        answer: "No. MD5 and SHA-1 have known collision vulnerabilities. Use SHA-256, SHA-512, or salted derivation algorithms like PBKDF2/bcrypt for security credentials."
      },
      {
        question: "Is my input text uploaded to an external server?",
        answer: "No. All hashing computations execute client-side in your browser; your plaintext is never transmitted."
      }
    ]
  },

  'jwt-decoder': {
    howTo: [
      {
        title: "Paste Encoded JWT Token",
        desc: "Input your JSON Web Token (header.payload.signature) into the decoder box."
      },
      {
        title: "Inspect Decoded Header & Claims",
        desc: "View parsed algorithm parameters (alg, typ) and payload claims (sub, iss, exp, iat, roles) formatted in clean JSON."
      },
      {
        title: "Verify Token Expiration Status",
        desc: "Check the visual expiration badge showing whether the token is currently active or expired, along with exact UTC timestamps."
      }
    ],
    faq: [
      {
        question: "Is it safe to decode private JWT tokens using this web tool?",
        answer: "Yes. This decoder operates 100% locally in your browser. It splits the token string and decodes the Base64URL payload using client-side JavaScript without network calls."
      },
      {
        question: "How does the tool parse expiration (exp) and issued-at (iat) timestamps?",
        answer: "Standard JWT Unix timestamps are converted into human-readable local and UTC date-times, displaying relative elapsed time (e.g. 'Expires in 42 minutes')."
      },
      {
        question: "Can this tool verify cryptographic JWT signatures?",
        answer: "This is a decoder and claims inspector. Cryptographic signature verification requires a matching public key or HMAC secret."
      },
      {
        question: "What does the red, purple, and blue color-coding signify?",
        answer: "Red highlights the JOSE Header, purple indicates the Claims Payload, and blue represents the Cryptographic Signature."
      },
      {
        question: "Does the tool support nested JSON claims and custom attributes?",
        answer: "Yes. Complex nested objects, arrays, and custom OAuth/OIDC claims are parsed and displayed in an interactive JSON tree."
      }
    ]
  },

  'regex-tester': {
    howTo: [
      {
        title: "Enter Regular Expression Pattern",
        desc: "Input your regex pattern and toggle standard flags: Global (g), Case-Insensitive (i), Multiline (m), and DotAll (s)."
      },
      {
        title: "Input Test String or Sample Text",
        desc: "Paste sample text to test your pattern against real-world data and edge cases."
      },
      {
        title: "Inspect Matches & Capture Groups",
        desc: "Review highlighted match spans, match count, execution time, and individual captured group arrays."
      }
    ],
    faq: [
      {
        question: "Which regex dialect does this tester use?",
        answer: "It uses modern ECMAScript (JavaScript) RegExp specifications, including named capture groups (?<name>), lookaheads (?=), lookbehinds (?<=), and Unicode property escapes."
      },
      {
        question: "Does the tester highlight multiple capture groups?",
        answer: "Yes. Matched text is visually highlighted with distinct color badges, and capture groups are broken down in an interactive results table."
      },
      {
        question: "Can I test regex substitution and replacement strings?",
        answer: "Yes. Switch to Replacement mode to test substitution syntax including $1 group variables and custom replacement logic."
      },
      {
        question: "Does the tester protect against catastrophic backtracking (ReDoS)?",
        answer: "Yes. Pattern matching runs inside a protected evaluation wrapper that aborts if an exponential backtracking freeze is detected."
      },
      {
        question: "Are my test data or regex patterns stored anywhere?",
        answer: "No. Regex compilation and text matching execute client-side in browser memory with complete confidentiality."
      }
    ]
  },

  'json-formatter': {
    howTo: [
      {
        title: "Paste Raw JSON Code",
        desc: "Enter unformatted, minified, or messy JSON into the input editor."
      },
      {
        title: "Select Indentation & Formatting Mode",
        desc: "Choose 2-space, 4-space, or tab indentation, and optionally sort object keys alphabetically."
      },
      {
        title: "Format, Validate & Copy Clean JSON",
        desc: "Click Format to beautify your data with syntax color coding and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "How does the JSON Formatter handle syntax errors?",
        answer: "If the input contains invalid syntax, the parser pinpoints the exact line number, column, and character token causing the parse failure."
      },
      {
        question: "Can I sort object keys alphabetically for consistent diff comparisons?",
        answer: "Yes. Toggling 'Sort Keys' recursively orders all JSON keys alphabetically, making it easy to compare API payloads."
      },
      {
        question: "What is the maximum JSON file size supported?",
        answer: "The tool handles multi-megabyte JSON payloads (10MB+) smoothly using native browser JSON.parse and JSON.stringify engines."
      },
      {
        question: "Can I toggle between formatted tree view and raw text?",
        answer: "Yes. You can switch between an interactive collapsible tree view and a formatted code editor."
      },
      {
        question: "Is my JSON payload uploaded to an external server?",
        answer: "No. All parsing and formatting occur 100% locally in your browser memory."
      }
    ]
  },

  'json-validator': {
    howTo: [
      {
        title: "Paste JSON to Validate",
        desc: "Input JSON configuration, API responses, or schema definitions into the validation pane."
      },
      {
        title: "Run Instant Syntax & Type Check",
        desc: "The parser verifies RFC 8259 syntax on every keystroke, checking quotes, braces, trailing commas, and escaped characters."
      },
      {
        title: "Locate & Fix Highlighted Errors",
        desc: "Inspect precise error banners highlighting line and column coordinates, or click 'Auto-Fix' to repair common syntax mistakes."
      }
    ],
    faq: [
      {
        question: "What common JSON errors does this validator detect?",
        answer: "It detects trailing commas, unquoted keys, single quotes instead of double quotes, unescaped control characters, and mismatched brackets."
      },
      {
        question: "Can the validator automatically fix common JSON mistakes?",
        answer: "Yes. The 'Auto-Fix' feature converts single quotes to double quotes, strips trailing commas, and wraps unquoted property names according to RFC standards."
      },
      {
        question: "Does the validator support JSON Schema validation?",
        answer: "Yes. You can provide an optional JSON Schema definition to validate data types, required fields, and array constraints."
      },
      {
        question: "Can I inspect object depth and element counts?",
        answer: "Yes. The statistics panel displays total keys, array lengths, object nesting depth, and character metrics."
      },
      {
        question: "Is sensitive configuration data kept secure?",
        answer: "Yes. Validation runs locally in your browser without any network communication."
      }
    ]
  },

  'json-to-csv': {
    howTo: [
      {
        title: "Paste JSON Array or Object",
        desc: "Enter a JSON array of objects or nested JSON records into the input pane."
      },
      {
        title: "Configure Delimiter & Header Options",
        desc: "Choose Comma (,), Semicolon (;), or Tab (TSV), and toggle flattened dot-notation for nested objects."
      },
      {
        title: "Download CSV Spreadsheet",
        desc: "Review the live table preview and click Download CSV to open directly in Excel or Google Sheets."
      }
    ],
    faq: [
      {
        question: "How does the tool handle nested JSON objects and arrays?",
        answer: "Nested objects are flattened into dot-notation column headers (e.g. 'user.address.city'), and array values are serialized cleanly into quoted comma-separated strings."
      },
      {
        question: "How are commas and quotes inside string fields escaped?",
        answer: "In compliance with RFC 4180, fields containing commas, line breaks, or quotation marks are wrapped in double quotes, with internal quotes escaped as double double-quotes (\"\")."
      },
      {
        question: "Can I customize the column delimiter for European Excel?",
        answer: "Yes. You can select semicolon (;) delimiter mode to ensure seamless spreadsheet opening in European locales."
      },
      {
        question: "Can I convert large JSON datasets?",
        answer: "Yes. Datasets containing thousands of rows are processed in milliseconds using streaming browser memory buffers."
      },
      {
        question: "Are database records uploaded to Zubware servers?",
        answer: "No. Conversion executes client-side with zero data transmission."
      }
    ]
  },

  'csv-to-json': {
    howTo: [
      {
        title: "Paste CSV Data or Upload File",
        desc: "Enter raw comma-separated text or upload a .csv / .tsv spreadsheet file."
      },
      {
        title: "Configure Parsing & Type Inference",
        desc: "Select delimiter (Auto, Comma, Tab, Semicolon), specify header row, and toggle automatic number/boolean type conversion."
      },
      {
        title: "Copy or Export Formatted JSON",
        desc: "Review the converted JSON array of objects and click Copy or Download as a .json file."
      }
    ],
    faq: [
      {
        question: "Does the converter automatically detect numbers and booleans?",
        answer: "Yes. The type inference engine converts numeric strings (e.g. '123' to 123) and boolean words ('true' to true) into native JSON primitives."
      },
      {
        question: "Can I choose between an Array of Objects and an Array of Arrays?",
        answer: "Yes. You can output an array of keyed objects ([{id: 1, name: 'Alice'}]) or a compact 2D array of rows ([['id', 'name'], [1, 'Alice']])."
      },
      {
        question: "How does the parser handle quoted fields with line breaks?",
        answer: "It follows the RFC 4180 specification, correctly preserving multi-line strings enclosed inside double quotes without splitting them into new records."
      },
      {
        question: "Can I convert Tab-Separated Values (TSV) from Excel?",
        answer: "Yes. The parser auto-detects tab delimiters when copying and pasting directly from spreadsheet software."
      },
      {
        question: "Is any spreadsheet data sent over the network?",
        answer: "No. File parsing and JSON serialization occur completely in your web browser."
      }
    ]
  },

  'csv-viewer': {
    howTo: [
      {
        title: "Open or Paste CSV File",
        desc: "Upload a CSV spreadsheet or paste raw tabular text directly into the viewer."
      },
      {
        title: "Search, Sort & Paginate Table",
        desc: "Click column headers to sort ascending/descending, filter rows with live search, and navigate pages."
      },
      {
        title: "Export Filtered View or JSON",
        desc: "Download the sorted data back to a clean CSV file or export selected rows as JSON."
      }
    ],
    faq: [
      {
        question: "Can this viewer open large CSV spreadsheets without freezing?",
        answer: "Yes. It uses virtualized table rendering and paginated data slicing to display files with tens of thousands of rows smoothly."
      },
      {
        question: "Can I search and filter specific columns?",
        answer: "Yes. The global search bar filters rows instantly across all columns, while column filters allow targeted data querying."
      },
      {
        question: "Does the viewer auto-detect delimiters like semicolons and tabs?",
        answer: "Yes. An automated sniffer inspects the first several rows to detect whether comma, semicolon, tab, or pipe is the primary delimiter."
      },
      {
        question: "Can I edit cell values directly in the table?",
        answer: "Yes. Double-click any table cell to edit its value and export the modified spreadsheet."
      },
      {
        question: "Are financial or customer spreadsheets secure?",
        answer: "Yes. File reading is performed exclusively via the browser's native FileReader API with 100% client-side privacy."
      }
    ]
  },

  'website-downloader': {
    howTo: [
      {
        title: "Enter Web Page URL",
        desc: "Type the full target website URL (including https://) into the downloader bar."
      },
      {
        title: "Select Download Assets to Package",
        desc: "Choose whether to bundle inline HTML, linked CSS stylesheets, JavaScript files, and images into a single zip archive."
      },
      {
        title: "Download Offline ZIP Archive",
        desc: "Click Download to fetch the webpage resources directly and download an organized offline archive."
      }
    ],
    faq: [
      {
        question: "How does the Website Downloader package web pages for offline viewing?",
        answer: "It fetches the primary HTML document, rewrites relative asset paths, bundles linked styles and scripts, and packages them into a portable ZIP archive."
      },
      {
        question: "Why might some websites fail to download due to CORS?",
        answer: "Web security standards enforce Cross-Origin Resource Sharing (CORS). Websites that explicitly forbid cross-origin browser requests cannot be scraped directly from a web client."
      },
      {
        question: "Does this downloader crawl entire multi-page websites?",
        answer: "This tool downloads single complete web pages and their immediate page assets rather than crawling multi-level domain hierarchies."
      },
      {
        question: "Can I open the downloaded HTML file directly in my browser without a server?",
        answer: "Yes. Extracted files use relative pathing, allowing you to double-click index.html to view the saved page offline."
      },
      {
        question: "Does Zubware log the URLs I download?",
        answer: "No. Network requests are dispatched directly between your browser and the target server."
      }
    ]
  },

  'html-formatter': {
    howTo: [
      {
        title: "Paste Raw HTML Code",
        desc: "Input minified, scraped, or unindented HTML markup into the editor."
      },
      {
        title: "Configure Indentation & Formatting Rules",
        desc: "Select 2 spaces, 4 spaces, or tabs, and toggle void tag style (HTML5 vs XHTML self-closing)."
      },
      {
        title: "Beautify & Copy Clean HTML",
        desc: "Click Format HTML to re-indent all nested tags and copy the clean markup to your clipboard."
      }
    ],
    faq: [
      {
        question: "Does the formatter format inline CSS and JavaScript?",
        answer: "Yes. Code blocks inside <style> and <script> tags are indented according to their respective CSS and JavaScript syntax rules."
      },
      {
        question: "How does it handle void self-closing tags like <img> and <input>?",
        answer: "You can configure standard modern HTML5 style (<img>) or strict XHTML style (<img />) for self-closing elements."
      },
      {
        question: "Does formatting preserve whitespace inside <pre> and <code> tags?",
        answer: "Yes. Preformatted blocks (<pre>, <code>, <textarea>) are protected to prevent breaking code indentation or whitespace layout."
      },
      {
        question: "Can I collapse multiple empty lines?",
        answer: "Yes. The formatter normalizes redundant consecutive blank lines to keep templates clean and readable."
      },
      {
        question: "Is HTML formatted client-side?",
        answer: "Yes. The parsing algorithm runs entirely in browser memory without sending code to an external server."
      }
    ]
  },

  'css-formatter': {
    howTo: [
      {
        title: "Paste CSS Stylesheet",
        desc: "Input unformatted, minified, or disorganized CSS, SCSS, or Less code."
      },
      {
        title: "Select Formatting Style",
        desc: "Choose Expanded (standard multi-line rules) or Compact (one-line selectors), and set indent spacing."
      },
      {
        title: "Beautify & Copy CSS",
        desc: "Review syntax-highlighted CSS with normalized property spacing and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "Can the formatter sort CSS properties alphabetically?",
        answer: "Yes. Toggling 'Sort Properties' orders declarations alphabetically (e.g. background, color, margin, padding) within each selector block."
      },
      {
        question: "Does it format CSS media queries and @keyframes correctly?",
        answer: "Yes. Nested @media, @supports, and @keyframes blocks are indented with hierarchical nesting."
      },
      {
        question: "How does it handle hex color case normalization?",
        answer: "You can choose to normalize all hex color codes to consistent lowercase (#fff) or uppercase (#FFF)."
      },
      {
        question: "Can I remove duplicate CSS selectors?",
        answer: "Yes. The deduplication filter identifies and reports duplicate selector declarations across your stylesheet."
      },
      {
        question: "Is my stylesheet processed locally?",
        answer: "Yes. CSS parsing and formatting execute 100% locally in your browser session."
      }
    ]
  },

  'javascript-formatter': {
    howTo: [
      {
        title: "Paste JavaScript or TypeScript",
        desc: "Enter unformatted, obfuscated, or minified JS/TS code into the editor."
      },
      {
        title: "Choose Indentation & Semicolon Rules",
        desc: "Set 2-space or 4-space indents, toggle single/double quote preferences, and choose semicolon insertion rules."
      },
      {
        title: "Format Code & Copy",
        desc: "Click Format to unpack minified bundles into readable code and copy the beautified script."
      }
    ],
    faq: [
      {
        question: "Can this formatter unpack and de-minify bundled JavaScript?",
        answer: "Yes. It unwraps minified one-line bundles, restoring clean indentation, statement line breaks, and bracket hierarchy."
      },
      {
        question: "Does it support modern ES6+ and TypeScript syntax?",
        answer: "Yes. It handles arrow functions, async/await, optional chaining (?.), nullish coalescing (??), and TypeScript type annotations."
      },
      {
        question: "Can I enforce semicolons or quote styles?",
        answer: "Yes. You can enforce trailing semicolons and normalize quotes to consistent single (') or double (\") quotes."
      },
      {
        question: "Does the formatter execute the JavaScript code?",
        answer: "No. The tool parses AST tokens purely as text for formatting purposes; it never executes the script, guaranteeing safety."
      },
      {
        question: "Is my proprietary script code transmitted to Zubware?",
        answer: "No. All formatting logic runs client-side in browser memory with complete privacy."
      }
    ]
  },

  'xml-formatter': {
    howTo: [
      {
        title: "Paste Raw XML or RSS Feed",
        desc: "Input unindented XML markup, SOAP payloads, SVG code, or sitemaps."
      },
      {
        title: "Configure Indentation Spacing",
        desc: "Choose 2-space, 4-space, or tab indentation and select self-closing tag handling."
      },
      {
        title: "Beautify & Copy Clean XML",
        desc: "Inspect the formatted XML tree with aligned attributes and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "Does the XML formatter validate tag hierarchy before formatting?",
        answer: "Yes. It checks for well-formed XML structure, flagging unclosed tags or mismatched elements with exact line error callouts."
      },
      {
        question: "Can it format CDATA blocks and XML comments properly?",
        answer: "Yes. CDATA sections (<![CDATA[...]]>) and comments (<!-- ... -->) are preserved with proper indentation."
      },
      {
        question: "Can I use this tool to format SVG vector files?",
        answer: "Yes. Because SVG is an XML-based vector format, you can format messy SVG files into clean readable markup."
      },
      {
        question: "Can I format attribute alignment across multiple lines?",
        answer: "Yes. Long tag elements with numerous XML attributes can be formatted with attributes aligned on separate lines for legibility."
      },
      {
        question: "Is XML data processed securely in the browser?",
        answer: "Yes. The XML parser operates client-side without sending data to an external server."
      }
    ]
  },

  'xml-validator': {
    howTo: [
      {
        title: "Paste XML Document",
        desc: "Input your XML document, configuration file, or API payload into the editor."
      },
      {
        title: "Run Real-Time Well-Formedness Check",
        desc: "The parser verifies tag pairing, attribute quoting, root element closure, and character encoding."
      },
      {
        title: "Review Line Errors & Fix",
        desc: "Inspect pinpointed error lines and error descriptions to correct syntax violations."
      }
    ],
    faq: [
      {
        question: "What does 'well-formed' XML mean?",
        answer: "A well-formed XML document strictly satisfies XML specifications: a single root element, all tags properly closed and correctly nested, attribute values quoted, and special characters escaped."
      },
      {
        question: "How does the validator report syntax errors?",
        answer: "It uses the browser's native DOMParser engine to return the exact line number, column, and description of the invalid token."
      },
      {
        question: "Does it check for illegal unescaped characters like < and &?",
        answer: "Yes. It alerts you to unescaped ampersands (&amp;) or angle brackets inside attribute values and text nodes."
      },
      {
        question: "Can I validate XML sitemaps and RSS feeds?",
        answer: "Yes. You can paste XML sitemaps or RSS feeds to confirm they are error-free before publishing."
      },
      {
        question: "Is my XML content private?",
        answer: "Yes. Validation executes entirely in your browser session with zero server tracking."
      }
    ]
  },

  'url-parser': {
    howTo: [
      {
        title: "Paste Full Target URL",
        desc: "Input any web address (e.g. https://example.com:8080/path/page?user=1&ref=tw#section) into the parser."
      },
      {
        title: "Inspect Deconstructed URL Components",
        desc: "Review parsed breakdown cards: Protocol, Hostname, Port, Pathname, Query String Parameters, and Hash Fragment."
      },
      {
        title: "Copy Query Parameters as JSON or Table",
        desc: "Inspect individual query key-value pairs, decode encoded URI values, and copy parameter data."
      }
    ],
    faq: [
      {
        question: "Which URL components does this parser deconstruct?",
        answer: "It breaks URLs down into Protocol (Scheme), Username, Password, Hostname, Port, Pathname, Search/Query string, and Hash fragment."
      },
      {
        question: "How does it handle URL-encoded query parameters?",
        answer: "It automatically decodes percent-encoded query keys and values (e.g. decoding %20 into spaces or %3D into equals signs) for clean readability."
      },
      {
        question: "Can I copy the parsed query parameters as a JSON object?",
        answer: "Yes. Click 'Export JSON' to copy all query parameters as a structured {key: value} JSON object."
      },
      {
        question: "Can I edit query parameters and reconstruct an updated URL?",
        answer: "Yes. You can add, edit, or remove parameter rows; the master URL updates in real time with correct URI encoding."
      },
      {
        question: "Are parsed URLs logged or tracked?",
        answer: "No. URL parsing uses the browser's native URL object locally with zero server communication."
      }
    ]
  },

  'url-encoder-decoder': {
    howTo: [
      {
        title: "Enter Text or URL String",
        desc: "Paste plaintext to encode or percent-encoded query strings to decode."
      },
      {
        title: "Select Encoding Standard",
        desc: "Choose encodeURIComponent (for query values) or encodeURI (for complete URLs), or switch to Decode mode."
      },
      {
        title: "Copy Converted String",
        desc: "Review the converted result and click Copy to clipboard for API queries or link construction."
      }
    ],
    faq: [
      {
        question: "What is the difference between encodeURI and encodeURIComponent?",
        answer: "encodeURI preserves protocol and path delimiters (: / ? & #) suitable for full web addresses. encodeURIComponent encodes all special characters into percent-escapes (%2F, %3F, %26), which is required when passing parameters inside query strings."
      },
      {
        question: "How does decoding handle plus signs (+) in query strings?",
        answer: "The decoder provides an option to treat plus signs as spaces, matching standard application/x-www-form-urlencoded form submission behavior."
      },
      {
        question: "Can I encode non-ASCII Unicode characters?",
        answer: "Yes. Characters like accented letters, emojis, and international scripts are encoded into standard UTF-8 percent-byte sequences."
      },
      {
        question: "Does it support batch multi-line URL decoding?",
        answer: "Yes. You can paste lists of multiple URLs on separate lines to encode or decode them all simultaneously."
      },
      {
        question: "Is text processing executed client-side?",
        answer: "Yes. All encoding and decoding execute in local browser memory with complete privacy."
      }
    ]
  },

  'base64-encoder-decoder': {
    howTo: [
      {
        title: "Enter Text or Upload File",
        desc: "Type or paste ASCII/Unicode text into the input editor or upload an image/document file."
      },
      {
        title: "Choose Encode or Decode Mode",
        desc: "Toggle between Encode (Plaintext to Base64) and Decode (Base64 to Plaintext), and configure URL-safe Base64 options."
      },
      {
        title: "Copy Base64 Output or Download File",
        desc: "Click Copy to grab the Base64 string or download decoded binary data as a local file."
      }
    ],
    faq: [
      {
        question: "Does this Base64 tool support UTF-8 characters and emojis?",
        answer: "Yes. Standard browser btoa() fails on multi-byte characters; this tool uses full UTF-8 byte encoding arrays so characters like é, ñ, and emojis convert without errors."
      },
      {
        question: "What is URL-Safe Base64 encoding?",
        answer: "URL-safe Base64 replaces standard characters + and / with - and _, and removes trailing padding (=), making the string safe for URL paths and JWT tokens."
      },
      {
        question: "Can I convert small images to Base64 Data URIs?",
        answer: "Yes. Uploading a PNG, JPG, or SVG generates a complete data:image/png;base64,... string ready for inline CSS or HTML."
      },
      {
        question: "Can I decode Base64 back into a downloadable binary file?",
        answer: "Yes. If the decoded data is binary, you can download the recovered file directly to your computer."
      },
      {
        question: "Are files or sensitive tokens uploaded to a server?",
        answer: "No. All Base64 conversions execute client-side in browser memory."
      }
    ]
  },

  'html-escape-unescape': {
    howTo: [
      {
        title: "Paste Raw HTML or Escaped Entities",
        desc: "Enter HTML code to escape for documentation, or paste escaped strings containing &lt;, &gt;, and &amp; to decode."
      },
      {
        title: "Select Escape or Unescape Mode",
        desc: "Toggle between escaping special markup characters and unescaping entities back into clean HTML tags."
      },
      {
        title: "Copy Converted Entity String",
        desc: "Review the converted text and click Copy to clipboard for safe insertion into HTML pre/code blocks."
      }
    ],
    faq: [
      {
        question: "Which characters are escaped by default?",
        answer: "It escapes reserved HTML characters: &amp; (&), &lt; (<), &gt; (>), &quot; (\"), and &#39; (') to prevent unintended HTML tag rendering."
      },
      {
        question: "Why is escaping HTML essential when displaying code examples on websites?",
        answer: "Without escaping, browsers interpret code brackets as real DOM elements rather than text, which breaks page layouts or exposes Cross-Site Scripting (XSS) vulnerabilities."
      },
      {
        question: "Can it decode named HTML entities (like &copy; and &euro;)?",
        answer: "Yes. The unescape engine decodes named entities, decimal entities (&#169;), and hexadecimal entities (&#xA9;) into their literal Unicode glyphs."
      },
      {
        question: "Is there a limit on the amount of code I can escape?",
        answer: "No. High-performance string replacement handles entire script files and template components in milliseconds."
      },
      {
        question: "Is code uploaded to an external server?",
        answer: "No. String replacement executes entirely within your browser session."
      }
    ]
  },

  'http-header-viewer': {
    howTo: [
      {
        title: "Enter Web Domain or URL",
        desc: "Type the target website address (e.g. https://example.com) into the header lookup field."
      },
      {
        title: "Fetch Response Headers",
        desc: "Click Inspect Headers to retrieve HTTP response status codes, cache directives, and server headers."
      },
      {
        title: "Analyze Security & Caching Headers",
        desc: "Inspect security badges for Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, and Cache-Control."
      }
    ],
    faq: [
      {
        question: "What security headers does this tool audit?",
        answer: "It audits crucial security headers including Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, and Referrer-Policy."
      },
      {
        question: "Can I inspect HTTP redirect response codes (301, 302)?",
        answer: "Yes. The tool reveals the HTTP status code (200 OK, 301 Permanent Redirect, 404 Not Found) along with server response latency."
      },
      {
        question: "How does it check caching configurations?",
        answer: "It parses Cache-Control directives (max-age, s-maxage, no-cache), ETag tags, and Last-Modified headers to verify CDN caching efficiency."
      },
      {
        question: "Can I copy individual header values?",
        answer: "Yes. You can click on any header row to copy its value or export all response headers as a clean JSON object."
      },
      {
        question: "Does Zubware record my header lookups?",
        answer: "No. Header lookups are performed directly between client requests and target endpoints without search logging."
      }
    ]
  },

  'api-request-builder': {
    howTo: [
      {
        title: "Select HTTP Method & Enter Endpoint",
        desc: "Choose GET, POST, PUT, PATCH, or DELETE, and input the target API endpoint URL."
      },
      {
        title: "Configure Headers, Auth & Body Payload",
        desc: "Add custom HTTP headers, Bearer token / Basic auth credentials, and JSON or form-data request body."
      },
      {
        title: "Send Request & Inspect Live Response",
        desc: "Click Send to inspect status code, round-trip latency, formatted JSON response body, and response headers."
      }
    ],
    faq: [
      {
        question: "Can I test authenticated API endpoints with Bearer tokens?",
        answer: "Yes. The Authorization tab allows you to configure Bearer tokens, Basic Auth (username/password), or custom API Key header pairs."
      },
      {
        question: "How does the tool handle browser CORS restrictions?",
        answer: "Because requests originate from your browser, target endpoints must support CORS (Access-Control-Allow-Origin). For restricted APIs, test endpoints that permit cross-origin calls."
      },
      {
        question: "Can I send JSON, form-data, and raw text payloads?",
        answer: "Yes. The body editor supports raw JSON (with real-time syntax validation), URL-encoded form data, and raw plain text."
      },
      {
        question: "Does it generate copyable curl commands?",
        answer: "Yes. Click 'Copy as cURL' to generate a complete command-line curl snippet matching your configured request."
      },
      {
        question: "Are API keys or payload data stored on Zubware servers?",
        answer: "No. Requests are dispatched directly from your browser to your endpoint. No keys, tokens, or request bodies are logged."
      }
    ]
  },

  'color-converter': {
    howTo: [
      {
        title: "Input Color in Any Format",
        desc: "Enter a HEX code, RGB/RGBA string, HSL/HSLA value, or select a shade with the visual color picker."
      },
      {
        title: "Inspect Synchronized Multi-Format Outputs",
        desc: "View instant synchronized conversions in HEX, RGB, HSL, HSV, CMYK, and CSS Color Name."
      },
      {
        title: "Copy Formatted Code & Check Contrast",
        desc: "Click Copy on your desired color format and inspect WCAG legibility over black and white backgrounds."
      }
    ],
    faq: [
      {
        question: "Which color models are supported by the converter?",
        answer: "It converts between HEX (#RRGGBB, #RRGGBBAA), RGB/RGBA, HSL/HSLA, HSV/HSB, and 4-color CMYK printing values."
      },
      {
        question: "How are alpha channel transparency values converted?",
        answer: "Alpha values are accurately preserved across formats: 8-digit HEX (#ffffff80) maps to rgba(255, 255, 255, 0.5) and hsla(0, 0%, 100%, 0.5)."
      },
      {
        question: "Does the tool check WCAG accessibility contrast?",
        answer: "Yes. It calculates real-time relative luminance and shows contrast ratio scores against pure black (#000) and pure white (#fff)."
      },
      {
        question: "Can I generate a monochromatic shade ramp for the color?",
        answer: "Yes. Every converted color generates an automated 10-step lighter tint and darker shade spectrum."
      },
      {
        question: "Does color conversion run offline?",
        answer: "Yes. Mathematical color space conversions execute locally in your browser JavaScript engine."
      }
    ]
  },

  'qr-code-decoder': {
    howTo: [
      {
        title: "Upload QR Code Image or Paste from Clipboard",
        desc: "Select a photo, screenshot, or graphic containing a QR code, or paste directly with Ctrl+V / Cmd+V."
      },
      {
        title: "Inspect Decoded Data & Payload Type",
        desc: "The decoder identifies the QR matrix and reveals the embedded text, URL, vCard, or WiFi network credentials."
      },
      {
        title: "Copy Extracted Data or Open Link",
        desc: "Click Copy to grab the raw decoded text or click the open button to visit the link safely."
      }
    ],
    faq: [
      {
        question: "Can this tool decode QR codes from screenshots and saved images?",
        answer: "Yes. You can upload any image file (PNG, JPG, WebP, GIF) or paste a screenshot from your clipboard to extract the embedded data."
      },
      {
        question: "Can it decode blurry, angled, or low-contrast QR codes?",
        answer: "The image pre-processor applies automatic binarization, adaptive contrast thresholding, and perspective correction to read challenging scans."
      },
      {
        question: "Does the decoder format vCard contact cards and WiFi credentials?",
        answer: "Yes. It parses structured payloads and organizes vCard contacts and WiFi passwords into readable fields."
      },
      {
        question: "Can I scan using my device camera?",
        answer: "Yes. Toggle 'Live Camera' to decode QR codes in real time through your laptop webcam or smartphone browser."
      },
      {
        question: "Is the uploaded image sent to an external server?",
        answer: "No. The QR matrix analysis runs 100% locally in browser memory via client-side JavaScript."
      }
    ]
  },

  'json-minifier': {
    howTo: [
      {
        title: "Paste Formatted JSON",
        desc: "Input indented or multi-line JSON into the compression editor."
      },
      {
        title: "Minify JSON & Strip Whitespace",
        desc: "Click Minify to remove all unnecessary whitespace, tabs, and line breaks while preserving string literals."
      },
      {
        title: "Copy Compact Payload & View Size Savings",
        desc: "Inspect the file size reduction percentage and click Copy to grab the minified single-line JSON string."
      }
    ],
    faq: [
      {
        question: "How does JSON minification reduce file size?",
        answer: "It removes all formatting spaces, indents, and newline characters between syntax tokens, typically reducing JSON payload size by 20% to 45% for faster network transit."
      },
      {
        question: "Does minifying JSON alter data or string contents?",
        answer: "No. Spaces and line breaks located inside string values (e.g. \"message\": \"hello world\") are strictly preserved; only structural whitespace is stripped."
      },
      {
        question: "Does the minifier validate JSON syntax before compressing?",
        answer: "Yes. It runs a full JSON syntax verification pass; if invalid syntax is found, it alerts you to the error location before minifying."
      },
      {
        question: "Can I copy the minified string or download a .min.json file?",
        answer: "Yes. You can copy the single-line string with one click or download a production-ready .min.json file."
      },
      {
        question: "Is my JSON processed privately?",
        answer: "Yes. Minification executes entirely client-side using native JSON serialization."
      }
    ]
  },

  'json-to-xml': {
    howTo: [
      {
        title: "Paste Valid JSON",
        desc: "Enter a JSON object or array of records into the input pane."
      },
      {
        title: "Configure Root Tag & Attribute Rules",
        desc: "Specify your custom root wrapper element name (e.g. <root> or <response>) and choose element vs attribute mapping."
      },
      {
        title: "Copy or Download Clean XML",
        desc: "Review the formatted XML output with proper tag hierarchy and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "How does the tool handle JSON arrays when converting to XML?",
        answer: "Array elements are mapped into repeated child elements wrapped under the parent tag (e.g. a 'users' array produces multiple sequential <user> tags)."
      },
      {
        question: "Can I define a custom root element name?",
        answer: "Yes. You can specify any valid XML tag name for the document root element (defaulting to <root>)."
      },
      {
        question: "How are special characters in JSON strings escaped in XML?",
        answer: "Characters like <, >, &, and quotes inside JSON strings are automatically escaped into compliant XML entities (&lt;, &gt;, &amp;)."
      },
      {
        question: "Can I download the resulting XML as a file?",
        answer: "Yes. You can copy the text or download a clean .xml document directly to your device."
      },
      {
        question: "Is my data sent to an external server?",
        answer: "No. All conversion logic runs client-side in browser memory with zero server access."
      }
    ]
  }
};
