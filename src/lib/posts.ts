import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Element, Root } from 'hast';
import remarkGfm from 'remark-gfm';

export type Post = {
    id: number;
    title: string;
    date: string;
    excerpt: string;
    tags?: string[];
    thumbnail?: string;
};

export type PostContentData = Post & {
    contentHtml: string;
};

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData(): Post[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            ...(matterResult.data as Post),
        };
    });
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 모든 글
export function getAllPosts(): Post[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        return {
            ...(matterResult.data as Post),
        };
    });
    return allPostsData;
}

// 모든 태그
export function getAllTags(posts: Post[]): { tag: string; count: number }[] {
    const tagCounts: Record<string, number> = {};
    posts.forEach((post) => {
        post.tags?.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    return Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
}

// 이미지 URL 변경
function rehypeAddImageBaseUrl() {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
    return (tree: Root) => {
        visit(tree, 'element', (node: Element) => {
            if (node.tagName === 'img' && node.properties?.src) {
                const src = node.properties.src as string;
                if (src.startsWith('/')) {
                    node.properties.src = `${imageBaseUrl}${src}`;
                }
            }
        });
    };
}

// 개별 포스트
export async function getPostData(id: string): Promise<PostContentData | null> {
    const fileNames = fs.readdirSync(postsDirectory);

    const targetFileName = fileNames.find((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        return matterResult.data.id?.toString() === id;
    });

    if (!targetFileName) {
        return null;
    }

    const fullPath = path.join(postsDirectory, targetFileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
        .use(rehypeAddImageBaseUrl)
        .use(rehypeStringify)
        .process(matterResult.content);

    return {
        contentHtml: processedContent.toString(),
        ...(matterResult.data as Post),
    };
}

// 태그 페이지용
export function getPostsByTag(tag: string): Post[] {
    const allPosts = getSortedPostsData();
    const filteredPosts = allPosts.filter((post) =>
        post.tags?.some((t) => t.toLowerCase() === tag),
    );
    return filteredPosts;
}
