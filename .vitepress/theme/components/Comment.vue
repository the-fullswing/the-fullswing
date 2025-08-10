<script setup lang="ts">
import Giscus from "@giscus/vue";
import { useData } from "vitepress";

const { isDark } = useData();
</script>

<template>
  <ClientOnly>
    <Giscus id="comments" repo="the-fullswing/the-fullswing.github.io" repoId="R_kgDOPPfzuw-x55Q"
      categoryId="DIC_kwDOPPfzu84Ct_oY" mapping="pathname" strict="0" reactionsEnabled="1" emitMetadata="1"
      inputPosition="top" :theme="isDark ? 'dark' : 'light'" lang="ko" loading="lazy" crossorigin="anonymous" async />
  </ClientOnly>
</template>
