# 전체 포스트 아카이브

개발자들이 학습한 기술 아티클과 경험을 정리한 포스트들입니다.

<script setup>
import { data } from './posts.data.mts'
</script>

<div class="year-list">
  <div v-for="yearData in data.yearMonthData" :key="yearData.year" class="year-item">
    <h3>{{ yearData.year }}년</h3>
    <div class="month-list">
      <a 
        v-for="month in yearData.months" 
        :key="month"
        :href="`/posts/${yearData.year}/${month}/`"
      >
        {{ month }}월
      </a>
    </div>
  </div>
</div>

## 홈으로 돌아가기

[← 홈으로 돌아가기](/)
