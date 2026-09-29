import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ToolUpdate } from './batch6/types';
import { CLUSTER_1A_DEV_TOOLS } from './batch6/cluster1a_dev';
import { CLUSTER_1B_DEV_TOOLS } from './batch6/cluster1b_dev';
import { CLUSTER_2_TEXT_TOOLS } from './batch6/cluster2_text';
import { CLUSTER_3_DESIGN_TOOLS } from './batch6/cluster3_design';
import { CLUSTER_4_PROMPT_TOOLS } from './batch6/cluster4_prompts';
import { CLUSTER_5_SOCIAL_TOOLS } from './batch6/cluster5_social';
import { CLUSTER_6_CAREER_BUSINESS_TOOLS } from './batch6/cluster6_career_business';
import { CLUSTER_7_SECURITY_AUDIO_TOOLS } from './batch6/cluster7_security_audio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BATCH_6_TOOLS: Record<string, ToolUpdate> = {
  ...CLUSTER_1A_DEV_TOOLS,
  ...CLUSTER_1B_DEV_TOOLS,
  ...CLUSTER_2_TEXT_TOOLS,
  ...CLUSTER_3_DESIGN_TOOLS,
  ...CLUSTER_4_PROMPT_TOOLS,
  ...CLUSTER_5_SOCIAL_TOOLS,
  ...CLUSTER_6_CAREER_BUSINESS_TOOLS,
  ...CLUSTER_7_SECURITY_AUDIO_TOOLS
};

export function updateBatch6InToolsData() {
  const filePath = path.resolve(__dirname, '../src/data/toolsData.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  let updatedCount = 0;
  const toolIds = Object.keys(BATCH_6_TOOLS);
  console.log(`Starting Batch 6 update for ${toolIds.length} tools...`);

  for (const [toolId, update] of Object.entries(BATCH_6_TOOLS)) {
    const idRegex = new RegExp(`(\\n\\s*id:\\s*['"]${toolId}['"],)`);
    const match = content.match(idRegex);
    if (!match || match.index === undefined) {
      console.error(`Tool ID not found: ${toolId}`);
      continue;
    }

    const startIndex = match.index;
    const afterId = content.slice(startIndex);
    const endMatch = afterId.match(/\n  \}(,?)/);
    if (!endMatch || endMatch.index === undefined) {
      console.error(`Could not find end of tool object: ${toolId}`);
      continue;
    }

    const toolBlockLength = endMatch.index + endMatch[0].length;
    let toolChunk = afterId.slice(0, toolBlockLength);

    const howToIndent = '    ';
    const howToFormatted = `${howToIndent}howTo: [\n` +
      update.howTo.map(step => 
        `${howToIndent}  { title: ${JSON.stringify(step.title)}, desc: ${JSON.stringify(step.desc)} }`
      ).join(',\n') +
      `\n${howToIndent}]`;

    const faqFormatted = `${howToIndent}faq: [\n` +
      update.faq.map(item =>
        `${howToIndent}  { question: ${JSON.stringify(item.question)}, answer: ${JSON.stringify(item.answer)} }`
      ).join(',\n') +
      `\n${howToIndent}]`;

    if (toolChunk.includes('howTo:')) {
      toolChunk = toolChunk.replace(/\n\s*howTo:\s*\[[\s\S]*?\n\s*\]/, `\n${howToFormatted}`);
    } else {
      if (toolChunk.includes('features:')) {
        const featMatch = toolChunk.match(/\n\s*features:\s*\[[\s\S]*?\],?/);
        if (featMatch && featMatch.index !== undefined) {
          const insertPos = featMatch.index + featMatch[0].length;
          let before = toolChunk.slice(0, insertPos);
          if (!before.endsWith(',')) before += ',';
          toolChunk = before + `\n${howToFormatted},` + toolChunk.slice(insertPos);
        } else {
          toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${howToFormatted}\n  }$1`);
        }
      } else {
        toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${howToFormatted}\n  }$1`);
      }
    }

    if (toolChunk.includes('faq:')) {
      toolChunk = toolChunk.replace(/\n\s*faq:\s*\[[\s\S]*?\n\s*\]/, `\n${faqFormatted}`);
    } else {
      const howToMatch = toolChunk.match(/\n\s*howTo:\s*\[[\s\S]*?\n\s*\]/);
      if (howToMatch && howToMatch.index !== undefined) {
        const insertPos = howToMatch.index + howToMatch[0].length;
        let before = toolChunk.slice(0, insertPos);
        if (!before.endsWith(',')) before += ',';
        toolChunk = before + `\n${faqFormatted},` + toolChunk.slice(insertPos);
      } else {
        toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${faqFormatted}\n  }$1`);
      }
    }

    toolChunk = toolChunk.replace(/,(\s*\n\s*\},?)$/, '$1');
    toolChunk = toolChunk.replace(/,\s*,/g, ',');

    content = content.slice(0, startIndex) + toolChunk + content.slice(startIndex + toolBlockLength);
    updatedCount++;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${updatedCount} Batch 6 tools in toolsData.ts.`);
}

if (process.argv[1] && process.argv[1].endsWith('updateBatch6Tools.ts')) {
  updateBatch6InToolsData();
}
