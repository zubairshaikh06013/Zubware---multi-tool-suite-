import assert from 'node:assert/strict';
import { CATEGORIES, STYLES, generateYouTubeTitles } from '../src/lib/youtubeTitleSuggestions';

// Regression: the former Urgency style returned the same title six times.
for (const category of CATEGORIES) {
  for (const style of STYLES) {
    for (const topic of ['Zubware tools', 'कैसे सीखें', '  ', 'A'.repeat(120)]) {
      const titles = generateYouTubeTitles(topic, category, style);
      assert.equal(titles.length, 6, `${category}: ${style} should provide six distinct drafts`);
      assert.equal(new Set(titles).size, 6);
      assert.ok(titles.every(title => title.includes(topic.trim() || 'My Video Topic')));
    }
  }
}
const drafts = generateYouTubeTitles('sample topic', 'Tech', 'Warnings & Checklists');
assert.ok(drafts.every(title => !title.includes('URGENT')));
assert.notDeepEqual(drafts, generateYouTubeTitles('another topic', 'Tech', 'Warnings & Checklists'));
console.log('Title drafts: 60 category/style combinations, unique output and empty/Unicode/long topics passed.');
