import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { getActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { extractTextFromPdf } from '../../../lib/pdfUtils';
import { 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  TrendingUp, 
  Award, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  Upload,
  Download,
  Trash2,
  Copy,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  Info,
  Layers,
  FileCheck
} from 'lucide-react';

interface ResumeScoreAnalyzerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface AnalysisResult {
  overallScore: number;
  contentScore: number;
  impactScore: number;
  atsScore: number;
  structureScore: number;
  skillsScore: number;
  wordCount: number;
  detectedSections: { name: string; found: boolean; detail: string }[];
  metricsFound: string[];
  actionVerbsCount: number;
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  skillsFound: string[];
  recommendations: { priority: 'high' | 'medium' | 'low'; title: string; desc: string }[];
}

const SAMPLE_RESUME_TEXT = `ALEXANDER MORGAN
San Francisco, CA • (555) 234-5678 • alex.morgan@email.com • linkedin.com/in/alexmorgan • github.com/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Software Engineer with 7+ years of experience architecting and deploying scalable web applications and distributed cloud systems. Specialized in TypeScript, React, Node.js, and AWS. Proven track record of improving application throughput by 42% and leading cross-functional engineering teams of 8+ engineers.

CORE SKILLS
Programming: TypeScript, JavaScript (ES6+), Python, Go, SQL, HTML5/CSS3
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, Redux Toolkit, GraphQL
Cloud & DevOps: AWS (S3, Lambda, CloudFront, ECS), Docker, Kubernetes, CI/CD Pipelines, PostgreSQL, Redis
Engineering Practices: System Architecture, Microservices, RESTful APIs, Agile/Scrum, Unit & E2E Testing (Jest, Playwright)

WORK EXPERIENCE
Senior Software Engineer | CloudScale Technologies (2021 – Present)
• Architected and migrated legacy monolith to modular microservices on AWS ECS, reducing server latency by 38% for 2.4M monthly active users.
• Spearheaded frontend performance overhaul utilizing React Server Components and code-splitting, slashing First Contentful Paint (FCP) from 2.8s to 0.9s.
• Mentored 6 junior and mid-level engineers, establishing automated CI/CD code quality gates that reduced production bug escape rate by 25%.
• Integrated real-time WebSocket infrastructure handling 50,000+ concurrent connections with 99.99% uptime.

Software Engineer | Apex Digital Solutions (2018 – 2021)
• Developed responsive SaaS dashboard features with React, TypeScript, and Node.js, increasing daily user engagement by 31%.
• Designed high-throughput PostgreSQL schema and Redis caching layer, saving $14,000 in monthly database infrastructure costs.
• Implemented OAuth2 and RBAC security protocols across 12 internal APIs adhering to SOC2 compliance standards.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley (2014 – 2018)
• Magna Cum Laude • Dean's Honors List • Chair of ACM Student Chapter

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate (2023)
• Certified Kubernetes Application Developer (CKAD) (2022)`;

export const ResumeScoreAnalyzerTool: React.FC<ResumeScoreAnalyzerToolProps> = ({ onShowToast, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'builder'>('upload');
  const [resumeText, setResumeText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const analyzeText = (text: string, sourceName = 'Resume') => {
    if (!text.trim()) {
      onShowToast('Please provide resume text or upload a document.');
      return;
    }

    setIsAnalyzing(true);
    setFileName(sourceName);

    setTimeout(() => {
      const lower = text.toLowerCase();
      const words = text.split(/\s+/).filter(Boolean);
      const wordCount = words.length;

      // 1. Contact Info
      const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
      const hasPhone = /[\d\+\-\(\)\s]{7,}\d/.test(text);
      const hasLinkedIn = /linkedin\.com\/in\/[\w.-]+/i.test(text) || lower.includes('linkedin');
      const hasGitHub = /github\.com\/[\w.-]+/i.test(text) || lower.includes('github') || lower.includes('portfolio');

      // 2. Sections Detection
      const sections = [
        { 
          name: 'Contact Information', 
          found: hasEmail && hasPhone, 
          detail: hasEmail && hasPhone ? 'Email and phone number detected' : 'Missing email or phone number' 
        },
        { 
          name: 'Professional Summary', 
          found: /summary|profile|about me|objective/i.test(text), 
          detail: /summary|profile|about me|objective/i.test(text) ? 'Clear introduction present' : 'Recommended to add a 3-4 line career overview' 
        },
        { 
          name: 'Work Experience', 
          found: /experience|employment|work history|career/i.test(text), 
          detail: /experience|employment|work history|career/i.test(text) ? 'Employment history detected' : 'Crucial section missing' 
        },
        { 
          name: 'Skills / Expertise', 
          found: /skills|technologies|competencies|tools/i.test(text), 
          detail: /skills|technologies|competencies|tools/i.test(text) ? 'Skills section present' : 'Missing dedicated skills list' 
        },
        { 
          name: 'Education', 
          found: /education|degree|university|college|bachelor|master|phd/i.test(text), 
          detail: /education|degree|university|college|bachelor|master|phd/i.test(text) ? 'Academic background found' : 'Academic history not detected' 
        },
        { 
          name: 'Certifications & Projects', 
          found: /certification|certified|projects|awards|publications/i.test(text), 
          detail: /certification|certified|projects|awards|publications/i.test(text) ? 'Additional credentials found' : 'Consider adding relevant certifications or key projects' 
        }
      ];

      // 3. Impact & Quantifiable Metrics
      const metricMatches = text.match(/\b\d+(?:\.\d+)?%|\$\d+(?:,\d+)*(?:\.\d+)?(?:\s*[KkMmBb])?|\b\d+\+\s*(?:years|users|engineers|clients|projects|team members)|\breduced by \d+|\bincreased by \d+|\bsaved \$?\d+/gi) || [];
      const metricsFound = Array.from(new Set(metricMatches)).slice(0, 8);

      // 4. Action Verbs
      const ACTION_VERBS = [
        'architected', 'spearheaded', 'developed', 'engineered', 'led', 'designed', 'optimized',
        'implemented', 'accelerated', 'reduced', 'increased', 'managed', 'created', 'built',
        'migrated', 'streamlined', 'delivered', 'orchestrated', 'mentored', 'analyzed', 'generated'
      ];
      let actionVerbsCount = 0;
      ACTION_VERBS.forEach(v => {
        const regex = new RegExp(`\\b${v}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) actionVerbsCount += matches.length;
      });

      // 5. Skills extraction
      const COMMON_TECH_SKILLS = [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS', 'Docker',
        'Kubernetes', 'HTML5', 'CSS3', 'Git', 'Next.js', 'Express', 'PostgreSQL', 'MongoDB',
        'GraphQL', 'Tailwind CSS', 'Redux', 'CI/CD', 'Agile', 'Scrum', 'Linux', 'REST APIs',
        'Leadership', 'Project Management', 'Data Analysis', 'Figma', 'System Architecture'
      ];
      const skillsFound = COMMON_TECH_SKILLS.filter(sk => lower.includes(sk.toLowerCase()));

      // 6. Sub-scores Calculation
      const contentScore = Math.min(100, Math.round(
        (wordCount >= 350 && wordCount <= 850 ? 40 : 25) +
        (sections.filter(s => s.found).length * 8) +
        (skillsFound.length >= 6 ? 12 : skillsFound.length * 2)
      ));

      const impactScore = Math.min(100, Math.round(
        (metricsFound.length >= 4 ? 45 : metricsFound.length * 11) +
        (actionVerbsCount >= 6 ? 35 : actionVerbsCount * 5) +
        20
      ));

      const atsScore = Math.min(100, Math.round(
        (hasEmail && hasPhone ? 30 : 15) +
        (sections.filter(s => s.found).length >= 5 ? 40 : 25) +
        (wordCount >= 300 ? 30 : 15)
      ));

      const structureScore = Math.min(100, Math.round(
        (sections.filter(s => s.found).length / sections.length) * 80 +
        (hasLinkedIn || hasGitHub ? 20 : 10)
      ));

      const skillsScore = Math.min(100, Math.round(
        Math.min(100, skillsFound.length * 7 + (lower.includes('tools') || lower.includes('technologies') ? 20 : 0))
      ));

      const overallScore = Math.round(
        contentScore * 0.25 +
        impactScore * 0.25 +
        atsScore * 0.20 +
        structureScore * 0.15 +
        skillsScore * 0.15
      );

      // Recommendations list
      const recommendations: { priority: 'high' | 'medium' | 'low'; title: string; desc: string }[] = [];

      if (metricsFound.length < 3) {
        recommendations.push({
          priority: 'high',
          title: 'Add Quantifiable Metrics & Business Impact',
          desc: 'Recruiters favor resumes with tangible numbers (e.g., "reduced latency by 35%", "managed $50k budget", "led team of 6"). Add 3–5 percentage or numerical results.'
        });
      }

      if (!hasLinkedIn) {
        recommendations.push({
          priority: 'medium',
          title: 'Add LinkedIn Profile URL',
          desc: 'Over 85% of hiring managers verify candidate credentials via LinkedIn. Include your custom LinkedIn URL in your header.'
        });
      }

      if (skillsFound.length < 6) {
        recommendations.push({
          priority: 'high',
          title: 'Broaden Technical & Domain Keyword Skills',
          desc: 'Your resume has fewer detected skill keywords. Group your core skills into categories (Languages, Frameworks, Cloud/Tools) to pass automated ATS parsers.'
        });
      }

      if (actionVerbsCount < 5) {
        recommendations.push({
          priority: 'medium',
          title: 'Start Experience Bullets with Strong Action Verbs',
          desc: 'Replace passive phrases like "responsible for" or "worked on" with power verbs like "Spearheaded", "Architected", "Engineered", or "Streamlined".'
        });
      }

      if (wordCount < 300) {
        recommendations.push({
          priority: 'high',
          title: 'Expand Resume Detail (Under 300 words)',
          desc: 'Your resume is concise. Add more depth to your work history bullet points and elaborate on project achievements.'
        });
      } else if (wordCount > 950) {
        recommendations.push({
          priority: 'low',
          title: 'Streamline Length (Over 950 words)',
          desc: 'Consider condensing older roles to keep your resume concise (1 page for <5 years experience, 2 pages max for senior roles).'
        });
      }

      setAnalysisResult({
        overallScore,
        contentScore,
        impactScore,
        atsScore,
        structureScore,
        skillsScore,
        wordCount,
        detectedSections: sections,
        metricsFound,
        actionVerbsCount,
        hasEmail,
        hasPhone,
        hasLinkedIn,
        skillsFound,
        recommendations
      });

      setIsAnalyzing(false);
      onShowToast('Resume analysis complete!');
    }, 450);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        setIsAnalyzing(true);
        const buffer = await file.arrayBuffer();
        const extracted = await extractTextFromPdf(buffer);
        setResumeText(extracted);
        analyzeText(extracted, file.name);
      } catch (err: any) {
        setIsAnalyzing(false);
        onShowToast(err?.message || 'Error extracting text from PDF file.');
      }
    } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const text = await file.text();
      setResumeText(text);
      analyzeText(text, file.name);
    } else {
      onShowToast('Please select a PDF document or plain text resume file.');
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        setIsAnalyzing(true);
        const buffer = await file.arrayBuffer();
        const extracted = await extractTextFromPdf(buffer);
        setResumeText(extracted);
        analyzeText(extracted, file.name);
      } catch (err: any) {
        setIsAnalyzing(false);
        onShowToast(err?.message || 'Error extracting text from PDF.');
      }
    } else {
      const text = await file.text();
      setResumeText(text);
      analyzeText(text, file.name);
    }
  };

  const loadSampleResume = () => {
    setResumeText(SAMPLE_RESUME_TEXT);
    analyzeText(SAMPLE_RESUME_TEXT, 'Sample_Senior_Engineer_Resume.pdf');
  };

  const loadFromActiveBuilder = () => {
    const active = getActiveResume();
    const formatted = [
      active.personalInfo.fullName,
      active.personalInfo.jobTitle,
      `${active.personalInfo.email} • ${active.personalInfo.phone} • ${active.personalInfo.address}`,
      active.personalInfo.linkedIn,
      active.personalInfo.gitHub,
      active.personalInfo.portfolio,
      '',
      'PROFESSIONAL SUMMARY',
      active.personalInfo.summary,
      '',
      'WORK EXPERIENCE',
      ...active.experience.map(e => `${e.title} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'})\n${e.description}`),
      '',
      'EDUCATION',
      ...active.education.map(ed => `${ed.degree}, ${ed.institution}${ed.location ? ` (${ed.location})` : ''}`),
      '',
      'SKILLS',
      active.skills.map(s => s.name).join(', ')
    ].filter(Boolean).join('\n');

    setResumeText(formatted);
    analyzeText(formatted, 'Active_Zubware_Resume_Draft');
  };

  const exportReport = () => {
    if (!analysisResult) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('Zubware Resume Score & Audit Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`File: ${fileName || 'Resume Analysis'} | Date: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text(`Overall Score: ${analysisResult.overallScore}/100`, 14, 42);

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Content & Depth: ${analysisResult.contentScore}/100`, 14, 52);
    doc.text(`• Quantifiable Impact: ${analysisResult.impactScore}/100`, 14, 58);
    doc.text(`• ATS Compatibility: ${analysisResult.atsScore}/100`, 14, 64);
    doc.text(`• Section Structure: ${analysisResult.structureScore}/100`, 14, 70);
    doc.text(`• Skills Diversity: ${analysisResult.skillsScore}/100`, 14, 76);
    doc.text(`• Word Count: ${analysisResult.wordCount} words`, 14, 82);

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Actionable Recommendations:', 14, 96);

    let y = 104;
    analysisResult.recommendations.forEach((rec, idx) => {
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229);
      doc.text(`${idx + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`, 14, y);
      y += 6;
      doc.setTextColor(100, 116, 139);
      const splitText = doc.splitTextToSize(rec.desc, 180);
      doc.text(splitText, 18, y);
      y += splitText.length * 5 + 4;
    });

    doc.save(`Zubware-Resume-Audit-${Date.now()}.pdf`);
    onShowToast('PDF Audit Report downloaded!');
  };

  const copySummary = () => {
    if (!analysisResult) return;
    const summary = `Zubware Resume Score: ${analysisResult.overallScore}/100
• Content: ${analysisResult.contentScore}/100
• Impact & Metrics: ${analysisResult.impactScore}/100
• ATS Compatibility: ${analysisResult.atsScore}/100
• Structure: ${analysisResult.structureScore}/100
• Skills: ${analysisResult.skillsScore}/100
• Words: ${analysisResult.wordCount}

Top Recommendations:
${analysisResult.recommendations.map(r => `- [${r.priority.toUpperCase()}] ${r.title}: ${r.desc}`).join('\n')}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('Audit summary copied to clipboard!');
  };

  const resetAll = () => {
    setResumeText('');
    setFileName('');
    setAnalysisResult(null);
    onShowToast('Analyzer cleared.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Tool Header Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Resume Score & Quality Analyzer
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Instant AI-grade heuristic breakdown of content depth, quantifiable impact, ATS keywords, and structural health.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleResume}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200/50 dark:border-indigo-800/50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try Sample Resume</span>
          </button>
          {analysisResult && (
            <button
              onClick={resetAll}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
              title="Clear & Analyze New Resume"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Input Mode Selector */}
      {!analysisResult && (
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Upload PDF / Document
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Paste Resume Text
            </button>
            <button
              onClick={() => {
                setActiveTab('builder');
                loadFromActiveBuilder();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'builder'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Scan Active Resume Builder Draft
            </button>
          </div>

          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Drag & Drop your resume PDF here, or click to browse
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Supports PDF, TXT, and Markdown files. 100% Client-Side Local Processing.
                </p>
              </div>

              <label className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-sm transition-all inline-flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                <span>Select PDF Resume</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Paste Your Full Resume Content
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full text of your resume here (Summary, Experience, Education, Skills)..."
                rows={10}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {resumeText.split(/\s+/).filter(Boolean).length} words detected
                </span>
                <button
                  onClick={() => analyzeText(resumeText, 'Pasted_Resume')}
                  disabled={!resumeText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume Score</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Main Score Hero Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Overall Resume Score
              </span>
              <div className="text-6xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                {analysisResult.overallScore} <span className="text-xl font-bold text-slate-400">/ 100</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                analysisResult.overallScore >= 85 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : analysisResult.overallScore >= 70
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {analysisResult.overallScore >= 85 ? '🌟 Excellent Strength' : analysisResult.overallScore >= 70 ? '👍 Good Quality' : '⚠️ Needs Actionable Improvement'}
              </span>
              <span className="text-[11px] text-slate-400">Source: {fileName}</span>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Content Depth</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{analysisResult.contentScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysisResult.contentScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Metrics & Impact</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{analysisResult.impactScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analysisResult.impactScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>ATS Compatibility</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{analysisResult.atsScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${analysisResult.atsScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Section Structure</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{analysisResult.structureScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${analysisResult.structureScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Skills Density</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{analysisResult.skillsScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${analysisResult.skillsScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Word Count</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{analysisResult.wordCount} words</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (analysisResult.wordCount / 600) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={exportReport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Audit PDF</span>
              </button>
              <button
                onClick={copySummary}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
            </div>

            <button
              onClick={() => setAnalysisResult(null)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Upload / Scan Another Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Key Findings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sections Breakdown */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Structural Section Breakdown</span>
              </h3>
              <div className="space-y-2.5">
                {analysisResult.detectedSections.map((sec, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-2.5">
                      {sec.found ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{sec.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{sec.detail}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      sec.found ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      {sec.found ? 'Present' : 'Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantifiable Impact & Skills */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Quantifiable Achievements & Skills</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Detected Metrics ({analysisResult.metricsFound.length})
                  </span>
                  {analysisResult.metricsFound.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {analysisResult.metricsFound.map((metric, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-mono bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {metric}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-rose-500 mt-1">No numeric percentages or currency metrics detected.</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Extracted Core Keywords ({analysisResult.skillsFound.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-36 overflow-y-auto">
                    {analysisResult.skillsFound.map((skill, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations List */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Prioritized Improvement Action Items</span>
            </h3>

            <div className="space-y-3">
              {analysisResult.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3.5">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    rec.priority === 'high'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                      : rec.priority === 'medium'
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                  }`}>
                    {rec.priority === 'high' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">{rec.title}</span>
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                        rec.priority === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : rec.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
