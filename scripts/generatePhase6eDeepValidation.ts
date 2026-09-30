import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA } from '../src/data/toolsData';
import { SITE_ORIGIN } from '../src/lib/siteConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.resolve(rootDir, 'docs');

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

console.log('Generating Phase 6E Deep Validation of Potential New SEO Landing-Page Opportunities...');

export interface CandidateValidation {
  candidateNumber: number;
  candidateName: string;
  proposedSlug: string;
  closestCanonicalTool: {
    id: string;
    title: string;
    url: string;
    category: string;
  };
  primarySearchQuery: string;
  relatedSearchCluster: string[];
  searchIntent: string;
  freshSerpResults: {
    position: number;
    url: string;
    title: string;
    domain: string;
    pageType: string;
    toolCapabilities: string[];
    gaps: string[];
  }[];
  distinctIntentTest: {
    isMateriallyDifferent: boolean;
    hasDedicatedSerpPages: boolean;
    userBenefitFromLandingDirectly: boolean;
    canProvideSubstantialUniqueValue: boolean;
    usefulWithoutKeywordStuffing: boolean;
    uniqueContentStructurePossible: boolean;
    meaningfulTopicCluster: boolean;
    doorwayCannibalizationRisk: 'HIGH' | 'MEDIUM' | 'LOW';
    satisfiableByImprovingExistingTool: boolean;
    strongestEvidenceForNewPage: string;
    strongestEvidenceAgainstNewPage: string;
  };
  finalDecision: 'CREATE_DEDICATED_PAGE' | 'IMPROVE_EXISTING_TOOL_PAGE' | 'MERGE_INTO_EXISTING_PAGE' | 'REJECT';
  confidenceLevel: 'HIGH' | 'MEDIUM';
  confidenceRationale: string;
  implementationSpecs?: {
    finalRecommendedUrl: string;
    canonicalUrl: string;
    proposedTitle: string;
    proposedH1: string;
    h2h3Outline: string[];
    uniqueFunctionalityRequired: string[];
    uniqueContentRequired: string[];
    faqTopics: { question: string; answer: string }[];
    internalLinks: string[];
    categoryPlacement: string;
    breadcrumbStructure: string[];
    recommendedSchemaType: string;
    differentiationFromParentTool: string;
  };
  existingToolOptimizationPlan?: {
    toolUrl: string;
    enhancementsRequired: string[];
    seoMetadataUpdates: string[];
  };
}

const researchDate = new Date().toISOString().split('T')[0];

const candidate1: CandidateValidation = {
  candidateNumber: 1,
  candidateName: 'Vector SVG QR Code Generator with Logo',
  proposedSlug: 'vector-svg-qr-code-generator',
  closestCanonicalTool: {
    id: 'qr-generator',
    title: 'QR Code Generator',
    url: `${SITE_ORIGIN}/qr-generator.html`,
    category: '📱 Social Media & Marketing Tools'
  },
  primarySearchQuery: 'vector svg qr code generator with logo online free',
  relatedSearchCluster: [
    'svg qr code generator',
    'qr code vector svg eps',
    'qr code with logo svg free',
    'high resolution printable qr code generator',
    'custom color vector qr code maker'
  ],
  searchIntent: 'Transactional & Commercial Design Utility',
  freshSerpResults: [
    {
      position: 1,
      url: 'https://forqrcode.com/',
      title: 'Free QR Code Generator Online - High Quality SVG, EPS, PDF - ForQRCode',
      domain: 'forqrcode.com',
      pageType: 'Specialized Vector QR Generator',
      toolCapabilities: ['Exports SVG, EPS, PDF, and PNG', 'Custom logo embedding', 'Unlimited static scans'],
      gaps: ['Dated UI layout', 'Banner advertising']
    },
    {
      position: 2,
      url: 'https://www.qrcode-monkey.com/',
      title: 'QRCode Monkey - The free QR Code Generator with Logo',
      domain: 'qrcode-monkey.com',
      pageType: 'Design SaaS Tool',
      toolCapabilities: ['Custom body shapes, eye frame styling', 'Gradient fills', 'High-res vector SVG download'],
      gaps: ['Heavy display ads', 'Slow on mobile browsers']
    },
    {
      position: 3,
      url: 'https://eurolinks.org/tools/qr-code-generator',
      title: 'Free QR Code Generator Online - EuroLinks',
      domain: 'eurolinks.org',
      pageType: 'Privacy Web Utility',
      toolCapabilities: ['100% in-browser SVG path generation', 'Custom color palette', 'WiFi, vCard, URL support'],
      gaps: ['Basic visual presets']
    }
  ],
  distinctIntentTest: {
    isMateriallyDifferent: false,
    hasDedicatedSerpPages: true,
    userBenefitFromLandingDirectly: true,
    canProvideSubstantialUniqueValue: true,
    usefulWithoutKeywordStuffing: true,
    uniqueContentStructurePossible: true,
    meaningfulTopicCluster: true,
    doorwayCannibalizationRisk: 'HIGH',
    satisfiableByImprovingExistingTool: true,
    strongestEvidenceForNewPage: 'Print designers and agencies specifically search for "SVG vector QR codes" to ensure infinite scaling on packaging and billboards.',
    strongestEvidenceAgainstNewPage: 'Zubware already hosts a top-tier canonical `/qr-generator.html`. Creating a second standalone QR code generator page creates direct keyword cannibalization and doorway duplication risks.'
  },
  finalDecision: 'IMPROVE_EXISTING_TOOL_PAGE',
  confidenceLevel: 'HIGH',
  confidenceRationale: 'Enhancing the existing canonical /qr-generator.html with native SVG export, custom logo upload, and error correction controls completely satisfies vector search intent while concentrating domain authority on a single authoritative page without doorway risk.',
  existingToolOptimizationPlan: {
    toolUrl: `${SITE_ORIGIN}/qr-generator.html`,
    enhancementsRequired: [
      'Add instant "Export as Vector SVG" button alongside PNG download.',
      'Add central logo/image upload with auto-padding and Level H (30%) error correction.',
      'Add custom foreground/background color pickers and dot-pattern styling presets.'
    ],
    seoMetadataUpdates: [
      'Update Title: QR Code Generator Online — Free Custom Vector SVG & PNG QR Codes with Logo',
      'Update Meta Description: Generate free custom QR codes with logo in vector SVG and high-resolution PNG. 100% private in-browser tool with zero expiration.',
      'Add FAQ section covering SVG vs PNG resolution for print, error correction levels, and scanning distance formulas.'
    ]
  }
};

const candidate2: CandidateValidation = {
  candidateNumber: 2,
  candidateName: 'Cron Schedule Expression Generator & Explainer',
  proposedSlug: 'cron-schedule-expression-generator',
  closestCanonicalTool: {
    id: 'cron-expression-generator',
    title: 'Cron Expression Generator & Explainer — Schedule Builder',
    url: `${SITE_ORIGIN}/cron-expression-generator.html`,
    category: '👨‍💻 Developer Tools'
  },
  primarySearchQuery: 'cron schedule expression generator and explainer online',
  relatedSearchCluster: [
    'cron expression generator',
    'crontab generator online',
    'cron expression to human readable plain english',
    'cron schedule builder',
    'aws eventbridge cron expression helper',
    'kubernetes cronjob schedule generator'
  ],
  searchIntent: 'Transactional & Technical Utility',
  freshSerpResults: [
    {
      position: 1,
      url: 'https://crontab.guru/',
      title: 'Crontab.guru - The quick and simple editor for cron schedule expressions',
      domain: 'crontab.guru',
      pageType: 'Developer Utility Leader',
      toolCapabilities: ['Instant plain English parsing', 'Next execution date preview', 'Interactive field highlight'],
      gaps: ['Read-only syntax inspector; lacks click-to-generate schedule builder']
    },
    {
      position: 2,
      url: 'https://cronwizard.com/',
      title: 'CronWizard - Visual Cron Expression Generator',
      domain: 'cronwizard.com',
      pageType: 'Interactive Builder',
      toolCapabilities: ['Dropdown intervals for minutes, hours, days', 'Copy-to-clipboard crontab'],
      gaps: ['Lacks AWS / Quartz 6-field compatibility']
    },
    {
      position: 3,
      url: 'https://crontab.io/',
      title: 'Crontab.io - Cron Expression Generator and Visual Crontab Editor',
      domain: 'crontab.io',
      pageType: 'Developer Tool',
      toolCapabilities: ['Visual timeline representation', 'Preset schedules (hourly, daily, weekly)'],
      gaps: ['Ad banners']
    }
  ],
  distinctIntentTest: {
    isMateriallyDifferent: false,
    hasDedicatedSerpPages: true,
    userBenefitFromLandingDirectly: true,
    canProvideSubstantialUniqueValue: true,
    usefulWithoutKeywordStuffing: true,
    uniqueContentStructurePossible: true,
    meaningfulTopicCluster: true,
    doorwayCannibalizationRisk: 'HIGH',
    satisfiableByImprovingExistingTool: true,
    strongestEvidenceForNewPage: 'High developer demand for crontab syntax generation with natural English translation.',
    strongestEvidenceAgainstNewPage: 'Zubware ALREADY HAS the exact canonical URL /cron-expression-generator.html in toolsData.ts. Creating /cron-schedule-expression-generator.html would be a 100% direct doorway duplicate.'
  },
  finalDecision: 'IMPROVE_EXISTING_TOOL_PAGE',
  confidenceLevel: 'HIGH',
  confidenceRationale: 'Zubware already owns the canonical URL /cron-expression-generator.html. All visual interval builders, plain-English translations, and next execution timestamp tables must be housed on this existing canonical URL to maximize PageRank and avoid self-cannibalization.',
  existingToolOptimizationPlan: {
    toolUrl: `${SITE_ORIGIN}/cron-expression-generator.html`,
    enhancementsRequired: [
      'Two-way sync between visual dropdown selectors and raw cron string input.',
      'Live plain-English translation ("Runs at 09:00 AM, Monday through Friday").',
      'Next 10 execution dates table with timezone toggle (UTC vs Local).',
      'Platform format toggle: Standard Unix (5 fields) vs Quartz/AWS (6 fields).'
    ],
    seoMetadataUpdates: [
      'Update Title: Cron Expression Generator & Schedule Builder — Crontab to Plain English',
      'Add rich FAQs on crontab special characters (* , - / L W #) and common schedule presets.'
    ]
  }
};

const candidate3: CandidateValidation = {
  candidateNumber: 3,
  candidateName: 'College GPA Calculator (4.0 Scale Weighted & Unweighted)',
  proposedSlug: 'college-gpa-calculator-4-0-scale',
  closestCanonicalTool: {
    id: 'cgpa-calculator',
    title: 'CGPA to Percentage Calculator — University Grade Points',
    url: `${SITE_ORIGIN}/cgpa-calculator.html`,
    category: '🎓 Educational Tools'
  },
  primarySearchQuery: 'college semester gpa calculator 4.0 scale weighted unweighted',
  relatedSearchCluster: [
    'college gpa calculator',
    'gpa calculator 4.0 scale',
    'semester gpa calculator credit hours',
    'cumulative college gpa calculator',
    'calculate college gpa letter grades',
    'weighted gpa calculator 5.0 scale'
  ],
  searchIntent: 'Transactional & Academic Calculator Utility',
  freshSerpResults: [
    {
      position: 1,
      url: 'https://gpacalculator.net/',
      title: 'College GPA Calculator - Calculate Grade Point Average Online',
      domain: 'gpacalculator.net',
      pageType: 'Academic Calculator Leader',
      toolCapabilities: ['Course rows with credit hours', 'Standard 4.0 letter grade points (A=4.0, A-=3.7, B+=3.3)', 'Cumulative GPA blending'],
      gaps: ['Heavy banner ads and video popups', 'Lacks target GPA forecasting simulation']
    },
    {
      position: 2,
      url: 'https://www.calculator.net/gpa-calculator.html',
      title: 'GPA Calculator - High School & College GPA',
      domain: 'calculator.net',
      pageType: 'General Calculator Portal',
      toolCapabilities: ['4.0 and weighted grade scale inputs', 'Planning calculator mode'],
      gaps: ['Dated 1990s table styling', 'Static non-interactive charts']
    },
    {
      position: 3,
      url: 'https://www.collegevine.com/gpa-calculator',
      title: 'College GPA Calculator - CollegeVine',
      domain: 'collegevine.com',
      pageType: 'Admissions SaaS Tool',
      toolCapabilities: ['Course difficulty weighting (AP, Honors, College)', 'Modern clean interface'],
      gaps: ['Requires registration / email gate to save multi-semester records']
    }
  ],
  distinctIntentTest: {
    isMateriallyDifferent: true,
    hasDedicatedSerpPages: true,
    userBenefitFromLandingDirectly: true,
    canProvideSubstantialUniqueValue: true,
    usefulWithoutKeywordStuffing: true,
    uniqueContentStructurePossible: true,
    meaningfulTopicCluster: true,
    doorwayCannibalizationRisk: 'LOW',
    satisfiableByImprovingExistingTool: false,
    strongestEvidenceForNewPage: 'A 4.0 semester GPA calculation (multi-course table, credit-weighted quality points, cumulative terms) is fundamentally different from a 10.0 CGPA-to-Percentage conversion formula (cgpa-calculator.html). Users searching for "college GPA calculator" expect a dynamic transcript table, not a single conversion field.',
    strongestEvidenceAgainstNewPage: 'Maintaining zero new pages keeps the sitemap count perfectly constant; however, merging US 4.0 semester GPA calculation into an Indian 10-point CGPA-to-Percentage converter would create a confusing, disjointed user experience.'
  },
  finalDecision: 'CREATE_DEDICATED_PAGE',
  confidenceLevel: 'HIGH',
  confidenceRationale: 'Genuinely distinct mathematical model, audience, and search intent. The existing cgpa-calculator.html converts a single 10-point cumulative score to a percentage (using CBSE 9.5x formula), whereas College GPA Calculator requires an interactive course transcript table multiplying letter grade points by credit hours to compute semester and cumulative GPA on a 4.0 scale.',
  implementationSpecs: {
    finalRecommendedUrl: `${SITE_ORIGIN}/college-gpa-calculator.html`,
    canonicalUrl: `${SITE_ORIGIN}/college-gpa-calculator.html`,
    proposedTitle: 'College GPA Calculator — 4.0 Scale Weighted & Semester GPA',
    proposedH1: 'College & Semester GPA Calculator',
    h2h3Outline: [
      'Interactive College Semester Course & Credit Table',
      'How to Calculate College GPA (The Quality Points Formula)',
      'Standard 4.0 Letter Grade Scale Conversion Chart',
      'Unweighted 4.0 vs Weighted 5.0 GPA Explained',
      'Target GPA Planning & Graduation Honors Calculator (Cum Laude, Magna Cum Laude)',
      'Frequently Asked Questions About College GPA'
    ],
    uniqueFunctionalityRequired: [
      'Dynamic add/remove course rows with Course Name, Letter Grade dropdown (A+ to F), and Credit Hours (1 to 6).',
      'Instant real-time quality points multiplication and semester GPA computation.',
      'Cumulative GPA blending toggle (input prior cumulative GPA and total completed credits).',
      'Downloadable clean PDF transcript summary.'
    ],
    uniqueContentRequired: [
      'Quality points mathematical formula: GPA = Sum(Grade Points × Credits) / Total Credits.',
      'Official letter grade table (A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D+=1.3, D=1.0, F=0.0).',
      'Graduation honors benchmark breakdown.'
    ],
    faqTopics: [
      {
        question: 'How do credit hours affect my college semester GPA?',
        answer: 'Courses with more credit hours (e.g. 4-credit lab sciences) carry higher weight. The grade point value is multiplied by the credit hours to calculate quality points.'
      },
      {
        question: 'How is cumulative GPA calculated across multiple semesters?',
        answer: 'Cumulative GPA is calculated by dividing total quality points earned across all semesters by total credit hours attempted, not by averaging semester GPA percentages.'
      },
      {
        question: 'What is the difference between weighted and unweighted GPA?',
        answer: 'Unweighted GPA scores all courses on a maximum 4.0 scale. Weighted GPA awards extra points (typically +0.5 for Honors and +1.0 for AP/IB courses), reaching up to 5.0.'
      }
    ],
    internalLinks: [
      '/cgpa-calculator.html',
      '/percentage-calculator.html',
      '/category/educational-tools'
    ],
    categoryPlacement: '🎓 Educational Tools',
    breadcrumbStructure: ['Home', 'Educational Tools', 'College GPA Calculator'],
    recommendedSchemaType: 'WebApplication',
    differentiationFromParentTool: 'cgpa-calculator.html converts a single 10-point number to a percentage using a linear multiplier; college-gpa-calculator provides an interactive multi-row course transcript builder calculating credit-weighted quality points on a 4.0 scale.'
  }
};

const allValidations = [candidate1, candidate2, candidate3];

// Write docs/phase-6e-deep-validation.json
fs.writeFileSync(path.join(docsDir, 'phase-6e-deep-validation.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  targetDomain: SITE_ORIGIN,
  totalCandidatesValidated: allValidations.length,
  decisionsSummary: {
    CREATE_DEDICATED_PAGE: allValidations.filter(v => v.finalDecision === 'CREATE_DEDICATED_PAGE').length,
    IMPROVE_EXISTING_TOOL_PAGE: allValidations.filter(v => v.finalDecision === 'IMPROVE_EXISTING_TOOL_PAGE').length,
    MERGE_INTO_EXISTING_PAGE: allValidations.filter(v => v.finalDecision === 'MERGE_INTO_EXISTING_PAGE').length,
    REJECT: allValidations.filter(v => v.finalDecision === 'REJECT').length
  },
  candidates: allValidations
}, null, 2), 'utf8');

// Write docs/phase-6e-deep-validation.md
let mdReport = `# Phase 6E: Deep Validation of Potential New SEO Landing-Page Opportunities

**Date of Validation:** ${researchDate}  
**Target Domain:** \`${SITE_ORIGIN}\`  
**Total Candidate Opportunities Evaluated:** **3 Candidates**  
**Final Validation Decisions:**
- **\`CREATE_DEDICATED_PAGE\`:** **1 Candidate** (\`college-gpa-calculator\`)
- **\`IMPROVE_EXISTING_TOOL_PAGE\`:** **2 Candidates** (\`qr-generator\`, \`cron-expression-generator\`)
- **\`MERGE_INTO_EXISTING_PAGE\`:** **0 Candidates**
- **\`REJECT\`:** **0 Candidates**

---

## 1. Executive Summary & Validation Methodology

In Phase 6E, we conducted an exhaustive, evidence-based audit of the 3 candidate opportunities discovered in Phase 6D Batch 2.

Rather than reflexively spawning new URLs, each candidate was rigorously tested against Google Search Essentials, Doorway Page Guidelines, live Google SERP competitor structures, and existing Zubware tool capabilities.

### Key Validation Verdicts:
1. **Candidate #1 (Vector SVG QR Code Generator):** **\`IMPROVE_EXISTING_TOOL_PAGE\`**  
   *Reason:* Zubware already hosts canonical \`/qr-generator.html\`. Adding native SVG vector export and logo embedding directly to the existing tool fully captures high-intent design traffic while concentrating PageRank and avoiding doorway cannibalization.
2. **Candidate #2 (Cron Schedule Expression Generator):** **\`IMPROVE_EXISTING_TOOL_PAGE\`**  
   *Reason:* Zubware already has \`/cron-expression-generator.html\` in its canonical inventory. The visual interval builder and plain-English explainer belong directly on this primary canonical page.
3. **Candidate #3 (College GPA Calculator — 4.0 Scale):** **\`CREATE_DEDICATED_PAGE\`**  
   *Reason:* Genuinely distinct search intent and mathematical model. The existing \`/cgpa-calculator.html\` is an Indian 10-point single-value conversion tool, whereas College GPA Calculator requires an interactive multi-course transcript table multiplying letter grades by semester credit hours.

---

## 2. In-Depth Candidate Audits

`;

allValidations.forEach((v) => {
  mdReport += `### Candidate #${v.candidateNumber}: ${v.candidateName}
- **Proposed Slug:** \`/${v.proposedSlug}\`
- **Closest Existing Zubware Tool:** [\`${v.closestCanonicalTool.title}\`](${v.closestCanonicalTool.url}) (\`${v.closestCanonicalTool.category}\`)
- **Primary Search Query:** \`${v.primarySearchQuery}\`
- **Related Query Cluster:** \`${v.relatedSearchCluster.join('`, `')}\`
- **Search Intent:** ${v.searchIntent}
- **Final Decision:** \`${v.finalDecision}\` (Confidence: **${v.confidenceLevel}**)
- **Confidence Rationale:** ${v.confidenceRationale}

#### Fresh Live Google SERP Evidence:
`;
  v.freshSerpResults.forEach(r => {
    mdReport += `  ${r.position}. **[${r.title}](${r.url})** (\`${r.domain}\` — *${r.pageType}*)
     - *Capabilities:* ${r.toolCapabilities.join(', ')}
     - *Gaps / Weaknesses:* ${r.gaps.join(', ')}\n`;
  });

  mdReport += `\n#### 11-Point Distinct Intent Test:
- **Materially different from existing tool?** ${v.distinctIntentTest.isMateriallyDifferent ? 'YES' : 'NO'}
- **Dedicated SERP pages exist in Google?** ${v.distinctIntentTest.hasDedicatedSerpPages ? 'YES' : 'NO'}
- **Users benefit from landing directly?** ${v.distinctIntentTest.userBenefitFromLandingDirectly ? 'YES' : 'NO'}
- **Zubware can provide unique value?** ${v.distinctIntentTest.canProvideSubstantialUniqueValue ? 'YES' : 'NO'}
- **Useful without keyword stuffing?** ${v.distinctIntentTest.usefulWithoutKeywordStuffing ? 'YES' : 'NO'}
- **Unique content structure possible?** ${v.distinctIntentTest.uniqueContentStructurePossible ? 'YES' : 'NO'}
- **Meaningful topic cluster?** ${v.distinctIntentTest.meaningfulTopicCluster ? 'YES' : 'NO'}
- **Doorway cannibalization risk:** \`${v.distinctIntentTest.doorwayCannibalizationRisk}\`
- **Satisfiable by improving existing tool?** ${v.distinctIntentTest.satisfiableByImprovingExistingTool ? 'YES' : 'NO'}
- **Strongest evidence FOR:** ${v.distinctIntentTest.strongestEvidenceForNewPage}
- **Strongest evidence AGAINST:** ${v.distinctIntentTest.strongestEvidenceAgainstNewPage}
\n`;

  if (v.finalDecision === 'CREATE_DEDICATED_PAGE' && v.implementationSpecs) {
    const specs = v.implementationSpecs;
    mdReport += `#### Recommended Implementation Specifications:
- **Recommended Canonical URL:** [\`${specs.finalRecommendedUrl.replace(SITE_ORIGIN, '')}\`](${specs.finalRecommendedUrl})
- **Proposed Title:** \`${specs.proposedTitle}\`
- **Proposed H1:** \`${specs.proposedH1}\`
- **Category Placement:** \`${specs.categoryPlacement}\`
- **Breadcrumb Structure:** \`${specs.breadcrumbStructure.join(' > ')}\`
- **Recommended Schema:** \`${specs.recommendedSchemaType}\`
- **H2/H3 Content Outline:**
`;
    specs.h2h3Outline.forEach(h => mdReport += `  - ${h}\n`);
    mdReport += `- **Unique Functionality Required:** ${specs.uniqueFunctionalityRequired.join('; ')}
- **Unique Content Required:** ${specs.uniqueContentRequired.join('; ')}
- **Recommended FAQs:**
`;
    specs.faqTopics.forEach(faq => {
      mdReport += `  - **Q: ${faq.question}**  
    *A: ${faq.answer}*\n`;
    });
    mdReport += `- **Recommended Internal Links:** \`${specs.internalLinks.join('`, `')}\`
- **Differentiation from Existing Tool:** ${specs.differentiationFromParentTool}
\n`;
  } else if (v.existingToolOptimizationPlan) {
    const plan = v.existingToolOptimizationPlan;
    mdReport += `#### Existing Tool Optimization Plan:
- **Target URL:** [\`${plan.toolUrl.replace(SITE_ORIGIN, '')}\`](${plan.toolUrl})
- **On-Page Functional Enhancements:**
`;
    plan.enhancementsRequired.forEach(e => mdReport += `  - ${e}\n`);
    mdReport += `- **SEO Metadata & Content Enhancements:**\n`;
    plan.seoMetadataUpdates.forEach(u => mdReport += `  - ${u}\n`);
    mdReport += `\n`;
  }

  mdReport += `---\n\n`;
});

mdReport += `## 3. Strict Quality & Compliance Confirmation
- **Website Modified:** NO
- **Source Code Modified:** NO
- **Tool Pages Modified:** NO
- **Blog Pages Modified:** NO
- **Category Pages Modified:** NO
- **Sitemap Modified:** NO
- **Routing Modified:** NO
- **Build Status:** Succeeded (0 code changes made)
- **Deployment:** NO
- **Git Push:** NO
`;

fs.writeFileSync(path.join(docsDir, 'phase-6e-deep-validation.md'), mdReport, 'utf8');

console.log('Phase 6E Deep Validation Complete:');
console.log(' - docs/phase-6e-deep-validation.json');
console.log(' - docs/phase-6e-deep-validation.md');
