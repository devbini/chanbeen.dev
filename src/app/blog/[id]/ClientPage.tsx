'use client';

import styled, { css, keyframes } from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { PostContentData } from '@/lib/posts';
import GiscusComments from '@/components/giscusComments';
import {useState, useEffect} from "react";

interface ClientPageProps {
    postData: PostContentData;
    contentWithIds: string;
    headings: { id: string; text: string; level: number }[];
}

export default function ClientPage({ postData, contentWithIds, headings }: ClientPageProps) {
    const [scrollProgress, setScrollProgress] = useState(0);

    const bgImage = postData.thumbnail
        ? (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "") + postData.thumbnail
        : null;

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const progress = (window.scrollY / totalHeight) * 100;
                setScrollProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <PageContainer>
            <ProgressBar style={{ width: `${scrollProgress}%` }}/>

            <HeroSection $hasImage={!!bgImage}>
                {bgImage && (
                    <Image
                        src={bgImage}
                        alt={postData.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        className="bg-image"
                    />
                )}
                <HeroOverlay />

                <HeroContent>
                    <MetaInfo>
                        <span className="date"><Calendar size={16}/> {postData.date}</span>
                        {postData.tags?.map(tag => (
                            <HeroBadge key={tag}>#{tag}</HeroBadge>
                        ))}
                    </MetaInfo>
                    <HeroTitle>{postData.title}</HeroTitle>
                </HeroContent>
            </HeroSection>

            <ContentContainer>
                <ArticleWrapper>
                    <MarkdownBody dangerouslySetInnerHTML={{ __html: contentWithIds }} />

                    <Divider />

                    <NavArea>
                        <Link href="/blog" passHref legacyBehavior>
                            <BackBtn>
                                <ArrowLeft size={16} /> 목록으로 돌아가기
                            </BackBtn>
                        </Link>
                    </NavArea>

                    <CommentSection>
                        <GiscusComments />
                    </CommentSection>
                </ArticleWrapper>

                <AsideWrapper>
                    <TocBox>
                        <div className="toc-header">Contents</div>
                        <TocList>
                            {headings.map((heading) => (
                                <TocItem key={heading.id} $level={heading.level}>
                                    <a
                                        href={`#${heading.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(heading.id)?.scrollIntoView({
                                                behavior: 'smooth'
                                            });
                                        }}
                                    >
                                        {heading.text}
                                    </a>
                                </TocItem>
                            ))}
                        </TocList>
                    </TocBox>
                </AsideWrapper>
            </ContentContainer>
        </PageContainer>
    );
}

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  color: #1e293b;
  padding-bottom: 8rem;
`;

const ProgressBar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    z-index: 100;
    transition: width 0.1s ease-out;
`;

const HeroSection = styled.header<{ $hasImage: boolean }>`
    position: relative;
    width: 100%;
    height: 450px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background-color: #1e293b;
    margin-bottom: 5rem;
    margin-top: 4rem;
    background: ${(props) => props.$hasImage ? 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' : ''};  

    @media (max-width: 768px) {
    height: 350px;
}
`;

const HeroOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%);
    z-index: 1;
`;

const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1024px;
    padding: 0 1.5rem 4rem;
    color: white;
`;

const HeroTitle = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.2;
    margin-top: 1rem;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    word-break: keep-all;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const MetaInfo = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    font-size: 0.95rem;
    font-weight: 500;
    opacity: 0.9;

    .date {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }
`;

const HeroBadge = styled.span`
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(4px);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: background 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.25);
    }
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    position: relative;

    @media (min-width: 1024px) {
        grid-template-columns: minmax(0, 3fr) 1fr;
    }
`;

const ArticleWrapper = styled.article`
    min-width: 0;
`;

const AsideWrapper = styled.aside`
    display: none;
    @media (min-width: 1024px) {
        display: block;
    }
`;

const TocBox = styled.div`
    position: sticky;
    top: 8rem;
    padding-left: 1.5rem;
    border-left: 2px solid #e2e8f0;

    .toc-header {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #94a3b8;
        margin-bottom: 1rem;
        letter-spacing: 0.05em;
    }
`;

const TocList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const TocItem = styled.li<{ $level: number }>`
    font-size: 0.9rem;
    padding-left: ${props => (props.$level - 2) * 0.5}rem;
    position: relative;
    transition: all 0.2s;

    a {
        display: block;
        color: #64748b;
        font-weight: 400;
        text-decoration: none;
        line-height: 1.4;
        transition: color 0.2s;

        &:hover {
            color: #3b82f6;
        }
    }
`;

const MarkdownBody = styled.div`
    font-size: 1.05rem;
    line-height: 1.8;
    color: #334155;

    h1, h2, h3, h4 {
        color: #0f172a;
        font-weight: 800;
        margin-top: 3.5rem;
        margin-bottom: 1.25rem;
        line-height: 1.3;
        scroll-margin-top: 6rem;
    }

    h2 { font-size: 1.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
    h3 { font-size: 1.4rem; }
    h4 { font-size: 1.2rem; }

    p { margin-bottom: 1.5rem; }

    a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
        border-bottom: 1px solid transparent;
        transition: border-bottom 0.2s;
        &:hover { border-bottom-color: #2563eb; }
    }

    ul, ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
    ul { list-style: disc; }
    ol { list-style: decimal; }
    li { margin-bottom: 0.5rem; }

    ul li::marker { color: #cbd5e1; }
    ol li::marker {
        color: #2563eb;
        font-weight: 700;
    }

    blockquote {
        border-left: 4px solid #3b82f6;
        background-color: #f8fafc;
        padding: 1.25rem 1.5rem;
        border-radius: 0 0.5rem 0.5rem 0;
        margin: 2rem 0;
        font-style: italic;
        color: #475569;
        p:last-child { margin-bottom: 0; }
    }

    pre {
        background-color: #1e293b;
        color: #f1f5f9;
        padding: 1.5rem;
        border-radius: 0.75rem;
        overflow-x: auto;
        margin: 2rem 0;
        line-height: 1.6;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.9rem;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;

        code {
            background: transparent;
            color: inherit;
            padding: 0;
            font-size: inherit;
        }
    }

    code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.85em;
        background-color: #f1f5f9;
        color: #ef4444;
        padding: 0.2em 0.4em;
        border-radius: 0.25rem;
        font-weight: 600;
        -webkit-font-smoothing: antialiased;
    }

    img {
        border-radius: 0.75rem;
        max-width: 100%;
        height: auto;
        margin: 2.5rem auto;
        display: block;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    hr {
        border: 0;
        height: 1px;
        background-color: #cbd5e1;
        margin: 3rem 0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 2rem 0;
        font-size: 0.95rem;

        th, td {
            border: 1px solid #e2e8f0;
            padding: 0.75rem 1rem;
            text-align: left;
        }
        th {
            background-color: #f8fafc;
            font-weight: 700;
            color: #0f172a;
        }
    }
`;

const Divider = styled.hr`
    border: 0;
    height: 1px;
    background-color: #cbd5e1;
    margin: 4rem 0;
`;

const NavArea = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
`;

const BackBtn = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    background-color: white;
    color: #64748b;
    font-weight: 600;
    font-size: 0.9rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
        border-color: #cbd5e1;
        background-color: #f8fafc;
        color: #0f172a;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
`;

const CommentSection = styled.div`
    padding-top: 2rem;
`;