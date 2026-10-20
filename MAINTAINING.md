# Looking after Swaying Branches

This is a short guide for family members. You do not need to be a programmer, and you never need to install anything: every change below can be made in your web browser on GitHub.

## How the site works

- Each of Ed's posts is a text file in [`src/content/posts/`](src/content/posts/). The top of each file, between the two `---` lines, holds the title, date, topic and summaries. Everything below the second `---` is his post.
- When a change is saved to the `main` branch, GitHub rebuilds the site and publishes it, usually within two or three minutes. You can watch progress on the **Actions** tab.
- The published site is plain web pages. If a rebuild ever fails, nothing is taken down: the last good version stays online until a later rebuild succeeds.

## One-time setting (do this before or when merging)

In the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. Without this, GitHub keeps trying to build the old Jekyll site and the new site will not appear (or the site will break). It only needs doing once. The custom domain stays the same; it comes from the file `public/CNAME`.

## Fix a typo in a post

1. Open [`src/content/posts/`](src/content/posts/) and click the post. Files are named by date, for example `2013-11-26-swaying-branches.md`.
2. Click the pencil icon (**Edit this file**).
3. Make the change. Please change only what is needed: the promise on the About page is that his words are unchanged.
4. Click **Commit changes…**, write a short note such as "Fix typo in Moodus post", and commit to `main`.

## Review or edit a summary

Each post has these lines near the top:

```yaml
summary: "One line, shown in lists."
summary_long: "Two or three sentences, shown at the top of the post."
summary_ai: true
summary_reviewed: false
```

- To **approve** a summary as it is, change `summary_reviewed: false` to `summary_reviewed: true`. The label on the post changes from "not yet reviewed by family" to "reviewed by family".
- To **rewrite** it, edit the text inside the quotes and set `summary_reviewed: true`. If the family wrote it from scratch, you can also set `summary_ai: false`.
- Keep the text inside straight double quotes `"…"`. If you need a double quote inside the text, use single quotes or write `\"`.
- The one-line `summary` must be under 200 characters.

The `topic` must be one of: Reflections & Nature, Memories & Places, Faith & Philosophy, Work & Career, Canoeing & Outdoors, Food & Recipes, Politics & Society, Health & Medicine. `tags` can hold up to four words or short phrases.

If something is typed wrongly (a missing quote, a topic spelled differently), the rebuild stops with an error on the **Actions** tab and the live site stays as it was. Fix the line and commit again.

## Add a link above a post

To point readers somewhere else (the Recipes post links to the recipe site this way), add to the post's top section:

```yaml
see_also:
  url: https://recipes.yehudardevelopment.com/
  text: "All of these recipes, typed up with adjustable servings"
```

It appears just below the summary and is not part of his text.

## Change the dedication

Edit [`src/site.config.ts`](src/site.config.ts). Under `DEDICATION`, replace the sentences in `paragraphs` (one quoted string per paragraph) and change `isPlaceholder: true` to `isPlaceholder: false`. That removes the "Draft dedication" note and the dashed border.

## Change the "Start here" posts

In a post's top section, set `featured: true` to add it to "Start here", or `featured: false` to remove it. Four or five posts works best.

## Software updates

You do not need to update anything. The exact versions of all the building tools are locked in `package-lock.json`, so the site builds the same way for years. Updating them is optional; only consider it if a rebuild starts failing, and ask someone comfortable with Node.js to run `npm update` and check the result.

## For anyone working on the code

```sh
nvm use            # Node version from .nvmrc
npm ci
npm run dev        # local preview at http://localhost:4321 (search works only after a build)
npm run build      # astro check + astro build + Pagefind index
npm run check:urls # confirms every old address exists in dist/
npm run preview    # serve the built site
```
