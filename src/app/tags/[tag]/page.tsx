import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

import Header from '@/components/header';
import ProfileCard from '@/components/profileCard';
import TagCloud from '@/components/tagCloud';
import PostCard from "@/components/postCard";
import {getAllTags, getPostsByTag, getSortedPostsData} from '@/lib/posts';

// 1. 태그 페이지 함수
export function generateStaticParams() {
    const allPosts = getSortedPostsData();
    const allTags = new Set(allPosts.flatMap(post => post.tags || []));
    return Array.from(allTags).map(tag => ({
        tag: tag.toLowerCase(),
    }));
}

export default function TagPage({params}: { params: { tag: string } }) {
    const {tag} = params;
    const posts = getPostsByTag(tag);

    const originalTag = posts.length > 0 ? posts[0].tags?.find(t => t.toLowerCase() === tag) || tag : tag;

    const allPostsForTags = getSortedPostsData();
    const allTagsForCloud = getAllTags(allPostsForTags);

    return (<div className="bg-gray-50 dark:bg-black min-h-screen text-gray-800 dark:text-gray-200">
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
                    </div>
                </aside>

                {/* 오른쪽 메인 콘텐츠 */}
                <div className="lg:col-span-3">
                    <div
                        className="p-6 mb-8 rounded-lg border dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm flex items-center justify-between">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                            Tag: <span
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 transition-all duration-300">#{originalTag}</span>
                        </h1>
                    </div>
                    <div className="space-y-4">
                        {posts.length > 0 ? (posts.map(post => <PostCard key={post.id} post={post}/>)) : (
                            <p className="text-gray-600 dark:text-gray-400">해당 태그를 가진 글이 없습니다.</p>)}
                    </div>
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
    </div>);
}