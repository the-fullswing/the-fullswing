import { createContentLoader } from "vitepress";
import fs from "node:fs";
import path from "node:path";

// 공통 인터페이스들
export interface PostData {
  text: string;
  title: string;
  author: string;
  lastUpdated?: string;
  url: string;
}

export interface YearMonthData {
  year: string;
  months: string[];
}

export interface SidebarData {
  text: string;
  items: PostData[];
}

// URL에서 연도/월/파일명 추출하는 함수
export function extractPostInfo(
  url: string
): { year: string; month: string; fileName: string } | null {
  const match = url.match(/\/posts\/(\d{4})\/(\d{2})\/([^\/]+)\.html$/);
  if (match) {
    const [, year, month, fileName] = match;
    return { year, month, fileName };
  }
  return null;
}

// 포스트 데이터를 연도/월별로 그룹화하는 함수
export function groupPostsByYearMonth(
  posts: any[]
): Record<string, PostData[]> {
  const groupedData: Record<string, PostData[]> = {};

  posts.forEach((item) => {
    const postInfo = extractPostInfo(item.url);
    if (postInfo) {
      const { year, month, fileName } = postInfo;
      const key = `${year}-${month}`;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }

      const title = item.frontmatter?.title || fileName.replace(/-/g, " ");

      groupedData[key].push({
        text: title,
        title: item.frontmatter?.title || "제목 없음",
        author: item.frontmatter?.author || "작성자 없음",
        lastUpdated: item.frontmatter?.lastUpdated,
        url: item.url,
      });
    }
  });

  return groupedData;
}

// 포스트 데이터를 정렬하는 함수
export function sortPosts(
  posts: PostData[],
  sortBy: "title" | "lastUpdated" = "lastUpdated"
): PostData[] {
  return posts.sort((a, b) => {
    if (sortBy === "lastUpdated" && a.lastUpdated && b.lastUpdated) {
      return a.lastUpdated.localeCompare(b.lastUpdated);
    }
    return a.title.localeCompare(b.title);
  });
}

// 연도/월 폴더 구조를 읽는 함수
export function getYearMonthFolders(
  postsDir: string = "posts"
): YearMonthData[] {
  const yearMonthData: YearMonthData[] = [];

  try {
    const yearDirs = fs
      .readdirSync(postsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && /^\d{4}$/.test(dirent.name))
      .map((dirent) => dirent.name)
      .sort((a, b) => b.localeCompare(a)); // 최신 연도부터 정렬

    for (const year of yearDirs) {
      const yearPath = path.join(postsDir, year);
      const monthDirs = fs
        .readdirSync(yearPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && /^\d{2}$/.test(dirent.name))
        .map((dirent) => dirent.name)
        .sort((a, b) => b.localeCompare(a)); // 최신 월부터 정렬

      if (monthDirs.length > 0) {
        yearMonthData.push({
          year,
          months: monthDirs,
        });
      }
    }
  } catch (error) {
    console.error("Error reading posts directory:", error);
  }

  return yearMonthData;
}

// 포스트 데이터 로더 생성 함수
export function createPostLoader(
  pattern: string,
  options?: {
    filter?: (item: any) => boolean;
    transform?: (item: any) => any;
  }
) {
  return createContentLoader(pattern, {
    excerpt: false,
    transform: (data) => {
      let filteredData = data;

      // 필터 적용
      if (options?.filter) {
        filteredData = data.filter(options.filter);
      }

      // 변환 적용
      if (options?.transform) {
        return filteredData.map(options.transform);
      }

      return filteredData;
    },
  });
}
