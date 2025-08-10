<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import { useData } from 'vitepress'
import Comment from './components/Comment.vue'

const { Layout } = DefaultTheme
const { page, frontmatter } = useData()

const isPostPage = computed(() => {
  const path = page.value?.relativePath || ''
  return path.startsWith('posts/')
})

const isCommentsEnabled = computed(() => {
  return frontmatter.value?.comments !== false
})
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      <Comment v-if="isPostPage && isCommentsEnabled" />
    </template>
  </Layout>

</template>
