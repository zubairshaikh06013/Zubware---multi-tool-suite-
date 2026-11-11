import fs from 'node:fs';
import path from 'node:path';

/** Keep only the icons already used by the initial tool directory in its shared chunk. */
export function initialToolIconFiles(root: string): Set<string> {
  const source = fs.readFileSync(path.join(root, 'src/components/common/ToolIcon.tsx'), 'utf8');
  const imports = source.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
  if (!imports) throw new Error('Cannot find the initial ToolIcon imports');
  const names = new Set(imports[1].split(',').map(part => part.trim().split(/\s+as\s+/)[0]));
  const exports = fs.readFileSync(path.join(root, 'node_modules/lucide-react/dist/esm/lucide-react.js'), 'utf8');
  const files = new Set<string>();
  for (const match of exports.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"]\.\/icons\/([^'"]+)['"]/g)) {
    if (match[1].split(',').some(part => names.has(part.trim().replace(/^default\s+as\s+/, '')))) {
      files.add(match[2]);
    }
  }
  if (!files.size) throw new Error('Cannot resolve initial icons in the installed Lucide package');
  return files;
}
