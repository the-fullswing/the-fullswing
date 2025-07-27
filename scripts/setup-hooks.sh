#!/bin/bash

# Git hooks 설정 스크립트

echo "🔧 Git hooks 설정 중..."

# hooks 경로 설정
git config core.hooksPath .githooks

# hooks 실행 권한 부여
chmod +x .githooks/pre-push

echo "✅ Git hooks 설정 완료!"
echo "💡 이제 push할 때마다 자동으로 인덱스 파일이 생성됩니다." 