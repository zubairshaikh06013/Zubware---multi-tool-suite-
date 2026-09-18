import json
import re

with open('/tmp/tools_parsed.json') as f:
    tools = json.load(f)

print(f"Refining clean high-intent keywords for {len(tools)} tools...")

def clean_text(t):
    t = re.sub(r'[—–\-\|\:\,\(\)\/\"\'\.]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t.lower()

tool_keywords = {}

for tool in tools:
    tid = tool['id']
    title = tool['title']
    cat = tool['category']
    desc = tool['description']
    
    clean_t = clean_text(title)
    # Remove leading 'free ' or trailing ' online' for base root
    root_title = re.sub(r'^(free|online)\s+', '', clean_t)
    root_title = re.sub(r'\s+(free|online)$', '', root_title).strip()
    
    # Base ID phrase
    id_phrase = tid.replace('-', ' ')
    
    kws = []
    
    # 1. Primary Queries
    kws.append(id_phrase)
    kws.append(f"{id_phrase} online")
    kws.append(f"{id_phrase} free")
    
    if root_title != id_phrase and len(root_title) > 3:
        # Take first 3-4 words of root title
        short_root = " ".join(root_title.split()[:4])
        kws.append(short_root)
        kws.append(f"{short_root} online")
    
    # 2. Specific intent by category & functionality
    if 'pdf' in tid or 'PDF' in cat:
        kws.append("free pdf tools")
        kws.append("online pdf editor")
        kws.append("client side pdf")
        if any(w in tid for w in ['compress', 'decrease', 'size', 'adjuster']):
            kws.extend(["reduce pdf size in kb", "compress pdf online", "shrink pdf file", "pdf size reducer", "compress pdf without losing quality"])
        elif 'increase' in tid:
            kws.extend(["increase pdf file size in kb", "enlarge pdf size online", "boost pdf kb for job portal", "make pdf size bigger"])
        elif 'merge' in tid or 'combine' in tid:
            kws.extend(["merge pdf files online", "combine multiple pdf into one", "join pdf documents", "pdf joiner free"])
        elif 'split' in tid or 'extract' in tid or 'delete' in tid:
            kws.extend(["split pdf pages", "extract pages from pdf", "separate pdf document", "remove pages from pdf"])
        elif 'word' in tid:
            kws.extend(["convert pdf to word docx", "pdf to editable doc", "free pdf to word converter"])
        elif 'image' in tid or 'jpg' in tid:
            kws.extend(["convert jpg to pdf", "photos to pdf online", "combine images to single pdf"])
        elif 'excel' in tid:
            kws.extend(["convert pdf table to excel", "pdf to xlsx converter", "extract tables from pdf"])
        elif 'protect' in tid or 'unlock' in tid:
            kws.extend(["lock pdf with password", "remove password from pdf", "decrypt pdf online"])
        elif 'signature' in tid or 'sign' in tid:
            kws.extend(["sign pdf online free", "draw digital signature on pdf", "electronic signature pdf"])
            
    elif 'image' in tid or 'photo' in tid or 'Image' in cat:
        kws.append("free photo editor")
        kws.append("client side image tools")
        kws.append("no watermark photo tool")
        if 'compress' in tid:
            kws.extend(["compress jpg to 20kb", "reduce image size in kb", "compress photo for exam portal", "photo size reducer", "shrink image without quality loss"])
        elif 'resiz' in tid:
            kws.extend(["resize photo in cm and px", "passport photo resize", "image pixel dimension editor", "reduce photo dimensions"])
        elif 'converter' in tid or 'to-jpg' in tid:
            kws.extend(["convert image format online", "png to jpg converter", "webp to png converter", "heic to jpg iphone"])
        elif 'background' in tid or 'bg' in tid:
            kws.extend(["remove background free", "transparent png background", "ai background cutout", "change photo background color"])
        elif 'watermark' in tid:
            kws.extend(["add watermark to photo", "stamp logo on picture", "copyright photo watermark"])
        elif 'crop' in tid:
            kws.extend(["crop photo online free", "circular crop image", "aspect ratio photo cropper"])
        elif 'passport' in tid:
            kws.extend(["passport photo maker free", "indian passport photo size", "visa photo printable sheet", "id photo creator"])
        elif 'signature' in tid:
            kws.extend(["create digital signature online", "transparent signature maker", "crop and resize signature"])
            
    elif 'Audio' in cat or 'song' in tid or 'music' in tid or 'audio' in tid:
        kws.append("free audio editor")
        kws.append("browser audio converter")
        if 'lofi' in tid:
            kws.extend(["lofi beat maker", "make lofi music online", "lofi generator free", "chillhop beat maker", "ambient music generator"])
        elif 'slowed' in tid or 'reverb' in tid:
            kws.extend(["slowed and reverb audio converter", "daycore song maker", "reverb effect generator", "slow down mp3 songs"])
            
    elif 'Video' in cat or 'video' in tid:
        kws.append("browser video tools")
        kws.append("free video editor online")
        if 'compress' in tid:
            kws.extend(["compress mp4 video", "reduce video size in mb", "shrink video for whatsapp", "video file compressor"])
        elif 'trim' in tid:
            kws.extend(["cut video online", "trim mp4 segment", "video trimmer free no watermark"])
        elif 'aspect' in tid:
            kws.extend(["convert video to 9:16", "reels shorts aspect ratio", "change video dimensions"])
        elif 'audio' in tid:
            kws.extend(["extract audio from video", "convert mp4 to mp3 online", "video sound extractor"])
        elif 'gif' in tid:
            kws.extend(["convert video to gif", "create animated gif from mp4", "high quality video to gif"])
            
    elif 'youtube' in tid or 'Creator' in cat:
        kws.append("youtube creator tools")
        kws.append("social media growth tools")
        if 'tag' in tid or 'hashtag' in tid:
            kws.extend(["youtube tags generator", "viral video tags", "best tags for youtube video", "youtube tag finder"])
        elif 'title' in tid:
            kws.extend(["catchy youtube titles", "viral video title generator", "high ctr youtube title ideas"])
        elif 'thumbnail' in tid:
            kws.extend(["youtube thumbnail preview", "mobile feed simulator", "test thumbnail ctr", "youtube thumbnail checker"])
        elif 'banner' in tid:
            kws.extend(["youtube banner safe area", "channel art safe zone", "2560x1440 youtube banner preview"])
        elif 'bio' in tid:
            kws.extend(["link in bio generator", "instagram bio links", "creator link tree free"])
            
    elif 'Calculator' in title or 'calculator' in tid or 'ctc' in tid:
        kws.append("online calculator free")
        kws.append("instant calculation formula")
        if 'emi' in tid:
            kws.extend(["home loan emi calculator", "car loan emi calculator", "monthly emi formula", "sbi loan emi calculator"])
        elif 'gst' in tid:
            kws.extend(["gst tax calculator", "cgst sgst calculation", "gst invoice calculation free", "18 percent gst calculation"])
        elif 'age' in tid:
            kws.extend(["exact age calculator", "date of birth calculator", "calculate age in years months days", "current age finder"])
        elif 'ctc' in tid:
            kws.extend(["ctc to in hand salary calculator", "take home salary calculator", "pf and tax deduction calculation"])
        elif 'sip' in tid or 'compound' in tid or 'roi' in tid:
            kws.extend(["sip return calculator", "mutual fund investment returns", "compound interest formula calculator"])
        elif 'calorie' in tid or 'weight' in tid or 'diet' in tid:
            kws.extend(["calorie deficit calculator", "weight loss calorie calculator", "daily calorie requirement bmr"])
            
    elif 'resume' in tid or 'cv' in tid or 'Career' in cat or 'cover-letter' in tid:
        kws.append("free job application tools")
        kws.append("professional career tools")
        if 'ats' in tid or 'score' in tid or 'checker' in tid:
            kws.extend(["ats resume checker free", "resume score analyzer", "check resume ats score online", "ats friendly resume test"])
        elif 'builder' in tid:
            kws.extend(["free resume builder pdf", "modern cv maker online", "download resume in pdf", "fresher resume builder"])
        elif 'keyword' in tid:
            kws.extend(["resume keyword optimizer", "match resume with job description", "ats keyword scanner"])
            
    elif 'Developer' in cat or any(w in tid for w in ['json', 'sql', 'html', 'css', 'minifier', 'formatter', 'hash', 'base64', 'jwt']):
        kws.append("developer tools online")
        kws.append("web developer utility")
        if 'json' in tid:
            kws.extend(["json formatter online", "pretty print json", "json validator", "beautify json", "minify json"])
        elif 'sql' in tid:
            kws.extend(["sql query formatter", "beautify sql queries", "clean sql code online"])
        elif 'minifier' in tid:
            kws.extend(["minify code online", "compress code for seo", "reduce page load time"])
        elif 'hash' in tid:
            kws.extend(["generate sha256 hash", "md5 hash generator online", "checksum verifier"])
        elif 'jwt' in tid:
            kws.extend(["jwt token decoder", "decode json web token", "inspect jwt claims"])
            
    elif 'prompt' in tid or 'AI' in cat:
        kws.append("ai prompt generator")
        kws.append("prompt engineering templates")
        kws.append("chatgpt prompt templates")
        kws.append("structured ai prompts")
        
    elif 'text' in tid or 'Text' in cat:
        kws.append("text manipulation tools")
        kws.append("online text editor")
        if 'word' in tid or 'character' in tid or 'reading' in tid:
            kws.extend(["word counter online", "character count tool", "reading time estimator"])
        elif 'case' in tid:
            kws.extend(["convert uppercase to lowercase", "title case converter", "camelcase generator"])
        elif 'diff' in tid or 'compare' in tid:
            kws.extend(["compare two texts online", "text diff checker", "find difference in text"])

    # Clean & Deduplicate
    final_list = []
    seen = set()
    for kw in kws:
        k = re.sub(r'\s+', ' ', kw).strip().lower()
        if k and k not in seen and len(k) > 2 and 'free free' not in k and 'online online' not in k:
            seen.add(k)
            final_list.append(k)
            
    tool_keywords[tid] = final_list[:12]

# Format clean TypeScript output
output_lines = [
    "/**",
    " * Pre-audited, high-intent Keyword & Search Tag mappings for all Zubware tools.",
    " * Curated for optimal on-site search matching, SEO meta tags, and SERP discovery.",
    " * Total tools covered: " + str(len(tool_keywords)),
    " */",
    "export const TOOL_KEYWORDS: Record<string, string[]> = {"
]

for tid in sorted(tool_keywords.keys()):
    kws = tool_keywords[tid]
    kws_json = json.dumps(kws)
    output_lines.append(f"  '{tid}': {kws_json},")

output_lines.append("};")
output_lines.append("")
output_lines.append("/**")
output_lines.append(" * Returns curated search tags and keywords for any given tool.")
output_lines.append(" */")
output_lines.append("export function getToolKeywords(toolId: string): string[] {")
output_lines.append("  return TOOL_KEYWORDS[toolId] || [];")
output_lines.append("}")
output_lines.append("")

with open('src/lib/toolKeywords.ts', 'w') as f:
    f.write("\n".join(output_lines))

print("Successfully wrote updated src/lib/toolKeywords.ts")
