'use client';

import styled from 'styled-components';
import Link from 'next/link';

export default function Footer() {
    return (
        <FooterWrapper>
            <div className="socials">
                <Link href="https://github.com/devbini">GitHub</Link>
                <Link href="https://linkedin.com/in/chanbeen">LinkedIn</Link>
                <Link href="mailto:contact@chanbeen.com">Email</Link>
            </div>
            &copy; {new Date().getFullYear()} Chan Been Kim. All rights reserved.
        </FooterWrapper>
    );
}

const FooterWrapper = styled.footer`
    padding: 2.5rem 0;
    text-align: center;
    font-size: 0.75rem;
    color: var(--palette-94a3b8);
    border-top: 1px solid var(--palette-e2e8f0);
    background-color: var(--palette-ffffff);
    position: relative;
    z-index: 10;

    .socials {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-bottom: 1rem;

        a {
            color: var(--palette-94a3b8);
            text-decoration: none;
            transition: color 0.2s;
            &:hover {
                color: var(--palette-0f172a);
            }
        }
    }
`;
