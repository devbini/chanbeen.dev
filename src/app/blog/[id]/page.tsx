import { notFound } from 'next/navigation';
import { getPostData, PostContentData } from '@/lib/posts';
import ClientPage from './ClientPage';

export async function generateStaticParams() {
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');

    const postsDirectory = path.join(process.cwd(), 'posts');
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName: string) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        return { id: matterResult.data.id.toString() };
    });
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
    const postData: PostContentData | null = await getPostData(params.id);

    if (!postData) {
        notFound();
    }

    const headings: { id: string; text: string; level: number }[] = [];

    const contentWithIds = postData.contentHtml.replace(
        /<h([2-3])([^>]*)>(.*?)<\/h\1>/g,
        (match, level, attrs, innerText) => {
            const cleanText = innerText.replace(/<[^>]*>/g, '');
            const id = cleanText
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9\-ㄱ-ㅎ가-힣]/gi, '');

            headings.push({
                id,
                text: cleanText,
                level: Number(level),
            });

            return `<h${level} id="${id}"${attrs}>${innerText}</h${level}>`;
        },
    );

    return <ClientPage postData={postData} contentWithIds={contentWithIds} headings={headings} />;
}
