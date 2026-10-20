import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { getPosts, postUrl } from '../lib/posts';

/** Served at /feed.xml, the same address the old Jekyll feed used. */
export async function GET(context: APIContext): Promise<Response> {
  const posts = (await getPosts()).reverse();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: postUrl(post),
      author: SITE.author,
      categories: [post.data.topic],
      content: post.rendered?.html ?? '',
    })),
    customData: '<language>en-us</language>',
  });
}
