import Image from 'next/image';
import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    Github,
    Link as LinkIcon,
    BookOpen,
    Briefcase,
    Code2,
    GraduationCap,
    Trophy,
    Server,
    Database,
    Terminal,
    HeartHandshake,
    Building2,
    MessageCircle,
    Linkedin,
    Globe,
    GitPullRequest,
} from 'lucide-react';

export default function ResumePage() {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

    const navItems = [
        { id: 'profile', label: 'Profile', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'experience', label: 'Work Experience', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'contribution', label: 'Open Source', icon: <GitPullRequest className="w-4 h-4" /> },
        { id: 'projects', label: 'Key Projects', icon: <LinkIcon className="w-4 h-4" /> },
        { id: 'skills', label: 'Technical Skills', icon: <Code2 className="w-4 h-4" /> },
        {
            id: 'education',
            label: 'Education & Awards',
            icon: <GraduationCap className="w-4 h-4" />,
        },
    ];

    // 굵음 처리 부분
    const mainSkills = new Set([
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

    const badgeStyle = (isMain: boolean) => `
        text-[11px] px-2 py-1 
        bg-slate-50 border border-slate-200 
        dark:bg-slate-800 dark:border-slate-700 
        rounded-md 
        text-slate-600 dark:text-slate-300 
        hover:bg-slate-100 dark:hover:bg-slate-700
        ${isMain ? 'font-bold' : 'font-medium'}
    `;

    return (
        <div className="bg-slate-50 dark:bg-black min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sticky top-0 z-50 bg-slate-50/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                    <Header />
                </div>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-28 space-y-6">
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white text-sm px-2">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    <span>Contents</span>
                                </h3>
                                <nav className="flex flex-col space-y-1">
                                    {navItems.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                                        >
                                            <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20">
                                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Contact Me
                                </h4>
                                <p className="text-xs text-blue-100 mb-4 leading-relaxed opacity-90">
                                    커피챗이든, 어떤 연락이든 모두 좋습니다 😊
                                </p>
                                <a
                                    href="mailto:flqld86851@gmail.com"
                                    className="block w-full py-2 text-xs font-bold text-center text-blue-700 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Send Email
                                </a>
                            </div>
                        </div>
                    </aside>

                    <div className="lg:col-span-9 space-y-16">
                        {/* 프로필 */}
                        <section id="profile" className="scroll-mt-28">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex-1 order-2 md:order-1">
                                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white">
                                        김찬빈{' '}
                                        <span className="text-2xl md:text-3xl font-normal text-slate-400 dark:text-slate-500 ml-1">
                                            Chanbeen Kim
                                        </span>
                                    </h1>
                                    <p className="text-lg text-blue-600 dark:text-blue-400 font-bold mb-6 flex items-center gap-2">
                                        <Terminal className="w-5 h-5" />
                                        Full Stack Developer
                                    </p>

                                    <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-2xl mb-8 space-y-4">
                                        <p className="text-sm text-slate-800 dark:text-slate-200">
                                            <strong>
                                                &#34;도움이 되는 것에 보람을 느끼는 엔지니어&#34;
                                            </strong>
                                            입니다.
                                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded mx-1 font-semibold text-slate-900 dark:text-slate-100">
                                                500만 건 이상의 데이터
                                            </span>
                                            를 처리하는 모니터링 서비스에서 쿼리 최적화를 수행하여
                                            응답 속도를 <strong>40초에서 1초 미만으로 단축</strong>
                                            시킨 경험이 있습니다.
                                        </p>
                                        <p className="text-sm">
                                            일일{' '}
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                20,000 트래픽
                                            </span>
                                            의 행사 플랫폼 인프라를 설계 및 운영하며 AWS CloudWatch
                                            기반 보안 관제와 CI/CD 자동화를 직접 구축했습니다.
                                        </p>

                                        <div className="flex items-start gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <HeartHandshake className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-500 dark:text-slate-500">
                                                단순히 제 역량을 높이는 것에서 멈추지 않고, 사내
                                                스터디와 멘토링을 통해 지식을 공유하며 <br />
                                                <strong>
                                                    &#39;개인의 성장을 팀의 성장으로 확장하는
                                                    문화&#39;
                                                </strong>
                                                를 만드는 것에 깊은 가치를 둡니다.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        <a
                                            href="mailto:flqld86851@gmail.com"
                                            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span>flqld86851@gmail.com</span>
                                        </a>
                                        <a
                                            href="https://github.com/devbini"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            <Github className="w-4 h-4 text-slate-400" />
                                            <span>github.com/devbini</span>
                                        </a>
                                        <a
                                            href="https://linkedin.com/in/devbini"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            <Linkedin className="w-4 h-4 text-slate-400" />
                                            <span>linkedin.com/in/devbini</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="order-1 md:order-2 flex-shrink-0">
                                    <div className="relative w-32 h-40 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl shadow-slate-200 dark:shadow-none">
                                        <Image
                                            src={imageBaseUrl + '/resume_profile.jpg'}
                                            alt="Chanbeen Kim"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 경력 */}
                        <section id="experience" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                Work Experience
                            </h2>

                            <div className="relative space-y-8 pl-4">
                                <div className="absolute left-[40px] top-4 bottom-4 w-0.5 bg-slate-300 dark:bg-slate-700 z-0"></div>

                                <div className="relative pl-12 z-10">
                                    <div className="absolute left-0 top-0 p-1.5 bg-white dark:bg-black rounded-full border border-slate-200 dark:border-slate-700 z-10">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    (주)웨어밸리 (WareValley)
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                                    기술연구소 시트러스팀 / 선임 연구원
                                                </p>
                                            </div>
                                            <div className="mt-2 sm:mt-0 text-right">
                                                <span className="block text-sm font-bold text-blue-600 dark:text-blue-400">
                                                    2025.04 - Present
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    7 mos
                                                </span>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    Enterprise 제품 개발
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    <strong>Django(Python)</strong> 시스템{' '}
                                                    <strong>React</strong> 마이그레이션 및{' '}
                                                    <strong>Spring Boot/Java</strong> 버전
                                                    업그레이드 진행.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    LLM 기반 AI Chat, Socket 실시간 채팅, yjs 기반
                                                    실시간 동시 편집 시스템 등 신기능 개발 진행.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    외부망 팀 개발 인프라(
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        GitLab + Jenkins + ArgoCD(k3s)
                                                    </span>
                                                    ) 구축 전담 및 파이프라인 자동화.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        Redis
                                                    </span>
                                                    , PostgreSql, MSSQL, GreenPlum 등 이기종
                                                    데이터베이스 연동 및 데이터 엔지니어링 수행.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="relative pl-12 z-10">
                                    <div className="absolute left-0 top-0 p-1.5 bg-white dark:bg-black rounded-full border border-slate-200 dark:border-slate-700 z-10">
                                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-md">
                                            <MessageCircle className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    Codeit (코드잇)
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                                                        Full Stack Sprint Mentor
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20 text-[10px] px-1.5 py-0"
                                                    >
                                                        Freelance
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:mt-0 text-right">
                                                <span className="block text-sm font-bold text-slate-600 dark:text-slate-400">
                                                    2025.08 - 2026.02
                                                </span>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    부트캠프 수강생 대상{' '}
                                                    <strong>1:1 코드 리뷰 및 기술 멘토링</strong>{' '}
                                                    진행 (React, Express).
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    취업 준비 주니어 개발자들의 기술적 문제 해결을
                                                    돕고, 모의면접 진행.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="relative pl-12 z-10">
                                    <div className="absolute left-0 top-0 p-1.5 bg-white dark:bg-black rounded-full border border-slate-200 dark:border-slate-700 z-10">
                                        <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center text-white shadow-md">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    (주)코아텍
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                                    개발팀 / 주임 (Full Stack)
                                                </p>
                                            </div>
                                            <div className="mt-2 sm:mt-0 text-right">
                                                <span className="block text-sm font-bold text-slate-600 dark:text-slate-400">
                                                    2019.10 - 2025.04
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    5 yrs 7 mos
                                                </span>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    기존 수동적인 개발 환경에{' '}
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        Git VCS를 최초로 도입
                                                    </span>
                                                    하여 형상 관리 프로세스 정립.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    Linux 온프레미스 서버 및 공공 데이터 활용{' '}
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        스트리밍 서버 구축/운영
                                                    </span>{' '}
                                                    전담.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    Spring Boot, Node.js, JSP 기반 백엔드 및 React,
                                                    Next.js 프론트엔드 구축.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    Express + Socket 기반 MQTT 스트리밍 서버 구축 및
                                                    구독 시스템 구축.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                                                <span className="leading-relaxed">
                                                    MySQL, PostgreSQL 등 RDB 스키마 설계 및 대용량
                                                    쿼리 최적화 수행.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 오픈소스 참여이력 */}
                        <section id="contribution" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-300">
                                    <GitPullRequest className="w-6 h-6" />
                                </div>
                                Open Source Contribution
                            </h2>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                            <Github className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                                                Lettuce (Advanced Java Redis Client)
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Contributor (Pull Request #3387)
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-none">
                                        Open PR
                                    </Badge>
                                </div>

                                <div className="pl-0 sm:pl-[52px]">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                                        Spring Boot의 기본 Redis 클라이언트인{' '}
                                        <strong>Lettuce</strong>의 클러스터 성능 최적화에
                                        기여했습니다.
                                        <br />
                                        Redis Cluster 환경에서 키 파티셔닝 과정 중 발생하는
                                        오버헤드에 대한 최적화입니다.
                                    </p>

                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
                                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-500 font-bold mt-0.5">
                                                    ✓
                                                </span>
                                                <span>
                                                    Redis Cluster 환경에서 단일 키 파티션에 대해
                                                    무겁게 동작하던 <code>MGET</code> 명령어를
                                                    경량화된 <code>GET</code> 명령어로 변환하도록
                                                    로직 최적화.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-500 font-bold mt-0.5">
                                                    ✓
                                                </span>
                                                <span>
                                                    불필요한 커맨드 오버헤드를 제거하여 클라이언트
                                                    및 서버의 리소스 사용량을 절감하고 응답
                                                    속도(Latency) 개선.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <a
                                            href="https://github.com/redis/lettuce/pull/3387"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-purple-600 transition-colors"
                                        >
                                            <LinkIcon className="w-3 h-3" /> View Pull Request
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 주요 프로젝트 */}
                        <section id="projects" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-300">
                                    <LinkIcon className="w-6 h-6" />
                                </div>
                                Key Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                SeSAC 강의 플랫폼
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                2024.09 - Present | Full Stack & DevOps
                                            </p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            Team Project
                                        </Badge>
                                    </div>

                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {[
                                            'Spring Boot (Kotlin)',
                                            'React',
                                            'AWS to Azure',
                                            'MariaDB',
                                        ].map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-500 font-bold mt-0.5">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>Notification System:</strong>{' '}
                                                SSE(Server-Sent-Events) 기반 실시간 알림 분산 서비스
                                                구현.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-500 font-bold mt-0.5">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>Multi-Cloud & Migration:</strong> AWS 인프라
                                                비용 효율화 및 인프라 셋업, 이후 Azure 환경으로의
                                                마이그레이션 및 재설계.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-500 font-bold mt-0.5">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>Backend Engineering:</strong> MariaDB 테이블
                                                설계 및 JPA 최적화, Kotlin 기반 안정적인 서비스 로직
                                                구현.
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                영캠프 (대규모 축제 플랫폼)
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                2024.10 - 2024.12 | Backend Lead & DevOps
                                            </p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            Team Project
                                        </Badge>
                                    </div>

                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {[
                                            'Spring Boot (Java)',
                                            'JPA',
                                            'Security',
                                            'AWS',
                                            'Docker',
                                            'Jenkins',
                                        ].map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-500 font-bold mt-0.5">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>High Traffic Infra:</strong> 일 20,000
                                                트래픽 처리를 위한 AWS 로드밸런싱 설계 및
                                                모니터링/보안 관제.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-500 font-bold mt-0.5">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>CI/CD Automation:</strong> Jenkins & Docker
                                                기반 무중단 배포(Zero-downtime) 파이프라인 구축.
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                구내식당 메뉴 프리뷰
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                2024 - Present | Creator & Operator
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-slate-600 border-slate-300 font-normal"
                                        >
                                            Personal Project
                                        </Badge>
                                    </div>

                                    <div className="mb-4 flex flex-wrap gap-2">
                                        <span className="text-[11px] px-2 py-1 bg-green-100 text-green-700 font-bold rounded-md">
                                            DAU 50+
                                        </span>
                                        {['React', 'PWA', 'Operation'].map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-500 font-bold mt-0.5">
                                                ✓
                                            </span>
                                            <span>
                                                건물 내 임직원을 위한 식단 확인 웹 서비스 기획 및
                                                개발, 운영, 영업 전반
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-500 font-bold mt-0.5">
                                                ✓
                                            </span>
                                            <span>평일 기준 일일 활성 사용자(DAU) 50명 달성</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 기술 스택 */}
                        <section id="skills" className="scroll-mt-28">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg text-emerald-600 dark:text-emerald-300">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                Technical Skills
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                        <Server className="w-4 h-4" /> Backend & Infrastructure
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'Java',
                                            'Spring Boot',
                                            'Kotlin',
                                            'JPA',
                                            'Node.js',
                                            'Express.js',
                                            'Python',
                                            'Gradle',
                                            'Swagger',
                                            'WebSocket',
                                            'MQTT',
                                        ].map((s) => (
                                            <Badge
                                                key={s}
                                                className={badgeStyle(mainSkills.has(s))}
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                        <Terminal className="w-4 h-4" /> DevOps & Cloud
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'AWS',
                                            'Azure',
                                            'Docker',
                                            'Jenkins',
                                            'Kubernetes',
                                            'ArgoCD',
                                            'GitLab CI',
                                            'Nginx',
                                            'Apache Tomcat',
                                            'Ansible',
                                            'Linux',
                                        ].map((s) => (
                                            <Badge
                                                key={s}
                                                className={badgeStyle(mainSkills.has(s))}
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                        <Database className="w-4 h-4" /> Database
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'MySQL',
                                            'PostgreSQL',
                                            'MariaDB',
                                            'Redis',
                                            'MSSQL',
                                            'PostgreSQL',
                                        ].map((s) => (
                                            <Badge
                                                key={s}
                                                className={badgeStyle(mainSkills.has(s))}
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                        <Code2 className="w-4 h-4" /> Frontend & Others
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'React',
                                            'Next.js',
                                            'TypeScript',
                                            'Vite',
                                            'HTML/CSS',
                                            'JSP',
                                            'Unity',
                                            'Unreal Engine',
                                            'C#',
                                            'C++',
                                        ].map((s) => (
                                            <Badge
                                                key={s}
                                                className={badgeStyle(mainSkills.has(s))}
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 학위/수상/자격 */}
                        <section
                            id="education"
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-28"
                        >
                            {/* 학력 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg text-orange-600 dark:text-orange-300">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    Education
                                </h2>

                                <div className="relative pl-4 space-y-8">
                                    <div className="relative pl-6 z-10">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-orange-500 z-10"></div>
                                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                            동국대학교 (Dongguk Univ.)
                                        </h3>
                                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                            융합보안학 전공 (GPA 4.18/4.5)
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            미래융합대학 (야간) 재학 중
                                        </p>

                                        <div className="mt-3 p-3 rounded-lg bg-orange-50 border border-orange-100 dark:bg-orange-900/10 dark:border-orange-800/30">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                                                    AWS Cloud Clubs at DGU 1기
                                                </span>
                                                <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] h-5">
                                                    Core Member
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                                AWS 주관 글로벌 대학생 커뮤니티 초기 코어 멤버
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative pl-6 z-10">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-600 z-10"></div>
                                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                            수원정보과학고등학교
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                            디지털 네트워크학
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            보안 동아리 활동
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            2017.03 - 2020.03
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 수상 및 자격증 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-yellow-600 dark:text-yellow-300">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    Awards & Certifications
                                </h2>
                                <ul className="space-y-4">
                                    <li className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <span className="block font-bold text-sm text-slate-900 dark:text-white">
                                                최우수상 (동국대학교 미래융합대학 학술제)
                                            </span>
                                            <p className="text-xs text-slate-500 mt-1">
                                                논문: 소규모 클라우드 인스턴스 환경에서 보안
                                                솔루션이 웹 서비스 성능에 미치는 영향 분석
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px]">
                                            2025
                                        </Badge>
                                    </li>
                                    <li className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <span className="block font-bold text-sm text-slate-900 dark:text-white">
                                                우수상 (국토교통부)
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                경관심의 공모전
                                            </span>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px]">
                                            2020
                                        </Badge>
                                    </li>
                                    <li className="space-y-2 dark:border-slate-800 mt-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                            <span>정보처리기사 (2025.09)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                            <span>AWS Certified Cloud Practitioner (2024.09)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            <span>리눅스마스터 2급 (Linux Master Lv.2)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            <span>IBM Microservices & Serverless (2025.01)</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-500 pt-1">
                                            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5"></div>
                                            <span className="leading-snug">
                                                Foundation Skills: 정보처리기능사, 컴퓨터활용능력
                                                2급, IT+ Lv.2, 코딩지도사, 워드프로세서
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
