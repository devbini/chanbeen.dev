'use client';

import Giscus from '@giscus/react';
import { useTheme } from './theme-provider';

export default function GiscusComments() {
    const { theme } = useTheme();
    return (
        <Giscus
            repo="devbini/chanbeen.dev"
            repoId="R_kgDOPMC7cA"
            category="Comments"
            categoryId="DIC_kwDOPMC7cM4CtWLP"
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="bottom"
            theme={theme}
            lang="ko"
            loading="lazy"
        />
    );
}
