/**
 * Site-wide settings. This is the one file the family is expected to edit
 * for things like the dedication on the homepage.
 *
 * Which posts appear under "Start here" is set per post, with
 * `featured: true` in the post's front matter (src/content/posts/*.md).
 */

export const SITE = {
  title: 'Swaying Branches',
  author: 'Edward Ringler',
  years: '2013–2022',
  description:
    'Swaying Branches, the blog of Edward Ringler, written between 2013 and 2022 and preserved with his words unchanged.',
  url: 'https://swayingbranches.yehudardevelopment.com',
  originalBlog: 'https://swaying-branches.blogspot.com/',
  /** Ed's recipe cards, typed up and searchable. */
  recipesSite: 'https://recipes.yehudardevelopment.com/',
  /** Blogger published in Pacific time; dates are shown in this zone so they match the original posts. */
  timeZone: 'America/Los_Angeles',
} as const;

/**
 * The dedication shown at the top of the homepage.
 * Each string is one paragraph. Replace the text and set `isPlaceholder`
 * to false when the family has written the final version.
 */
export const DEDICATION = {
  isPlaceholder: false,
  paragraphs: [
    'Ed wrote here between 2013 and 2022, about the trees outside his porch, his childhood summers, his work, his faith and the questions of the day.',
    'His posts are kept as he wrote them, so that family, friends and anyone who finds them can keep reading.',
  ],
} as const;

/**
 * The fixed list of topics. Every post has exactly one, set with `topic:`
 * in its front matter. The slug is used in the address, e.g. /topics/memories-places/.
 */
export const TOPICS = [
  { name: 'Reflections & Nature', slug: 'reflections-nature' },
  { name: 'Memories & Places', slug: 'memories-places' },
  { name: 'Faith & Philosophy', slug: 'faith-philosophy' },
  { name: 'Work & Career', slug: 'work-career' },
  { name: 'Canoeing & Outdoors', slug: 'canoeing-outdoors' },
  { name: 'Food & Recipes', slug: 'food-recipes' },
  { name: 'Politics & Society', slug: 'politics-society' },
  { name: 'Health & Medicine', slug: 'health-medicine' },
] as const;

export type TopicName = (typeof TOPICS)[number]['name'];
export type Topic = (typeof TOPICS)[number];
