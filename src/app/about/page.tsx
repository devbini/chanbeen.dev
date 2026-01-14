'use client';

import { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Image from 'next/image';
import {
    Mail,
    Github,
    Linkedin,
    Code2,
    Trophy,
    GitPullRequest,
    Terminal,
    Database,
    Server,
    Download,
    Send,
    User,
    MessageSquare,
    Award,
    FileText,
} from 'lucide-react';
import { sendContactEmail } from '@/lib/email';

const PROFILE_IMAGE_URL = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '') + '/resume_profile.jpg';
const RESUME_FILE_URL = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '') + '/KimChanbeen_Resume.pdf';

const TOC_ITEMS = [
    { id: 'profile', text: 'Intro', level: 2 },
    { id: 'experience', text: 'Work Experience', level: 2 },
    { id: 'contribution', text: 'Open Source', level: 2 },
    { id: 'paper', text: 'Paper', level: 2 },
    { id: 'projects', text: 'Key Projects', level: 2 },
    { id: 'skills', text: 'Technical Skills', level: 2 },
    { id: 'education', text: 'Education', level: 2 },
    { id: 'awards', text: 'Awards & Certs', level: 2 },
    { id: 'others', text: 'Others', level: 2 },
];

const MAIN_SKILLS = new Set([
    'Java',
    'Spring Boot',
    'Kotlin',
    'JPA',
    'AWS',
    'Azure',
    'Docker',
    'Jenkins',
    'MySQL',
    'Redis',
    'React',
    'Next.js',
    'TypeScript',
]);

export default function ResumePage() {
    const [activeId, setActiveId] = useState<string>('');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const headingElementsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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

    const handleDownloadResume = async () => {
        try {
            const response = await fetch(RESUME_FILE_URL);

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'KimChanbeen_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            window.open(RESUME_FILE_URL, '_blank');
        }
    };

    useEffect(() => {
        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                headingElementsRef.current[entry.target.id] = entry;
            });

            const visibleHeadings: IntersectionObserverEntry[] = [];
            Object.keys(headingElementsRef.current).forEach((key) => {
                const entry = headingElementsRef.current[key];
                if (entry.isIntersecting && entry.intersectionRatio > 0) {
                    visibleHeadings.push(entry);
                }
            });

            if (visibleHeadings.length > 0) {
                const sortedVisible = visibleHeadings.sort(
                    (a, b) =>
                        a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top,
                );
                setActiveId(sortedVisible[0].target.id);
            }
        };

        const observer = new IntersectionObserver(callback, {
            rootMargin: '-100px 0px -40% 0px',
            threshold: [0, 1],
        });

        TOC_ITEMS.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const handleSendEmail = async () => {
        if (!formData.name || !formData.email || !formData.message) {
            alert('이름, 이메일, 내용을 모두 입력해주세요.');
            return;
        }

        setIsSending(true);

        try {
            await sendContactEmail(formData);
            alert(
                '메일이 성공적으로 전송되었습니다! 🚀\n감사합니다. 빠른 시일 내에 회신드리겠습니다.',
            );
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            alert('메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요. 😢');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <PageContainer>
            <ProgressBar style={{ width: `${scrollProgress}%` }} />

            <HeroSection>
                <HeroOverlay />
                <HeroContent>
                    <MetaInfo>
                        <span className="job-title">
                            <Terminal size={14} /> Full Stack Developer (Cloud & DevOps Engineer)
                        </span>
                        <div className="social-links">
                            <a href="https://github.com/devbini" target="_blank">
                                <Github size={16} /> GitHub
                            </a>
                            <a href="https://linkedin.com/in/devbini" target="_blank">
                                <Linkedin size={16} /> LinkedIn
                            </a>
                            <a href="mailto:flqld86851@gmail.com">
                                <Mail size={16} /> Email
                            </a>
                        </div>
                    </MetaInfo>
                    <HeroTitle>
                        김찬빈 <span className="eng">Chanbeen Kim</span>
                    </HeroTitle>
                    <p className="hero-desc">
                        &quot;도움이 되는 것에 보람을 느끼는 엔지니어&quot;
                        <br />
                        개인의 성장이 팀의 성장으로 확장되는 문화를 좋아하고, 도전을 멈추지
                        않습니다.
                    </p>
                </HeroContent>
            </HeroSection>

            <ContentGrid>
                <ResumeContent>
                    {/* Intro */}
                    <Section id="profile">
                        <SectionTitle>Intro</SectionTitle>
                        <IntroBox>
                            <div className="text">
                                <p className="headline">
                                    <strong>
                                        &quot;기술로 비즈니스의 실질적인 가치를 만들어내는 엔지니어
                                        김찬빈입니다.&quot;
                                    </strong>
                                </p>
                                <p>
                                    지난 6년간 웹 개발 전반과 인프라를 아우르며{' '}
                                    <strong>&apos;숲과 나무를 동시에 보는 시야&apos;</strong>를
                                    갖췄습니다.
                                    <br />
                                    <strong>
                                        500만 건 이상의 데이터 처리 최적화(40s→1s)
                                    </strong>와{' '}
                                    <strong>
                                        온프레미스 운영, 클라우드 인프라 구축 및 마이그레이션
                                    </strong>{' '}
                                    경험 등을 바탕으로 비즈니스 문제를 기술적으로 해결하는 데
                                    집중합니다.
                                </p>
                                <p>
                                    기능 구현을 넘어 <strong>'왜'</strong>를 고민하며,{' '}
                                    <strong>오픈소스 기여와 컨퍼런스 연사, 멘토링 활동</strong>으로
                                    지식의 선순환을 바라고 있습니다. 이러한 경험을 바탕으로, 사내
                                    DevOps 문화를 주도하며 팀 전체의 엔지니어링 역량을 높이는{' '}
                                    <strong>'함께 성장하는 개발자'</strong>가 되고자 합니다.
                                </p>
                            </div>
                            <div className="profile-img">
                                <Image
                                    src={PROFILE_IMAGE_URL}
                                    alt="Chanbeen Kim"
                                    width={140}
                                    height={140}
                                    style={{ objectFit: 'cover', borderRadius: '1rem' }}
                                />
                            </div>
                        </IntroBox>
                    </Section>

                    {/* Work Experience */}
                    <Section id="experience">
                        <SectionTitle>Work Experience</SectionTitle>
                        <Timeline>
                            <TimelineItem>
                                <div className="date-col">
                                    <span className="period">2025.04 - Present</span>
                                    <span className="duration">7 mos</span>
                                </div>
                                <div className="content-col">
                                    <h3 className="company">(주)웨어밸리 (WareValley)</h3>
                                    <p className="role">
                                        기술연구소 시트러스팀 / 선임 연구원 (Full Stack)
                                    </p>
                                    <ul className="details">
                                        <li>
                                            외부망 팀 개발 인프라(GitLab + Jenkins + ArgoCD) 구축 및
                                            파이프라인 자동화.
                                        </li>
                                        <li>
                                            <strong>Django(Python)</strong> 시스템 React
                                            마이그레이션 및 Spring Boot/Java 프로젝트 진행.
                                        </li>
                                        <li>
                                            LLM 기반 AI Chat, Socket 실시간 채팅, yjs 기반 실시간
                                            동시 편집 시스템 등 신기능 개발.
                                        </li>
                                        <li>
                                            Socket & xterm.js & Guacamole 활용 Web-based
                                            SSH/TELNET/RDP Terminal 기능 구현
                                        </li>
                                    </ul>
                                </div>
                            </TimelineItem>

                            <TimelineItem>
                                <div className="date-col">
                                    <span className="period">2025.08 - 2026.02</span>
                                    <span className="type">Freelance</span>
                                </div>
                                <div className="content-col">
                                    <h3 className="company">Codeit (코드잇)</h3>
                                    <p className="role">Full Stack Sprint 9기 Mentor</p>
                                    <ul className="details">
                                        <li>
                                            부트캠프 수강생 대상 1:1 코드 리뷰 및 기술 멘토링 진행
                                            (React, Express).
                                        </li>
                                        <li>
                                            취업 준비 주니어 개발자들의 기술적 문제 해결을 돕고,
                                            모의면접 진행.
                                        </li>
                                    </ul>
                                </div>
                            </TimelineItem>

                            <TimelineItem>
                                <div className="date-col">
                                    <span className="period">2019.10 - 2025.03</span>
                                    <span className="duration">5 yrs 7 mos</span>
                                </div>
                                <div className="content-col">
                                    <h3 className="company">(주)코아텍</h3>
                                    <p className="role">개발팀 / 주임 (Full Stack)</p>
                                    <ul className="details">
                                        <li>
                                            기존 수동적인 개발 환경에 Git VCS를 최초로 도입하여 형상
                                            관리 프로세스 정립.
                                        </li>
                                        <li>
                                            Linux 온프레미스 서버 및 공공 데이터 활용 웹 프로그램
                                            구축/운영 전담.
                                        </li>
                                        <li>
                                            Express + Socket 기반 MQTT 스트리밍 서버 구축 및 구독
                                            시스템 구축.
                                        </li>
                                        <li>MySQL 스키마 설계 및 대용량 쿼리 최적화 수행.</li>
                                    </ul>
                                </div>
                            </TimelineItem>
                        </Timeline>
                    </Section>

                    {/* Open Source */}
                    <Section id="contribution">
                        <SectionTitle>Open Source Contribution</SectionTitle>

                        {/* ArgoCD */}
                        <ProjectCard>
                            <div className="card-header">
                                <div>
                                    <h3>ArgoCD (Kubernetes GitOps)</h3>
                                    <p className="sub">Contributor (Pull Request #25906)</p>
                                </div>
                                <Badge $variant="purple">Open PR</Badge>
                            </div>
                            <p className="desc">
                                ArgoCD CLI로 클러스터 추가 시, 번들링된 내부 Redis 대신{' '}
                                <strong>외부 Redis(External Redis)</strong>를 사용할 수 있도록{' '}
                                <code>ARGOCD_REDIS_SERVER</code> 환경변수 기능을 추가했습니다.
                                (테스트 파일 작성 및 이슈 해결 포함)
                            </p>
                            <div className="tech-stack-row">
                                <TechTag>Go</TechTag>
                                <TechTag>Kubernetes</TechTag>
                                <TechTag>Redis</TechTag>
                            </div>
                            <a
                                href="https://github.com/argoproj/argo-cd/pull/25906"
                                target="_blank"
                                className="link"
                            >
                                <GitPullRequest size={14} /> View Pull Request
                            </a>
                        </ProjectCard>

                        {/* Lettuce */}
                        <ProjectCard>
                            <div className="card-header">
                                <div>
                                    <h3>Lettuce (Advanced Java Redis Client)</h3>
                                    <p className="sub">Contributor (Pull Request #3387)</p>
                                </div>
                                <Badge $variant="purple">Open PR</Badge>
                            </div>
                            <p className="desc">
                                Spring Boot의 기본 Redis 클라이언트인 <strong>Lettuce</strong>의
                                클러스터 성능 최적화 PR으로
                                <br />
                                Redis Cluster 환경에서 키 파티셔닝 과정 중 발생하는 오버헤드를
                                줄이기 위해 <code>MGET</code>을 <code>GET</code>으로 최적화했습니다.
                            </p>
                            <div className="tech-stack-row">
                                <TechTag>Java</TechTag>
                                <TechTag>Redis</TechTag>
                            </div>
                            <a
                                href="https://github.com/redis/lettuce/pull/3387"
                                target="_blank"
                                className="link"
                            >
                                <GitPullRequest size={14} /> View Pull Request
                            </a>
                        </ProjectCard>
                    </Section>

                    {/* Paper */}
                    <Section id="paper">
                        <SectionTitle>Paper</SectionTitle>
                        <ProjectCard>
                            <div className="card-header">
                                <div>
                                    <h3>
                                        클라우드 환경의 소규모 인스턴스에서 보안 솔루션이 웹 서비스
                                        성능에 미치는 영향
                                    </h3>
                                    <p className="sub">KCI 등재 (한국테러학회보 18권 4호)</p>
                                </div>
                                <Badge $variant="purple">KCI Accredited</Badge>
                            </div>
                            <p className="desc">
                                클라우드 소규모 인스턴스(AWS t2.micro) 환경에서 보안 솔루션 적용이
                                웹 서비스 성능에 미치는 영향을 실험 분석한 논문입니다. DPI(Deep
                                Packet Inspection)를 수행하는 Suricata 등 고부하 솔루션 적용 시 CPU
                                크레딧 고갈로 인한 가용성 저해 현상을 확인했습니다.
                            </p>
                            <div className="tech-stack-row">
                                <TechTag>Cloud Security</TechTag>
                                <TechTag>AWS</TechTag>
                                <TechTag>Performance Analysis</TechTag>
                            </div>
                            <a
                                href="https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003284473"
                                target="_blank"
                                className="link"
                            >
                                <FileText size={14} /> View Paper (KCI)
                            </a>
                        </ProjectCard>
                    </Section>

                    {/* Project */}
                    <Section id="projects">
                        <SectionTitle>Key Projects</SectionTitle>
                        <ProjectGrid>
                            <ProjectCard>
                                <div className="card-header">
                                    <h3>SeSAC 강의 플랫폼</h3>
                                    <Badge>Team Project</Badge>
                                </div>
                                <p className="role">Backend & DevOps</p>
                                <div className="tech-stack-row">
                                    <TechTag>Spring Boot</TechTag>
                                    <TechTag>Kotlin</TechTag>
                                    <TechTag>React</TechTag>
                                    <TechTag>AWS</TechTag>
                                </div>
                                <ul className="details">
                                    <li>Spring Boot(Kotlin) 기반 RESTful API 서버 구축</li>
                                    <li>SSE 기반 실시간 알림 분산 서비스 FE & BE 구현.</li>
                                    <li>AWS 인프라 설계 및 운영, Azure 마이그레이션 전담</li>
                                    <li>MariaDB 기반 테이블 설계 및 JPA 구현</li>
                                </ul>
                            </ProjectCard>

                            <ProjectCard>
                                <div className="card-header">
                                    <h3>영캠프 (축제 플랫폼)</h3>
                                    <Badge>Team Project</Badge>
                                </div>
                                <p className="role">Backend Lead & DevOps</p>
                                <div className="tech-stack-row">
                                    <TechTag>Spring Boot</TechTag>
                                    <TechTag>JPA</TechTag>
                                    <TechTag>AWS</TechTag>
                                    <TechTag>Docker</TechTag>
                                </div>
                                <ul className="details">
                                    <li>Spring Boot(Java) 기반 RESTful API 서버 구축</li>
                                    <li>
                                        AWS WAF & CloudWatch 기반 실시간 모니터링 구축 및 DDoS 공격
                                        차단 & 위협대응
                                    </li>
                                    <li>일 20,000 트래픽 처리를 위한 AWS 로드밸런싱 설계.</li>
                                    <li>Jenkins & Docker 기반 무중단 배포 파이프라인 구축.</li>
                                </ul>
                            </ProjectCard>

                            <ProjectCard>
                                <div className="card-header">
                                    <h3>구내식당 메뉴 프리뷰</h3>
                                    <Badge $variant="gray">Personal Project</Badge>
                                </div>
                                <p className="role">Solo Developer, Sales & Operation</p>
                                <div className="tech-stack-row">
                                    <TechTag>React</TechTag>
                                    <TechTag>PWA</TechTag>
                                    <TechTag>Vercel</TechTag>
                                </div>
                                <ul className="details">
                                    <li>
                                        건물 내 임직원을 위한 식단 확인 웹 서비스 기획 및 개발,
                                        운영.
                                    </li>
                                    <li>
                                        <strong>DAU 50+</strong> 달성, 사용자 피드백 루프를 통한
                                        기능 개선 경험.
                                    </li>
                                </ul>
                            </ProjectCard>
                        </ProjectGrid>
                    </Section>

                    {/* Skills */}
                    <Section id="skills">
                        <SectionTitle>Technical Skills</SectionTitle>
                        <SkillGrid>
                            <SkillBox>
                                <h4>
                                    <Server size={14} /> Backend
                                </h4>
                                <div className="tags">
                                    {[
                                        'Java',
                                        'Spring Boot',
                                        'Kotlin',
                                        'JPA',
                                        'Node.js',
                                        'Express.js',
                                        'Python',
                                    ].map((s) => (
                                        <SkillTag key={s} $highlight={MAIN_SKILLS.has(s)}>
                                            {s}
                                        </SkillTag>
                                    ))}
                                </div>
                            </SkillBox>
                            <SkillBox>
                                <h4>
                                    <Terminal size={14} /> DevOps
                                </h4>
                                <div className="tags">
                                    {[
                                        'AWS',
                                        'Azure',
                                        'Docker',
                                        'Jenkins',
                                        'Kubernetes',
                                        'ArgoCD',
                                        'Linux',
                                    ].map((s) => (
                                        <SkillTag key={s} $highlight={MAIN_SKILLS.has(s)}>
                                            {s}
                                        </SkillTag>
                                    ))}
                                </div>
                            </SkillBox>
                            <SkillBox>
                                <h4>
                                    <Database size={14} /> Database
                                </h4>
                                <div className="tags">
                                    {['MySQL', 'PostgreSQL', 'Redis', 'MSSQL'].map((s) => (
                                        <SkillTag key={s} $highlight={MAIN_SKILLS.has(s)}>
                                            {s}
                                        </SkillTag>
                                    ))}
                                </div>
                            </SkillBox>
                            <SkillBox>
                                <h4>
                                    <Code2 size={14} /> Frontend
                                </h4>
                                <div className="tags">
                                    {['React', 'Next.js', 'TypeScript', 'HTML/CSS'].map((s) => (
                                        <SkillTag key={s} $highlight={MAIN_SKILLS.has(s)}>
                                            {s}
                                        </SkillTag>
                                    ))}
                                </div>
                            </SkillBox>
                        </SkillGrid>
                    </Section>

                    {/* Education */}
                    <Section id="education">
                        <SectionTitle>Education</SectionTitle>
                        <Timeline>
                            <TimelineItem>
                                <div className="date-col">
                                    <span className="period">2023.03 - 2026.02</span>
                                </div>
                                <div className="content-col">
                                    <h3 className="company">동국대학교 (Dongguk Univ.)</h3>
                                    <p className="role">융합보안학 전공 (미래융합대학)</p>
                                    <p className="desc">
                                        <span style={{ color: '#2563eb', fontWeight: 600 }}>
                                            GPA 4.2 / 4.5
                                        </span>
                                        &nbsp;· 최우등 졸업 (Summa Cum Laude) · 1년 조기 졸업 (예정)
                                    </p>
                                    <ul className="details">
                                        <li>
                                            <strong>
                                                AWS Cloud Clubs 1st Gen Core Team (DevRel)
                                            </strong>{' '}
                                            - 동국대학교 ACC 초기 코어 멤버로 활동하며 기술 공유
                                            세션 운영.
                                        </li>
                                    </ul>
                                </div>
                            </TimelineItem>

                            <TimelineItem>
                                <div className="date-col">
                                    <span className="period">2017.03 - 2020.02</span>
                                </div>
                                <div className="content-col">
                                    <h3 className="company">수원정보과학고등학교</h3>
                                    <p className="role">디지털 네트워크과</p>
                                    <ul className="details">
                                        <li>
                                            <strong>보안 동아리 활동</strong> - 웹 해킹 파트를
                                            담당하며 기본적인 코딩지식 및 해커톤 참여
                                        </li>
                                    </ul>
                                </div>
                            </TimelineItem>
                        </Timeline>
                    </Section>

                    {/* Awards & Certs */}
                    <Section id="awards">
                        <SectionTitle>Awards & Certifications</SectionTitle>
                        <ListContainer>
                            <ListItem>
                                <div className="icon-col">
                                    <Trophy size={18} className="icon gold" />
                                </div>
                                <div className="text-col">
                                    <div className="main-text">
                                        웨어밸리 사내 AI 활용 공모전{' '}
                                        <span className="highlight">대상</span>
                                    </div>
                                    <div className="sub-text">
                                        Ollama 기반 사내 코드 리뷰 봇 구축 (2025.12)
                                    </div>
                                </div>
                            </ListItem>
                            <ListItem>
                                <div className="icon-col">
                                    <Trophy size={18} className="icon silver" />
                                </div>
                                <div className="text-col">
                                    <div className="main-text">
                                        동국대학교 미래융합대학 학술제{' '}
                                        <span className="highlight">최우수상</span>
                                    </div>
                                    <div className="sub-text">
                                        논문: 소규모 클라우드 인스턴스 보안/성능 분석 (2025.11)
                                    </div>
                                </div>
                            </ListItem>
                            <ListItem>
                                <div className="icon-col">
                                    <Trophy size={18} className="icon silver" />
                                </div>
                                <div className="text-col">
                                    <div className="main-text">
                                        국토교통부 주관 경관심의 공모전{' '}
                                        <span className="highlight">우수상</span>
                                    </div>
                                    <div className="sub-text">
                                        언리얼 엔진 활용 경관심의 진행 프로그램 개발 (2020.10)
                                    </div>
                                </div>
                            </ListItem>

                            <Divider />

                            <ListItem>
                                <div className="icon-col">
                                    <Award size={18} className="icon blue" />
                                </div>
                                <div className="text-col">
                                    <div className="main-text">
                                        AWS Certified Solutions Architect – Associate (SAA)
                                    </div>
                                    <div className="sub-text">Amazon Web Services (2026.01)</div>
                                </div>
                            </ListItem>
                            <ListItem>
                                <div className="icon-col">
                                    <Award size={18} className="icon blue" />
                                </div>
                                <div className="text-col">
                                    <div className="main-text">
                                        정보처리기사 (Engineer Information Processing)
                                    </div>
                                    <div className="sub-text">한국산업인력공단 (2025.09)</div>
                                </div>
                            </ListItem>
                            <ListItem>
                                <div className="icon-col">
                                    <Award size={18} className="icon gray" />
                                </div>
                                <div className="text-col">
                                    <div className="main-text">
                                        리눅스마스터 2급 (Linux Master Lv.2)
                                    </div>
                                    <div className="sub-text">KAIT (2025.07)</div>
                                </div>
                            </ListItem>
                            <ListItem>
                                <div className="icon-col">
                                    <Award size={18} className="icon gray" />
                                </div>
                                <div className="text-col">
                                    <div className="main-text">
                                        Application Development using Microservices and Serverless
                                        (수료)
                                    </div>
                                    <div className="sub-text">IBM (2025.01)</div>
                                </div>
                            </ListItem>
                            <ListItem>
                                <div className="icon-col">
                                    <Award size={18} className="icon gray" />
                                </div>
                                <div className="text-col">
                                    <div className="main-text">
                                        AWS Certified Cloud Practitioner (CLF)
                                    </div>
                                    <div className="sub-text">Amazon Web Services (2024.09)</div>
                                </div>
                            </ListItem>
                        </ListContainer>
                    </Section>

                    {/* Others */}
                    <Section id="others">
                        <SectionTitle>Others</SectionTitle>
                        <ListContainer>
                            <ListItem>
                                <div className="text-col">
                                    <div className="main-text">"유명한 기술이 정답인가?"</div>
                                    <div className="sub-text">TEO Conf 연사 (2025.12)</div>
                                </div>
                            </ListItem>
                        </ListContainer>
                    </Section>
                </ResumeContent>

                {/* 우측 사이드뷰 */}
                <AsideWrapper>
                    <SidebarContent>
                        <TocBox>
                            <div className="toc-header">Contents</div>
                            <TocList>
                                {TOC_ITEMS.map((item) => (
                                    <TocItem
                                        key={item.id}
                                        $active={activeId === item.id}
                                        $level={item.level}
                                    >
                                        <a
                                            href={`#${item.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(item.id)?.scrollIntoView({
                                                    behavior: 'smooth',
                                                });
                                            }}
                                        >
                                            {item.text}
                                        </a>
                                    </TocItem>
                                ))}
                            </TocList>
                        </TocBox>

                        <DownloadBtn onClick={handleDownloadResume}>
                            <Download size={16} /> Download Resume
                        </DownloadBtn>

                        <ContactForm>
                            <div className="form-header">
                                <MessageSquare size={16} />
                                <span>Send me a message</span>
                            </div>

                            <InputGroup>
                                <label>Name</label>
                                <div className="input-wrapper">
                                    <User size={14} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="홍길동"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </InputGroup>

                            <InputGroup>
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <Mail size={14} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </InputGroup>

                            <InputGroup>
                                <label>Message</label>
                                <textarea
                                    rows={3}
                                    name="message"
                                    placeholder="안녕하세요..."
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputGroup>

                            <SubmitBtn type="button" onClick={handleSendEmail} disabled={isSending}>
                                {isSending ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        Send <Send size={14} />
                                    </>
                                )}
                            </SubmitBtn>
                        </ContactForm>
                    </SidebarContent>
                </AsideWrapper>
            </ContentGrid>
        </PageContainer>
    );
}

// 스타일컴포넌트
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

const HeroSection = styled.header`
    position: relative;
    width: 100%;
    height: 400px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background-color: #1e293b;
    margin-bottom: 5rem;
    padding-top: 4rem;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);

    @media (max-width: 768px) {
        height: 350px;
    }
`;

const HeroOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
`;

const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1024px;
    padding: 0 1.5rem 4rem;
    color: white;

    .hero-desc {
        font-size: 1rem;
        color: #cbd5e1;
        line-height: 1.6;
        max-width: 600px;
        margin-top: 1rem;
    }
`;

const HeroTitle = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    .eng {
        font-weight: 400;
        color: #94a3b8;
        font-size: 1.8rem;
        margin-left: 0.5rem;
    }
    @media (max-width: 768px) {
        font-size: 2.2rem;
    }
`;

const MetaInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .job-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        color: #60a5fa;
        text-transform: uppercase;
        font-size: 0.875rem;
        letter-spacing: 0.05em;
    }

    .social-links {
        display: flex;
        gap: 1rem;
        a {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.8rem;
            color: #cbd5e1;
            text-decoration: none;
            transition: color 0.2s;
            &:hover {
                color: white;
            }
        }
    }
`;

const ContentGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    position: relative;

    @media (min-width: 1024px) {
        grid-template-columns: minmax(0, 3fr) 260px;
    }
`;

const ResumeContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4rem;
    min-width: 0;
`;

const AsideWrapper = styled.aside`
    display: none;
    @media (min-width: 1024px) {
        display: block;
    }
`;

const SidebarContent = styled.div`
    position: sticky;
    top: 8rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const TocBox = styled.div`
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

const TocItem = styled.li<{ $active: boolean; $level: number }>`
    font-size: 0.9rem;
    position: relative;
    transition: all 0.2s;

    ${(props) =>
        props.$active &&
        css`
            &::before {
                content: '';
                position: absolute;
                left: -1.6rem;
                top: 0;
                bottom: 0;
                width: 3px;
                background-color: #2563eb;
                border-radius: 0 4px 4px 0;
            }
        `}

    a {
        display: block;
        color: ${(props) => (props.$active ? '#1e293b' : '#94a3b8')};
        font-weight: ${(props) => (props.$active ? '700' : '400')};
        text-decoration: none;
        line-height: 1.4;
        transition: color 0.2s;
        &:hover {
            color: #3b82f6;
        }
    }
`;

const DownloadBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background-color: #1e293b;
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #334155;
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
`;

const ContactForm = styled.div`
    background-color: #f8fafc;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #f1f5f9;

    .form-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 700;
        color: #475569;
        margin-bottom: 1rem;
    }
`;

const InputGroup = styled.div`
    margin-bottom: 0.8rem;

    label {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 0.4rem;
    }

    .input-wrapper {
        position: relative;
        svg {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
        }
    }

    input,
    textarea {
        width: 100%;
        padding: 0.6rem 0.75rem;
        font-size: 0.875rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        outline: none;
        transition: all 0.2s;
        background: white;

        &:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
    }

    input {
        padding-left: 2.2rem;
    }
    textarea {
        resize: none;
    }
`;

const SubmitBtn = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem;
    background-color: #1e293b;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #334155;
        color: white;
    }
`;

const Section = styled.section`
    scroll-margin-top: 6rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
`;

const IntroBox = styled.div`
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    .text {
        flex: 1;
        line-height: 1.7;
        color: #334155;
        p {
            margin-bottom: 1rem;
        }
    }
    .profile-img {
        flex-shrink: 0;
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        padding: 0.5rem;
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 640px) {
        flex-direction: column-reverse;
        .profile-img {
            width: 100px;
        }
    }
`;

const Highlight = styled.span`
    background-color: #eff6ff;
    color: #1d4ed8;
    font-weight: 600;
    padding: 0 0.2rem;
    border-radius: 0.2rem;
`;

const Timeline = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const TimelineItem = styled.div`
    display: flex;
    gap: 2rem;

    @media (max-width: 640px) {
        flex-direction: column;
        gap: 0.5rem;
    }

    .date-col {
        flex-shrink: 0;
        width: 140px;
        text-align: right;
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 500;
        .period {
            display: block;
        }
        .duration,
        .type {
            display: block;
            font-size: 0.75rem;
            margin-top: 0.2rem;
            opacity: 0.8;
        }

        @media (max-width: 640px) {
            text-align: left;
            width: 100%;
            display: flex;
            gap: 0.5rem;
            align-items: baseline;
        }
    }

    .content-col {
        flex: 1;
        border-left: 2px solid #e2e8f0;
        padding-left: 1.5rem;
        padding-bottom: 2rem;

        @media (max-width: 640px) {
            border-left: 2px solid #e2e8f0;
            margin-left: 0.5rem;
            padding-left: 1rem;
        }

        .company {
            font-size: 1.1rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.2rem;
        }
        .role {
            font-size: 0.9rem;
            color: #2563eb;
            font-weight: 600;
            margin-bottom: 0.8rem;
        }
        .desc {
            font-size: 0.9rem;
            color: #334155;
            line-height: 1.6;
            margin-bottom: 0.5rem;
        }

        .details {
            list-style: disc;
            padding-left: 1rem;
            color: #475569;
            font-size: 0.9rem;
            line-height: 1.6;
            li {
                margin-bottom: 0.4rem;
            }
            li::marker {
                color: #cbd5e1;
            }
        }
    }
`;

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ListItem = styled.div`
    display: flex;
    gap: 1rem;
    align-items: flex-start;

    .icon-col {
        padding-top: 0.2rem;
        .icon {
            &.gold {
                color: #eab308;
            }
            &.silver {
                color: #94a3b8;
            }
            &.blue {
                color: #3b82f6;
            }
            &.gray {
                color: #9ca3af;
            }
        }
    }

    .text-col {
        .main-text {
            font-size: 0.95rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.1rem;
        }
        .sub-text {
            font-size: 0.85rem;
            color: #64748b;
        }
        .highlight {
            color: #2563eb;
            font-weight: 700;
        }
    }
`;

const Divider = styled.div`
    height: 1px;
    background-color: #e2e8f0;
    margin: 1rem 0;
`;

const ProjectCard = styled.div`
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.8rem;

        h3 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #0f172a;
        }
        .sub {
            font-size: 0.8rem;
            color: #64748b;
            margin-top: 0.2rem;
        }
    }

    .desc {
        font-size: 0.9rem;
        color: #334155;
        line-height: 1.6;
        margin-bottom: 1rem;
    }

    .tech-stack-row {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: #2563eb;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }

    .role {
        font-size: 0.85rem;
        color: #2563eb;
        font-weight: 600;
        margin-bottom: 1rem;
    }
`;

const ProjectGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }

    ${ProjectCard} {
        margin-bottom: 0;
        background: white;
        border-color: #e2e8f0;
    }
    .details {
        list-style: none;
        font-size: 0.85rem;
        color: #475569;
        li {
            position: relative;
            padding-left: 0.8rem;
            margin-bottom: 0.3rem;
        }
        li::before {
            content: '-';
            position: absolute;
            left: 0;
            color: #cbd5e1;
        }
    }
`;

const Badge = styled.span<{ $variant?: string }>`
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    font-weight: 600;
    white-space: nowrap;
    ${(props) =>
        props.$variant === 'purple'
            ? css`
                  background: #f3e8ff;
                  color: #7e22ce;
              `
            : props.$variant === 'gray'
              ? css`
                    background: #f1f5f9;
                    color: #475569;
                `
              : css`
                    background: #eff6ff;
                    color: #1d4ed8;
                `}
`;

const SkillGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`;

const SkillBox = styled.div`
    h4 {
        font-size: 0.9rem;
        font-weight: 700;
        color: #64748b;
        margin-bottom: 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        text-transform: uppercase;
    }
    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
    }
`;

const SkillTag = styled.span<{ $highlight?: boolean }>`
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
    border-radius: 0.4rem;
    ${(props) =>
        props.$highlight
            ? css`
                  background: #eff6ff;
                  color: #1d4ed8;
                  font-weight: 600;
                  border: 1px solid #dbeafe;
              `
            : css`
                  background: #f8fafc;
                  color: #475569;
                  border: 1px solid #f1f5f9;
              `}
`;

const TechTag = styled.span`
    font-size: 0.75rem;
    background-color: #f1f5f9;
    color: #475569;
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    font-weight: 500;
    border: 1px solid #e2e8f0;
`;
