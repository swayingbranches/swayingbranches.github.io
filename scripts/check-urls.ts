/**
 * Fails if any address the old site served is missing from the build.
 *
 * Run after `npm run build`:  npm run check:urls
 *
 * It reads every post's `permalink` from src/content/posts/*.md (so a post
 * added later is checked too) and also requires the fixed pages below.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const postsDir = join(root, 'src', 'content', 'posts');

/** Posts on the old site. The count guards against posts silently going missing. */
const EXPECTED_POSTS = 42;

const fixedPages = ['/about/index.html', '/feed.xml', '/404.html', '/index.html', '/sitemap-index.xml', '/CNAME'];

function permalinks(): string[] {
  return readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const text = readFileSync(join(postsDir, f), 'utf8');
      const match = /^permalink:\s*(\S+)\s*$/m.exec(text);
      if (!match?.[1]) throw new Error(`No permalink in ${f}`);
      return match[1];
    });
}

if (!existsSync(dist)) {
  console.error('dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

const posts = permalinks();
const required = [...posts, ...fixedPages];
const missing = required.filter((path) => !existsSync(join(dist, path)));
const problems: string[] = missing.map((path) => `missing: ${path}`);

if (posts.length < EXPECTED_POSTS) {
  problems.push(`expected at least ${EXPECTED_POSTS} posts, found ${posts.length}`);
}
const duplicates = posts.filter((p, i) => posts.indexOf(p) !== i);
for (const d of duplicates) problems.push(`duplicate permalink: ${d}`);

const feed = existsSync(join(dist, 'feed.xml')) ? readFileSync(join(dist, 'feed.xml'), 'utf8') : '';
for (const p of posts) {
  if (feed && !feed.includes(p)) problems.push(`feed.xml does not link ${p}`);
}

if (problems.length > 0) {
  console.error(`URL check failed (${problems.length} problem${problems.length === 1 ? '' : 's'}):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(`URL check passed: ${posts.length} post permalinks and ${fixedPages.length} fixed pages are in dist/.`);
