export const CATEGORIES = [
  'Tutorial', 'Review', 'Gaming', 'Education', 'Tech',
  'Finance', 'AI', 'Vlog', 'Shorts', 'News', 'Islamic', 'Entertainment'
] as const;

export type Category = typeof CATEGORIES[number];

export const STYLES = ['High CTR & Curiosity', 'How-To & Guides', 'Listicles & Top 10', 'Debate & Questions', 'Warnings & Checklists'];

export function generateYouTubeTitles(topic: string, category: Category, style: string): string[] {
    const raw = topic.trim() || 'My Video Topic';
    const cap = raw.charAt(0).toUpperCase() + raw.slice(1);

    const titleTemplates: Record<Category, string[]> = {
      Tutorial: [
        `How to Master ${cap} in 10 Minutes (Step-by-step)`,
        `Stop Doing ${cap} Wrong! Do THIS Instead`,
        `The Ultimate ${cap} Tutorial for Beginners (2026)`,
        `Learn ${cap} From Scratch: Complete Practical Guide`,
        `5 Easy Steps to Master ${cap} Fast!`,
        `${cap} Explained Simply (No Experience Needed)`
      ],
      Review: [
        `Is ${cap} ACTUALLY Worth It? Honest Unfiltered Review`,
        `I Tried ${cap} For 30 Days (Real Results)`,
        `${cap} Review: Don't Buy Until You Watch THIS!`,
        `The Truth About ${cap} (Pros, Cons & Regrets)`,
        `${cap} vs The Competition: Which One Wins?`,
        `Why Everyone Is Talking About ${cap}!`
      ],
      Gaming: [
        `I Spent 100 Hours Testing ${cap} (INSANE RESULTS)`,
        `The Most BROKEN ${cap} Strategy You Must Try`,
        `Noob vs Pro in ${cap}: Impossible Challenge!`,
        `Only 1% Of Players Know This ${cap} Secret`,
        `I Unlocked Everything in ${cap} So You Don't Have To`,
        `10 Secret Tips for ${cap} You Missed!`
      ],
      Education: [
        `The Shocking Truth About ${cap} (Explained)`,
        `Everything You Need to Know About ${cap}`,
        `Why ${cap} Will Change Everything in 2026`,
        `The Hidden Math/Science Behind ${cap}`,
        `${cap}: 5 Deep Insights Most People Miss`,
        `A Complete Breakdown of ${cap} Made Simple`
      ],
      Tech: [
        `The Future of ${cap} Is HERE (Full Breakdown)`,
        `Why ${cap} Changes EVERYTHING For Tech in 2026`,
        `I Built a Project Using ${cap} in 24 Hours!`,
        `${cap} Top Features You Need to Use Right Now`,
        `Don't Ignore ${cap}: The Next Big Revolution`,
        `The Ultimate Tech Setup with ${cap}`
      ],
      Finance: [
        `How to Make Money with ${cap} in 2026 (Beginner Guide)`,
        `The ${cap} Mistake Costing You Thousands!`,
        `How I Turned ${cap} into Passive Income`,
        `3 ${cap} Strategies That ACTUALLY Work`,
        `Is ${cap} Still Profitable? Honest Analysis`,
        `The Smart Way to Invest in ${cap}`
      ],
      AI: [
        `I Replaced My Workflow with ${cap} AI (Mind Blown)`,
        `10 Secret ${cap} AI Prompts You Didn't Know Exist`,
        `${cap} AI Just Made Everything Else Obsolete!`,
        `How to Use ${cap} AI Like a Pro in 5 Minutes`,
        `The DARK Side of ${cap} AI No One Is Talking About`,
        `Automate Your Entire Life with ${cap} AI`
      ],
      Vlog: [
        `A Day in My Life Testing ${cap} (Unexpected Ending)`,
        `I Tried ${cap} For a Week and THIS Happened!`,
        `We Need to Talk About ${cap}...`,
        `My HONEST Thoughts on ${cap} After 1 Year`,
        `Behind the Scenes of ${cap} (Raw & Uncut)`,
        `A Life-Changing Experience with ${cap}`
      ],
      Shorts: [
        `Do THIS for ${cap}! 😱 #Shorts`,
        `Secret ${cap} Trick You Need NOW! 🔥`,
        `Stop Doing ${cap} Like This! ❌`,
        `${cap} In 30 Seconds! ⚡`,
        `Mind-Blowing ${cap} Hack! 💡`,
        `You Won't Believe This ${cap} Secret! 🚀`
      ],
      News: [
        `BREAKING: Major Update on ${cap} Announced!`,
        `What Just Happened to ${cap}? Full Report`,
        `The Real Reason Behind the ${cap} Crisis`,
        `Everything Changing About ${cap} Starting Today`,
        `Why ${cap} Is Trending Worldwide Right Now`,
        `What You Must Know About ${cap} Today`
      ],
      Islamic: [
        `The Powerful Blessings of ${cap} in Islam`,
        `How to Practice ${cap} According to Sunnah`,
        `Beautiful Daily Guide to ${cap} for Peace`,
        `Understanding ${cap}: Meaning & Spiritual Rewards`,
        `3 Important Lessons About ${cap} Every Muslim Should Know`,
        `The Spiritual Impact of ${cap} in Daily Life`
      ],
      Entertainment: [
        `Top 10 Craziest Moments in ${cap} (Ranked)`,
        `Reacting to the Most Unbelievable ${cap} Videos!`,
        `I Tried ${cap} Challenge (Extreme Mode)`,
        `The Funniest ${cap} Fail Compilation Ever`,
        `We Tested Every Single ${cap} So You Don't Have To`,
        `10 Secrets Hidden in ${cap} You Never Noticed`
      ]
    };

    let base = titleTemplates[category] || titleTemplates['Tech'];

    if (style.includes('How-To')) {
      base = base.map(t => t.startsWith('How') ? t : `How To Master ${raw}: ${t}`);
    } else if (style.includes('Listicles')) {
      base = base.map((t, idx) => `Top ${ (idx + 1) * 3 } Secrets About ${raw} You Must Know`);
    } else if (style.includes('Debate')) {
      base = base.map(t => `Is ${raw} Overrated? ${t}`);
    } else if (style.includes('Warnings')) {
      base = [
        `Before You Try ${cap}: What to Check`,
        `${cap}: Common Mistakes to Avoid`,
        `Getting Started with ${cap}? Read This Checklist`,
        `${cap}: Questions to Ask First`,
        `Planning ${cap}: Things to Consider`,
        `${cap}: A Practical Preparation Guide`
      ];
    }

    return [...new Set(base)];
}
