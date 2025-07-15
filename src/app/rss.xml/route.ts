import RSS from 'rss';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type Post = { id: number; title: string; date: string; excerpt: string; };

function getSortedPostsData(): Post[] {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        return { ...(matterResult.data as Post) };
    });
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function GET() {
    const siteUrl = 'https://chanbeen.com';
    const allPosts = getSortedPostsData();

    const feed = new RSS({
        title: '김찬빈.dev 💻',
        description: 'Dev-bini\'s Tech Blog.',
        feed_url: `${siteUrl}/rss.xml`,
        site_url: siteUrl,
        language: 'ko',
    });

    // 피드 아이템 추가
    allPosts.forEach(post => {
        feed.item({
            title: post.title,
            description: post.excerpt,
            url: `${siteUrl}/posts/${post.id}`,
            guid: `${siteUrl}/posts/${post.id}`,
            date: post.date,
        });
    });

    // XML 문자열 생성
    const xml = feed.xml({ indent: true });
    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
