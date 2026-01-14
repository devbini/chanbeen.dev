import { getSortedPostsData } from '@/lib/posts';
import BlogView from '@/components/BlogView';

export default function BlogPage() {
    const posts = getSortedPostsData();

    return <BlogView posts={posts} currentCategory="All" />;
}