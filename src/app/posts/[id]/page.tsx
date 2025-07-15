import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ArrowLeft } from "lucide-react";
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import TagCloud from '@/components/TagCloud';
import TableOfContents from "@/components/tableOfContent";
import { Badge } from '@/components/ui/badge';

import { getSortedPostsData, getAllTags, getPostData, Post, PostContentData } from '@/lib/posts';

const postsDirectory = path.join(process.cwd(), 'posts');

export function generateStaticParams() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map(fileName => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id: matterResult.data.id.toString(),
    };
  });
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const postData: PostContentData | null = await getPostData(params.id);

  if (!postData) {
    notFound();
  }

  const headings = [...postData.contentHtml.matchAll(/<h([2-3])[^>]*>(.*?)<\/h\1>/g)].map((match, idx) => {
    const rawText = match[2].replace(/<.*?>/g, '').trim();
    const id = rawText
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-ㄱ-ㅎ가-힣]/gi, '');
    return {
      level: Number(match[1]),
      id: id || `heading-${idx}`,
      text: rawText,
    }
  });

  let idx = 0;
  const contentWithIds = postData.contentHtml.replace(/<h([2-3])[^>]*>(.*?)<\/h\1>/g, (full, level, inner) => {
    const rawText = inner.replace(/<.*?>/g, '').trim();
    const id = rawText.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-ㄱ-ㅎ가-힣]/gi, '');
    idx++;
    return `<h${level} id="${id || `heading-${idx}`}">${inner}</h${level}>`;
  });

  const allPostsForTags: Post[] = getSortedPostsData();
  const allTagsForCloud = getAllTags(allPostsForTags);

  return (
      <div className="bg-gray-50 dark:bg-black min-h-screen text-gray-800 dark:text-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sticky top-0 z-50 bg-gray-50 dark:bg-black border-b dark:border-gray-800">
            <Header/>
          </div>

          <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">

            {/* 왼쪽 사이드바 */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                <ProfileCard/>
                <TagCloud tags={allTagsForCloud}/>
                <TableOfContents headings={headings}/>
              </div>
            </aside>

            {/* 오른쪽 메인 콘텐츠 */}
            <div
                className="lg:col-span-3 p-6 md:p-8 rounded-xl border bg-white dark:bg-gray-900/50 dark:border-gray-800 shadow-sm">
              <article className="text-gray-900 dark:text-gray-100">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                  {postData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-gray-500 dark:text-gray-400">
                  <span>{postData.date}</span>
                  {postData.tags && (
                      <>
                        <span>·</span>
                        <div className="flex flex-wrap gap-2">
                          {postData.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </>
                  )}
                </div>

                <div
                    className="
                      prose
                      lg:prose-base
                      max-w-none
                      dark:prose-invert
                      prose-h1:text-3xl
                      prose-h2:text-2xl
                      prose-h3:text-xl
                      prose-p:leading-relaxed
                      prose-li:marker:text-blue-500
                      prose-a:text-blue-600
                      prose-a:underline
                      prose-code:before:content-none
                      prose-code:after:content-none
                      prose-code:bg-gray-100
                      prose-code:dark:bg-gray-800
                      prose-code:px-1
                      prose-code:rounded
                      prose-pre:bg-gray-900
                      prose-pre:text-white
                      prose-img:rounded-lg
                      prose-img:shadow
                      prose-table:border
                      prose-th:border
                      prose-td:border
                    "
                    dangerouslySetInnerHTML={{__html: contentWithIds}}/>
              </article>

              <div className="mt-16 pt-8 border-t dark:border-gray-700 text-center">
                <Link
                    href="/"
                    className="
                      inline-flex items-center justify-center
                      gap-2 px-4 py-2
                      rounded-md border
                      text-sm font-medium
                      text-gray-700 dark:text-gray-300
                      bg-gray-100 dark:bg-gray-800
                      hover:bg-gray-200 dark:hover:bg-gray-700
                      transition-colors
                    ">
                  <ArrowLeft className="w-4 h-4"/>
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          </main>

          <footer className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Chanbeen Kim. All Rights Reserved.
          </footer>
        </div>
      </div>
  );
}
