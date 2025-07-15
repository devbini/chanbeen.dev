import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from "unified";
import { visit } from 'unist-util-visit';
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export type Post = {
    id: string;
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
    const allPostsData = fileNames.map(fileName => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const id = fileName.replace(/\.md$/, '');
        return {
            id,
            ...(matterResult.data as Omit<Post, 'id'>),
        } as Post;
    });
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 모든 글
export function getAllPosts(): Post[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const id = fileName.replace(/\.md$/, '');
        return {
            id,
            ...(matterResult.data as Omit<Post, 'id'>)
        } as Post;
    });
    return allPostsData;
}

// 모든 태그
export function getAllTags(posts: Post[]): { tag: string; count: number }[] {
    const tagCounts: Record<string, number> = {};
    posts.forEach(post => {
        post.tags?.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    return Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
}

// 이미지 URL 변경
export default function rehypeAddImageBaseUrl() {
    return (tree: any) => {
        visit(tree, 'element', (node) => {
            if (node.tagName === 'img' && node.properties?.src?.startsWith('/')) {
                node.properties.src = `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${node.properties.src}`;
            }
        });
    };
}

// 개별 포스트
export async function
getPostData(id: string): Promise<PostContentData | null> {
    const fileNames = fs.readdirSync(postsDirectory);

    for (const fileName of fileNames) {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        if (matterResult.data.id?.toString() === id) {
            // @ts-ignore
            const processedContent = await unified()
                .use(remarkParse)
                .use(remarkHtml)
                .use(rehypeSlug)
                .use(rehypeAutolinkHeadings, {
                    behavior: 'wrap'
                })
                .use(rehypeAddImageBaseUrl)
                .process(matterResult.content);

            return {
                id,
                contentHtml: processedContent.toString(),
                ...(matterResult.data as Omit<Post, 'id'>),
            } as PostContentData;
        }
    }

    return null;
}

// 게시글 별 태그 목록
export function getPostsByTag(tag: string): Post[] {
    const allPosts = getAllPosts();
    const filteredPosts = allPosts.filter(post =>
        post.tags?.some(t => t.toLowerCase() === tag)
    );
    return filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
