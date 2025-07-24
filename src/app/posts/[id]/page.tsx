import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ArrowLeft } from "lucide-react";
import Header from '@/components/header';
import ProfileCard from '@/components/profileCard';
import TagCloud from '@/components/tagCloud';
import TableOfContents from "@/components/tableOfContent";
import { Badge } from '@/components/ui/badge';
import GiscusComments from '@/components/giscusComments';

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
      
        <div className="sticky top-0 z-50 bg-gray-50/80 dark:bg-black/80 backdrop-blur-lg border-b dark:border-gray-800">
          <Header/>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">

          {/* 왼쪽 사이드바 */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ProfileCard/>
              <TagCloud tags={allTagsForCloud}/>
              {headings.length > 0 && <TableOfContents headings={headings}/>}
            </div>
          </aside>

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm overflow-hidden">
            {postData.thumbnail ? (
              <header className="relative h-80 w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${postData.thumbnail}`}
                  alt={postData.title}
                  fill
                  className="object-cover z-0"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10" />
                <div className="relative z-20 flex flex-col justify-end h-full p-8 md:p-12">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                    {postData.title}
                  </h1>
                  <div className="flex items-center gap-x-4 mt-4 text-gray-200">
                    <span>{postData.date}</span>
                    {postData.tags && (
                      <>
                        <span>·</span>
                        <div className="flex flex-wrap gap-2">
                          {postData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </header>
            ) : (
              <header className="p-8 md:p-12 border-b dark:border-gray-800">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  {postData.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-gray-500 dark:text-gray-400">
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
              </header>
            )}

            <article className="p-8 md:p-12">
              <div
                  className="
                    prose lg:prose-base max-w-none dark:prose-invert 
                    prose-headings:scroll-mt-24
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:leading-relaxed prose-li:marker:text-blue-500 
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline

                    prose-blockquote:before:content-none
                    prose-blockquote:after:content-none
                    prose-blockquote:border-l-4
                    prose-blockquote:pl-6
            
                    prose-code:before:content-none prose-code:after:content-none
                    prose-code:dark:bg-gray-800
                    prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-normal
                    prose-pre:code:bg-transparent
                    prose-pre:code:p-0
      
                    prose-pre:bg-gray-900 prose-pre:text-white prose-img:rounded-lg
                    prose-img:shadow-md
                  "
                  dangerouslySetInnerHTML={{__html: contentWithIds }}
              />
            </article>

            <div className="mt-6 pt-8 border-t border-b dark:border-gray-700 text-center p-8 md:p-12">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ArrowLeft className="w-4 h-4"/>
                홈으로 돌아가기
              </Link>
            </div>

            <div className="mt-4 px-10 md:px-10 lg:px-10 mb-12">
              <GiscusComments />
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
