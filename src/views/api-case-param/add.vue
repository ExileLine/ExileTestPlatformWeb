<template>
  <page-container class="hp-100 overflow-y narrow-scrollbar">
    <div class="mb-20 fs-20 fw-600 mt-10">参数信息</div>
    <common-form :rules="rules" :field-list="fieldList" :data="reqData" label-width="100px">
      <template #actions>
        <span></span>
      </template>
      <template #params>
        <t-tabs v-model:value="paramsTab" theme="card" class="wp-100">
          <t-tab-panel
            v-for="tab in paramsTabList"
            :key="tab.key"
            :value="tab.label"
            :label="tab.label"
          >
            <div class="pt-10 body-container">
              <component
                :is="tab.component"
                v-model:data="reqData[tab.key]"
                v-model:body-type="reqData.request_body_type"
                @get-variable-list="() => getVariableList(data)"
              />
            </div>
          </t-tab-panel>
        </t-tabs>
      </template>
    </common-form>

    <t-button class="case-btn" size="medium" @click="submitReqData">
      <template #icon><t-icon name="check" /></template>
      提交
    </t-button>
    <variable-list-dialog v-model:visible="variableListDialogVisible" @bind="addVariableData" />
  </page-container>
</template>

<script setup lang="jsx">
import { inject, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { find } from 'lodash'
import QueryTable from '@/views/api-case/components/QueryTable.vue'
import BodyJson from '@/views/api-case/components/BodyJson.vue'
import VariableTable from '@/views/api-case/components/VariableTable.vue'
import VariableListDialog from '@/views/api-case/components/VariableListDialog.vue'
import { validateRequired } from '@/components/validate'
import { fetchGetReqData, fetchAddReqData, fetchUpdateReqData } from '@/api/api-case-param'
import { isEmptyValKey } from '@/utils/business'

const route = useRoute()
const router = useRouter()
const store = useStore()
const message = inject('message')

// 变量
const variableListDialogVisible = ref(false)
const getVariableList = () => {
  variableListDialogVisible.value = true
}

const reqData = ref({
  data_after: [],
  data_before: [],
  data_name: '',
  remark: '',
  is_public: true,
  request_body_type: 'json',
  request_params_hash: [],
  request_headers_hash: [],
  request_body_hash: `{
    
}`,
  update_var_list: [],
})

const switchLabel = ['是', '否']
const extraProps = {
  class: 'w-400',
}
const fieldList = [
  {
    label: '参数名称',
    value: 'data_name',
    extraProps,
  },
  {
    value: 'is_public',
    label: '公开使用',
    component: 't-switch',
    extraProps: {
      label: switchLabel,
    },
  },
  {
    value: 'remark',
    label: '备注',
    component: 't-textarea',
    extraProps,
  },
  {
    label: '',
    slot: 'params',
  },
]

const rules = {
  data_name: [validateRequired('请输入参数名称')],
}

const paramsTabList = [
  {
    label: 'Params',
    key: 'request_params_hash',
    component: QueryTable,
  },
  {
    label: 'Headers',
    key: 'request_headers_hash',
    component: QueryTable,
  },
  {
    label: 'Body',
    key: 'request_body_hash',
    component: BodyJson,
  },
  {
    label: '关系变量',
    key: 'update_var_list',
    component: VariableTable,
  },
  {
    label: '前置条件',
  },
  {
    label: '后置条件',
  },
]

const paramsTab = ref(paramsTabList[1].label)

const addVariableData = row => {
  const data_info = reqData.value
  const var_list = data_info.update_var_list
  const hasReqData = find(var_list, ({ id }) => id === row.id)
  if (hasReqData) {
    return message.warning(`变量(${row.var_name}) 已关联参数：${data_info.data_name}`)
  }
  message.success(`变量(${row.var_name}) 关联参数：${data_info.data_name} 成功`)
  var_list.push(row)
}

const submitReqData = async () => {
  const data = reqData.value
  const emptyKeyVarData = isEmptyValKey(data.update_var_list)
  if (emptyKeyVarData) {
    return message.warning({
      content: (
        <div>
          参数：<span class="text-warning-6">{data.data_name} </span>
          的关系变量：
          <span class="text-warning-6">{emptyKeyVarData.var_name}</span> 取值的key不能为空
        </div>
      ),
    })
  }

  if (data.id) {
    await fetchUpdateReqData(data)
  } else {
    await fetchAddReqData(data)
  }

  message.success('操作成功')
  store.commit('app/delTag', route.fullPath)
  router.push({
    path: '/api-case-param',
  })
}

onMounted(async () => {
  const { id } = route.query
  if (id) {
    reqData.value = await fetchGetReqData(id)
  }
})
</script>

<style lang="scss" scoped>
.case-btn {
  position: fixed;
  right: 40px;
  bottom: 60px;
  z-index: 100;
}
</style>
