import path from 'node:path';
import type { ToolMeta } from '../src/types';
import { getToolCanonicalPath } from '../src/lib/paths';

export interface BuildChunk { file: string; imports?: string[]; dynamicImports?: string[]; }
export type BuildManifest = Record<string, BuildChunk>;

/** Discover the existing lazy route bindings; hints never execute a different tool. */
export function buildPageModuleHints(appSource: string, tools: ToolMeta[], manifest: BuildManifest): Map<string, string> {
  const components = new Map<string, string>();
  for (const match of appSource.matchAll(/const\s+(\w+)\s*=\s*lazy(?:WithRetry)?\(\(\)\s*=>\s*import\(['"](\.[^'"]+)['"]\)/g)) {
    components.set(match[1], path.posix.normalize(`src/${match[2]}`).replace(/\.(?:tsx?|jsx?)$/, '') + '.tsx');
  }
  const sourceByTool = new Map<string, string>();
  for (const match of appSource.matchAll(/activeTool\.id\s*===\s*['"]([^'"]+)['"]\s*&&\s*<(\w+)/g)) {
    const source = components.get(match[2]);
    if (source) sourceByTool.set(match[1], source);
  }
  const hints = new Map<string, string>();
  const add = (route: string, source?: string) => {
    const file = source && manifest[source]?.file;
    if (file) hints.set(route, `/${file}`);
  };
  for (const tool of tools) add(getToolCanonicalPath(tool), sourceByTool.get(tool.id));
  for (const [route, component] of Object.entries({
    '/blog': 'BlogIndexPage', '/categories': 'CategoryPage', '/about': 'AboutPage',
    '/privacy': 'PrivacyPolicyPage', '/terms': 'TermsPage', '/disclaimer': 'DisclaimerPage',
    '/contact': 'ContactPage', '/help': 'HelpPage', '/changelog': 'ChangelogPage',
    '/feedback': 'FeedbackPage', '/dashboard': 'DashboardPage',
  })) add(route, components.get(component));
  // Variable path suffixes share their page shell, not every page's tool modules.
  add('/blog/*', components.get('BlogPostPage'));
  add('/category/*', components.get('CategoryPage'));
  return hints;
}

export function pageModuleHint(route: string, hints: Map<string, string>): string | undefined {
  return hints.get(route) || (route.startsWith('/blog/') ? hints.get('/blog/*') : route.startsWith('/category/') ? hints.get('/category/*') : undefined);
}
