# 2025년 08월 포스트

이번 달에 작성된 포스트들입니다.

## 포스트 목록

<script setup>
import { data as posts } from './posts.data.mts'
</script>

<div class="post-list">
  <div v-for="post in posts" :key="post.url" class="post-item">
    <a :href="post.url" class="post-link">{{ post.title }}</a>
    <span class="post-author">by {{ post.author }}</span>
  </div>
</div>

## 전체 아카이브

[← 전체 포스트 목록으로 돌아가기](/posts/)
