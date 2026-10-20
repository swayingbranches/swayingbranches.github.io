import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE, TOPICS, type Topic } from '../site.config';

export type Post = CollectionEntry<'posts'>;

/** All posts, oldest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
}

export function topicOf(post: Post): Topic {
  const topic = TOPICS.find((t) => t.name === post.data.topic);
  if (!topic) throw new Error(`Unknown topic "${post.data.topic}" in ${post.id}`);
  return topic;
}

export function topicUrl(topic: Topic): string {
  return `/topics/${topic.slug}/`;
}

/** The post's address, exactly as it was on the old site. */
export function postUrl(post: Post): string {
  return post.data.permalink;
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: SITE.timeZone,
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
const longDateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: SITE.timeZone,
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const isoParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: SITE.timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** "Jan 6, 2015", in the time zone the posts were published in. */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** "January 6, 2015". */
export function formatLongDate(date: Date): string {
  return longDateFormat.format(date);
}

/** "2015-01-06", for the datetime attribute of <time>. */
export function isoDate(date: Date): string {
  return isoParts.format(date);
}

export function yearOf(date: Date): number {
  return Number(isoDate(date).slice(0, 4));
}

/** Estimated reading time in minutes for the post's own text. */
export function readingMinutes(post: Post): number {
  const text = (post.body ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ');
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.round(words / 220));
}

export function readingLabel(post: Post): string {
  return `${readingMinutes(post)} min read`;
}

/** Number of images in the post, used to describe picture-heavy posts. */
export function imageCount(post: Post): number {
  return (post.body ?? '').match(/!\[[^\]]*\]\([^)]*\)|<img\b/g)?.length ?? 0;
}

/**
 * Some titles are used twice (two "Enhanced Resume" posts). For those the
 * page title also carries the date so the two can be told apart.
 */
export function hasDuplicateTitle(post: Post, all: Post[]): boolean {
  return all.some((p) => p.id !== post.id && p.data.title === post.data.title);
}

export function groupByTopic(posts: Post[]): { topic: Topic; posts: Post[] }[] {
  return TOPICS.map((topic) => ({
    topic,
    posts: posts.filter((p) => p.data.topic === topic.name),
  })).filter((g) => g.posts.length > 0);
}

export function groupByYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const years = [...new Set(posts.map((p) => yearOf(p.data.date)))].sort((a, b) => a - b);
  return years.map((year) => ({ year, posts: posts.filter((p) => yearOf(p.data.date) === year) }));
}

/** True once the family has reviewed every summary. */
export function allSummariesReviewed(posts: Post[]): boolean {
  return posts.every((p) => p.data.summary_reviewed || !p.data.summary_ai);
}
