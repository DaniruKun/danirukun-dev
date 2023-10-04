import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	const items = posts.map((post) => ({
		title: post.data.title,
		pubDate: post.data.pubDate,
		description: post.data.description,
		customData: post.data.customData,
		// Compute RSS link from post `slug`
		// This example assumes all posts are rendered as `/blog/[slug]` routes
		link: `/blog/${post.slug}/`,
	}));

	return rss({
		items,
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
	});
}
