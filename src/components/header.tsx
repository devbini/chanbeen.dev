'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { FaReact, FaCloud, FaCoffee, FaPenNib } from 'react-icons/fa';
import { Github, Linkedin, ChevronDown, Terminal } from 'lucide-react';

export default function Header() {
    return (
        <HeaderWrapper>
            <NavContainer>
                <LogoLink href="/">
                    <Terminal size={20} className="icon" />
                    <span>CHANBEEN.COM 💻</span>
                </LogoLink>

                <NavMenu>
                    <NavItem href="/resume">Resume</NavItem>

                    <DropdownWrapper>
                        <span className="trigger">
                            Posts <ChevronDown size={14} />
                        </span>

                        <DropdownContent>
                            <DropdownBox>
                                <div className="label">Categories</div>
                                <DropdownItem href="/blog/devops">
                                    <FaCloud className="icon sky" /> <span>DevOps & Cloud</span>
                                </DropdownItem>
                                <DropdownItem href="/blog/backend">
                                    <FaCoffee className="icon amber" /> <span>Backend & Java</span>
                                </DropdownItem>
                                <DropdownItem href="/blog/frontend">
                                    <FaReact className="icon blue" /> <span>Frontend</span>
                                </DropdownItem>
                                <DropdownItem href="/blog/essay">
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
                    <Link href="https://github.com/devbini" target="_blank"><Github size={18} /></Link>
                    <Link href="https://linkedin.com/in/devbini" target="_blank"><Linkedin size={18} /></Link>
                </SocialLinks>
            </NavContainer>
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
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #0f172a;
  text-decoration: none;
  
  .icon { color: #2563eb; }
  &:hover { opacity: 0.7; }
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
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: #0f172a; }
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
    color: #475569;
    transition: color 0.2s;
  }

  &:hover .trigger { color: #0f172a; }
  &:hover > div { /* Show Content */
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
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 0.25rem;

  .label {
    padding: 0.5rem 0.75rem;
    font-size: 0.625rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .divider {
    height: 1px;
    background-color: #f1f5f9;
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
  color: #475569;
  text-decoration: none;
  transition: background 0.2s;

  .icon { font-size: 1rem; }
  .icon.sky { color: #0ea5e9; }
  .icon.amber { color: #b45309; }
  .icon.blue { color: #3b82f6; }
  .icon.slate { color: #94a3b8; }

  &:hover {
    background-color: #f8fafc;
    color: #2563eb;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-left: 2rem;
  border-left: 1px solid #e2e8f0;
  height: 1.5rem;

  a {
    color: #94a3b8;
    transition: color 0.2s;
    &:hover { color: #0f172a; }
    /* LinkedIn Specific */
    &:nth-child(2):hover { color: #1d4ed8; }
  }
`;