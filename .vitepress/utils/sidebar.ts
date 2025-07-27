import { groupPostsByYearMonth, sortPosts, type SidebarData } from "./posts";

export async function generateSidebar(): Promise<SidebarData[]> {
  const { createPostLoader } = await import("./posts");

  const contentLoader = createPostLoader("posts/**/*.md", {
    transform: (data) => {
      const groupedData = groupPostsByYearMonth(data);

      // 최신 순으로 정렬
      return Object.entries(groupedData)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([key, posts]) => ({
          text: key,
          items: sortPosts(posts, "lastUpdated"),
        }));
    },
  });

  return (await contentLoader.load()) as SidebarData[];
}
