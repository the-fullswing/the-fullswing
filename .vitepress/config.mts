import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FullSwing Learning Hub",
  description:
    "기술 아티클과 영상에서 배운 지식을 정리하고 공유하는 개발자들의 학습 아카이브",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: generateSidebar({
      excludeByGlobPattern: ["index.md", "README.md"],
      useTitleFromFrontmatter: true,
      sortMenusByFrontmatterDate: true,
      sortMenusOrderByDescending: true,
    }),
    search: {
      provider: "local",
    },
  },
});
