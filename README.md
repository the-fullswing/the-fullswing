# The Full Swing

개발자들의 기술 아티클과 경험을 정리한 블로그입니다.

## 설정

### Git Hooks 설정

프로젝트를 클론한 후 다음 명령어를 실행하여 Git hooks를 설정하세요:

```bash
./scripts/setup-hooks.sh
```

또는 수동으로 설정:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-push
```

## 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 포스트 작성

새로운 포스트를 추가한 후:

```bash
git add .
git commit -m "새 포스트 추가"
git push  # 자동으로 인덱스 파일이 생성되고 커밋됩니다
```
