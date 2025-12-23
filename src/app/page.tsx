import Image from 'next/image';
import Link from 'next/link';

import Header from '@/components/header';
import ProfileCard from '@/components/profileCard';
import TagCloud from '@/components/tagCloud';
import PostCard from '@/components/postCard';
import { getSortedPostsData, getAllTags, Post } from '@/lib/posts';
import CategoryList from "@/components/categoryList";

// 1. 최신 글
function FeaturedPost({ post }: { post: Post }) {
    return (
        <Link href={`/posts/${post.id}`} className="block group mb-12">
            <div className="relative overflow-hidden rounded-xl">
                {post.thumbnail ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${post.thumbnail}`}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <p className="text-gray-500">No Thumbnail</p>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-3xl font-bold text-white leading-tight">{post.title}</h2>
                    <p className="text-gray-200 mt-2 line-clamp-2">{post.excerpt}</p>
                </div>
            </div>
        </Link>
    );
}

// --- 최종 메인 페이지 ---
export default function Home() {
    const allPostsData = getSortedPostsData();
    const allTags = getAllTags(allPostsData);

    const latestPost = allPostsData[0];
    const otherPosts = allPostsData.slice(1);

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen text-gray-800 dark:text-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sticky top-0 z-50 bg-gray-50 dark:bg-black border-b dark:border-gray-800">
                    <Header />
                </div>
                <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
                    {/* 왼쪽 사이드바 */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <ProfileCard />
                            <CategoryList />
                            <TagCloud tags={allTags} />
                        </div>
                    </aside>

                    {/* 오른쪽 메인 콘텐츠 */}
                    <div className="lg:col-span-3">
                        {latestPost && <FeaturedPost post={latestPost} />}

                        <h3 className="text-2xl font-bold mb-6 tracking-tight">All Posts</h3>
                        <div className="space-y-4">
                            {otherPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
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
