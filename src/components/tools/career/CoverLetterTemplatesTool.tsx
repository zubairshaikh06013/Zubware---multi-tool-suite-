import React, { useState } from 'react';
import { COVER_LETTER_TEMPLATES_LIST, getDefaultCoverLetter } from '../../../data/careerData';
import { saveActiveCoverLetter } from '../../../lib/resumeStore';
import { 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Edit3, 
  Briefcase, 
  Building2, 
  User, 
  RefreshCw 
} from 'lucide-react';

interface CoverLetterTemplatesToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const CoverLetterTemplatesTool: React.FC<CoverLetterTemplatesToolProps> = ({ onShowToast, onNavigate }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(COVER_LETTER_TEMPLATES_LIST[0].id);
  const [applicantName, setApplicantName] = useState<string>('Alex Morgan');
  const [applicantEmail, setApplicantEmail] = useState<string>('alex.morgan@email.com');
  const [applicantPhone, setApplicantPhone] = useState<string>('+1 (555) 019-2834');
  const [targetCompany, setTargetCompany] = useState<string>('Acme Innovations Inc.');
  const [hiringManager, setHiringManager] = useState<string>('Hiring Manager');
  const [jobTitle, setJobTitle] = useState<string>('Senior Software Engineer');
  const [keySkills, setKeySkills] = useState<string>('distributed microservices, cloud infrastructure, and TypeScript');
  const [keyAchievement, setKeyAchievement] = useState<string>('architecting high-throughput services that reduced latency by 35% across 2M daily active users');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedMeta = COVER_LETTER_TEMPLATES_LIST.find(t => t.id === selectedTemplateId) || COVER_LETTER_TEMPLATES_LIST[0];

  // Generate dynamic letter content based on selected template and fields
  const generateLetterContent = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    let roleSpecificHook = '';
    let bodyFocus = '';
    
    if (selectedMeta.category === 'Technology') {
      roleSpecificHook = `With deep hands-on expertise in ${keySkills}, I have consistently engineered scalable, resilient solutions that solve mission-critical business challenges.`;
      bodyFocus = `In my previous role, I took ownership of ${keyAchievement}. I understand that ${targetCompany} values engineering excellence and iterative product velocity—principles that have steered my career.`;
    } else if (selectedMeta.category === 'Design') {
      roleSpecificHook = `Combining user-centered design intuition with technical systems thinking in ${keySkills}, I transform complex workflows into delightful, high-converting digital products.`;
      bodyFocus = `My approach couples qualitative customer empathy with rigorous data validation. Recently, this led to ${keyAchievement}. I am eager to bring this passion for craft to ${targetCompany}.`;
    } else if (selectedMeta.category === 'Marketing') {
      roleSpecificHook = `With proven experience driving omni-channel acquisition and brand awareness through ${keySkills}, I thrive at the intersection of creative storytelling and analytical performance.`;
      bodyFocus = `Throughout my campaigns, I have focused on scalable ROI, including ${keyAchievement}. I am inspired by ${targetCompany}'s market position and look forward to accelerating your audience growth.`;
    } else {
      roleSpecificHook = `With a dedicated background focused on ${keySkills}, I have established a strong reputation for dependability, cross-functional collaboration, and measurable execution.`;
      bodyFocus = `A key highlight of my work includes ${keyAchievement}. I am deeply motivated by ${targetCompany}'s ongoing mission and values, and I am excited about the opportunity to contribute immediately.`;
    }

    return `${applicantName}
${applicantEmail} | ${applicantPhone}

${today}

${hiringManager}
${targetCompany}

Dear ${hiringManager},

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${targetCompany}. Having followed your recent milestones and industry impact, I am energized by the opportunity to contribute my skills and perspectives to your team.

${roleSpecificHook}

${bodyFocus} Beyond my technical contributions, I prioritize clear communication, mentorship, and proactive cross-team collaboration. Whether coordinating sprints, aligning with executive stakeholders, or debugging intricate production issues, I take pride in delivering results with integrity and precision.

I would welcome the opportunity to discuss how my background and work ethic align with the goals of ${targetCompany}. Thank you for your time, consideration, and review of my application.

Sincerely,

${applicantName}`;
  };

  const letterText = generateLetterContent();
  const wordCount = letterText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    onShowToast('Cover letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([letterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${applicantName.toLowerCase().replace(/\s+/g, '_')}_cover_letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded cover letter text file!');
  };

  const handleSaveToBuilder = () => {
    const templateData = getDefaultCoverLetter(selectedTemplateId);
    templateData.personalInfo.fullName = applicantName;
    templateData.personalInfo.email = applicantEmail;
    templateData.personalInfo.phone = applicantPhone;
    templateData.recipientInfo.companyName = targetCompany;
    templateData.recipientInfo.hiringManagerName = hiringManager;
    templateData.sections.introduction = letterText;
    saveActiveCoverLetter(templateData);
    onShowToast(`Saved ${selectedMeta.name} letter to Cover Letter Builder!`);
    if (onNavigate) {
      onNavigate('/cover-letter-builder.html');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Industry Cover Letter Templates & Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pick from curated, role-tailored cover letter formulas, customize key achievements, and generate clean documents instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Letter'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download .txt</span>
          </button>

          <button
            onClick={handleSaveToBuilder}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Open in Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Template Category Picker */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
          Select Role Template
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {COVER_LETTER_TEMPLATES_LIST.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                setSelectedTemplateId(tpl.id);
                setJobTitle(tpl.role);
                onShowToast(`Selected ${tpl.name}`);
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                selectedTemplateId === tpl.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase ${selectedTemplateId === tpl.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                {tpl.category}
              </span>
              <span className="text-xs font-bold line-clamp-1">
                {tpl.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Live Preview 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs: 5 Cols */}
        <div className="lg:col-span-5 glass-card p-5 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-500" /> Customize Application Details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Your Full Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Phone</label>
                <input
                  type="text"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Target Company</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Hiring Manager</label>
                <input
                  type="text"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Target Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Key Technical / Domain Skills</label>
              <input
                type="text"
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Measurable Achievement / Metric</label>
              <textarea
                rows={2}
                value={keyAchievement}
                onChange={(e) => setKeyAchievement(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Preview: 7 Cols */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" /> Formatted Document Preview
            </span>
            <span className="font-mono">
              {wordCount} words • ~{readingTime} min read
            </span>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-200 shadow-lg min-h-[480px] whitespace-pre-wrap selection:bg-indigo-500/20">
            {letterText}
          </div>
        </div>
      </div>
    </div>
  );
};
