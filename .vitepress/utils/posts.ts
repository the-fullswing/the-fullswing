import { createContentLoader } from "vitepress";
import fs from "node:fs";
import path from "node:path";

export interface YearMonthData {
  year: string;
  months: string[];
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
