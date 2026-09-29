import { ToolUpdate } from './types';

export const CLUSTER_4_PROMPT_TOOLS: Record<string, ToolUpdate> = {
  'chatgpt-prompt-builder': {
    howTo: [
      {
        title: "Define Persona & Goal",
        desc: "Select your expert persona (e.g. Senior Software Engineer or Marketing Strategist) and state your primary objective."
      },
      {
        title: "Add Context & Constraints",
        desc: "Specify domain background, negative constraints, preferred tone, and toggle Chain-of-Thought reasoning or few-shot examples."
      },
      {
        title: "Generate & Copy Structured Prompt",
        desc: "Review the assembled prompt block in the live preview panel and click Copy to clipboard to paste into ChatGPT."
      }
    ],
    faq: [
      {
        question: "How does structured prompt engineering improve ChatGPT output quality?",
        answer: "Explicitly defining persona, goal, context, constraints, and format eliminates ambiguity, guiding the model toward accurate, detailed responses while reducing hallucinations."
      },
      {
        question: "What does the Chain-of-Thought reasoning toggle do?",
        answer: "It injects instructions directing the model to outline its analytical strategy step-by-step before delivering the final answer, which boosts logic and math accuracy."
      },
      {
        question: "Can I use these prompts across GPT-4o, GPT-4, and GPT-3.5?",
        answer: "Yes. The generated prompt structures follow universal prompt design best practices that perform reliably across all OpenAI model versions."
      },
      {
        question: "Does this tool make calls to the OpenAI API?",
        answer: "No. This tool is a client-side prompt builder that formats and optimizes your prompt text locally; you paste the resulting prompt into ChatGPT."
      },
      {
        question: "Is my proprietary prompt content stored on Zubware servers?",
        answer: "No. All text fields and generated prompt blocks remain in local browser state with zero server-side transmission."
      }
    ]
  },

  'gemini-prompt-builder': {
    howTo: [
      {
        title: "Set Persona & Core Objective",
        desc: "Choose an expert role and define the exact task or query for Google Gemini."
      },
      {
        title: "Specify Multimodal & Research Context",
        desc: "Provide source context, cite data references, select output structure, and toggle step-by-step reasoning."
      },
      {
        title: "Copy Optimized Gemini Prompt",
        desc: "Review the formatted prompt and click Copy to clipboard for instant use in Google Gemini or Google AI Studio."
      }
    ],
    faq: [
      {
        question: "How is this prompt builder optimized specifically for Google Gemini models?",
        answer: "It organizes prompts into clean markdown sections with bracketed system instructions ([ROLE], [CONTEXT], [CONSTRAINTS]) that align with Gemini 1.5 Pro and Flash attention mechanisms."
      },
      {
        question: "Can I use these prompts with image and document uploads in Gemini?",
        answer: "Yes. The prompt framework includes sections for referencing attached screenshots, PDFs, or spreadsheets so Gemini analyzes them systematically."
      },
      {
        question: "Does the builder support few-shot examples?",
        answer: "Yes. You can add input/output demonstrations to teach Gemini custom formatting styles or specialized classification schemas."
      },
      {
        question: "Is an API key required to use this tool?",
        answer: "No. The builder operates purely in your browser as a structured template generator without requiring any API keys."
      },
      {
        question: "Are my draft prompts kept private?",
        answer: "Yes. All prompt text and selections remain strictly on your local device."
      }
    ]
  },

  'claude-prompt-builder': {
    howTo: [
      {
        title: "Define Expert Persona & Mission",
        desc: "Select an expert archetype and define the primary analytical or writing objective."
      },
      {
        title: "Configure XML Tag Structuring",
        desc: "Enable XML tag wrappers (<context>, <instructions>, <rules>) to maximize Claude's context comprehension."
      },
      {
        title: "Copy Anthropic-Optimized Prompt",
        desc: "Inspect the assembled prompt and click Copy for use in Claude 3.5 Sonnet, Opus, or Haiku."
      }
    ],
    faq: [
      {
        question: "Why does the builder use XML tags for Claude prompts?",
        answer: "Anthropic explicitly recommends XML tags (like <context>, <rules>, <scratchpad>) because Claude's architecture parses structured XML tags with exceptional precision."
      },
      {
        question: "What is the purpose of the 'scratchpad' or thinking section?",
        answer: "It prompts Claude to think through the problem internally inside <thinking> tags before writing its final response, yielding higher accuracy on complex queries."
      },
      {
        question: "Can I specify strict negative constraints in Claude prompts?",
        answer: "Yes. The constraints section generates explicit negative rules (e.g. 'Never apologize', 'Do not summarize') which Claude follows reliably."
      },
      {
        question: "Is this tool compatible with Claude Artifacts?",
        answer: "Yes. You can specify output formats like standalone HTML/React code or Markdown documentation that Claude renders cleanly inside Artifacts."
      },
      {
        question: "Are my prompts recorded on an external server?",
        answer: "No. All text formatting runs locally in your browser memory."
      }
    ]
  },

  'veo-prompt-builder': {
    howTo: [
      {
        title: "Describe Scene Subject & Action",
        desc: "Enter your primary subject, environment, and physical movement sequence for Google Veo video generation."
      },
      {
        title: "Set Camera Movement & Cinematography",
        desc: "Choose lens focal length, camera motion (Drone Orbit, Tracking Shot, Steadicam, Slow Dolly), lighting, and atmosphere."
      },
      {
        title: "Copy Cinematic Video Prompt",
        desc: "Review the compiled cinematic prompt with framerate and resolution descriptors and copy it with one click."
      }
    ],
    faq: [
      {
        question: "What parameters are critical for generating high-definition video with Google Veo?",
        answer: "Veo responds best to descriptive camera motion (e.g. 'slow drone push-in at 24fps'), specific lighting cues (e.g. 'golden hour volumetric light'), and explicit temporal action descriptions."
      },
      {
        question: "Can I specify aspect ratios like 16:9 widescreen or 9:16 vertical?",
        answer: "Yes. The builder formats technical aspect ratio directives for cinematic widescreen or vertical mobile video."
      },
      {
        question: "Does the builder include negative prompts to avoid visual artifacts?",
        answer: "Yes. You can append negative cues to filter out jitter, frame distortion, morphing limbs, and unnatural speed fluctuations."
      },
      {
        question: "Is this prompt builder connected to Google Cloud or Veo servers?",
        answer: "No. It is a local template engineering tool that crafts the prompt text you input into video generation platforms."
      },
      {
        question: "Can I save my favorite video camera movement combinations?",
        answer: "Yes. Your active settings persist in browser memory so you can generate cohesive sequential video scene prompts."
      }
    ]
  },

  'midjourney-prompt-builder': {
    howTo: [
      {
        title: "Describe Subject & Environment",
        desc: "Enter your core visual concept, characters, architectural elements, and background setting."
      },
      {
        title: "Select Art Style, Lighting & Parameters",
        desc: "Pick artistic medium (Hyperrealistic Photo, Oil, Anime), lighting style, and set --ar, --v, --stylize, and --chaos flags."
      },
      {
        title: "Copy Formatted /imagine Prompt",
        desc: "Review the full Midjourney command with appended parameter flags and click Copy to clipboard for Discord."
      }
    ],
    faq: [
      {
        question: "Which Midjourney parameter flags does this builder support?",
        answer: "It supports aspect ratios (--ar 16:9, --ar 9:16), version selection (--v 6), stylize intensity (--s 250), chaos randomization (--c 10), and weirdness (--w)."
      },
      {
        question: "How does weight weighting (--no, ::) work in Midjourney prompts?",
        answer: "You can append negative weights with --no (e.g. --no text, blur) and assign relative emphasis to concepts using double-colon weights (e.g. cyberpunk::2)."
      },
      {
        question: "Does the builder organize descriptive keywords effectively?",
        answer: "Yes. It arranges prompts in recommended Midjourney order: Core Subject → Environment & Lighting → Art Medium/Artist Reference → Technical Parameter Flags."
      },
      {
        question: "Can I copy the prompt with the /imagine prefix included?",
        answer: "Yes. The one-click copy button includes '/imagine prompt: ' so you can paste directly into Discord without typing commands."
      },
      {
        question: "Is any prompt data sent to external servers?",
        answer: "No. All parameter string concatenation executes client-side in your web browser."
      }
    ]
  },

  'flux-prompt-builder': {
    howTo: [
      {
        title: "Input Image Concept & Scene Details",
        desc: "Type your visual subject, composition, background textures, and emotional tone."
      },
      {
        title: "Configure Photographic & Stylistic Cues",
        desc: "Specify natural lighting, camera sensor specs (e.g. 35mm lens, f/1.8), color grading, and style realism."
      },
      {
        title: "Copy Natural Language Flux Prompt",
        desc: "Review the prompt engineered for Flux.1 Schnell, Dev, or Pro and copy the text for your image generator."
      }
    ],
    faq: [
      {
        question: "Why does Flux prefer natural language descriptions over tag lists?",
        answer: "Black Forest Labs' Flux models use a modern T5 text encoder that excels at parsing fluent, natural descriptive sentences rather than comma-separated booru tags."
      },
      {
        question: "Can Flux render readable in-image text?",
        answer: "Yes. The builder lets you wrap target text in quotation marks (e.g. a neon sign reading \"COFFEE\"), which Flux renders with high typographic accuracy."
      },
      {
        question: "How should photographic lighting be described for Flux?",
        answer: "Describe physical light sources naturally (e.g. 'soft morning diffuse light streaming through blinds with subtle dust motes') rather than generic buzzwords like 'hyperrealistic'."
      },
      {
        question: "Which Flux model tiers is this prompt compatible with?",
        answer: "The generated prompts work seamlessly across Flux.1 [pro], Flux.1 [dev], and Flux.1 [schnell] platforms."
      },
      {
        question: "Does the tool transmit my image prompt ideas anywhere?",
        answer: "No. All prompt assembly is performed locally in browser memory."
      }
    ]
  },

  'stable-diffusion-prompt-builder': {
    howTo: [
      {
        title: "Enter Subject & Art Direction",
        desc: "Specify your character, setting, art style (photorealistic, digital illustration, concept art), and color palette."
      },
      {
        title: "Configure Keyword Weights & Negative Prompt",
        desc: "Adjust emphasis parentheses (keyword:1.2), select camera optics, and generate an automated negative prompt."
      },
      {
        title: "Copy Positive & Negative Prompts",
        desc: "Click Copy Positive Prompt or Copy Negative Prompt to paste directly into Automatic1111, ComfyUI, or Fooocus."
      }
    ],
    faq: [
      {
        question: "How do keyword emphasis weights work in Stable Diffusion?",
        answer: "Enclosing words in parentheses with weight values (e.g. (masterpiece:1.2), (detailed eyes:1.1)) instructs the CLIP text encoder to prioritize those tokens during image generation."
      },
      {
        question: "What does the negative prompt do in SDXL and SD 1.5?",
        answer: "Negative prompts guide the reverse diffusion process away from unwanted features, removing artifacts like extra fingers, mutated anatomy, blur, and watermarks."
      },
      {
        question: "Is this compatible with SDXL, SD 1.5, and SD 3?",
        answer: "Yes. You can toggle SDXL natural sentence mode or SD 1.5 tag-weighted syntax depending on your local model checkpoint."
      },
      {
        question: "Can I copy positive and negative prompts separately?",
        answer: "Yes. Dedicated copy buttons let you grab the positive prompt block and negative prompt block independently."
      },
      {
        question: "Are prompt configurations saved on a server?",
        answer: "No. Everything runs client-side in your browser with complete privacy."
      }
    ]
  },

  'logo-prompt-builder': {
    howTo: [
      {
        title: "Enter Brand Name & Industry",
        desc: "Input your business or project name, company niche, and brand core values."
      },
      {
        title: "Select Logo Aesthetic & Style",
        desc: "Choose from Minimalist Flat Vector, Mascot Emblem, Monogram Lettermark, Geometric Abstract, or Vintage Badge."
      },
      {
        title: "Copy AI Image Logo Prompt",
        desc: "Review the engineered prompt featuring white background isolation directives and copy it for Midjourney or DALL-E."
      }
    ],
    faq: [
      {
        question: "Why does the logo prompt builder specify a pure white background?",
        answer: "Specifying an isolated pure white background (hex #FFFFFF) ensures the generated logo can be easily traced to vector (SVG) or transparent PNG without messy background artifacts."
      },
      {
        question: "What logo design styles are supported?",
        answer: "Styles include Modern Minimalist, Geometric Wordmark, Monogram Emblem, Vintage Retro Badge, 3D App Icon, and Corporate Tech Mascot."
      },
      {
        question: "Does the prompt enforce flat 2D vector aesthetics?",
        answer: "Yes. It injects negative constraints against gradients, photo textures, realistic 3D shading, and noisy backgrounds when 2D vector mode is chosen."
      },
      {
        question: "Can I use these prompts in Midjourney, DALL-E 3, and Flux?",
        answer: "Yes. The generated prompts follow universal graphic design prompt standards that translate cleanly across all major text-to-image engines."
      },
      {
        question: "Are my company branding ideas uploaded anywhere?",
        answer: "No. All prompt assembly is processed entirely inside your local browser."
      }
    ]
  },

  'thumbnail-prompt-builder': {
    howTo: [
      {
        title: "Input Video Topic & Hook",
        desc: "Enter your YouTube or social video subject, emotional hook, and primary thumbnail concept."
      },
      {
        title: "Select Composition & Facial Expression",
        desc: "Choose camera framing (Extreme Close-Up, Split-Screen), expressive facial reaction, high-contrast lighting, and 16:9 aspect ratio."
      },
      {
        title: "Copy High-CTR Thumbnail Prompt",
        desc: "Review the final prompt optimized for visual click-through rate and copy it for your image generator."
      }
    ],
    faq: [
      {
        question: "What visual elements make an AI-generated thumbnail click-worthy?",
        answer: "High-CTR thumbnails require high contrast, clean focal separation between subject and background, bold expressive faces, and vibrant lighting that stays legible on small mobile screens."
      },
      {
        question: "Does the builder automatically enforce 16:9 widescreen proportions?",
        answer: "Yes. It automatically includes the widescreen parameter (--ar 16:9) matching standard YouTube thumbnail dimensions (1280x720)."
      },
      {
        question: "Can I specify room for text overlay in the composition?",
        answer: "Yes. Composition presets let you place the main subject on the right or left third (Rule of Thirds), leaving negative space for bold headline text."
      },
      {
        question: "Can I generate split-screen Before vs After thumbnail prompts?",
        answer: "Yes. The comparison mode structures dual-scene prompts showing stark before-and-after contrasts."
      },
      {
        question: "Is my thumbnail prompt idea kept confidential?",
        answer: "Yes. All prompt construction runs in local browser state with zero external logging."
      }
    ]
  },

  'product-photo-prompt-builder': {
    howTo: [
      {
        title: "Enter Product Details",
        desc: "Describe your product category (cosmetics, electronics, beverage, apparel) and physical materials."
      },
      {
        title: "Choose Studio Setting & Lighting",
        desc: "Select studio podium, natural lifestyle interior, outdoor nature setting, softbox lighting, and camera depth-of-field."
      },
      {
        title: "Copy Commercial Photography Prompt",
        desc: "Review the commercial advertising prompt and copy it to generate realistic product mockups."
      }
    ],
    faq: [
      {
        question: "What lighting setups are included for commercial product photography?",
        answer: "It includes luxury studio softbox lighting, natural window backlight, dramatic moody rim light, high-key white e-commerce lighting, and golden hour sunlight."
      },
      {
        question: "Can I specify pedestal materials like marble, concrete, or wood?",
        answer: "Yes. You can select podium surfaces including polished marble, rough textured stone, acrylic glass, water splash ripples, or natural wood."
      },
      {
        question: "Does the prompt enforce shallow depth of field?",
        answer: "Yes. It includes camera lens parameters (e.g. 85mm macro lens, f/2.8) to blur busy background distractions and focus crisp detail on the product packaging."
      },
      {
        question: "Can I use these prompts for Amazon and Shopify listing mockups?",
        answer: "Yes. Switch to 'Clean White E-Commerce' mode to generate compliant white-background product shots for digital store listings."
      },
      {
        question: "Are product names or descriptions transmitted to Zubware?",
        answer: "No. All text formatting operates 100% locally in your web browser."
      }
    ]
  },

  'interior-design-prompt-builder': {
    howTo: [
      {
        title: "Select Room Type & Dimensions",
        desc: "Choose Living Room, Master Bedroom, Modern Kitchen, Luxury Bathroom, or Home Office."
      },
      {
        title: "Choose Architecture Style & Palette",
        desc: "Select Japandi, Scandinavian, Industrial Loft, Mid-Century Modern, or Biophilic, and configure natural lighting."
      },
      {
        title: "Copy Architectural Interior Prompt",
        desc: "Inspect the detailed architectural prompt with wide-angle lens specs and copy it to your clipboard."
      }
    ],
    faq: [
      {
        question: "Which interior design architectural styles are supported?",
        answer: "It supports Japandi, Scandinavian Minimalist, Mid-Century Modern, Industrial Urban Loft, Contemporary Luxury, Biophilic Modern, and French Provincial."
      },
      {
        question: "Does the prompt specify wide-angle architectural lens optics?",
        answer: "Yes. It includes professional architectural photography directives (e.g. 24mm tilt-shift lens, eye-level perspective) to render realistic room proportions."
      },
      {
        question: "Can I configure specific interior finishes like oak flooring and brass fixtures?",
        answer: "Yes. Material selectors let you specify concrete, herringbone hardwood, polished plaster, boucle fabrics, and custom metal hardware."
      },
      {
        question: "Can I specify time of day and natural window light?",
        answer: "Yes. You can select morning sunrise sunlight, bright afternoon daylight, dusk twilight with warm interior lamps, or moody overcast lighting."
      },
      {
        question: "Are design prompts stored on external servers?",
        answer: "No. All prompt assembly executes locally in client-side memory."
      }
    ]
  },

  'story-prompt-builder': {
    howTo: [
      {
        title: "Select Genre & Core Premise",
        desc: "Pick Sci-Fi, Fantasy, Thriller, Historical, Romance, or Horror, and summarize your central conflict."
      },
      {
        title: "Define Characters, Setting & Pacing",
        desc: "Configure protagonist motivations, primary antagonist, atmospheric setting, narrative point-of-view, and plot twists."
      },
      {
        title: "Copy Creative Writing Master Prompt",
        desc: "Review the comprehensive fiction-writing prompt and copy it for ChatGPT, Claude, or local LLMs."
      }
    ],
    faq: [
      {
        question: "How does this builder prevent generic or cliché AI story outputs?",
        answer: "It injects directives for showing rather than telling, subverting genre clichés, establishing distinct sensory details, and maintaining authentic character dialogue voices."
      },
      {
        question: "Can I choose narrative point-of-view (POV)?",
        answer: "Yes. You can toggle First Person ('I'), Third Person Limited, or Third Person Omniscient perspective."
      },
      {
        question: "Does the prompt include pacing and three-act structure guidance?",
        answer: "Yes. You can select classic Three-Act structure, the Hero's Journey, or episodic chapter-by-chapter scene breakdowns."
      },
      {
        question: "Can I generate dialogue-heavy scene prompts?",
        answer: "Yes. Tone options let you emphasize snappy character banter, philosophical dialogue, or descriptive atmospheric exposition."
      },
      {
        question: "Is my original fiction manuscript idea private?",
        answer: "Yes. All creative writing prompts are constructed entirely in your browser without external transmission."
      }
    ]
  },

  'youtube-script-prompt-builder': {
    howTo: [
      {
        title: "Enter Video Topic & Target Audience",
        desc: "State your video subject, target viewer demographic, and estimated video runtime."
      },
      {
        title: "Select Script Structure & Retention Hooks",
        desc: "Choose 5-second Hook style, Storytelling pacing, B-Roll callouts, and Call-to-Action placement."
      },
      {
        title: "Copy Complete YouTube Production Prompt",
        desc: "Review the scriptwriting prompt and copy it into your AI assistant for full script generation."
      }
    ],
    faq: [
      {
        question: "How does the builder optimize for YouTube audience retention?",
        answer: "It structures prompts to generate instant opening hooks (first 5-15 seconds), open story loops, curiosity gaps, and fast-paced transitions that minimize viewer drop-off."
      },
      {
        question: "Does the prompt output visual B-Roll and editing cues?",
        answer: "Yes. It instructs the AI model to include bracketed [Visual: B-roll / Motion Graphics] and [Sound Effect] suggestions alongside narration copy."
      },
      {
        question: "Can I specify target video duration and word count?",
        answer: "Yes. Durations (e.g. 5 minutes, 10 minutes, or 15+ minutes) automatically calibrate target script word counts based on a 140 WPM spoken pace."
      },
      {
        question: "Can I generate YouTube Shorts and TikTok 60-second scripts?",
        answer: "Yes. Toggle 'Short-Form Video' mode to structure fast 30-to-60 second vertical scripts with continuous visual scene shifts."
      },
      {
        question: "Are video script topics kept private?",
        answer: "Yes. Script prompt generation executes 100% locally in your browser."
      }
    ]
  },

  'resume-prompt-builder': {
    howTo: [
      {
        title: "Input Target Role & Experience Level",
        desc: "Specify your desired job title, target industry, and career seniority level."
      },
      {
        title: "Paste Raw Experience & Key Skills",
        desc: "Provide rough bullet points, job duties, metrics, and target job description keywords."
      },
      {
        title: "Copy Executive Resume Prompt",
        desc: "Review the prompt engineered to produce high-impact, metrics-driven XYZ bullet points and copy it."
      }
    ],
    faq: [
      {
        question: "What is Google's XYZ formula for resume bullet points?",
        answer: "The XYZ formula instructs: 'Accomplished [X] as measured by [Y], by doing [Z]'. The prompt directs the AI to transform vague duties into quantified business accomplishments."
      },
      {
        question: "Does the prompt optimize for Applicant Tracking Systems (ATS)?",
        answer: "Yes. It instructs the model to incorporate keywords from your target job description and use standard, scannable chronological section headings."
      },
      {
        question: "Can I use this for career transitions into new industries?",
        answer: "Yes. The career changer option emphasizes transferable technical and leadership skills while de-emphasizing non-relevant historical duties."
      },
      {
        question: "Does this prompt builder generate real executive summaries?",
        answer: "Yes. It includes templates for compelling 3-line professional career summaries highlighting core strengths and industry specialization."
      },
      {
        question: "Is my personal employment history uploaded to any server?",
        answer: "No. All text parsing and prompt assembly occur client-side in your active browser tab."
      }
    ]
  },

  'cover-letter-prompt-builder': {
    howTo: [
      {
        title: "Enter Job Title & Company Name",
        desc: "Provide the target employer, position title, and company culture context."
      },
      {
        title: "Highlight Value Proposition & Experience",
        desc: "Input your top 2-3 career accomplishments and why you are drawn to this organization."
      },
      {
        title: "Copy Tailored Cover Letter Prompt",
        desc: "Review the cover letter prompt and copy it to generate an authentic, non-generic letter in ChatGPT or Claude."
      }
    ],
    faq: [
      {
        question: "How does this builder avoid generic, robotic cover letters?",
        answer: "It requires specific company mission details and quantifiable past wins, instructing the AI model to write in an authentic, confident human voice without clichés."
      },
      {
        question: "Can I adjust the tone between formal and modern startup?",
        answer: "Yes. You can select Corporate Professional, Modern Startup, Academic/Scientific, or Creative conversational tone."
      },
      {
        question: "How long is the generated cover letter?",
        answer: "The prompt specifies standard single-page hiring manager length (250-350 words, 3 to 4 concise paragraphs)."
      },
      {
        question: "Can I address potential resume gaps or career changes?",
        answer: "Yes. The transition module frames career breaks or pivoting skill sets positively as adaptable problem-solving strengths."
      },
      {
        question: "Is my application data kept confidential?",
        answer: "Yes. No company names, user resumes, or cover letter drafts are sent to external servers."
      }
    ]
  },

  'email-prompt-builder': {
    howTo: [
      {
        title: "Choose Email Category & Objective",
        desc: "Select Cold Outreach, Client Follow-Up, Executive Update, Salary Negotiation, or Customer Support."
      },
      {
        title: "Set Recipient Persona & Desired Call to Action",
        desc: "Define the recipient's role, tone (Casual, Professional, Urgent, Diplomatic), and your exact desired next step."
      },
      {
        title: "Copy High-Response Email Prompt",
        desc: "Review the email generation prompt with subject line options and copy it with one click."
      }
    ],
    faq: [
      {
        question: "Which email templates are supported?",
        answer: "It supports sales cold outreach, networking requests, polite invoice payment reminders, project status summaries, and executive escalations."
      },
      {
        question: "Does the prompt ask for multiple subject line variants?",
        answer: "Yes. The prompt instructs the AI to propose 3 high-open-rate subject lines with differing curiosity and urgency levels."
      },
      {
        question: "Can I constrain email length to prevent wordy messages?",
        answer: "Yes. You can enforce a strict brevity limit (e.g. under 125 words) to ensure high mobile readability and reply rates."
      },
      {
        question: "How does it handle polite but firm follow-up emails?",
        answer: "The follow-up module provides context-aware phrasing that follows up warmly without sounding accusatory or desperate."
      },
      {
        question: "Is my private correspondence uploaded anywhere?",
        answer: "No. All prompt assembly executes locally in browser memory."
      }
    ]
  },

  'social-media-prompt-builder': {
    howTo: [
      {
        title: "Select Social Platform & Content Pillar",
        desc: "Choose LinkedIn, Twitter/X, Instagram, Facebook, or Threads, and specify your content topic."
      },
      {
        title: "Configure Hook Style, Formatting & Hashtags",
        desc: "Select single post, multi-tweet thread, or carousel script, set emoji frequency, and define call-to-action."
      },
      {
        title: "Copy Viral Social Post Prompt",
        desc: "Review the platform-native social media prompt and copy it into your AI assistant."
      }
    ],
    faq: [
      {
        question: "How does the builder adapt prompts for specific social networks?",
        answer: "Each platform uses native formatting guidelines: Twitter/X enforces 280-character thread blocks, LinkedIn prioritizes professional line-spaced storytelling, and Instagram emphasizes visual caption storytelling."
      },
      {
        question: "Can I generate multi-part Twitter/X threads?",
        answer: "Yes. The thread mode instructs the model to write a magnetic opening hook tweet, 5-8 structured value tweets, and a concluding recap CTA tweet."
      },
      {
        question: "Can I control emoji usage and visual spacing?",
        answer: "Yes. You can select 'Minimal / Professional', 'Moderate Accents', or 'Vibrant / High Engagement' emoji levels."
      },
      {
        question: "Does the prompt suggest relevant hashtags?",
        answer: "Yes. It directs the AI to research and provide 3-5 high-relevance niche hashtags matching the core topic."
      },
      {
        question: "Are social media post ideas stored on a server?",
        answer: "No. Prompt compilation runs 100% locally in your browser."
      }
    ]
  },

  'seo-prompt-builder': {
    howTo: [
      {
        title: "Enter Target Keyword & Search Intent",
        desc: "Specify your primary target keyword, secondary keywords, and search intent (Informational, Commercial, or Transactional)."
      },
      {
        title: "Configure Article Scope & Schema Directives",
        desc: "Set word count, outline depth, H2/H3 subheadings, FAQ schema questions, and competitor differentiator angles."
      },
      {
        title: "Copy Comprehensive SEO Writing Prompt",
        desc: "Review the search-optimized content prompt and copy it for ChatGPT, Claude, or Gemini."
      }
    ],
    faq: [
      {
        question: "How does this builder ensure compliance with Google's helpful content guidelines?",
        answer: "The prompt instructs the AI to provide direct answers, cite practical examples, offer unique expert insights (EEAT), and avoid repetitive keyword stuffing."
      },
      {
        question: "Does the prompt generate FAQ schema sections?",
        answer: "Yes. It directs the model to extract common 'People Also Ask' questions and answer them concisely in ready-to-use FAQ schema formats."
      },
      {
        question: "Can I specify internal linking placeholder directives?",
        answer: "Yes. The prompt instructs the model to indicate natural anchor text placements for linking to related website resources."
      },
      {
        question: "What search intent classifications are available?",
        answer: "You can select Informational (guides, tutorials), Commercial (reviews, comparisons), Transactional (buy/pricing), or Navigational intents."
      },
      {
        question: "Is my proprietary keyword research data stored on a database?",
        answer: "No. All text inputs remain strictly in local browser memory with zero tracking."
      }
    ]
  },

  'coding-prompt-builder': {
    howTo: [
      {
        title: "Select Language, Framework & Architecture",
        desc: "Choose programming language (TypeScript, Python, Go, Rust, React, Next.js) and architecture design patterns."
      },
      {
        title: "Specify Problem, Inputs & Edge Cases",
        desc: "Describe function requirements, input/output data types, performance constraints, and error handling rules."
      },
      {
        title: "Copy Production-Grade Code Prompt",
        desc: "Review the technical engineering prompt demanding clean typed code and unit tests, and copy it."
      }
    ],
    faq: [
      {
        question: "How does this builder prevent hallucinated code and syntax bugs?",
        answer: "It requires strict typing (TypeScript, mypy), forbids deprecated APIs, demands production error handling, and instructs the model to include runnable test suites."
      },
      {
        question: "Can I request specific testing frameworks like Jest, Vitest, or PyTest?",
        answer: "Yes. The testing directive instructs the AI to generate complete unit test suites with mock assertions alongside the core implementation."
      },
      {
        question: "Can I generate prompts for refactoring or debugging existing code?",
        answer: "Yes. Toggle 'Refactor & Optimize' mode to paste existing legacy code and request Big-O algorithmic optimization, readability improvements, or bug identification."
      },
      {
        question: "Does the prompt demand clean, commented code without fluff?",
        answer: "Yes. It instructs the model to provide raw code blocks with concise inline architectural explanations, omitting unnecessary conversational filler."
      },
      {
        question: "Is my proprietary codebase or code snippet uploaded to Zubware?",
        answer: "No. All prompt construction runs client-side in browser memory with zero server access."
      }
    ]
  },

  'universal-prompt-builder': {
    howTo: [
      {
        title: "Define Role & Primary Task",
        desc: "State the expert persona and clearly describe what you want the AI assistant to accomplish."
      },
      {
        title: "Add Context, Rules & Formatting Requirements",
        desc: "Provide background information, negative constraints, desired tone, and exact output format (Table, Markdown, Code, JSON)."
      },
      {
        title: "Copy Master Prompt for Any LLM",
        desc: "Review the universally structured prompt and copy it for use in any AI model or chat platform."
      }
    ],
    faq: [
      {
        question: "Why is the Universal Prompt Builder compatible with all AI models?",
        answer: "It utilizes the universal PREP framework (Persona, Request, Explanation, Proof/Format), which aligns with the core instruction-tuning algorithms of all modern LLMs."
      },
      {
        question: "Can I generate JSON schema outputs for API automation?",
        answer: "Yes. Select 'Strict JSON' in the output format selector to instruct the model to return valid, unescaped JSON matching your required schema."
      },
      {
        question: "Does the universal builder support step-by-step reasoning?",
        answer: "Yes. You can toggle Chain-of-Thought reasoning to ensure models break complex multi-part questions into logical steps before concluding."
      },
      {
        question: "Can I save custom prompt templates for repeat tasks?",
        answer: "Yes. The integrated prompt library allows you to bookmark custom configurations in local browser storage for quick reuse."
      },
      {
        question: "Are universal prompt drafts sent over the internet?",
        answer: "No. String compilation is executed 100% locally in your web browser."
      }
    ]
  }
};
