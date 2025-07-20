const fs = require("fs");
const path = require("path");

// 특정 폴더의 마크다운 파일들을 찾는 함수
function findMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && item.endsWith(".md") && item !== "index.md") {
      files.push(item);
    }
  }

  return files;
}

// posts 하위의 모든 연도/월 폴더를 찾는 함수
function findYearMonthFolders(postsDir) {
  const folders = [];
  const items = fs.readdirSync(postsDir);

  for (const item of items) {
    const fullPath = path.join(postsDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 연도 폴더인지 확인
      if (/^\d{4}$/.test(item)) {
        const yearPath = path.join(postsDir, item);
        const yearItems = fs.readdirSync(yearPath);

        for (const monthItem of yearItems) {
          const monthPath = path.join(yearPath, monthItem);
          const monthStat = fs.statSync(monthPath);

          if (monthStat.isDirectory() && /^\d{2}$/.test(monthItem)) {
            folders.push({
              year: item,
              month: monthItem,
              path: path.join(item, monthItem),
            });
          }
        }
      }
    }
  }

  return folders.sort((a, b) => {
    // 연도, 월 순으로 정렬
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

// 특정 폴더의 인덱스 파일 생성
function generateMonthIndex(files, outputPath, title) {
  const sortedFiles = files.sort(); // 파일명 알파벳 순으로 정렬

  let content = `# ${title}\n\n`;
  content += `이번 달에 작성된 기술 아티클들입니다.\n\n`;

  content += `## 포스트 목록\n\n`;

  for (const file of sortedFiles) {
    const displayName = file.replace(".md", "").replace(/-/g, " ");
    content += `- [${displayName}](./${file})\n`;
  }

  content += `\n## 전체 아카이브\n\n`;
  content += `[← 전체 포스트 목록으로 돌아가기](/)\n`;

  fs.writeFileSync(outputPath, content);
  console.log(`Generated: ${outputPath}`);
}

// 전체 posts 인덱스 파일 생성
function generateMainIndex(folders, outputPath) {
  let content = `# 전체 포스트 아카이브\n\n`;
  content += `개발자들이 학습한 기술 아티클과 경험을 정리한 포스트들입니다.\n\n`;

  content += `## 연도별 포스트\n\n`;

  // 연도별로 그룹화
  const yearGroups = {};
  for (const folder of folders) {
    if (!yearGroups[folder.year]) {
      yearGroups[folder.year] = [];
    }
    yearGroups[folder.year].push(folder);
  }

  for (const [year, months] of Object.entries(yearGroups)) {
    content += `### ${year}년\n`;
    for (const month of months) {
      const monthName = `${month.month}월`;
      content += `- [${monthName} 포스트](./${month.path}/) - ${month.path} 폴더의 포스트들\n`;
    }
    content += `\n`;
  }

  content += `## 홈으로 돌아가기\n\n`;
  content += `[← 홈으로 돌아가기]/)\n`;

  fs.writeFileSync(outputPath, content);
  console.log(`Generated: ${outputPath}`);
}

// 메인 실행
function main() {
  const postsDir = "posts";
  const folders = findYearMonthFolders(postsDir);

  console.log(
    `Found ${folders.length} year/month folders:`,
    folders.map((f) => f.path)
  );

  // 각 연도/월 폴더에 대해 인덱스 생성
  for (const folder of folders) {
    const folderPath = path.join(postsDir, folder.path);
    const markdownFiles = findMarkdownFiles(folderPath);

    if (markdownFiles.length > 0) {
      const title = `${folder.year}년 ${folder.month}월 포스트`;
      const indexPath = path.join(folderPath, "index.md");
      generateMonthIndex(markdownFiles, indexPath, title);
    }
  }

  // 전체 posts 인덱스 생성
  generateMainIndex(folders, path.join(postsDir, "index.md"));

  console.log("All index files generated successfully!");
}

main();
