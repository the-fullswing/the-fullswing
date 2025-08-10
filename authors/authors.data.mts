import { createPostLoader } from "../.vitepress/utils/posts";

export interface AuthorPostItem {
  title: string;
  author: string;
  date: string;
  url: string;
}

declare const data: AuthorPostItem[];
export { data };

export default createPostLoader("posts/**/*.md", {
  filter: (item) => !!item.frontmatter.title && !!item.frontmatter.author,
  transform: (item) => ({
    title: item.frontmatter?.title || "제목 없음",
    author: item.frontmatter?.author || "작성자 없음",
    date: item.frontmatter?.date || "날짜 없음",
    url: item.url,
  }),
});
