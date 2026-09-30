import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Award, Copy, Check, Calculator, RefreshCw, BookOpen, HelpCircle, ArrowRight, TrendingUp, FileText } from 'lucide-react';

interface CourseRecord {
  id: string;
  name: string;
  grade: string;
  gradePoints: number;
  credits: number;
  weightBonus: number; // 0 for standard, 0.5 for Honors, 1.0 for AP/Advanced
}

interface CollegeGpaCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const GRADE_SCALE: { label: string; points: number }[] = [
  { label: 'A+ (97–100%)', points: 4.0 },
  { label: 'A (93–96%)', points: 4.0 },
  { label: 'A- (90–92%)', points: 3.7 },
  { label: 'B+ (87–89%)', points: 3.3 },
  { label: 'B (83–86%)', points: 3.0 },
  { label: 'B- (80–82%)', points: 2.7 },
  { label: 'C+ (77–79%)', points: 2.3 },
  { label: 'C (73–76%)', points: 2.0 },
  { label: 'C- (70–72%)', points: 1.7 },
  { label: 'D+ (67–69%)', points: 1.3 },
  { label: 'D (63–66%)', points: 1.0 },
  { label: 'D- (60–62%)', points: 0.7 },
  { label: 'F (Below 60%)', points: 0.0 }
];

export const CollegeGpaCalculatorTool: React.FC<CollegeGpaCalculatorToolProps> = ({ onShowToast }) => {
  const [courses, setCourses] = useState<CourseRecord[]>([
    { id: '1', name: 'Calculus I (MATH 101)', grade: 'A', gradePoints: 4.0, credits: 4, weightBonus: 0 },
    { id: '2', name: 'Intro to Computer Science (CS 105)', grade: 'A-', gradePoints: 3.7, credits: 4, weightBonus: 0 },
    { id: '3', name: 'College Composition (ENG 101)', grade: 'B+', gradePoints: 3.3, credits: 3, weightBonus: 0 },
    { id: '4', name: 'General Chemistry with Lab (CHEM 110)', grade: 'A', gradePoints: 4.0, credits: 4, weightBonus: 0 },
    { id: '5', name: 'World History (HIST 120)', grade: 'B', gradePoints: 3.0, credits: 3, weightBonus: 0 }
  ]);

  // Cumulative GPA state
  const [includePriorGpa, setIncludePriorGpa] = useState<boolean>(false);
  const [priorGpa, setPriorGpa] = useState<number>(3.50);
  const [priorCredits, setPriorCredits] = useState<number>(30);

  // Target GPA Planner state
  const [targetGpa, setTargetGpa] = useState<number>(3.75);
  const [remainingCredits, setRemainingCredits] = useState<number>(45);

  const [copied, setCopied] = useState<boolean>(false);

  const addCourse = () => {
    const nextNum = courses.length + 1;
    setCourses([
      ...courses,
      {
        id: String(Date.now()),
        name: `Course ${nextNum}`,
        grade: 'A',
        gradePoints: 4.0,
        credits: 3,
        weightBonus: 0
      }
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) {
      onShowToast('At least one course is required.');
      return;
    }
    setCourses(courses.filter(c => c.id !== id));
  };

  const resetCalculator = () => {
    setCourses([
      { id: '1', name: 'Course 1', grade: 'A', gradePoints: 4.0, credits: 3, weightBonus: 0 },
      { id: '2', name: 'Course 2', grade: 'B+', gradePoints: 3.3, credits: 3, weightBonus: 0 },
      { id: '3', name: 'Course 3', grade: 'A-', gradePoints: 3.7, credits: 3, weightBonus: 0 },
      { id: '4', name: 'Course 4', grade: 'B', gradePoints: 3.0, credits: 3, weightBonus: 0 }
    ]);
    setIncludePriorGpa(false);
    onShowToast('Calculator reset to defaults');
  };

  const updateCourse = (id: string, field: keyof CourseRecord, value: any) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        if (field === 'grade') {
          const match = GRADE_SCALE.find(g => g.label.startsWith(value));
          const pts = match ? match.points : 4.0;
          return { ...c, grade: value, gradePoints: pts };
        }
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  // Calculations
  const totalSemesterCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
  const totalSemesterQualityPoints = courses.reduce((acc, c) => {
    const effectivePoints = (c.gradePoints || 0) + (c.weightBonus || 0);
    return acc + (effectivePoints * (Number(c.credits) || 0));
  }, 0);

  const semesterGpa = totalSemesterCredits > 0 ? (totalSemesterQualityPoints / totalSemesterCredits) : 0;

  // Cumulative calculation
  const priorQualityPoints = (Number(priorGpa) || 0) * (Number(priorCredits) || 0);
  const combinedTotalCredits = totalSemesterCredits + (includePriorGpa ? (Number(priorCredits) || 0) : 0);
  const combinedTotalQualityPoints = totalSemesterQualityPoints + (includePriorGpa ? priorQualityPoints : 0);
  const cumulativeGpa = combinedTotalCredits > 0 ? (combinedTotalQualityPoints / combinedTotalCredits) : 0;

  // Target GPA calculation
  // targetGpa * (currentTotalCredits + remainingCredits) = currentQualityPoints + (requiredGpa * remainingCredits)
  const currentTotalCredits = combinedTotalCredits;
  const currentQualityPoints = combinedTotalQualityPoints;
  const targetTotalCredits = currentTotalCredits + (Number(remainingCredits) || 0);
  const requiredQualityPoints = (Number(targetGpa) * targetTotalCredits) - currentQualityPoints;
  const requiredAverageGpa = (Number(remainingCredits) > 0) ? (requiredQualityPoints / Number(remainingCredits)) : 0;

  // Academic Standing & Honors
  const activeGpa = includePriorGpa ? cumulativeGpa : semesterGpa;
  let academicHonors = 'Good Standing';
  let badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  if (activeGpa >= 3.90) {
    academicHonors = 'Summa Cum Laude (Highest Honors)';
    badgeColor = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
  } else if (activeGpa >= 3.70) {
    academicHonors = 'Magna Cum Laude (High Honors)';
    badgeColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
  } else if (activeGpa >= 3.50) {
    academicHonors = 'Cum Laude (Dean\'s List Honors)';
    badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  } else if (activeGpa >= 3.00) {
    academicHonors = 'Dean\'s List Standing';
    badgeColor = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
  } else if (activeGpa < 2.00) {
    academicHonors = 'Academic Warning / Probation';
    badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  }

  const copySummary = () => {
    const lines = [
      `=== COLLEGE GPA REPORT (4.0 SCALE) ===`,
      `Semester GPA: ${semesterGpa.toFixed(2)} / 4.00`,
      `Total Semester Credits: ${totalSemesterCredits}`,
      `Total Quality Points: ${totalSemesterQualityPoints.toFixed(2)}`,
      includePriorGpa ? `Cumulative Overall GPA: ${cumulativeGpa.toFixed(2)} / 4.00 (${combinedTotalCredits} total credits)` : '',
      `Academic Standing: ${academicHonors}`,
      ``,
      `Courses Breakdown:`,
      ...courses.map(c => `- ${c.name || 'Course'}: Grade ${c.grade} (${c.gradePoints} pts) × ${c.credits} cr = ${(c.gradePoints * c.credits).toFixed(2)} QP`),
      ``,
      `Calculated on Zubware College GPA Calculator: https://www.zubware.com/college-gpa-calculator.html`
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    onShowToast('Copied GPA Academic Summary!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Interactive Tool Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-8">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  College & Semester GPA Calculator
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Standard 4.0 scale weighted quality points calculator with credit hours, letter grades, and cumulative blending.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetCalculator}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
              title="Reset to default courses"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={copySummary}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Summary'}
            </button>
          </div>
        </div>

        {/* Results Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Semester GPA
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              {semesterGpa.toFixed(2)}
              <span className="text-sm font-semibold text-slate-400 ml-1">/ 4.00</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {totalSemesterCredits} credit hours in {courses.length} courses
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Quality Points
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              {totalSemesterQualityPoints.toFixed(1)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sum of (Grade Pts × Credits)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {includePriorGpa ? 'Cumulative GPA' : 'Total Credits'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              {includePriorGpa ? cumulativeGpa.toFixed(2) : totalSemesterCredits}
              {includePriorGpa && <span className="text-sm font-semibold text-slate-400 ml-1">/ 4.00</span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {includePriorGpa ? `${combinedTotalCredits} combined credits` : 'Total semester hours'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Academic Standing
              </span>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${badgeColor}`}>
                  {academicHonors}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Based on standard 4.0 university honors scale
            </p>
          </div>
        </div>

        {/* Course Rows Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-500" />
              Semester Courses & Grades
            </h3>
            <button
              onClick={addCourse}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Course
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course, idx) => {
              const qp = (course.gradePoints + course.weightBonus) * course.credits;
              return (
                <div
                  key={course.id}
                  className="grid grid-cols-12 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 items-center transition hover:border-indigo-500/30"
                >
                  {/* Course Name */}
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
                      Course #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      placeholder={`e.g. Course ${idx + 1}`}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Letter Grade */}
                  <div className="col-span-5 sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
                      Grade
                    </label>
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {GRADE_SCALE.map(g => (
                        <option key={g.label} value={g.label.split(' ')[0]}>
                          {g.label.split(' ')[0]} ({g.points.toFixed(1)} pts)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Credit Hours */}
                  <div className="col-span-4 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
                      Credits
                    </label>
                    <select
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {[1, 1.5, 2, 3, 4, 5, 6].map(cr => (
                        <option key={cr} value={cr}>
                          {cr} {cr === 1 ? 'Credit' : 'Credits'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quality Points Display */}
                  <div className="col-span-2 sm:col-span-2 text-right sm:text-center">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
                      QP
                    </label>
                    <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 py-2">
                      {qp.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">QP</span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Remove course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={addCourse}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Another Course
            </button>
          </div>
        </div>

        {/* Cumulative GPA Blending & Target GPA Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          {/* Cumulative Blending */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePriorGpa}
                  onChange={(e) => setIncludePriorGpa(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                Include Prior Cumulative GPA
              </label>
            </div>

            {includePriorGpa && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Prior Cumulative GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={priorGpa}
                    onChange={(e) => setPriorGpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Prior Completed Credits
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="200"
                    value={priorCredits}
                    onChange={(e) => setPriorCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Blend your current semester grades with all previously completed college transcripts.
            </p>
          </div>

          {/* Target GPA Planner */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Target Graduation GPA Planner
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Target Graduation GPA
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="2.0"
                  max="4.0"
                  value={targetGpa}
                  onChange={(e) => setTargetGpa(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Remaining Credits
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="120"
                  value={remainingCredits}
                  onChange={(e) => setRemainingCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
              Required average GPA in remaining courses: {' '}
              <span className={`font-black ${requiredAverageGpa > 4.0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {requiredAverageGpa > 4.0 ? 'Mathematically Unattainable (>4.0)' : `${requiredAverageGpa.toFixed(2)} / 4.00`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Educational & SEO Content Sections */}
      <div className="space-y-12 text-slate-700 dark:text-slate-300">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            How to Calculate College GPA on a 4.0 Scale
          </h2>
          <p className="leading-relaxed">
            In North American universities and colleges, Grade Point Average (GPA) is the standard metric used to measure academic performance. Unlike high school grading systems that sometimes calculate simple percentage averages, college GPA is calculated as a <strong>credit-weighted average</strong>. This means classes with higher credit hours (such as 4-credit lab sciences or engineering courses) have a proportionally greater impact on your final GPA than 1-credit physical education or elective seminars.
          </p>
        </section>

        {/* Section 2: Formula */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            How the College GPA Formula Works
          </h2>
          <p className="leading-relaxed">
            The mathematical formula for calculating your semester or cumulative Grade Point Average is:
          </p>
          <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center font-mono text-base sm:text-lg font-black text-indigo-900 dark:text-indigo-200">
            GPA = Total Quality Points / Total Attempted Credit Hours
          </div>
          <p className="leading-relaxed text-sm">
            Where <strong>Quality Points</strong> for each course equal: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Course Credit Hours × Grade Point Value</code>.
          </p>
        </section>

        {/* Section 3: Grade Conversion Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            4.0 GPA Grade Conversion Table
          </h2>
          <p className="leading-relaxed text-sm">
            Below is the standard letter grade point scale utilized by most U.S. and Canadian higher education institutions:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-extrabold">
                  <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">Letter Grade</th>
                  <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">Percentage Equivalent</th>
                  <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">4.0 Grade Points</th>
                  <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">Academic Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">A+ / A</td><td className="p-3">93% – 100%</td><td className="p-3 font-mono font-bold">4.0</td><td className="p-3">Excellent (Dean's List / Honors)</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">A-</td><td className="p-3">90% – 92%</td><td className="p-3 font-mono font-bold">3.7</td><td className="p-3">Superior</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">B+</td><td className="p-3">87% – 89%</td><td className="p-3 font-mono font-bold">3.3</td><td className="p-3">Above Average</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">B</td><td className="p-3">83% – 86%</td><td className="p-3 font-mono font-bold">3.0</td><td className="p-3">Good / Competent</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">B-</td><td className="p-3">80% – 82%</td><td className="p-3 font-mono font-bold">2.7</td><td className="p-3">Satisfactory</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">C+</td><td className="p-3">77% – 79%</td><td className="p-3 font-mono font-bold">2.3</td><td className="p-3">Average</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">C</td><td className="p-3">73% – 76%</td><td className="p-3 font-mono font-bold">2.0</td><td className="p-3">Minimum Major Passing</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">C-</td><td className="p-3">70% – 72%</td><td className="p-3 font-mono font-bold">1.7</td><td className="p-3">Below Average</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">D+ / D</td><td className="p-3">63% – 69%</td><td className="p-3 font-mono font-bold">1.0 – 1.3</td><td className="p-3">Passing / Deficient</td></tr>
                <tr><td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">F</td><td className="p-3">Below 60%</td><td className="p-3 font-mono font-bold">0.0</td><td className="p-3">Failing (No Credit)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Worked Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            College GPA Calculation Example
          </h2>
          <p className="leading-relaxed text-sm">
            Suppose a student completes the following 4 courses during their Fall semester:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-extrabold">
                  <th className="p-3">Course</th>
                  <th className="p-3">Letter Grade</th>
                  <th className="p-3">Grade Points</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Quality Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr><td className="p-3 font-medium">Calculus I</td><td className="p-3 font-bold">A</td><td className="p-3">4.0</td><td className="p-3">4</td><td className="p-3 font-mono font-bold">16.0 QP</td></tr>
                <tr><td className="p-3 font-medium">English Composition</td><td className="p-3 font-bold">B+</td><td className="p-3">3.3</td><td className="p-3">3</td><td className="p-3 font-mono font-bold">9.9 QP</td></tr>
                <tr><td className="p-3 font-medium">Organic Chemistry</td><td className="p-3 font-bold">A-</td><td className="p-3">3.7</td><td className="p-3">4</td><td className="p-3 font-mono font-bold">14.8 QP</td></tr>
                <tr><td className="p-3 font-medium">Microeconomics</td><td className="p-3 font-bold">B</td><td className="p-3">3.0</td><td className="p-3">3</td><td className="p-3 font-mono font-bold">9.0 QP</td></tr>
                <tr className="bg-slate-50 dark:bg-slate-800/40 font-black text-slate-900 dark:text-white">
                  <td className="p-3" colSpan={3}>Totals</td>
                  <td className="p-3">14 Credits</td>
                  <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400">49.7 Total QP</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed text-sm">
            <strong>Calculation:</strong> <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">49.7 Total Quality Points / 14 Credits = 3.55 Semester GPA</code> (Cum Laude Standing).
          </p>
        </section>

        {/* Section 5: Semester vs Cumulative */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Semester GPA vs. Cumulative GPA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Semester GPA</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Represents your average academic performance for a single individual term (Fall, Spring, or Summer). It is used for semester-specific honors such as Dean’s List or term academic probation evaluation.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cumulative GPA</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Combines all completed semesters throughout your entire degree program. It represents your total quality points divided by total completed college credit hours and appears on your official graduation diploma.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Related Tools */}
        <section className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Related Academic & Grade Calculators
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Explore other specialized academic and numerical calculators in the Zubware suite:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <a
              href="/cgpa-calculator.html"
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition group block"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 flex items-center justify-between">
                CGPA to Percentage
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">For Indian university 10-point CBSE / VTU multiplier conversions.</p>
            </a>

            <a
              href="/percentage-calculator.html"
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition group block"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 flex items-center justify-between">
                Percentage Calculator
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Calculate score increases, grade markups, and exam percentages.</p>
            </a>

            <a
              href="/category/career-tools"
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition group block"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 flex items-center justify-between">
                Career & Resume Suite
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">ATS resume checker, cover letter builder, and career utilities.</p>
            </a>
          </div>
        </section>

        {/* Section 7: FAQs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Frequently Asked Questions (FAQ)
          </h2>
          <div className="space-y-3">
            <details className="group p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <summary className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                How do credit hours affect my college semester GPA?
                <span className="text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                Courses with more credit hours carry more weight. For example, earning an 'A' in a 4-credit course provides 16 Quality Points (4 × 4.0), whereas an 'A' in a 1-credit lab provides only 4 Quality Points (1 × 4.0). Quality points are summed and divided by total attempted credits.
              </p>
            </details>

            <details className="group p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <summary className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                What is the difference between this College GPA Calculator and the CGPA Calculator?
                <span className="text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                The College GPA Calculator computes credit-weighted semester and cumulative GPA on a 4.0 letter grade scale (A+ to F). In contrast, the <a href="/cgpa-calculator.html" className="text-indigo-600 dark:text-indigo-400 underline">CGPA Calculator</a> is designed for 10-point university grading systems (common in India and CBSE boards) and converts a 10.0 scale number into a percentage using standard university multipliers (such as 9.5x).
              </p>
            </details>

            <details className="group p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <summary className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                What GPA qualifies for graduation honors (Cum Laude)?
                <span className="text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                While specific thresholds vary by university, standard Latin honors benchmarks are typically: Cum Laude (Honors): 3.50 – 3.69 GPA; Magna Cum Laude (High Honors): 3.70 – 3.89 GPA; and Summa Cum Laude (Highest Honors): 3.90 – 4.00 GPA.
              </p>
            </details>

            <details className="group p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <summary className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                Are my grades or student transcripts stored on Zubware servers?
                <span className="text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                No. All GPA calculations execute 100% locally in your browser sandbox using client-side JavaScript. Your course names, credits, and grade history never leave your device.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
};
