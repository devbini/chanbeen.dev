'use client';

import { useState } from 'react';
import { Post } from '@/lib/posts';
import PostCard from '@/components/postCard';

export default function FilterablePostList({ posts, tags }: { posts: Post[]; tags: string[] }) {
    const [selectedTag, setSelectedTag] = useState('All');

    const filteredPosts = selectedTag === 'All'
        ? posts
        : posts.filter(p => p.tags.includes(selectedTag));

    return (
        <div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                    onClick={() => setSelectedTag('All')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        selectedTag === 'All'
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-black dark:text-gray-400 dark:border-gray-800'
                    }`}
                >
                    All
                </button>
                {tags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            selectedTag === tag
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-black dark:text-gray-400 dark:border-gray-800'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">
                            해당 카테고리에 글이 없습니다.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}