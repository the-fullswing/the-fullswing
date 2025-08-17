import { createPostLoader } from "../../../.vitepress/utils/posts";

export default createPostLoader("posts/2025/08/*.md", {
  filter: (item) => !!item.frontmatter.title,
  transform: (item) => ({
    title: item.frontmatter?.title || "제목 없음",
    author: item.frontmatter?.author || "작성자 없음",
    date: item.frontmatter?.date || "날짜 없음",
    url: item.url,
  }),
});
