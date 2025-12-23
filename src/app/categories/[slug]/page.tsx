import {getAllTags, getSortedPostsData} from '@/lib/posts';
import FilterablePostList from '@/components/filterablePostList';
import Header from '@/components/header';
import CategoryList from '@/components/categoryList';
import ProfileCard from "@/components/profileCard";
import TagCloud from "@/components/tagCloud";
import Link from "next/link";
import {ArrowLeft, Layers} from "lucide-react";
import PostCard from "@/components/postCard";

const CATEGORY_MAP: Record<string, string> = {
    'backend': 'Backend',
    'frontend': 'Frontend',
    'devops': 'DevOps & Cloud',
    'essay': 'Essay',
};

export function generateStaticParams() {
    return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const categoryTitle = CATEGORY_MAP[slug] || '미공개 페이지';

    const allPostsData = getSortedPostsData();
    const allTags = getAllTags(allPostsData);

    const filteredPosts = allPostsData.filter(post =>
        post.category?.toLowerCase().includes(slug.split('-')[0]) ||
        post.category === categoryTitle
    );

    const tags = Array.from(new Set(filteredPosts.flatMap(p => p.tags)));

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen text-gray-800 dark:text-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sticky top-0 z-50 bg-gray-50 dark:bg-black border-b dark:border-gray-800">
                    <Header />
                </div>

                <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
                    <aside className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <ProfileCard />
                            <CategoryList />
                            <TagCloud tags={allTags} />
                        </div>
                    </aside>

                    {/* 메인 콘텐츠 */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 text-center pt-4">
                            <span className="flex items-center justify-center gap-1 text-blue-600 font-bold tracking-wider uppercase text-sm mb-2">
                                <Layers size={14} /> Category
                            </span>
                            <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                {categoryTitle}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                총 <span className="text-black dark:text-white font-bold">{filteredPosts.length}</span>개의 글이 있습니다.
                            </p>
                        </div>

                        <FilterablePostList posts={filteredPosts} tags={tags} />

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