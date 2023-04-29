<template>
  <div>
    <t-dialog
      :visible="visible"
      header="执行条件"
      width="700px"
      destroy-on-close
      placement="center"
      :footer="null"
      @close="close"
    >
      <common-form
        dialog
        label-width="10em"
        :data="formModal"
        :rules="rules"
        :field-list="fieldList"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="execute"
        @cancel="close"
      />
    </t-dialog>
  </div>
</template>

<script setup>
import { computed, inject, reactive } from 'vue'
import { fetchUiExecute } from '@/api/ui-api-case'
import { validateArrayRequired, validateRequired } from '@/components/validate'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object,
    default: () => ({}),
  },
  executeName: {
    type: String,
  },
  executeType: {
    type: String,
    default: 'case',
  },
})
const emit = defineEmits(['update:visible'])
const message = inject('message')
const formModal = reactive({})

const fieldList = computed(() => [
  {
    label: 'Liunx',
    value: 'use_client',
    component: 't-switch',
    suffix: 'PC(仅支持私有化部署)',
    suffixClass: 'ml-20',
  },
  {
    label: 'PC端地址',
    value: 'client',
    component: 'remote-select',
    extraProps: {
      url: '/api/ui_pc_conf_page',
      labelKey: ({ ui_pc_name, ui_pc_ip }) => `${ui_pc_name}(${ui_pc_ip})`,
      valueKey: 'id',
      disabled: !formModal.use_client,
      multiple: true,
    },
  },
  {
    label: '钉钉推送',
    value: 'use_dd_push',
    component: 't-switch',
  },
  {
    label: '钉钉群组',
    value: 'dd_push_id',
    component: 'remote-select',
    extraProps: {
      url: '/api/dd_push_conf_page',
      valueKey: 'id',
      labelKey: 'title',
      disabled: !formModal.use_dd_push,
    },
  },
  {
    label: '邮件发送',
    value: 'use_mail',
    component: 't-switch',
  },
  {
    label: '全部发送',
    value: 'mail_send_all',
    component: 't-radio',
    list: [
      {
        value: true,
        label: '是',
      },
      {
        value: false,
        label: '否',
      },
    ],
    extraProps: {
      disabled: !formModal.use_mail,
    },
  },
  {
    label: '邮箱列表',
    value: 'mail_list',
    component: 'remote-select',
    extraProps: {
      url: '/api/mail_conf_page',
      valueKey: 'id',
      labelKey: ({ mail, mail_user }) => `${mail_user}(${mail})`,
      multiple: true,
      disabled: !formModal.use_mail,
    },
  },
])

const rules = computed(() => {
  const rules = {}

  if (formModal.use_client) {
    rules.client = [validateRequired('请选择环境', 'change')]
  }
  if (formModal.use_dd_push) {
    rules.dd_push_id = [validateRequired('请选择钉钉群组', 'change')]
  }
  if (formModal.use_mail) {
    rules.mail_send_all = [validateRequired('请选择是否全部发送', 'change')]
    rules.mail_list = [validateArrayRequired('请选择邮箱列表', 'change')]
  }
  return rules
})

const close = () => {
  emit('update:visible', false)
}
const execute = async () => {
  const { info, executeName } = props

  await fetchUiExecute({
    ...formModal,
    execute_id: info.id,
    execute_name: executeName,
    execute_key: 'ui_case',
    execute_type: 'ui_case',
    execute_label: '',
    trigger_type: 'user_execute',
  })
  close()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped></style>
