import { getSortedPostsData } from '@/lib/posts';
import BlogView from '@/components/BlogView';

type Props = {
    params: { category: string };
};

export async function generateMetadata({ params }: Props) {
    return {
        title: `${decodeURIComponent(params.category).toUpperCase()} | 찬빈.com`,
        description: `이 기록이, 도움이 되시길 바랍니다.`,
    };
}

export default function CategoryPage({ params }: Props) {
    const posts = getSortedPostsData();
    const category = decodeURIComponent(params.category);

    return <BlogView posts={posts} currentCategory={category} />;
}

// SSG 처리용
export function generateStaticParams() {
    const categories = ["devops", "backend", "frontend", "essay"];
    return categories.map((category) => ({ category }));
}