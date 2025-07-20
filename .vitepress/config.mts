import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FullSwing Learning Hub",
  description:
    "기술 아티클과 영상에서 배운 지식을 정리하고 공유하는 개발자들의 학습 아카이브",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "posts",
        items: [
          {
            text: "2025-07",
            items: [
              {
                text: "코틀린 코루틴을 배워야 하는 이유",
                link: "/posts/2025/07/0716-hyunjaae",
              },
              {
                text: "선물하기 시스템의 상품 재고는 어떻게 관리되어질까?",
                link: "/posts/2025/07/0716-jdalma",
              },
              {
                text: "Server-driven UI",
                link: "/posts/2025/07/0716-jglee96",
              },
              {
                text: "DSL 이란?",
                link: "/posts/2025/07/0718-hyunjaae",
              },
              {
                text: "마이그레이션 전략",
                link: "/posts/2025/07/0718-jglee96",
              },
              {
                text: "보상 트랜잭션으로 분산 환경에서도 안전하게 환전하기",
                link: "/posts/2025/07/0720-jdalma",
              },
              {
                text: "무신사 무진장 세일",
                link: "/posts/2025/07/0720-suchanmyoung",
              },
            ],
          },
        ],
      },
    ],
  },
});
