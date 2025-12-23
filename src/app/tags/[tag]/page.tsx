import Link from 'next/link';
import {ArrowLeft, Hash} from 'lucide-react';

import Header from '@/components/header';
import ProfileCard from '@/components/profileCard';
import TagCloud from '@/components/tagCloud';
import PostCard from '@/components/postCard';
import { getAllTags, getPostsByTag, getSortedPostsData } from '@/lib/posts';
import CategoryList from "@/components/categoryList";

export function generateStaticParams() {
    const allPosts = getSortedPostsData();
    const allTags = new Set(allPosts.flatMap((post) => post.tags || []));
    return Array.from(allTags).map((tag) => ({
        tag: tag.toLowerCase(),
    }));
}

export default function TagPage({ params }: { params: { tag: string } }) {
    const { tag } = params;
    const posts = getPostsByTag(tag);

    const originalTag =
        posts.length > 0 ? posts[0].tags?.find((t) => t.toLowerCase() === tag) || tag : tag;

    const allPostsForTags = getSortedPostsData();
    const allTagsForCloud = getAllTags(allPostsForTags);

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen text-gray-800 dark:text-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sticky top-0 z-50 bg-gray-50 dark:bg-black border-b dark:border-gray-800">
                    <Header />
                </div>
                <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
                    {/* 왼쪽 사이드바 */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <ProfileCard />
                            <CategoryList />
                            <TagCloud tags={allTagsForCloud} />
                        </div>
                    </aside>

                    {/* 오른쪽 메인 콘텐츠 */}
                    <div className="lg:col-span-3">
                        <div className="mb-12 text-center pt-4">
                            <span className="flex items-center justify-center gap-1 text-pink-500 font-bold tracking-wider uppercase text-sm mb-2">
                                <Hash size={14} /> Tagged with
                            </span>
                            <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                #{originalTag}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                총 <span className="text-black dark:text-white font-bold">{posts.length}</span>개의 글이 있습니다.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {posts.length > 0 ? (
                                posts.map((post) => <PostCard key={post.id} post={post} />)
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        해당 태그를 가진 글이 없습니다.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-16 pt-8 border-t dark:border-gray-800 flex justify-center">
                            <Link
                                href="/"
                                className="
                                    group flex items-center gap-2 px-5 py-2.5
                                    rounded-full border bg-white dark:bg-black
                                    text-sm font-medium text-gray-600 dark:text-gray-300
                                    hover:border-gray-400 dark:hover:border-gray-600
                                    hover:text-black dark:hover:text-white
                                    transition-all
                                "
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
