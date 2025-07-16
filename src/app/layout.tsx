import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "김찬빈.dev 💻",
    description: "Dev-bini's Tech Blog.",
    other: {
        "google-site-verification": "uD9P9Pv7oLPV7ZpTN031Hi6BkIPvlGb0w1rW9FMQXFY",
        "naver-site-verification": "1ead47515e0286ec0bb8f1c02807f56135d84c9a",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
    );
}
