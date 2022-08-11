<template>
  <div class="TDesign-theme-tabs">
    <div
      class="TDesign-theme-tabs__block"
      style="width: 28px"
      :style="{
        left: `${isSun ? 2 : 30}px`,
      }"
    ></div>
    <div
      data-theme="light"
      class="item sun"
      :class="{ active: isSun }"
      @click="$store.commit('app/setTheme', 'light')"
    >
      <svg-icon icon="sun" width="20" height="20" />
    </div>

    <div
      data-theme="dark"
      class="item moon"
      :class="{ active: !isSun }"
      @click="$store.commit('app/setTheme', 'dark')"
    >
      <svg-icon icon="moon" width="20" height="20" />
    </div>
  </div>
</template>

<script setup>
import { watch, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isSun = computed(() => store.getters.theme !== 'dark')
watch(
  () => isSun.value,
  theme => {
    if (theme) {
      document.documentElement.removeAttribute('theme-mode')
    } else {
      document.documentElement.setAttribute('theme-mode', 'dark')
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.TDesign-theme-tabs {
  min-width: 60px;
  height: 32px;
  padding: 2px;
  box-sizing: border-box;
  border-radius: var(--border-radius);
  position: relative;
  display: flex;
  justify-content: space-between;
  background: var(--td-bg-color-page);
  color: var(--text-secondary);
}
.TDesign-theme-tabs__block {
  background-color: var(--td-bg-color-container);
  box-shadow: rgb(0 0 0 / 15%) 0px 2px 4px;
  position: absolute;
  height: calc(100% - 4px);
  transition: all cubic-bezier(0.38, 0, 0.24, 1) 0.24s;
  border-radius: var(--border-radius);
}

.TDesign-theme-tabs .item.active.sun {
  color: rgb(255, 189, 46);
}

.TDesign-theme-tabs .item {
  width: 50%;
  height: 28px;
  padding: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  color: var(--td-gray-color-7);
  position: relative;
  cursor: pointer;
  &:hover {
    color: var(--td-text-color-primary);
  }
}
.TDesign-theme-tabs .item svg {
  width: 16px;
  height: 16px;
  pointer-events: none;
  transition: all 0.2s linear 0s;
}

.TDesign-theme-tabs .item.active.moon {
  color: rgb(255, 255, 255);
}
</style>
