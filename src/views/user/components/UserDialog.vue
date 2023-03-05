<template>
  <div>
    <t-dialog :visible="visible" :footer="false" :header="title" @close="close">
      <common-form
        dialog
        ref="userFormRef"
        :rules="rules"
        :data="data"
        :field-list="fieldList"
        label-width="6em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="saveUser"
        @cancel="$emit('update:visible', false)"
      />
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useStore } from 'vuex'
import { clone } from 'lodash'
import { validateRequired } from '@/components/validate'
import { fetchAddUser, fetchUpdateUser } from '@/api/user'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible', 'close', 'save'])

const message = inject('message')

const title = computed(() => (props.data.id ? '编辑用户' : '新增用户'))
const store = useStore()
const info = computed(() => store.getters.info)

const userFormRef = ref()

const addFieldList = [
  {
    label: '工号',
    value: 'code',
  },
  {
    label: '用户名',
    value: 'username',
  },
  {
    label: '昵称',
    value: 'nickname',
  },
  {
    label: '密码',
    value: 'password',
    extraProps: {
      type: 'password',
      showPassword: true,
      autocomplete: 'new-password',
    },
  },
  {
    label: '手机号',
    value: 'phone',
    component: 't-input-number',
    extraProps: {
      theme: 'normal',
      type: 'tel',
      class: 'wp-100',
    },
  },
  {
    label: '邮箱',
    value: 'mail',
  },
  {
    label: '备注',
    value: 'remark',
  },
]
const editFieldList = [
  {
    label: '昵称',
    value: 'nickname',
  },
  {
    label: '手机号',
    value: 'phone',
    component: 't-input-number',
    extraProps: {
      theme: 'normal',
      type: 'tel',
      class: 'wp-100',
    },
  },
  {
    label: '邮箱',
    value: 'mail',
  },
  {
    label: '备注',
    value: 'remark',
  },
]
const fieldList = computed(() => (props.data.id ? editFieldList : addFieldList))
const rules = {
  username: [validateRequired('请输入用户名')],
  password: [validateRequired('请输入密码')],
  phone: [validateRequired('请输入手机号')],
  mail: [validateRequired('请输入邮箱')],
}

const close = () => {
  userFormRef.value.cancel()
  emit('update:visible', false)
  emit('close')
}

const saveUser = async () => {
  const id = props.data.id
  if (id) {
    await fetchUpdateUser(props.data)
    if (info.value.id === id) {
      store.commit('user/SET_INFO', clone(props.data))
    }
  } else {
    await fetchAddUser(props.data)
  }
  close()
  emit('save')
  message.success('保存成功')
}
</script>

<style lang="scss" scoped></style>
