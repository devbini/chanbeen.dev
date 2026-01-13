'use client';

import { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Link from 'next/link';
import {
    ArrowRight, Zap, Server, BookOpen, Calendar,
    Code2, Mail, Send, User, MessageSquare
} from 'lucide-react';
import type { Post } from '@/lib/posts';

const CATEGORIES = ["All", "DevOps", "Backend", "Frontend", "Essay"];
const PROFILE_IMAGE_URL = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "") + "/profile.png";

export default function LandingPage({ posts }: { posts: Post[] }) {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredPosts = activeCategory === "All"
        ? posts
        : posts.filter(post =>
            post.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
        );

    const displayPosts = filteredPosts.slice(0, 4);

    return (
        <Container>
            <MainContent>
                {/* Section 1 */}
                <HeroSection>
                    <HeroTextContent>
                        <Badge>
                            <span className="indicator">
                                <span className="ping"></span>
                                <span className="dot"></span>
                            </span>
                            6th Year Full-Stack Engineer
                        </Badge>

                        <MainTitle>
                            Engineering <br />
                            <span>Productivity.</span>
                        </MainTitle>

                        <Description>
                            웹과 인프라를 경계 없이 넘나드는 것을 좋아합니다.<br />
                            새로운 기술은 도구로써 사용하고, <strong>"왜"</strong>를 생각하고자 합니다.<br />
                            <strong>모두와 함께 성장하는</strong>, 믿음직한 개발자가 되고자 합니다.
                        </Description>

                        <ButtonGroup>
                            <Link href="/about">
                                <Button $primary>More about me <ArrowRight size={18} /></Button>
                            </Link>
                            <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                Contact Me
                            </Button>
                        </ButtonGroup>
                    </HeroTextContent>

                    <HeroVisualContent>
                        <CodeWindowWrapper>
                            <CodeWindow>
                                <CodeHeader>
                                    <Dot $color="#ef4444" />
                                    <Dot $color="#eab308" />
                                    <Dot $color="#22c55e" />
                                    <div className="filename">chanbeen.config</div>
                                </CodeHeader>
                                <CodeContent>
                                    <span className="keyword">const</span> <span className="variable">chanbeen</span> = {'{'}
                                    {'\n'}  <span className="comment">// Current Status</span>
                                    {'\n'}  role: <span className="string">"Full-Stack Engineer"</span>,
                                    {'\n'}
                                    {'\n'}  <span className="comment">// Growing towards...</span>
                                    {'\n'}  nextGoal: [<span className="string">"DevOps"</span>, <span className="string">"Cloud Specialist"</span>],
                                    {'\n'}
                                    {'\n'}  <span className="comment">// Key Strengths</span>
                                    {'\n'}  skills: [<span className="string">"Macro Perspective"</span>, <span className="string">"AI"</span>],
                                    {'\n'}
                                    {'\n'}  <span className="comment">// Mission</span>
                                    {'\n'}  focus: <span className="variable">"Building Good Software"</span>
                                    {'\n'}{'}'};
                                </CodeContent>
                            </CodeWindow>

                            <ProfileCard href="/about">
                                <div className="img-wrapper">
                                    <img src={PROFILE_IMAGE_URL} alt="Chan Been Kim" />
                                </div>
                            </ProfileCard>

                            <FloatingCard href="/about" $top="-2rem" $right="-3.5rem" $delay="0.1s">
                                <div className="icon-box green"><Code2 size={20} /></div>
                                <div>
                                    <div className="label">Contribution</div>
                                    <div className="value">OSS Contributor</div>
                                </div>
                            </FloatingCard>

                            <FloatingCard href="/about" $bottom="-1.5rem" $left="-2rem" $delay="0.7s">
                                <div className="icon-box orange"><Zap size={20} /></div>
                                <div>
                                    <div className="label">Performance</div>
                                    <div className="value">40s → 1s</div>
                                </div>
                            </FloatingCard>

                            <FloatingCard href="/about" $top="0.5rem" $left="-2rem" $delay="1s">
                                <div className="icon-box purple"><BookOpen size={20} /></div>
                                <div>
                                    <div className="label">Research</div>
                                    <div className="value">KCI Paper</div>
                                </div>
                            </FloatingCard>

                            <FloatingCard href="/about" $bottom="-0.5rem" $right="-2rem" $delay="1.5s">
                                <div className="icon-box blue"><Server size={20} /></div>
                                <div>
                                    <div className="label">Infra</div>
                                    <div className="value">Zero to All</div>
                                </div>
                            </FloatingCard>
                        </CodeWindowWrapper>
                    </HeroVisualContent>
                </HeroSection>

                <BlogSection id="blog">
                    <SectionHeader>
                        <div>
                            <SectionTitle>Engineering Log</SectionTitle>
                            <SectionSubtitle>개발과 트러블 슈팅을 기록합니다.</SectionSubtitle>
                        </div>
                        <CategoryScroll>
                            {CATEGORIES.map((cat) => (
                                <CategoryBtn
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    $active={activeCategory === cat}
                                >
                                    {cat}
                                </CategoryBtn>
                            ))}
                        </CategoryScroll>
                    </SectionHeader>

                    <BlogGrid>
                        {displayPosts.length > 0 ? (
                            displayPosts.map((post) => (
                                <BlogCard href={`/blog/${post.id}`} key={post.id}>
                                    {post.thumbnail && (
                                        <ThumbnailWrapper>
                                            <img
                                                src={(process.env.NEXT_PUBLIC_IMAGE_BASE_URL) + post.thumbnail}
                                                alt={post.title}
                                            />
                                            <div className="category-badge">
                                                {post.category}
                                            </div>
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
                            <EmptyState>
                                아직 작성된 글이 없습니다.
                            </EmptyState>
                        )}
                    </BlogGrid>

                    <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                        <Link href="/blog">
                            <Button>View Full Archive</Button>
                        </Link>
                    </div>
                </BlogSection>

                <ContactSection id="contact">
                    <ContactGrid>
                        <div className="info">
                            <h2>Get in Touch</h2>
                            <p>
                                커피챗, 제안, 인사 모두 환영합니다.<br />
                                메일 남겨주시면 빠르게 답변 드리겠습니다.
                            </p>
                            <div className="links">
                                <div className="item">
                                    <div className="icon-circle blue"><Mail size={18} /></div>
                                    <span>flqld86851@gmail.com</span>
                                </div>
                                <div className="item">
                                    <div className="icon-circle green"><MessageSquare size={18} /></div>
                                    <span>Open for Coffee Chat</span>
                                </div>
                            </div>
                        </div>

                        <TouchForm>
                            <InputGroup>
                                <label>Name</label>
                                <div className="input-wrapper">
                                    <User size={16} />
                                    <Input type="text" placeholder="홍길동" />
                                </div>
                            </InputGroup>
                            <InputGroup>
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <Mail size={16} />
                                    <Input type="email" placeholder="your@email.com" />
                                </div>
                            </InputGroup>
                            <InputGroup>
                                <label>Message</label>
                                <TextArea rows={4} placeholder="안녕하세요..." />
                            </InputGroup>
                            <Button $primary style={{ width: '100%' }}>
                                Send Message <Send size={16} />
                            </Button>
                        </TouchForm>
                    </ContactGrid>
                </ContactSection>
            </MainContent>
        </Container>
    );
}

// 스타일 컴포넌트 목록 (Anim 포함)
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const ping = keyframes`
  75%, 100% { transform: scale(2); opacity: 0; }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
  position: relative;

  &::selection {
    background-color: #2563eb;
    color: white;
  }
`;

const MainContent = styled.main`
  position: relative;
  z-index: 10;
  padding-top: 8rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
`;

// --- Section 1 ---
const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  min-height: 650px;
  margin-bottom: 8rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const HeroTextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  animation: ${fadeInUp} 0.5s ease-out;
  order: 2;
  @media (min-width: 1024px) { order: 1; }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1d4ed8;
  margin-bottom: 2rem;

  .indicator {
    position: relative;
    display: flex;
    height: 0.5rem;
    width: 0.5rem;
  }
  .ping {
    animation: ${ping} 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    position: absolute;
    display: inline-flex;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    background-color: #60a5fa;
    opacity: 0.75;
  }
  .dot {
    position: relative;
    display: inline-flex;
    border-radius: 9999px;
    height: 0.5rem;
    width: 0.5rem;
    background-color: #2563eb;
  }
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: #0f172a;
  margin-bottom: 2rem;

  @media (min-width: 640px) { font-size: 4.5rem; }

  span {
    background: linear-gradient(to right, #1d4ed8, #4f46e5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #475569;
  line-height: 1.625;
  font-weight: 500;
  max-width: 36rem;
  margin-bottom: 2.5rem;

  strong {
    color: #0f172a;
    font-weight: 700;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 0.5rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  
  ${props => props.$primary ? css`
    background-color: #0f172a;
    color: white;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background-color: #1e293b;
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
  ` : css`
    background-color: white;
    color: #334155;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background-color: #f8fafc;
      border-color: #cbd5e1;
    }
  `}
`;

const HeroVisualContent = styled.div`
  position: relative;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  animation: ${fadeInUp} 0.5s ease-out 0.2s backwards;
  order: 1;
  @media (min-width: 1024px) { display: flex; order: 2; }
`;

const CodeWindowWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 32rem;
`;

const CodeWindow = styled.div`
  background-color: #0f172a;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #1e293b;
  overflow: hidden;
  position: relative;
  z-index: 10;
  transform: rotate(1deg);
  transition: transform 0.5s;

  &:hover { transform: rotate(0deg); }
`;

const CodeHeader = styled.div`
  background-color: #1e293b;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #334155;

  .filename {
    margin-left: 1rem;
    font-size: 0.75rem;
    color: #94a3b8;
    font-family: monospace;
  }
`;

const Dot = styled.div<{ $color: string }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background-color: ${props => props.$color};
`;

const CodeContent = styled.pre`
  padding: 1.5rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #cbd5e1;

  .keyword { color: #c084fc; }
  .variable { color: #60a5fa; }
  .string { color: #4ade80; }
  .comment { color: #64748b; }
`;

const FloatingCard = styled(Link)<{ $top?: string; $bottom?: string; $left?: string; $right?: string; $delay?: string }>`
  position: absolute;
  top: ${props => props.$top || 'auto'};
  bottom: ${props => props.$bottom || 'auto'};
  left: ${props => props.$left || 'auto'};
  right: ${props => props.$right || 'auto'};
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 30;
  max-width: 200px;
  text-decoration: none;
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  transition: transform 0.2s;

  &:hover { transform: scale(1.05); }

  .icon-box {
    padding: 0.625rem;
    border-radius: 0.75rem;
    display: flex;
    &.green { background: #dcfce7; color: #16a34a; }
    &.orange { background: #ffedd5; color: #ea580c; }
    &.purple { background: #f3e8ff; color: #9333ea; }
    &.blue { background: #dbeafe; color: #2563eb; }
  }

  .label { font-size: 0.625rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
  .value { font-size: 0.875rem; font-weight: 700; color: #1e293b; }
`;

const ProfileCard = styled(FloatingCard)`
  top: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem;
  animation-duration: 4.5s;
  
  &:hover { transform: translateX(-50%) scale(1.05); }

  .img-wrapper {
    position: relative;
    width: 4rem;
    height: 4rem;
    border-radius: 0.75rem;
    overflow: hidden;
    background-color: #f1f5f9;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

// --- Section 2 ---
const BlogSection = styled.section`
  padding: 8rem 0;
  border-top: 1px solid #e2e8f0;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  gap: 1.5rem;
  @media (min-width: 768px) { flex-direction: row; }
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
`;

const SectionSubtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const CategoryScroll = styled.div`
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  gap: 0.5rem;
  &::-webkit-scrollbar { display: none; }
`;

const CategoryBtn = styled.button<{ $active: boolean }>`
  white-space: nowrap;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.3s;
  border: 1px solid;
  cursor: pointer;

  ${props => props.$active ? css`
    background-color: #0f172a;
    color: white;
    border-color: #0f172a;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  ` : css`
    background-color: white;
    color: #64748b;
    border-color: #e2e8f0;
    &:hover { background-color: #f8fafc; border-color: #cbd5e1; }
  `}
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
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
  height: 12rem;
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
  ${BlogCard}:hover & h3 { color: #2563eb; }

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
    svg { margin-left: 0.5rem; }
  }
  ${BlogCard}:hover & .read-more { color: #2563eb; }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 5rem 0;
  text-align: center;
  color: #94a3b8;
  background-color: #f8fafc;
  border-radius: 1rem;
  border: 1px dashed #e2e8f0;
`;

// --- Section 3 ---
const ContactSection = styled.section`
  padding: 8rem 0;
  background-color: white;
  border-top: 1px solid #e2e8f0;
`;

const ContactGrid = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }

  .info h2 {
    font-size: 1.875rem;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.025em;
    margin-bottom: 1rem;
  }
  
  .info p {
    color: #475569;
    font-size: 1.125rem;
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .links .item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: #475569;
    span { font-weight: 500; }
  }

  .icon-circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.blue { background-color: #eff6ff; color: #2563eb; }
    &.green { background-color: #f0fdf4; color: #16a34a; }
  }
`;

const TouchForm = styled.div`
  background-color: #f8fafc;
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .input-wrapper {
    position: relative;
    svg {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  resize: none;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;