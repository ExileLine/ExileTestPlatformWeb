<template>
  <div class="root">
    <head-part v-model:collapsed="collapsed"></head-part>
    <div id="layout">
      <left-slide v-model:collapsed="collapsed"></left-slide>
      <div class="content-box">
        <tags></tags>
        <div class="main-box" ref="childrens">
          <breadcrumb v-if="!$route.meta.hiddenTitle" />
          <div id="main-container">
            <router-view />
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import HeadPart from "./components/HeadPart.vue";
import LeftSlide from "./components/LeftSlide";
import Tags from "./components/Tags.vue";
const collapsed = ref(false);
</script>
