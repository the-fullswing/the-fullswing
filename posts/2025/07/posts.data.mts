import { createContentLoader } from "vitepress";

export default createContentLoader("posts/2025/07/*.md", {
  transform: (data) => {
    return data
      .filter((item) => !!item.frontmatter.title)
      .map((item) => ({
        title: item.frontmatter?.title || "제목 없음",
        author: item.frontmatter?.author || "작성자 없음",
        url: item.url,
      }));
  },
});
