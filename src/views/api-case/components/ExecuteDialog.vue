<template>
  <div class="assert-list">
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
      >
        <template v-if="!includes(executeKeyList, executeKey)" #top>
          <t-form-item label="全部用例">
            <t-switch v-model="formModal.openCase" />
          </t-form-item>
          <t-form-item label="全部场景">
            <t-switch v-model="formModal.openScenario" />
          </t-form-item>
        </template>
      </common-form>
    </t-dialog>
  </div>
</template>

<script setup>
import { computed, inject, reactive } from 'vue'
import { includes } from 'lodash'
import { fetchExecute } from '@/api/api-case'
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
  executeKey: {
    type: String,
    default: 'case',
  },
})
const emit = defineEmits(['update:visible'])
const message = inject('message')
const formModal = reactive({
  request_timeout: 3,
})
const executeKeyList = ['case', 'scenario']
const executeType = computed(() => {
  const { openCase, openScenario } = formModal
  const executeKey = props.executeKey
  if (includes(executeKeyList, executeKey)) return executeKey
  if (openCase && openScenario) return `${executeKey}_all`
  if (openCase) return `${executeKey}_case`
  if (openScenario) return `${executeKey}_scenario`
})

const fieldList = computed(() => [
  {
    label: '环境覆盖',
    value: 'is_env_cover',
    component: 't-switch',
  },
  {
    label: '环境地址',
    value: 'env_url_id',
    component: 'remote-select',
    extraProps: {
      url: '/api/case_env_page',
      labelKey: ({ env_name, env_url }) => `${env_url}(${env_name})`,
      valueKey: 'id',
      disabled: !formModal.is_env_cover,
    },
  },
  {
    label: '数据驱动',
    value: 'data_driven',
    component: 't-switch',
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
      multiple: true,
      disabled: !formModal.use_mail,
    },
  },
  {
    label: '超时时间(默认3s)',
    value: 'modify_request',
    component: 't-switch',
  },
  {
    label: '超时时间',
    value: 'request_timeout',
    component: 't-input-number',
    extraProps: {
      theme: 'normal',
      type: 'tel',
      multiple: true,
      disabled: !formModal.modify_request,
    },
  },
])

const rules = computed(() => {
  const rules = {}

  if (formModal.is_env_cover) {
    rules.env_url_id = [validateRequired('请选择环境', 'change')]
  }
  if (formModal.use_dd_push) {
    rules.dd_push_id = [validateRequired('请选择环境', 'change')]
  }
  if (formModal.use_mail) {
    rules.mail_send_all = [validateRequired('请选择是否全部发送', 'change')]
    rules.mail_list = [validateArrayRequired('请选择邮箱列表', 'change')]
  }
  if (formModal.modify_request) {
    rules.request_timeout = [validateRequired('请选择环境', 'change')]
  }
  return rules
})

const close = () => {
  emit('update:visible', false)
}
const execute = async () => {
  const { info, executeName, executeKey } = props
  const { modify_request, request_timeout, openCase, openScenario, ...data } = formModal

  if (!includes(executeKeyList, executeKey)) {
    if (!openCase && !openScenario) return message.warning('请先选择全部用例或全部场景')
  }
  await fetchExecute({
    ...data,
    request_timeout: modify_request ? request_timeout : 3,
    execute_id: info.id,
    execute_name: executeName,
    execute_key: executeKey,
    execute_type: executeType.value,
    execute_label: '',
    trigger_type: 'user_execute',
  })
  close()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped></style>
