<template>
  <div class="post-header">
    <div class="post-title-section">
      <h1 class="post-title">{{ title }}</h1>
      <div class="post-meta">
        <a
          :href="`https://github.com/${author}`"
          target="_blank"
          rel="noopener noreferrer"
          class="author-link"
        >
          <img
            src="/.vitepress/theme/assets/github-mark.svg"
            class="github-icon"
            alt="GitHub"
          />
          {{ author }}
        </a>
        <span v-if="date" class="last-updated">{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title: string;
  author: string;
  date?: string;
}

const props = defineProps<Props>();

const formattedDate = computed(() => {
  if (!props.date) return "";

  try {
    const date = new Date(props.date);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return props.date;
  }
});
</script>

<style scoped>
.post-header {
  margin-bottom: 20px;
}

.post-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.post-title {
  margin: 0;
  flex: 1;
}

.post-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.author-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

.author-link:hover {
  text-decoration: underline;
}

.github-icon {
  width: 16px;
  height: 16px;
}

.last-updated {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
