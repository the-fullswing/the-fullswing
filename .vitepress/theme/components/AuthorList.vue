<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as allPosts } from '../../../authors/authors.data.mts'
import { formatDate } from '../../utils/date'

const props = defineProps<{ author?: string }>()

const route = useRoute()

const targetAuthor = computed(() => {
  if (props.author) return props.author
  const nameFromParams = (route.params as any)?.name
  return nameFromParams ? decodeURIComponent(nameFromParams) : ''
})

const authorsMap = computed(() => {
  const map = new Map<string, Array<{ title: string; author: string; date: string; url: string }>>()
  for (const post of allPosts) {
    const key = post.author
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(post)
  }
  for (const [, list] of map) {
    list.sort((a, b) => String(b.date).localeCompare(String(a.date)))
  }
  return map
})

const authorList = computed(() => Array.from(authorsMap.value.keys()))
const postsBySelected = computed(() => authorsMap.value.get(targetAuthor.value) || [])
</script>

<template>
  <div v-if="!targetAuthor || !postsBySelected.length">
    <h1>작성자별 글 모아보기</h1>
    <p>아래에서 작성자를 선택하세요.</p>
    <p>
      <span v-for="name in authorList" :key="name" style="margin-right: 8px;">
        <a :href="`/authors/${encodeURIComponent(name)}/`">{{ name }}</a>
      </span>
    </p>
    <p>
      <a href="/posts/">전체 포스트 아카이브</a>
      ·
      <a href="/">홈으로 돌아가기</a>
    </p>
  </div>
  <div v-else>
    <p>
      다른 작성자 보기:
      <span v-for="name in authorList" :key="name" style="margin-right: 8px;">
        <a :href="`/authors/${encodeURIComponent(name)}/`">{{ name }}</a>
      </span>
    </p>
    <div class="post-list">
      <div v-for="post in postsBySelected" :key="post.url" class="post-item">
        <a class="post-link" :href="post.url">{{ post.title }}</a>
        <span class="post-author">{{ formatDate(post.date) }}</span>
      </div>
    </div>
    <h2 style="margin-top: 24px;">다른 페이지</h2>
    <ul>
      <li><a href="/posts/">전체 포스트 아카이브</a></li>
      <li><a href="/">홈으로 돌아가기</a></li>
    </ul>
  </div>

</template>
