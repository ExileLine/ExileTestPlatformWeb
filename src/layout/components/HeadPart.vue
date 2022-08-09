<template>
  <div class="header justify-end align-center">
    <div class="logo align-center">
      <div
        :class="{
          'w-190': !collapsed,
          'w-40': collapsed
        }"
        @click="$router.push('/project')"
      >
        Exile
      </div>
      <div v-if="!isProject" class="ml-10 fs-22 cursor" @click="toggleCollapse">
        <t-icon
          :name="`${collapsed ? 'format-vertical-align-left' : 'format-vertical-align-right'}`"
        />
      </div>
    </div>

    <t-tooltip placement="bottom" content="刷新">
      <t-button theme="default" shape="square" variant="text" @click="refresh">
        <t-icon name="refresh" />
      </t-button>
    </t-tooltip>
    <t-tooltip placement="bottom" content="代码仓库">
      <t-button theme="default" shape="square" variant="text">
        <t-icon name="logo-github" />
      </t-button>
    </t-tooltip>
    <t-tooltip placement="bottom" content="帮助文档">
      <t-button theme="default" shape="square" variant="text">
        <t-icon name="help-circle" />
      </t-button>
    </t-tooltip>
    <t-dropdown :min-column-width="135" trigger="click">
      <template #dropdown>
        <t-dropdown-menu>
          <t-dropdown-item>
            <div class="align-center">
              <t-icon name="user-circle" class="mr-10" />
              个人中心
            </div>
          </t-dropdown-item>
          <t-dropdown-item>
            <div class="align-center">
              <t-icon name="lock-off" class="mr-10" />
              重置密码
            </div>
          </t-dropdown-item>
          <t-dropdown-item>
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
          Admin
          <t-icon name="chevron-down" />
        </div>
      </t-button>
    </t-dropdown>
    <theme-tabs class="mlr-10" />
    <t-dialog v-model="resetPwdVisible" title="重置密码" width="400px" @close="close">
      <common-form
        dialog
        ref="resetPwdForm"
        :rules="resetPwdRules"
        :data="resetPwdForm"
        :field-list="resetPwdFieldList"
        label-width="6em"
        confirm-text="确定"
        reset-text="取消"
        @submit="resetPwd"
        @reset="resetPwdVisible = false"
      />
    </t-dialog>
  </div>
</template>
<script>
import ThemeTabs from './ThemeTabs.vue'
import { validateRequired } from '@comp/validate'
import { fetchResetPwd } from '@/api/user'
export default {
  components: {
    ThemeTabs
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const commonProps = {
      type: 'password',
      showPassword: true
    }
    const validatePwd = (rule, value, callback) => {
      if (value !== this.resetPwdForm.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      resetPwdVisible: false,
      resetPwdForm: {
        old_password: '',
        new_password: '',
        raw_password: ''
      },
      resetPwdRules: {
        old_password: [validateRequired('请输入旧密码')],
        new_password: [validateRequired('请输入新密码')],
        raw_password: [
          validateRequired('请再次输入密码'),
          { validator: validatePwd, trigger: 'blur' }
        ]
      },
      resetPwdFieldList: [
        {
          value: 'old_password',
          label: '旧密码',
          component: 't-input',
          extraProps: {
            ...commonProps
          }
        },
        {
          value: 'new_password',
          label: '新密码',
          component: 't-input',
          extraProps: {
            ...commonProps
          }
        },
        {
          value: 'raw_password',
          label: '确认密码',
          component: 't-input',
          extraProps: {
            ...commonProps
          }
        }
      ]
    }
  },
  computed: {
    isProject() {
      return this.$route.path === '/project'
    }
  },
  methods: {
    refresh() {
      location.reload()
    },
    toggleCollapse() {
      this.$emit('update:collapsed', !this.collapsed)
    },
    close() {
      this.$refs.resetPwdForm.reset()
    },
    async resetPwd() {
      await fetchResetPwd({
        ...this.resetPwdForm,
        user_id: this.$store.getters.info.id
      })
      this.close()
      this.resetPwdVisible = false
      this.$message.success('重置密码成功')
    }
  }
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
  }
}
</style>
