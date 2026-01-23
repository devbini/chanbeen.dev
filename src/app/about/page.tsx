import type { Metadata } from 'next';
import AboutClientPage from "@/app/about/AboutClientPage";

export const metadata: Metadata = {
    title: '찬빈.com | About 페이지',
};

export default function Page() {
    return <AboutClientPage />;
}