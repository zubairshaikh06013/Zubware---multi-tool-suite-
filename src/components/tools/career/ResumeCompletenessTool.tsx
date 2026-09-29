import React, { useState, useMemo } from 'react';
import { getActiveResume } from '../../../lib/resumeStore';
import { ResumeData } from '../../../types/resume';
import { ResumeInfoPanel } from './ResumeInfoPanel';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  Award, 
  Target, 
  Copy, 
  Check, 
  Download, 
  RefreshCw 
} from 'lucide-react';

interface CheckItem {
  id: string;
  category: 'Contact' | 'Content' | 'Experience' | 'Skills' | 'Impact';
  label: string;
  description: string;
  weight: number;
  pass: boolean;
  recommendation: string;
}

export const ResumeCompletenessTool: React.FC<{ onShowToast: (msg: string) => void; onNavigate?: (path: string) => void }> = ({ onShowToast, onNavigate }) => {
  const [resume, setResume] = useState<ResumeData>(() => getActiveResume());
  const [auditMode, setAuditMode] = useState<'active' | 'custom'>('active');
  const [customText, setCustomText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Active resume checks
  const checks: CheckItem[] = useMemo(() => {
    if (auditMode === 'custom') {
      const text = customText.toLowerCase();
      const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(customText);
      const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(customText);
      const hasLinkedIn = /linkedin\.com|github\.com/i.test(customText);
      const hasSummary = text.includes('summary') || text.includes('profile') || text.includes('about');
      const hasExperience = text.includes('experience') || text.includes('employment') || text.includes('work history');
      const hasEducation = text.includes('education') || text.includes('university') || text.includes('degree') || text.includes('college');
      const hasSkills = text.includes('skills') || text.includes('technologies') || text.includes('competencies');
      const hasMetrics = /\d+%\s*|\$\d+|\d+\s*years|\d+\s*team|\d+\s*users/i.test(customText);
      const wordCount = customText.trim().split(/\s+/).filter(Boolean).length;

      return [
        {
          id: 'contact_email_phone',
          category: 'Contact',
          label: 'Contact Information (Email & Phone)',
          description: 'Recruiters must have direct phone and email channels to invite you for interviews.',
          weight: 15,
          pass: hasEmail && hasPhone,
          recommendation: !hasEmail ? 'Add a professional email address' : (!hasPhone ? 'Add a direct mobile phone number' : 'Contact channels verified.')
        },
        {
          id: 'professional_links',
          category: 'Contact',
          label: 'LinkedIn or Portfolio URL',
          description: '70% of tech and corporate recruiters view linked profiles before shortlisting.',
          weight: 10,
          pass: hasLinkedIn,
          recommendation: 'Include a clean clickable link to your LinkedIn profile or personal GitHub/portfolio.'
        },
        {
          id: 'summary_section',
          category: 'Content',
          label: 'Professional Summary / Hook',
          description: 'A 2-3 sentence overview highlighting role seniority and key domains.',
          weight: 15,
          pass: hasSummary && wordCount > 50,
          recommendation: 'Add a concise Professional Summary section stating your specialization.'
        },
        {
          id: 'experience_history',
          category: 'Experience',
          label: 'Work Experience Section',
          description: 'Reverse-chronological history of roles, responsibilities, and key accomplishments.',
          weight: 25,
          pass: hasExperience,
          recommendation: 'Detail your employment history with clear company names, roles, and dates.'
        },
        {
          id: 'measurable_impact',
          category: 'Impact',
          label: 'Quantifiable Metrics & Data',
          description: 'Bullet points with numbers (percentages, revenue, team size, efficiency).',
          weight: 15,
          pass: hasMetrics,
          recommendation: 'Strengthen bullet points using data (e.g. "Increased sales by 32%", "Decreased latency by 45ms").'
        },
        {
          id: 'skills_section',
          category: 'Skills',
          label: 'Dedicated Skills Inventory',
          description: 'Industry-standard keywords to pass Applicant Tracking Systems (ATS).',
          weight: 10,
          pass: hasSkills,
          recommendation: 'List 6-12 relevant technical, analytical, or specialized domain skills.'
        },
        {
          id: 'education_credentials',
          category: 'Content',
          label: 'Education & Certifications',
          description: 'Degrees, diplomas, bootcamps, or industry-recognized accreditations.',
          weight: 10,
          pass: hasEducation,
          recommendation: 'Include your highest degree, educational institution, and completion year.'
        }
      ];
    }

    // Default: Check active resume store
    const hasNameAndTitle = Boolean(resume.personalInfo.fullName && resume.personalInfo.jobTitle);
    const hasContact = Boolean(resume.personalInfo.email && resume.personalInfo.phone);
    const hasLinks = Boolean(resume.personalInfo.linkedIn || resume.personalInfo.gitHub || resume.personalInfo.portfolio);
    const summaryLen = (resume.personalInfo.summary || '').trim().split(/\s+/).filter(Boolean).length;
    const hasExp = (resume.experience?.length || 0) > 0;
    const hasEdu = (resume.education?.length || 0) > 0;
    const skillsCount = resume.skills?.length || 0;
    const hasProjects = (resume.projects?.length || 0) > 0;

    return [
      {
        id: 'name_title',
        category: 'Contact',
        label: 'Full Name & Target Role Title',
        description: 'Clear headline establishing your identity and primary target profession.',
        weight: 15,
        pass: hasNameAndTitle,
        recommendation: !resume.personalInfo.fullName ? 'Fill in your full legal or professional name' : 'Specify a target job title headline.'
      },
      {
        id: 'contact_info',
        category: 'Contact',
        label: 'Direct Email & Phone Contact',
        description: 'Required contact methods for recruiter scheduling.',
        weight: 15,
        pass: hasContact,
        recommendation: 'Provide both an active email address and phone number with country code.'
      },
      {
        id: 'links',
        category: 'Contact',
        label: 'LinkedIn, Portfolio, or GitHub',
        description: 'Enables hiring managers to inspect code repositories and endorsements.',
        weight: 10,
        pass: hasLinks,
        recommendation: 'Add your LinkedIn or online project portfolio link.'
      },
      {
        id: 'summary',
        category: 'Content',
        label: 'Executive Summary (> 30 words)',
        description: 'An impactful summary hooking the reader in 6 seconds.',
        weight: 15,
        pass: summaryLen >= 30,
        recommendation: summaryLen === 0 ? 'Write an executive summary' : `Expand summary (currently ${summaryLen} words; target 30-60 words).`
      },
      {
        id: 'experience',
        category: 'Experience',
        label: 'Work Experience Record',
        description: 'At least one verified position with duties and achievements.',
        weight: 20,
        pass: hasExp,
        recommendation: 'Add past employment roles detailing company, title, dates, and accomplishments.'
      },
      {
        id: 'skills',
        category: 'Skills',
        label: 'Core Skills Inventory (5+ Skills)',
        description: 'Keyword-rich skill tags for ATS automated filtering.',
        weight: 15,
        pass: skillsCount >= 5,
        recommendation: `Add more domain skills (currently ${skillsCount}/5 minimum recommended).`
      },
      {
        id: 'education',
        category: 'Content',
        label: 'Education or Project Showcase',
        description: 'Verified academic pedigree or portfolio projects proving execution.',
        weight: 10,
        pass: hasEdu || hasProjects,
        recommendation: 'Include your education history or notable portfolio projects.'
      }
    ];
  }, [resume, auditMode, customText]);

  const totalScore = useMemo(() => {
    return checks.reduce((acc, curr) => acc + (curr.pass ? curr.weight : 0), 0);
  }, [checks]);

  const passedCount = checks.filter(c => c.pass).length;
  const missingCount = checks.length - passedCount;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 65) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreRating = (score: number) => {
    if (score >= 90) return 'All-Star Ready';
    if (score >= 75) return 'Strong Contender';
    if (score >= 60) return 'Needs Polishing';
    return 'Incomplete Draft';
  };

  const handleCopyReport = () => {
    const report = [
      `=== Zubware Resume Completeness Audit ===`,
      `Overall Score: ${totalScore}% (${getScoreRating(totalScore)})`,
      `Passed Checks: ${passedCount}/${checks.length}`,
      ``,
      `--- Detailed Breakdown ---`,
      ...checks.map(c => `[${c.pass ? 'PASS' : 'FAIL'}] ${c.label} (${c.weight}%): ${c.pass ? 'Completed' : c.recommendation}`),
      ``,
      `Generated with Zubware Tools`
    ].join('\n');

    navigator.clipboard.writeText(report);
    setCopied(true);
    onShowToast('Audit report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const report = [
      `=== Zubware Resume Completeness Audit ===`,
      `Overall Score: ${totalScore}% (${getScoreRating(totalScore)})`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `--- Action Items to Reach 100% ---`,
      ...checks.filter(c => !c.pass).map(c => `- ${c.label}: ${c.recommendation}`),
      ``,
      `--- Completed Items ---`,
      ...checks.filter(c => c.pass).map(c => `- ${c.label}: Verified (+${c.weight}%)`),
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-completeness-report-${totalScore}pct.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded completeness audit report!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header and Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" /> Resume Profile Completeness & ATS Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Evaluate key hiring criteria, ATS keyword requirements, and missing sections with real-time scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setAuditMode('active')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                auditMode === 'active'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Active Resume
            </button>
            <button
              onClick={() => setAuditMode('custom')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                auditMode === 'custom'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Paste Custom Text
            </button>
          </div>
        </div>
      </div>

      {auditMode === 'active' && <ResumeInfoPanel resumeData={resume} />}

      {auditMode === 'custom' && (
        <div className="glass-card p-5 rounded-3xl space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Paste Existing Resume or CV Content for Live Scan
          </label>
          <textarea
            rows={5}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your resume text here (experience, skills, summary, contact information)..."
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      )}

      {/* Score Summary Overview Card */}
      <div className="glass-card p-6 rounded-3xl space-y-5 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/40 to-purple-50/20 dark:from-slate-900/60 dark:to-indigo-950/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 flex flex-col items-center justify-center border border-indigo-500/30">
              <span className={`text-2xl font-black ${getScoreColor(totalScore)}`}>
                {totalScore}%
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Score</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {getScoreRating(totalScore)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  totalScore >= 80 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'
                }`}>
                  {passedCount} of {checks.length} Passed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {missingCount === 0 
                  ? 'Outstanding! Your resume checks all standard recruiter and ATS filters.' 
                  : `Address the ${missingCount} pending item${missingCount > 1 ? 's' : ''} below to maximize interview call-backs.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Audit'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>

            {onNavigate && auditMode === 'active' && (
              <button
                onClick={() => onNavigate('/resume-builder.html')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Edit in Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                totalScore >= 80 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                  : totalScore >= 60 
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-500' 
                  : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${Math.max(totalScore, 4)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
            <span>0% Incomplete</span>
            <span>50% Basic</span>
            <span>80% ATS-Optimized</span>
            <span>100% Comprehensive</span>
          </div>
        </div>
      </div>

      {/* Detailed Checklist Breakdown */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
          <span>Component Breakdown & Recommendations</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono">{totalScore}/100 Pts</span>
        </h3>

        <div className="space-y-3">
          {checks.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.pass
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {item.pass ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${item.pass ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>

                    {!item.pass && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Suggestion: {item.recommendation}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`text-xs font-bold ${item.pass ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    +{item.weight}%
                  </span>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {item.pass ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
