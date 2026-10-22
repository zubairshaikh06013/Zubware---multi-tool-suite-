import assert from 'node:assert/strict';
import { hasResumeKeyword, resumeWordCount } from '../src/lib/resumeKeywordMatch';
for (const [text, keyword] of [['JavaScript developer', 'java'], ['Django engineer', 'go'], ['digital marketing', 'git'], ['PostgreSQL administration', 'sql'], ['reactive systems', 'react'], ['C++ developer', 'C'], ['mentoring teammates', 'mentor']]) {
  assert.equal(hasResumeKeyword(text, keyword), false, `${keyword} must not match inside ${text}`);
}
for (const [text, keyword] of [['Java, JavaScript and Go.', 'java'], ['Skills: Node.js / React', 'node.js'], ['Build CI/CD pipelines', 'ci/cd'], ['Uses C++ daily', 'c++'], ['REST\nAPI design', 'rest api'], ['TypeScript engineer', 'typescript'], ['Python/SQL developer', 'sql']]) {
  assert.equal(hasResumeKeyword(text, keyword), true, `${keyword} should match ${text}`);
}
assert.equal(hasResumeKeyword('abc', ''), false);
assert.equal(resumeWordCount('  one\n two\tthree  '), 3);
assert.equal(resumeWordCount('a '.repeat(100)), 100);
assert.equal(resumeWordCount('longword'.repeat(100)), 1);
console.log('Resume matching: whole skills, punctuation, whitespace and real word counts passed.');
