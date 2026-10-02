import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { extractTextFromPdf } from '../../../lib/pdfUtils';
import { getActiveResume } from '../../../lib/resumeStore';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  FileText, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award,
  Sparkles,
  Upload,
  Download,
  Copy,
  Check,
  Trash2,
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface AtsResumeCheckerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface AtsMatchResult {
  matchScore: number;
  hardSkillsScore: number;
  softSkillsScore: number;
  experienceScore: number;
  formattingScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingRisks: { issue: string; severity: 'high' | 'medium' | 'low'; recommendation: string }[];
  tailoringTips: string[];
}

const SAMPLE_JOB_DESCRIPTION = `Senior Full Stack Engineer (React, TypeScript & Node.js)
Company: CloudScale Infrastructure
Location: San Francisco, CA / Remote

About the Role:
We are looking for a Senior Full Stack Engineer to lead the development of our high-volume cloud observability platform. You will build resilient microservices with Node.js, Go, and PostgreSQL, while delivering responsive web applications with React, Next.js, and TypeScript.

Key Responsibilities:
• Architect, build, and maintain mission-critical distributed systems and microservices deployed on AWS (ECS, Lambda, S3, Docker, Kubernetes).
• Develop fluid, accessible web interfaces utilizing React, TypeScript, and Tailwind CSS with high performance (FCP < 1.0s).
• Optimize high-throughput PostgreSQL queries, Redis caching, and CI/CD automated deployment pipelines.
• Collaborate with product managers, designers, and mentor junior engineers using Agile / Scrum methodologies.
• Ensure enterprise-grade security adhering to SOC2, OAuth2, and RESTful API standards.

Required Qualifications & Skills:
• 5+ years of software engineering experience in modern full-stack web development.
• Strong proficiency in TypeScript, JavaScript, React, Node.js, and PostgreSQL.
• Hands-on production experience with AWS cloud infrastructure, Docker containers, and CI/CD pipelines.
• Solid background in System Architecture, Microservices, and REST APIs.
• Excellent communication, leadership, and problem-solving abilities.`;

const SAMPLE_RESUME_TEXT = `ALEXANDER MORGAN
San Francisco, CA • (555) 234-5678 • alex.morgan@email.com • linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Software Engineer with 7+ years of experience architecting and deploying scalable web applications and distributed cloud systems. Specialized in TypeScript, React, Node.js, and AWS.

CORE SKILLS
TypeScript, JavaScript, React, Next.js, Node.js, Express, PostgreSQL, Redis, AWS (ECS, S3), Docker, Kubernetes, CI/CD, Microservices, REST APIs, Agile, System Architecture

WORK EXPERIENCE
Senior Software Engineer | CloudScale Technologies (2021 – Present)
• Architected and migrated legacy monolith to modular microservices on AWS ECS, reducing server latency by 38% for 2.4M monthly active users.
• Spearheaded frontend performance overhaul with React and TypeScript, slashing page load times to under 1s.
• Mentored 6 junior engineers and established automated CI/CD code quality gates.

Software Engineer | Apex Digital Solutions (2018 – 2021)
• Developed responsive SaaS dashboard features with React, TypeScript, and Node.js, increasing daily user engagement by 31%.
• Designed high-throughput PostgreSQL schema and Redis caching layer, saving $14,000 in monthly infrastructure costs.
• Implemented OAuth2 and RBAC protocols across 12 internal REST APIs.

EDUCATION
Bachelor of Science in Computer Science | UC Berkeley (2014 – 2018)`;

export const AtsResumeCheckerTool: React.FC<AtsResumeCheckerToolProps> = ({ onShowToast, onNavigate }) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeSource, setResumeSource] = useState<string>('');
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<AtsMatchResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const runAtsScan = (customResume?: string, customJob?: string) => {
    const resume = (customResume !== undefined ? customResume : resumeText).trim();
    const job = (customJob !== undefined ? customJob : jobDescription).trim();

    if (!resume) {
      onShowToast('Please upload or paste your resume text first.');
      return;
    }

    if (!job) {
      onShowToast('Please provide the target Job Description to compare against.');
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      const resumeLower = resume.toLowerCase();
      const jobLower = job.toLowerCase();

      // Extract keywords from job description (common skills & requirements)
      const TECH_KEYWORDS = [
        'typescript', 'javascript', 'react', 'next.js', 'node.js', 'python', 'java', 'go', 'golang',
        'sql', 'postgresql', 'mongodb', 'redis', 'aws', 'docker', 'kubernetes', 'ci/cd', 'git',
        'graphql', 'rest api', 'restful', 'microservices', 'system architecture', 'tailwind css',
        'redux', 'agile', 'scrum', 'soc2', 'oauth2', 'unit testing', 'jest', 'playwright',
        'distributed systems', 'cloud infrastructure', 'html5', 'css3', 'linux'
      ];

      const SOFT_KEYWORDS = [
        'leadership', 'mentoring', 'mentor', 'communication', 'problem-solving', 'cross-functional',
        'collaboration', 'strategy', 'optimization', 'throughput', 'scalability'
      ];

      // Find keywords mentioned in job description
      const targetTech = TECH_KEYWORDS.filter(k => jobLower.includes(k));
      const targetSoft = SOFT_KEYWORDS.filter(k => jobLower.includes(k));
      const allTarget = Array.from(new Set([...targetTech, ...targetSoft]));

      // If job description is unique text, extract capitalized domain words
      const capitalWords: string[] = job.match(/\b[A-Z][a-zA-Z0-9+#.-]{2,}\b/g) || [];
      capitalWords.forEach((w: string) => {
        const wLower = w.toLowerCase();
        if (w.length > 3 && !['about', 'with', 'your', 'from', 'this', 'that', 'have', 'been', 'must', 'role', 'team', 'work', 'year', 'years', 'will'].includes(wLower)) {
          if (!allTarget.includes(wLower) && allTarget.length < 25) {
            allTarget.push(wLower);
          }
        }
      });

      const matchedKeywords: string[] = [];
      const missingKeywords: string[] = [];

      allTarget.forEach(kw => {
        if (resumeLower.includes(kw)) {
          matchedKeywords.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      });

      // Calculate scores
      const totalKeywords = Math.max(1, allTarget.length);
      const hardMatches = targetTech.filter(k => resumeLower.includes(k)).length;
      const hardTotal = Math.max(1, targetTech.length);
      const hardSkillsScore = Math.round((hardMatches / hardTotal) * 100);

      const softMatches = targetSoft.filter(k => resumeLower.includes(k)).length;
      const softTotal = Math.max(1, targetSoft.length);
      const softSkillsScore = Math.round((softMatches / softTotal) * 100);

      // Experience & title match
      const titleWords = jobTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const titleMatches = titleWords.filter(w => resumeLower.includes(w)).length;
      const experienceScore = Math.min(100, Math.round((titleMatches / Math.max(1, titleWords.length)) * 50 + (resume.length > 1000 ? 50 : 25)));

      // Formatting risks
      const formattingRisks: { issue: string; severity: 'high' | 'medium' | 'low'; recommendation: string }[] = [];

      if (!/[\w.-]+@[\w.-]+\.\w+/.test(resume)) {
        formattingRisks.push({
          issue: 'Missing contact email address',
          severity: 'high',
          recommendation: 'Add a standard email format in the topmost contact section.'
        });
      }

      if (!/[\d\+\-\(\)\s]{7,}\d/.test(resume)) {
        formattingRisks.push({
          issue: 'Missing contact telephone number',
          severity: 'high',
          recommendation: 'Provide a direct phone number with area/country code.'
        });
      }

      if (resume.length < 500) {
        formattingRisks.push({
          issue: 'Low text content density',
          severity: 'medium',
          recommendation: 'Your resume text is under 100 words. Expand job bullet points to include relevant technical scope.'
        });
      }

      const formattingScore = Math.max(50, 100 - (formattingRisks.length * 20));

      const matchScore = Math.round(
        hardSkillsScore * 0.45 +
        softSkillsScore * 0.15 +
        experienceScore * 0.25 +
        formattingScore * 0.15
      );

      // Tailoring Tips
      const tailoringTips: string[] = [];
      if (missingKeywords.length > 0) {
        tailoringTips.push(`Integrate the missing skills [${missingKeywords.slice(0, 4).join(', ')}] directly into your Experience bullet points where you have utilized them.`);
      }
      if (titleMatches < titleWords.length) {
        tailoringTips.push(`Align your headline or professional summary title to reflect the target role "${jobTitle}".`);
      }
      tailoringTips.push('Ensure experience descriptions use the exact acronyms and tool names mentioned in the job description (e.g., CI/CD, AWS, TypeScript).');

      setMatchResult({
        matchScore,
        hardSkillsScore,
        softSkillsScore,
        experienceScore,
        formattingScore,
        matchedKeywords,
        missingKeywords,
        formattingRisks,
        tailoringTips
      });

      setIsScanning(false);
      onShowToast(`ATS Scan Completed: ${matchScore}% Match!`);
    }, 450);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        setIsScanning(true);
        const buffer = await file.arrayBuffer();
        const extracted = await extractTextFromPdf(buffer);
        setResumeText(extracted);
        setResumeSource(file.name);
        setIsScanning(false);
        onShowToast(`Loaded "${file.name}"`);
      } catch (err: any) {
        setIsScanning(false);
        onShowToast(err?.message || 'Failed to extract text from PDF.');
      }
    } else {
      const text = await file.text();
      setResumeText(text);
      setResumeSource(file.name);
      onShowToast(`Loaded "${file.name}"`);
    }
  };

  const loadSamplePair = () => {
    setResumeText(SAMPLE_RESUME_TEXT);
    setJobTitle('Senior Full Stack Engineer');
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setResumeSource('Sample_Senior_Engineer_Resume.pdf');
    runAtsScan(SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTION);
  };

  const loadActiveBuilderResume = () => {
    const active = getActiveResume();
    const formatted = [
      active.personalInfo.fullName,
      active.personalInfo.jobTitle,
      `${active.personalInfo.email} • ${active.personalInfo.phone}`,
      active.personalInfo.summary,
      ...active.experience.map(e => `${e.title} at ${e.company}: ${e.description}`),
      ...active.skills.map(s => s.name)
    ].filter(Boolean).join('\n');

    setResumeText(formatted);
    setResumeSource('Active_Zubware_Resume_Draft');
    onShowToast('Loaded active resume draft from Zubware Builder!');
  };

  const exportAtsReport = () => {
    if (!matchResult) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('Zubware ATS Resume Match Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Target Role: ${jobTitle} | Date: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text(`Overall ATS Match Score: ${matchResult.matchScore}%`, 14, 42);

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Hard Technical Skills Match: ${matchResult.hardSkillsScore}%`, 14, 52);
    doc.text(`• Soft Skills & Competencies: ${matchResult.softSkillsScore}%`, 14, 58);
    doc.text(`• Experience & Title Match: ${matchResult.experienceScore}%`, 14, 64);
    doc.text(`• Formatting & Parsing Safety: ${matchResult.formattingScore}%`, 14, 70);

    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`Matched Keywords (${matchResult.matchedKeywords.length}):`, 14, 82);
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const matchedStr = doc.splitTextToSize(matchResult.matchedKeywords.join(', ') || 'None', 180);
    doc.text(matchedStr, 14, 88);

    let y = 88 + matchedStr.length * 5 + 6;
    doc.setFontSize(12);
    doc.setTextColor(239, 68, 68);
    doc.text(`Missing Critical Keywords (${matchResult.missingKeywords.length}):`, 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const missingStr = doc.splitTextToSize(matchResult.missingKeywords.join(', ') || 'None detected', 180);
    doc.text(missingStr, 14, y);

    y += missingStr.length * 5 + 10;
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Tailoring Recommendations:', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    matchResult.tailoringTips.forEach(tip => {
      const splitTip = doc.splitTextToSize(`• ${tip}`, 180);
      doc.text(splitTip, 14, y);
      y += splitTip.length * 5 + 2;
    });

    doc.save(`Zubware-ATS-Match-${Date.now()}.pdf`);
    onShowToast('ATS Match Report downloaded!');
  };

  const copyAtsSummary = () => {
    if (!matchResult) return;
    const summary = `Zubware ATS Compatibility Score: ${matchResult.matchScore}%
Target Role: ${jobTitle}
• Hard Skills Match: ${matchResult.hardSkillsScore}%
• Experience Match: ${matchResult.experienceScore}%

Matched Keywords (${matchResult.matchedKeywords.length}): ${matchResult.matchedKeywords.join(', ')}
Missing Keywords (${matchResult.missingKeywords.length}): ${matchResult.missingKeywords.join(', ')}

Top Tailoring Recommendations:
${matchResult.tailoringTips.map(t => `- ${t}`).join('\n')}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('ATS summary copied to clipboard!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Tool Header Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ATS Resume Checker & Job Keyword Matcher
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Compare your resume against any job description to discover matching skills, missing keywords, and ATS parsing readiness.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSamplePair}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200/50 dark:border-indigo-800/50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try Sample Job Match</span>
          </button>
        </div>
      </div>

      {/* Inputs Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Candidate Resume */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>1. Your Resume</span>
            </h3>
            <button
              onClick={loadActiveBuilderResume}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
            >
              Use Builder Draft
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-center cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              <span>{resumeSource || 'Upload PDF / Text Resume'}</span>
              <input
                type="file"
                accept=".pdf,.txt,.md,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {resumeText && (
              <button
                onClick={() => { setResumeText(''); setResumeSource(''); }}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Clear Resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Or paste your resume text here (Summary, Experience, Education, Skills)..."
            rows={8}
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <span className="text-[11px] text-slate-400">
            {resumeText.split(/\s+/).filter(Boolean).length} resume words detected
          </span>
        </div>

        {/* Right Column: Target Job Description */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>2. Target Job Posting</span>
            </h3>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Job Description / Requirements
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job posting, required qualifications, and responsibilities here..."
              rows={6}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={() => runAtsScan()}
            disabled={!resumeText.trim() || !jobDescription.trim() || isScanning}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            <span>{isScanning ? 'Scanning ATS Keywords...' : 'Scan ATS Match Compatibility'}</span>
          </button>
        </div>
      </div>

      {/* Match Result Display */}
      {matchResult && (
        <div className="space-y-6">
          {/* Main Score Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                ATS Compatibility Match
              </span>
              <div className="text-6xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                {matchResult.matchScore}%
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                matchResult.matchScore >= 80
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : matchResult.matchScore >= 60
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {matchResult.matchScore >= 80 ? '🎯 High Match Rate' : matchResult.matchScore >= 60 ? '⚡ Moderate Match' : '⚠️ Low Match - Needs Tailoring'}
              </span>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="text-[11px] text-slate-500">Technical Skills</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">{matchResult.hardSkillsScore}%</div>
                <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${matchResult.hardSkillsScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="text-[11px] text-slate-500">Soft Skills</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">{matchResult.softSkillsScore}%</div>
                <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${matchResult.softSkillsScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="text-[11px] text-slate-500">Title & Experience</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">{matchResult.experienceScore}%</div>
                <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${matchResult.experienceScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="text-[11px] text-slate-500">Format Safety</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">{matchResult.formattingScore}%</div>
                <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${matchResult.formattingScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={exportAtsReport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export ATS Match Report</span>
              </button>
              <button
                onClick={copyAtsSummary}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>

          {/* Keywords Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Keywords */}
            <div className="glass-card p-6 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Matched Keywords ({matchResult.matchedKeywords.length})</span>
                </h4>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Found in resume</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {matchResult.matchedKeywords.length > 0 ? (
                  matchResult.matchedKeywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-medium bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                      ✓ {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No overlapping keywords found.</p>
                )}
              </div>
            </div>

            {/* Missing Critical Keywords */}
            <div className="glass-card p-6 rounded-3xl border border-rose-200/80 dark:border-rose-800/80 bg-rose-50/20 dark:bg-rose-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>Missing Keywords ({matchResult.missingKeywords.length})</span>
                </h4>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Target to add</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {matchResult.missingKeywords.length > 0 ? (
                  matchResult.missingKeywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-medium bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700">
                      + {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-600 font-bold">Incredible! All core job posting keywords detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Tailoring Recommendations */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Tailoring Strategy for this Job Posting</span>
            </h4>
            <div className="space-y-2">
              {matchResult.tailoringTips.map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                  <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
