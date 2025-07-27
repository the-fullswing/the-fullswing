import { defineLoader } from "vitepress";
import {
  getYearMonthFolders,
  type YearMonthData,
} from "../.vitepress/utils/posts";

export interface Data {
  yearMonthData: YearMonthData[];
}

declare const data: Data;
export { data };

export default defineLoader({
  async load() {
    const yearMonthData = getYearMonthFolders();

    return {
      yearMonthData,
    };
  },
});
