<template>
  <div class="header justify-end align-center">
    <div class="logo align-center pointer">
      <div
        :class="{
          'w-190': !collapsed,
          'w-40': collapsed,
        }"
        class="align-center"
        @click="gotoProject"
      >
        <img src="@/assets/new_logo.png" alt="logo" class="w-40 mr-20" />
        <span class="fs-30">Exile</span>
      </div>
      <div v-if="!isProject && !isMobile" class="ml-10 fs-22 cursor" @click="toggleCollapse">
        <t-icon :name="`${collapsed ? 'menu-fold' : 'menu-unfold'}`" />
      </div>
    </div>

    <t-tooltip placement="bottom" content="刷新">
      <t-button theme="default" shape="square" variant="text" @click="refresh">
        <t-icon name="refresh" />
      </t-button>
    </t-tooltip>
    <t-tooltip placement="bottom" content="代码仓库">
      <t-button theme="default" shape="square" variant="text" @click="gotoGithub">
        <t-icon name="logo-github" />
      </t-button>
    </t-tooltip>
    <!-- <t-tooltip placement="bottom" content="TDesign">
      <t-button theme="default" shape="square" variant="text" @click="gotoTD">
        <t-icon name="heart" />
      </t-button>
    </t-tooltip> -->
    <t-tooltip placement="bottom" content="帮助文档">
      <t-button theme="default" shape="square" variant="text">
        <t-icon name="help-circle" />
      </t-button>
    </t-tooltip>
    <t-dropdown :min-column-width="135" trigger="click">
      <template #dropdown>
        <t-dropdown-menu>
          <t-dropdown-item @click="gotoInfo">
            <div class="align-center">
              <t-icon name="user-circle" class="mr-10" />
              个人中心
            </div>
          </t-dropdown-item>
          <t-dropdown-item @click="resetPwdVisible = true">
            <div class="align-center">
              <t-icon name="lock-off" class="mr-10" />
              重置密码
            </div>
          </t-dropdown-item>
          <t-dropdown-item @click="logout">
            <div class="align-center">
              <t-icon name="poweroff" class="mr-10" />
              退出登录
            </div>
          </t-dropdown-item>
        </t-dropdown-menu>
      </template>
      <t-button theme="default" variant="text">
        <template #icon>
          <t-icon class="header-user-avatar" name="user-circle" />
        </template>
        <div class="header-user-account">
          {{ info.username }}
          <t-icon name="chevron-down" />
        </div>
      </t-button>
    </t-dropdown>
    <theme-tabs class="mlr-10" />
    <t-dialog v-model:visible="resetPwdVisible" :footer="false" header="重置密码" @close="close">
      <common-form
        dialog
        ref="resetPwdFormRef"
        :rules="resetPwdRules"
        :data="resetPwdForm"
        :field-list="resetPwdFieldList"
        label-width="6em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="resetPwd"
        @cancel="resetPwdVisible = false"
      />
    </t-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ThemeTabs from './ThemeTabs.vue'
import { validateRequired } from '@comp/validate'
import { fetchResetPwd } from '@/api/user'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:collapsed'])

const route = useRoute()
const router = useRouter()
const store = useStore()
const message = inject('message')

const info = computed(() => store.getters.info)

const resetPwdFormRef = ref()
const commonProps = {
  type: 'password',
  showPassword: true,
}
const resetPwdVisible = ref(false)
const resetPwdForm = reactive({
  old_password: '',
  new_password: '',
  raw_password: '',
})
const validatePwd = value => {
  if (value !== resetPwdForm.new_password) {
    return { result: false, message: '两次输入密码不一致', type: 'error' }
  }
  return {
    result: true,
    type: 'success',
  }
}
const resetPwdRules = {
  old_password: [validateRequired('请输入旧密码')],
  new_password: [validateRequired('请输入新密码')],
  raw_password: [validateRequired('请再次输入密码'), { validator: validatePwd, trigger: 'blur' }],
}
const resetPwdFieldList = [
  {
    value: 'old_password',
    label: '旧密码',
    component: 't-input',
    extraProps: {
      ...commonProps,
    },
  },
  {
    value: 'new_password',
    label: '新密码',
    component: 't-input',
    extraProps: {
      ...commonProps,
    },
  },
  {
    value: 'raw_password',
    label: '确认密码',
    component: 't-input',
    extraProps: {
      ...commonProps,
    },
  },
]

const isProject = computed(() => route.path === '/project')
const isMobile = computed(() => store.getters.isMobile)

function refresh() {
  location.reload()
}
function gotoGithub() {
  window.open('https://github.com/ExileLine', '_blank')
}
function gotoTD() {
  window.open('https://tdesign.tencent.com/vue-next/changelog', '_blank')
}
function toggleCollapse() {
  emit('update:collapsed', !props.collapsed)
}
function gotoInfo() {
  router.push({
    path: '/user/info',
  })
}
function close() {
  resetPwdFormRef.value.cancel()
}
async function resetPwd() {
  await fetchResetPwd({
    ...resetPwdForm,
    user_id: store.getters.info.id,
  })
  close()
  resetPwdVisible.value = false
  message.success('重置密码成功')
}

const gotoProject = () => {
  store.commit('app/clearTag')
  router.push({
    path: '/project',
  })
}

const logout = () => {
  store.dispatch('user/logout')
}
</script>
<style lang="scss">
.header {
  position: relative;
  width: 100%;
  height: 50px;
  font-size: 16px;
  overflow: hidden;
  background-color: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-border-level-1-color);
  .logo {
    // width: 146px;
    height: 28px;
    position: absolute;
    top: 50%;
    margin-top: -15px;
    left: 10px;
    background-size: 100% 100%;
    .align-center {
      overflow: hidden;
    }
  }
}
</style>
