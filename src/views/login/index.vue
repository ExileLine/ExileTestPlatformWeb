<template>
  <div id="login-container">
    <div id="logo-container">
      <div class="flag-text">开源企业级</div>
      <div class="slogan-text">
        持续测试平台, 涵盖测试跟踪、接口测试、UI测试、 团队协作等功能有效助力开发和测试团队
      </div>
      <img src="@/assets/logo-icon.png" alt="" />
    </div>
    <div id="login-content">
      <div class="logo">
        <img src="@/assets/new_logo.png" alt="logo" />
      </div>
      <h2 class="app-name">{{ appName }}</h2>
      <common-form
        hidden-cancel
        :data="loginData"
        label-align="top"
        :field-list="fieldList"
        confirm-text="登录"
        id="login-form"
        @confirm="login"
      />
      <div class="tourist-account" @click="getTouristAccount">获取游客账号</div>

      <div :class="{ hidden: isTouristHidden }">
        <t-card shadow>
          <div>账号：{{ tourist.username }}</div>
          <div>密码：{{ tourist.password }}</div>
        </t-card>
      </div>

      <div class="theme-tabs">
        <theme-tabs class="mlr-10" />
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { LockOnIcon, UserIcon } from 'tdesign-icons-vue-next'
import ThemeTabs from '@/layout/components/ThemeTabs.vue'
import { fetchTourist } from '@/api/user'

const store = useStore()
const router = useRouter()
const appName = import.meta.env.VITE_APP_NAME
const loginData = reactive({})
const isTouristHidden = ref(true)
const tourist = ref({})

const fieldList = [
  {
    label: '账号',
    value: 'username',
    extraProps: {
      prefixIcon: () => <UserIcon />,
    },
  },
  {
    label: '密码',
    value: 'password',
    extraProps: {
      type: 'password',
      prefixIcon: () => <LockOnIcon />,
    },
  },
]
const getTouristAccount = async () => {
  if (!isTouristHidden.value) return
  tourist.value = await fetchTourist()
  isTouristHidden.value = false
}

const login = async () => {
  await store.dispatch('user/login', loginData)
  router.push({
    path: '/project',
  })
}
</script>

<style lang="scss" scoped>
#login-container {
  display: flex;
  width: 100%;
  height: 100%;
  #logo-container {
    display: flex;
    flex-direction: column;
    width: 775px;
    height: 100%;
    padding: 40px 20px 10px;
    background: url(@/assets/logo-bg.png),
      linear-gradient(180deg, #1739e5 0%, rgba(23, 57, 229, 0.79) 54%, rgba(23, 57, 229, 0.62) 100%);
    background-size: cover;
    color: var(--td-gray-color-1);
    img {
      width: 100%;
    }

    .flag-text {
      font-size: 60px;
      font-family: $font-family-medium;
      font-weight: 500;
      margin: 80px 0 20px;
    }
    .slogan-text {
      padding: 20px 24px;
      font-size: 20px;
      background: var(--td-brand-color-10);
      border-radius: 0px 30px 0px 30px;
    }
  }
  #login-content {
    .logo {
      img {
        width: 80px;
      }
    }
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    #login-form {
      width: 545px;
      ::v-deep(.t-form__item) {
        .t-form__label {
          color: var(--td-gray-color-7);
        }
        .t-form__controls-content,
        .t-input,
        .t-button {
          height: 50px;
          line-height: 50px;
          width: 100%;
        }
      }
    }
    .app-name {
      background: linear-gradient(
        180deg,
        #1739e5 0%,
        rgba(23, 57, 229, 0.79) 54%,
        rgba(23, 57, 229, 0.62) 100%
      );
      -webkit-background-clip: text;
      color: transparent;
      font-size: 40px;
    }
    .tourist-account {
      cursor: pointer;
      font-size: 16px;
      margin: 24px 0;
      color: var(--td-brand-color-active);
    }
  }
}
.theme-tabs {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
