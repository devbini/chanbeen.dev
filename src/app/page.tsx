import { getSortedPostsData } from '@/lib/posts';
import LandingPage from '@/components/LandingPage';

export default function Page() {
    const posts = getSortedPostsData();

    return <LandingPage posts={posts} />;
}
