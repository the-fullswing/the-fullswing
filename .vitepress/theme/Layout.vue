<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import { useData } from 'vitepress'
import Comment from './components/Comment.vue'
import PostHeader from './components/PostHeader.vue'

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
    <template #doc-before>
      <div class="vp-doc">
        <PostHeader v-if="isPostPage" :title="frontmatter.title" :author="frontmatter.author"
          :date="frontmatter.date" />
      </div>
    </template>
    <template #doc-footer-before>
      <Comment v-if="isPostPage && isCommentsEnabled" />
    </template>
  </Layout>

</template>
