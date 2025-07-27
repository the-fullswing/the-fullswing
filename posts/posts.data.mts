import { defineLoader } from "vitepress";
import fs from "node:fs";
import path from "node:path";

export interface YearMonthData {
  year: string;
  months: string[];
}

export interface Data {
  yearMonthData: YearMonthData[];
}

declare const data: Data;
export { data };

export default defineLoader({
  async load() {
    const postsDir = "posts";
    const yearMonthData: YearMonthData[] = [];

    try {
      // posts 디렉토리 읽기
      const yearDirs = fs
        .readdirSync(postsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && /^\d{4}$/.test(dirent.name))
        .map((dirent) => dirent.name)
        .sort((a, b) => b.localeCompare(a)); // 최신 연도부터 정렬

      for (const year of yearDirs) {
        const yearPath = path.join(postsDir, year);
        const monthDirs = fs
          .readdirSync(yearPath, { withFileTypes: true })
          .filter(
            (dirent) => dirent.isDirectory() && /^\d{2}$/.test(dirent.name)
          )
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

    return {
      yearMonthData,
    };
  },
});
