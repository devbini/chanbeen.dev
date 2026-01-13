import { getSortedPostsData } from '@/lib/posts';
import BlogView from '@/components/BlogView';

export const metadata = {
    title: 'Blog | 찬빈.com',
    description: 'Engineering Log - 이 기록이, 도움이 되시길 바랍니다.',
};

export default function BlogPage() {
    const posts = getSortedPostsData();

    return <BlogView posts={posts} currentCategory="All" />;
}