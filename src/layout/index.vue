<template>
  <div class="root">
    <head-part v-model:collapsed="collapsed" />
    <div id="layout">
      <left-slide v-model:collapsed="collapsed" />
      <div class="content-box">
        <tags></tags>
        <div class="main-box" ref="childrens">
          <breadcrumb v-if="!$route.meta.hiddenTitle" />
          <div id="main-container">
            <router-view />
            <slot></slot>
          </div>
        </div>
        <footer class="flex-center copyright">
          Copyright @ 2020-2022 ExileLine. All Rights Reserved
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
const collapsed = ref(false)
</script>

<style>
.copyright {
  color: var(--td-text-color-placeholder);
  line-height: 40px;
}
</style>
