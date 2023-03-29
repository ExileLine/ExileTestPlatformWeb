<template>
  <div class="root">
    <head-part v-model:collapsed="collapsed" />
    <div id="layout">
      <left-slide v-model:collapsed="collapsed" />
      <div class="content-box">
        <tags></tags>
        <div class="main-box" ref="childrens">
          <breadcrumb v-if="!$route.meta.hiddenTitle" />
          <div id="main-container" class="narrow-scrollbar">
            <router-view />
            <slot></slot>
          </div>
        </div>
        <footer class="copyright plr-20 flex-center">
          Copyright @ 2020-2023 ExileLine. All Rights Reserved
        </footer>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Breadcrumb from './components/Breadcrumb.vue'
import HeadPart from './components/HeadPart.vue'
import LeftSlide from './components/LeftSlide'
import Tags from './components/Tags.vue'
import { MIN_POINT } from '@/config/global'
const collapsed = ref(window.innerWidth <= MIN_POINT)
</script>

<style>
.copyright {
  text-align: center;
  color: var(--td-text-color-placeholder);
  height: 40px;
  line-height: 1.5;
}
</style>
