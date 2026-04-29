import type { Metadata } from 'next';
import PhotoClientPage from './PhotoClientPage';

export const metadata: Metadata = {
    title: '찬빈.com | Photo Archive',
    description: '김찬빈의 취미 사진 아카이브입니다.',
    openGraph: {
        title: '찬빈.com | Photo Archive',
        description: '기록하고 싶은 장면들을 모아둔 취미 사진 아카이브입니다.',
        url: 'https://chanbeen.com/photo',
        siteName: '찬빈.com',
        type: 'website',
        locale: 'ko_KR',
    },
};

export default function PhotoPage() {
    return <PhotoClientPage />;
}
