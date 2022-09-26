<template>
  <div>
    <top-chart :data="dataCard" />
    <data-card :data="dataCard" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import TopChart from './components/TopChart.vue'
import DataCard from './components/DataCard.vue'
import { fetchGetDashboard } from '@/api/dashboard'

const dataCard = ref()
onMounted(async () => {
  dataCard.value = await fetchGetDashboard()
})
</script>

<style lang="scss" scoped></style>
