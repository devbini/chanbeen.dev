'use client';

import styled from 'styled-components';
import Link from 'next/link';

export default function Footer() {
    return (
        <FooterWrapper>
            <div className="socials">
                <Link href="https://github.com/devbini">GitHub</Link>
                <Link href="https://linkedin.com/in/devbini">LinkedIn</Link>
                <Link href="mailto:flqld86851@gmail.com">Email</Link>
            </div>
            &copy; {new Date().getFullYear()} Chan Been Kim. All rights reserved.
        </FooterWrapper>
    );
}

const FooterWrapper = styled.footer`
  padding: 2.5rem 0;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
  background-color: white;
  position: relative;
  z-index: 10;

  .socials {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
    
    a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: #0f172a; }
    }
  }
`;