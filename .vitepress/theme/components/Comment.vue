<script setup lang="ts">
import Giscus from "@giscus/vue";
import { useData, useRoute } from "vitepress";
import { computed } from "vue";

const { isDark } = useData();
const route = useRoute();
const giscusKey = computed(() => route.path);
</script>

<template>
  <ClientOnly>
    <Giscus :key="giscusKey" id="comments" repo="the-fullswing/the-fullswing.github.io" repoId="R_kgDOPPfzuw"
      category="Comment" categoryId="DIC_kwDOPPfzu84Ct_oY" mapping="pathname" strict="0" reactionsEnabled="1"
      emitMetadata="1" inputPosition="top" :theme="isDark ? 'dark' : 'light'" lang="ko" crossorigin="anonymous" async />
  </ClientOnly>
</template>
