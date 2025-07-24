'use client';

import Giscus from '@giscus/react';

export default function GiscusComments() {
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
      theme="preferred_color_scheme"
      lang="ko"
      loading="lazy"
    />
  );
}
