'use client';

import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Post } from '@/lib/posts';

const CATEGORIES = ['All', 'DevOps', 'Backend', 'Frontend', 'Essay'];
const ITEMS_PER_PAGE = 12;

interface BlogViewProps {
    posts: Post[];
    currentCategory: string;
}

export default function BlogView({ posts, currentCategory }: BlogViewProps) {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [currentCategory]);

    const isCategoryActive = (cat: string) => {
        return cat.toLowerCase() === currentCategory.toLowerCase();
    };

    const filteredPosts =
        currentCategory.toLowerCase() === 'all'
            ? posts
            : posts.filter((post) => post.category.toLowerCase() === currentCategory.toLowerCase());

    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Container>
            <MainContent>
                <SectionHeader>
                    <div>
                        <SectionTitle>Engineering Log</SectionTitle>
                        <SectionSubtitle>이 기록이, 도움이 되길 바랍니다.</SectionSubtitle>
                    </div>

                    <CategoryScroll>
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat}
                                href={
                                    cat === 'All' ? '/blog' : `/blog/category/${cat.toLowerCase()}`
                                }
                                passHref
                                legacyBehavior
                            >
                                <CategoryBtn as="a" $active={isCategoryActive(cat)}>
                                    {cat}
                                </CategoryBtn>
                            </Link>
                        ))}
                    </CategoryScroll>
                </SectionHeader>

                {/* 게시글 그리드 */}
                <BlogGrid>
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post) => (
                            <BlogCard href={`/blog/${post.id}`} key={post.id}>
                                {post.thumbnail && (
                                    <ThumbnailWrapper>
                                        <img
                                            src={
                                                (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '') +
                                                post.thumbnail
                                            }
                                            alt={post.title}
                                        />
                                        <div className="category-badge">{post.category}</div>
                                    </ThumbnailWrapper>
                                )}
                                <CardContent>
                                    <div className="date">
                                        <Calendar size={12} />
                                        {post.date}
                                    </div>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt || (post as any).desc}</p>
                                    <div className="read-more">
                                        Read Article <ArrowRight size={14} />
                                    </div>
                                </CardContent>
                            </BlogCard>
                        ))
                    ) : (
                        <EmptyState>작성된 글이 없습니다.</EmptyState>
                    )}
                </BlogGrid>

                {filteredPosts.length > 0 && (
                    <PaginationContainer>
                        <PageControlBtn
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </PageControlBtn>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <PageNumberBtn
                                key={pageNum}
                                $active={currentPage === pageNum}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </PageNumberBtn>
                        ))}

                        <PageControlBtn
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </PageControlBtn>
                    </PaginationContainer>
                )}
            </MainContent>
        </Container>
    );
}

//  스타일 컴포넌트
const Container = styled.div`
    min-height: 100vh;
    background-color: #f8fafc;
    color: #0f172a;
    padding-top: 6rem;
`;

const MainContent = styled.main`
    max-width: 1280px;
    margin: 0 auto;
    padding: 4rem 1.5rem;
`;

const SectionHeader = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    gap: 1.5rem;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-end;
    }
`;

const SectionTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 0.75rem;
    letter-spacing: -0.025em;
`;

const SectionSubtitle = styled.p`
    color: #64748b;
    font-size: 1.125rem;
`;

const CategoryScroll = styled.div`
    display: flex;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    gap: 0.5rem;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const CategoryBtn = styled.button<{ $active: boolean }>`
    display: inline-block;
    white-space: nowrap;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 700;
    transition: all 0.3s;
    border: 1px solid;
    cursor: pointer;
    text-decoration: none;

    ${(props) =>
        props.$active
            ? css`
                  background-color: #0f172a;
                  color: white;
                  border-color: #0f172a;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              `
            : css`
                  background-color: white;
                  color: #64748b;
                  border-color: #e2e8f0;

                  &:hover {
                      background-color: #f8fafc;
                      border-color: #cbd5e1;
                      color: #0f172a;
                  }
              `}
`;

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 4rem;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (min-width: 1024px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
`;

const BlogCard = styled(Link)`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.3s;
    isolation: isolate;
    transform: translateZ(0);

    &:hover {
        border-color: #93c5fd;
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
`;

const ThumbnailWrapper = styled.div`
    position: relative;
    height: 14rem;
    width: 100%;
    background-color: #f1f5f9;
    overflow: hidden;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;

    img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
    }

    ${BlogCard}:hover & img {
        transform: scale(1.05);
    }

    .category-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 10;
        padding: 0.25rem 0.75rem;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        color: #334155;
        font-size: 0.625rem;
        font-weight: 700;
        text-transform: uppercase;
        border-radius: 0.375rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
`;

const CardContent = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    flex: 1;

    .date {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        font-size: 0.75rem;
        color: #94a3b8;
        font-family: monospace;
        font-weight: 500;
    }

    h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.75rem;
        line-height: 1.4;
        transition: color 0.2s;
    }
    ${BlogCard}:hover & h3 {
        color: #2563eb;
    }

    p {
        color: #64748b;
        font-size: 0.875rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .read-more {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        font-weight: 700;
        color: #0f172a;
        margin-top: auto;
        padding-top: 1.25rem;
        border-top: 1px solid #f1f5f9;
        transition: color 0.2s;
        svg {
            margin-left: 0.5rem;
        }
    }
    ${BlogCard}:hover & .read-more {
        color: #2563eb;
    }
`;

const EmptyState = styled.div`
    grid-column: 1 / -1;
    padding: 8rem 0;
    text-align: center;
    color: #94a3b8;
    background-color: white;
    border-radius: 1rem;
    border: 1px dashed #e2e8f0;
    font-size: 1rem;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
`;

const PageBtnBase = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    background-color: white;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f1f5f9;
    }

    &:not(:disabled):hover {
        background-color: #f8fafc;
        color: #0f172a;
        border-color: #cbd5e1;
    }
`;

const PageControlBtn = styled(PageBtnBase)``;

const PageNumberBtn = styled(PageBtnBase)<{ $active: boolean }>`
    font-size: 0.875rem;
    font-weight: 600;

    ${(props) =>
        props.$active &&
        css`
            background-color: #0f172a;
            color: white;
            border-color: #0f172a;

            &:not(:disabled):hover {
                background-color: #1e293b;
                color: white;
            }
        `}
`;
