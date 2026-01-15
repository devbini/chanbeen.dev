import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import StyledComponentsRegistry from '@/lib/registry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '찬빈.com',
    description: "Chanbeen's Tech Blog.",
    other: {
        'google-site-verification': 'uD9P9Pv7oLPV7ZpTN031Hi6BkIPvlGb0w1rW9FMQXFY',
        'naver-site-verification': '1ead47515e0286ec0bb8f1c02807f56135d84c9a',
    },
    openGraph: {
        title: '김찬빈 기술 블로그',
        description: '기술과 경험을 함께 공유합니다.',
        url: 'https://chanbeen.com',
        siteName: '찬빈.com',
        images: [
            {
                url: 'https://chanbeen.com/blog_shared_cover.png',
                width: 1200,
                height: 630,
                alt: '커버',
            },
        ],
        type: 'website',
        locale: 'ko_KR',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <StyledComponentsRegistry>
                    <Header />
                    {children}
                    <Footer />
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
