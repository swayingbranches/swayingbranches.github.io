# Swaying Branches

The blog of Edward Ringler, written between 2013 and 2022 and originally published at swaying-branches.blogspot.com. It is preserved here, with his words unchanged, at <https://swayingbranches.yehudardevelopment.com>.

The site is built with [Astro](https://astro.build) and published to GitHub Pages by GitHub Actions. Search is provided by [Pagefind](https://pagefind.app). Every post keeps its original address (for example `/2013/11/swaying-branches.html`), and `/feed.xml` is the RSS feed.

- Posts: [`src/content/posts/`](src/content/posts/), one Markdown file each. The summaries and topics at the top of each file were written with AI and are marked as such on the site until the family reviews them.
- Site settings and the homepage dedication: [`src/site.config.ts`](src/site.config.ts).
- How to fix a typo, review a summary or change the featured posts: [MAINTAINING.md](MAINTAINING.md).

```sh
npm ci
npm run build       # type check, build, search index
npm run check:urls  # every old address must exist in dist/
```

Requires Node.js 22 (see `.nvmrc`). In the repository settings, **Pages → Source** must be set to **GitHub Actions**.
