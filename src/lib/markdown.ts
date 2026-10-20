/**
 * Markdown compatibility plugins.
 *
 * The posts were written for Jekyll's kramdown renderer. Astro renders them
 * with its default CommonMark processor (Sätteri), which reads a few things
 * differently. These plugins make the output match what kramdown produced,
 * without touching the text of any post.
 */
import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type MdastEntry = NonNullable<SatteriProcessorOptions['mdastPlugins']>[number];
type HastEntry = NonNullable<SatteriProcessorOptions['hastPlugins']>[number];
type MdastPlugin = Extract<MdastEntry, { name: string }>;
type HastPlugin = Extract<HastEntry, { name: string }>;

/**
 * kramdown treats `1)` at the start of a line as plain text; CommonMark
 * starts an ordered list. Turn such lists back into paragraphs.
 */
const parenthesisListsAsText: MdastPlugin = {
  name: 'kramdown-parenthesis-lists',
  options: { position: true },
  list(node, ctx) {
    if (!node.ordered) return;
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start === undefined || end === undefined) return;
    const source = ctx.source.slice(start, end);
    if (!/^\s*\d+\)/.test(source)) return;
    // Escape the `)` so the same text re-parses as paragraphs.
    return { raw: source.replace(/^(\s*\d+)\)/gm, '$1\\)') };
  },
};

/**
 * kramdown's `markdown="1"` attribute asks for Markdown inside an HTML block.
 * CommonMark keeps the first lines of such a block as raw HTML, so re-parse
 * them as Markdown and keep only the opening tag as HTML.
 */
const markdownInsideHtml: MdastPlugin = {
  name: 'kramdown-markdown-attribute',
  html(node, ctx) {
    const match = /^(<(div|section|span)\b[^>]*?)\s+markdown="1"([^>]*>)\s*\n?([\s\S]*)$/.exec(node.value);
    if (!match) return;
    const [, openStart = '', , openEnd = '', inner = ''] = match;
    const replacement: ({ type: 'html'; value: string } | { raw: string })[] = [
      { type: 'html', value: openStart + openEnd },
    ];
    if (inner.trim()) replacement.push({ raw: inner });
    ctx.replaceNode(node, replacement);
  },
};

/**
 * kramdown turns a line ending in `\\` into a line break. In CommonMark that
 * is an escaped backslash followed by an ordinary newline.
 */
const backslashLineBreaks: MdastPlugin = {
  name: 'kramdown-backslash-breaks',
  text(node, ctx) {
    if (!node.value.includes('\\\n')) return;
    const parts = node.value.split('\\\n');
    const replacement: ({ type: 'text'; value: string } | { type: 'break' })[] = [];
    parts.forEach((part, i) => {
      if (i > 0) replacement.push({ type: 'break' });
      if (part) replacement.push({ type: 'text', value: part });
    });
    ctx.replaceNode(node, replacement);
  },
};

/**
 * Typography the way kramdown does it: `---` is an em dash and `--` an en
 * dash, read left to right (so a long run of hyphens becomes em dashes and,
 * if needed, one en dash). Quotes: a double quote straight after a letter or
 * digit closes rather than opens, as in OB"M...
 */
const kramdownTypography: MdastPlugin = {
  name: 'kramdown-typography',
  text(node) {
    const value = node.value
      .replace(/---|--/g, (m) => (m === '---' ? '—' : '–'))
      .replace(/(?<=[\p{L}\p{N}])“/gu, '”')
      // ...and a single quote after a space opens, as in ''spoke''.
      .replace(/(?<=[\s(‘“])’(?=[\p{L}‘’])/gu, '‘');
    if (value === node.value) return;
    return { type: 'text', value };
  },
};

/**
 * Images: load lazily, and link each one to the full-size file so recipe
 * cards and charts can be opened and zoomed.
 */
const imageLinks: HastPlugin = {
  name: 'image-links',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      ctx.setProperty(node, 'loading', 'lazy');
      ctx.setProperty(node, 'decoding', 'async');
      const src = node.properties['src'];
      const parent = ctx.parent(node);
      const insideLink = parent?.type === 'element' && parent.tagName === 'a';
      if (typeof src !== 'string' || insideLink) return;
      const alt = typeof node.properties['alt'] === 'string' ? node.properties['alt'] : 'image';
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'a',
        properties: {
          href: src,
          className: ['image-link'],
          title: `Open full size: ${alt}`,
        },
        children: [],
      });
    },
  },
};

export const mdastPlugins = [
  markdownInsideHtml,
  parenthesisListsAsText,
  backslashLineBreaks,
  kramdownTypography,
];
export const hastPlugins = [imageLinks];
