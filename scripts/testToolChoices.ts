import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TOOL_CHOICES } from '../src/data/toolChoices';
import { TOOLS_DATA } from '../src/data/toolsData';
import { CATEGORIES_DATA } from '../src/data/categoriesData';
import { ToolChoiceGuide } from '../src/components/seo/ToolChoiceGuide';
import { getToolCanonicalPath } from '../src/lib/paths';
import { getMatchingGuidesForTool, getRelatedTools } from '../src/lib/workflowMap';
import articles from '../src/data/blogCatalog.json';

for (const category of CATEGORIES_DATA.filter(cat => cat.slug !== 'all')) {
  const choices = TOOL_CHOICES[category.slug];
  assert.ok(choices?.length >= 2, `Missing task guidance: ${category.slug}`);
  const client = renderToStaticMarkup(React.createElement(ToolChoiceGuide, { category: category.slug, tools: TOOLS_DATA }));
  const initial = fs.readFileSync(`dist/category/${category.slug}/index.html`, 'utf8');
  assert.ok(initial.includes(client), `Initial HTML must match the shared guidance: ${category.slug}`);
  for (const choice of choices) {
    const tool = TOOLS_DATA.find(tool => tool.id === choice.toolId);
    assert.ok(tool, `Unknown tool: ${choice.toolId}`);
    assert.ok(initial.includes(`href="${getToolCanonicalPath(tool)}"`));
    assert.ok(fs.existsSync(`dist${getToolCanonicalPath(tool)}/index.html`));
  }
}
const age = TOOLS_DATA.find(tool => tool.id === 'age-calculator')!;
const sample = [
  { slug: 'wrong', title: 'Best loan calculator', category: age.category, tags: ['calculator'], relatedToolIds: [] },
  { slug: 'right', title: 'Age at a cutoff date', category: age.category, tags: ['age'], relatedToolIds: [] },
];
assert.deepEqual(getMatchingGuidesForTool(age, sample).map(a => a.slug), ['right']);
assert.deepEqual(getMatchingGuidesForTool(age, sample, 0), []);
for (const tool of TOOLS_DATA) {
  const path = getToolCanonicalPath(tool);
  const page = fs.readFileSync(`dist${path}/index.html`, 'utf8');
  assert.ok(page.includes('<h1'), `Missing heading: ${path}`);
  assert.ok(page.includes(`rel="canonical" href="https://www.zubware.com${path}"`), `Canonical: ${path}`);
  const related = getRelatedTools(tool, TOOLS_DATA);
  assert.ok(!related.some(item => item.id === tool.id));
  assert.equal(new Set(related.map(item => item.id)).size, related.length);
  for (const guide of getMatchingGuidesForTool(tool, articles)) {
    assert.ok(fs.existsSync(`dist/blog/${guide.slug}/index.html`), `Missing guide: ${guide.slug}`);
  }
}
console.log(`Verified ${Object.keys(TOOL_CHOICES).length} task guides and ${TOOLS_DATA.length} tool canonicals, related tools and guide destinations.`);
