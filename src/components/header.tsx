'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaReact, FaCloud, FaCoffee, FaPenNib } from 'react-icons/fa';
import { Github, Linkedin, ChevronDown, Terminal, Camera, Menu, X } from 'lucide-react';

const mobileLinks = [
    { href: '/about', label: 'Resume' },
    { href: '/blog', label: 'View All Posts' },
];

const categoryLinks = [
    { href: '/blog/category/devops', label: 'DevOps & Cloud', icon: FaCloud },
    { href: '/blog/category/backend', label: 'Backend & Java', icon: FaCoffee },
    { href: '/blog/category/frontend', label: 'Frontend', icon: FaReact },
    { href: '/blog/category/essay', label: 'Essay', icon: FaPenNib },
];

export default function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!mobileOpen) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
                setMobileOpen(false);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        const desktop = window.matchMedia('(min-width: 768px)');
        const closeOnDesktop = () => {
            if (desktop.matches) setMobileOpen(false);
        };
        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        desktop.addEventListener('change', closeOnDesktop);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
            desktop.removeEventListener('change', closeOnDesktop);
        };
    }, [mobileOpen]);

    return (
        <HeaderWrapper
            ref={headerRef}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setMobileOpen(false);
            }}
        >
            <NavContainer>
                <LogoLink href="/">
                    <Terminal size={20} className="icon" />
                    <span>CHANBEEN.COM</span>
                </LogoLink>

                <NavMenu>
                    <NavItem href="/about">Resume</NavItem>

                    <DropdownWrapper>
                        <span className="trigger">
                            Posts <ChevronDown size={14} />
                        </span>

                        <DropdownContent>
                            <DropdownBox>
                                <div className="label">Categories</div>
                                <DropdownItem href="/blog/category/devops">
                                    <FaCloud className="icon sky" /> <span>DevOps & Cloud</span>
                                </DropdownItem>
                                <DropdownItem href="/blog/category/backend">
                                    <FaCoffee className="icon amber" /> <span>Backend & Java</span>
                                </DropdownItem>
                                <DropdownItem href="/blog/category/frontend">
                                    <FaReact className="icon blue" /> <span>Frontend</span>
                                </DropdownItem>
                                <DropdownItem href="/blog/category/essay">
                                    <FaPenNib className="icon slate" /> <span>Essay</span>
                                </DropdownItem>
                                <div className="divider"></div>
                                <DropdownItem href="/blog" className="view-all">
                                    View All Posts
                                </DropdownItem>
                            </DropdownBox>
                        </DropdownContent>
                    </DropdownWrapper>
                </NavMenu>

                <SocialLinks>
                    <Link href="https://github.com/devbini" target="_blank" aria-label="GitHub">
                        <Github size={18} />
                    </Link>
                    <Link
                        href="https://linkedin.com/in/chanbeen"
                        target="_blank"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={18} />
                    </Link>
                    <Link href="/photo" aria-label="Photo archive">
                        <Camera size={18} />
                    </Link>
                </SocialLinks>
                <MobileMenuButton
                    ref={menuButtonRef}
                    type="button"
                    aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMobileOpen((open) => !open)}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </MobileMenuButton>
            </NavContainer>
            <MobileNavigation
                id="mobile-navigation"
                aria-label="모바일 메뉴"
                hidden={!mobileOpen}
                onClick={(event) => {
                    if (event.target instanceof Element && event.target.closest('a')) {
                        setMobileOpen(false);
                    }
                }}
            >
                {mobileLinks.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        aria-current={pathname === href ? 'page' : undefined}
                    >
                        {label}
                    </Link>
                ))}
                <div className="categories">
                    <p>Categories</p>
                    {categoryLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={pathname === href ? 'page' : undefined}
                        >
                            <Icon aria-hidden="true" /> {label}
                        </Link>
                    ))}
                </div>
                <div className="socials">
                    <Link
                        href="https://github.com/devbini"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </Link>
                    <Link
                        href="https://linkedin.com/in/chanbeen"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </Link>
                    <Link href="/photo" aria-current={pathname === '/photo' ? 'page' : undefined}>
                        Photo Archive
                    </Link>
                </div>
            </MobileNavigation>
        </HeaderWrapper>
    );
}

// 스타일 컴포넌트 목록
const HeaderWrapper = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background-color: var(--header-bg);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--header-border);
`;

const NavContainer = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 480px) {
        padding: 0 1rem;
    }
`;

const LogoLink = styled(Link)`
    font-size: 1.25rem;
    font-weight: 900;
    letter-spacing: -0.05em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--palette-0f172a);
    text-decoration: none;

    .icon {
        color: var(--palette-2563eb);
    }
    &:hover {
        opacity: 0.7;
    }
`;

const NavMenu = styled.nav`
    display: none;
    @media (min-width: 768px) {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
`;

const NavItem = styled(Link)`
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--palette-475569);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    transition: color 0.2s;
    &:hover {
        color: var(--palette-0f172a);
    }
`;

const DropdownWrapper = styled.div`
    position: relative;
    height: 4rem;
    display: flex;
    align-items: center;
    cursor: pointer;

    .trigger {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--palette-475569);
        transition: color 0.2s;
    }

    &:hover .trigger {
        color: var(--palette-0f172a);
    }
    &:hover > div {
        /* Show Content */
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, 0);
    }
`;

const DropdownContent = styled.div`
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 10px);
    width: 14rem;
    padding-top: 0.5rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s;
    z-index: 50;
`;

const DropdownBox = styled.div`
    background: var(--palette-ffffff);
    border: 1px solid var(--palette-e2e8f0);
    border-radius: 0.75rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 0.25rem;

    .label {
        padding: 0.5rem 0.75rem;
        font-size: 0.625rem;
        font-weight: 700;
        color: var(--palette-94a3b8);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .divider {
        height: 1px;
        background-color: var(--palette-f1f5f9);
        margin: 0.25rem 0;
    }
`;

const DropdownItem = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--palette-475569);
    text-decoration: none;
    transition: background 0.2s;

    .icon {
        font-size: 1rem;
    }
    .icon.sky {
        color: var(--palette-0ea5e9);
    }
    .icon.amber {
        color: var(--palette-b45309);
    }
    .icon.blue {
        color: var(--palette-3b82f6);
    }
    .icon.slate {
        color: var(--palette-94a3b8);
    }

    &:hover {
        background-color: var(--palette-f8fafc);
        color: var(--palette-2563eb);
    }
`;

const SocialLinks = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    padding-left: 2rem;
    border-left: 1px solid var(--palette-e2e8f0);
    height: 1.5rem;
    @media (max-width: 767px) {
        display: none;
    }
    @media (max-width: 480px) {
        gap: 0.65rem;
        padding-left: 0.75rem;
    }

    a {
        color: var(--palette-94a3b8);
        transition: color 0.2s;
        &:hover {
            color: var(--palette-0f172a);
        }
        /* LinkedIn Specific */
        &:nth-child(2):hover {
            color: var(--palette-1d4ed8);
        }
        &:nth-child(3):hover {
            color: var(--palette-0f172a);
        }
    }
`;

const MobileMenuButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 0.75rem;
    color: var(--palette-0f172a);
    cursor: pointer;

    &:hover {
        background: var(--palette-f1f5f9);
    }
    &:focus-visible {
        outline: 2px solid var(--palette-2563eb);
        outline-offset: 2px;
    }
    @media (min-width: 768px) {
        display: none;
    }
`;

const MobileNavigation = styled.nav`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: calc(100vh - 4rem);
    max-height: calc(100dvh - 4rem);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.75rem 1rem 1rem;
    background: var(--palette-ffffff);
    border-bottom: 1px solid var(--palette-e2e8f0);
    box-shadow: 0 16px 24px -16px rgb(0 0 0 / 24%);

    &[hidden] {
        display: none;
    }
    a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-height: 44px;
        padding: 0.65rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--palette-475569);
        text-decoration: none;
    }
    a:hover,
    a[aria-current='page'] {
        background: var(--palette-f1f5f9);
        color: var(--palette-2563eb);
    }
    a:focus-visible {
        outline: 2px solid var(--palette-2563eb);
        outline-offset: -2px;
    }
    .categories,
    .socials {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid var(--palette-e2e8f0);
    }
    .categories p {
        padding: 0.5rem 0.75rem;
        font-size: 0.625rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--palette-64748b);
    }
    .socials {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    @media (min-width: 768px) {
        display: none;
    }
`;
