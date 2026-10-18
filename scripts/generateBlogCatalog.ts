import fs from 'node:fs';
import { BLOG_ARTICLES } from '../src/data/blogArticles';

/** Listing cards need metadata only; article bodies stay in the article route chunk. */
export function generateBlogCatalog() {
  const catalog = BLOG_ARTICLES.map(({slug, title, description, canonicalPath, publishedTime, author, category, readingTime, tags, excerpt, relatedToolIds}) => ({
    slug, title, description, canonicalPath, publishedTime, author:{name:author.name}, category, readingTime, tags, excerpt, relatedToolIds,
  }));
  const file = new URL('../src/data/blogCatalog.json', import.meta.url);
  const content = JSON.stringify(catalog, null, 2) + '\n';
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) fs.writeFileSync(file, content);
}
