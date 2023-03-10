<template>
  <div ref="affixContainerRef" class="hp-100 overflow-y narrow-scrollbar add-ui-contaienr">
    <t-affix :container="getContainer">
      <div class="ptb-20 bg-white">
        <common-form
          ref="uiCaseFormRef"
          layout="inline"
          :data="uiCaseForm"
          :field-list="fieldList"
          :rules="rules"
          action-class="hide"
        />
      </div>
    </t-affix>

    <div class="flex">
      <div class="flex-1 pr-30">
        <div v-for="control in controlList" class="mb-20">
          <div class="flex-center mb-10">
            <t-tag :theme="controlType[control.type]" variant="light">
              {{ control.title }}
            </t-tag>
          </div>
          <t-row :gutter="16">
            <t-col
              v-for="(child, idx) in control.control_list"
              :key="idx"
              :span="6"
              class="mb-10"
              draggable
            >
              <t-tag
                :theme="controlType[child.type]"
                class="block text-center ellipsis"
                draggable="true"
                @dragend="() => uiTagDragEnd(child)"
              >
                {{ child.title }}
              </t-tag>
            </t-col>
          </t-row>
        </div>
      </div>
      <div id="tree-container" class="flex-2">
        <div class="justify-end">
          <t-switch v-model="expandAll" :label="['折叠', '展开']"></t-switch>
        </div>
        <t-tree
          ref="treeRef"
          :data="uiCaseForm.meta_data"
          line
          hover
          v-model:expanded="metaDataKeys"
          activable
          draggable
          :keys="treeKeys"
          @drag-end="handleDragEnd"
          @drag-over="handleDragOver"
        >
          <template #label="{ node }">
            <div class="tree-node-item wp-100 align-center">
              <t-tag :theme="controlType[node.data.type]" @click="showDialog(node)">
                {{ node.data.title }}
              </t-tag>

              <div class="tree-btn-group pl-20">
                <t-icon name="add" class="ml-10" @click="appendNode(node)"></t-icon>
                <t-icon name="close" class="ml-10" @click="removeTreeNode(node)"></t-icon>
              </div>
            </div>
          </template>
        </t-tree>
      </div>
      <div class="flex-2 pl-30">databases</div>
    </div>

    <t-button class="case-btn" size="medium" @click="submitCase">
      <template #icon><t-icon name="check" /></template>
      提交
    </t-button>
  </div>

  <t-dialog v-model:visible="treeDialogVisible" header="URL配置">
    <div class="ptb-10">
      <t-form :data="dialogDetail">
        <t-form-item
          v-if="dialogDetail.args && dialogDetail.args.url"
          label="url"
          name="args.url"
          label-width="40px"
          :rules="[{ required: true, message: '请输入url', type: 'error' }]"
        >
          <t-input v-model="dialogDetail.args.url" placeholder=" 请输入url" />
        </t-form-item>
      </t-form>
    </div>
  </t-dialog>
</template>

<script lang="jsx">
import { inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { isArray, flattenDeep, map, filter, throttle, join, includes } from 'lodash'
import { confirmDialog } from '@/utils/business'
import {
  fetchGetUiCase,
  fetchAddUiCase,
  fetchUpdateUiCase,
  fetchGetUiControlList,
} from '@api/ui-api-case'
import { caseStatusList } from '@/config/variables'
import { validateRequired } from '@/components/validate'

export default {
  setup() {
    const route = useRoute()
    const treeRef = ref()
    const message = inject('message')
    const treeDialogVisible = ref(false)
    const dialogDetail = ref({ args: {} })

    const metaDataKeys = ref([])
    const expandAll = ref(true)
    const uiCaseFormRef = ref()
    const affixContainerRef = ref(null)
    const controlList = ref([])
    const getContainer = () => affixContainerRef.value

    const uiCaseForm = ref({
      module_list: [],
      version_list: [],
      case_name: '',
      is_shared: true,
      is_public: true,
      case_status: '',
      remark: '',
      meta_data: [],
    })

    function getValuesBy(obj, valueKey = 'uuid', childKey = 'business_list') {
      return [
        obj[valueKey],
        isArray(obj[childKey]) ? map(obj[childKey], value => getValuesBy(value)) : [],
      ]
    }

    const getAllTreeKey = () =>
      filter(flattenDeep(map(uiCaseForm.value.meta_data, value => getValuesBy(value))))
    onMounted(async () => {
      if (route.query.id) {
        uiCaseForm.value = await fetchGetUiCase(route.query.id)
        !uiCaseForm.value.version_list && (uiCaseForm.value.version_list = [])
        !uiCaseForm.value.module_list && (uiCaseForm.value.module_list = [])
        metaDataKeys.value = getAllTreeKey()
        document.title = '编辑UI用例-' + uiCaseForm.value.case_name
      } else {
        document.title = '新增UI用例'
      }
      controlList.value = await fetchGetUiControlList()
    })
    watch(
      () => expandAll.value,
      expandAll => {
        metaDataKeys.value = expandAll ? getAllTreeKey() : []
      }
    )
    const switchLabel = ['是', '否']

    const treeTargetNode = ref()
    return {
      treeRef,
      uiCaseFormRef,
      treeTargetNode,
      treeKeys: { value: 'uuid', label: 'title', children: 'business_list' },
      metaDataKeys,
      controlList,
      controlType: {
        master: undefined,
        ui_control: 'primary',
        api_control: 'success',
        assert_control: 'warning',
        logic: 'warning',
        logic_control: 'warning',
        message_control: '',
        middle_control: '',
      },
      dialogDetail,
      expandAll,
      treeDialogVisible,
      affixContainerRef,
      getContainer,
      showDialog(node) {
        treeDialogVisible.value = true
        dialogDetail.value = node.data
        console.log(node.data)
      },
      appendNode(node) {
        treeRef.value.appendTo(node.value, {
          uuid: Date.now(),
          title: '未命名业务',
          type: 'master',
        })
      },

      async removeTreeNode(node) {
        const dialog = await confirmDialog(
          <div>
            是否删除：
            <span class="text-error-6">{node.data.title}</span>
          </div>
        )
        treeRef.value.remove(node.value)
        dialog.hide()
      },
      uiTagDragEnd(child) {
        const targetNode = treeTargetNode.value
        const treeNode = targetNode?.node
        const classList = targetNode?.classList
        if (treeNode) {
          if (includes(classList, 't-tree__item--tip-highlight')) {
            treeRef.value.appendTo(treeNode.value, child)
          } else if (includes(classList, 't-tree__item--tip-top')) {
            treeRef.value.insertBefore(treeNode.value, child)
          } else if (includes(classList, 't-tree__item--tip-bottom')) {
            treeRef.value.insertAfter(treeNode.value, child)
          }
        }
        treeTargetNode.value = null
      },
      handleDragEnd() {
        treeTargetNode.value = null
      },
      handleDragOver(context) {
        const ele = window.event.currentTarget
        treeTargetNode.value = {
          ...context,
          classList: join(ele.classList),
        }
      },

      uiCaseForm,
      fieldList: [
        {
          value: 'version_list',
          label: '迭代版本',
          component: 'remote-select',
          extraProps: {
            url: '/api/project_version_page',
            labelKey: 'version_name',
            valueKey: 'id',
            valueType: 'object',
            multiple: true,
            class: 'w-200',
            'min-collapsed-num': 1,
          },
        },
        {
          value: 'module_list',
          label: '模块',
          component: 'remote-select',
          extraProps: {
            url: '/api/module_app_page',
            labelKey: 'module_name',
            valueKey: 'id',
            valueType: 'object',
            multiple: true,
            class: 'w-200',
            'min-collapsed-num': 1,
          },
        },
        {
          value: 'case_name',
          label: '用例名称',
        },
        {
          value: 'case_status',
          label: '用例状态',
          component: 't-select',
          list: caseStatusList,
          extraProps: {
            class: 'w-140',
          },
        },
        {
          value: 'remark',
          label: '备注',
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
          value: 'is_shared',
          label: '公开执行',
          component: 't-switch',
          extraProps: {
            label: switchLabel,
          },
        },
      ],
      rules: {
        case_name: [validateRequired('请输入用例名称')],
        case_status: [validateRequired('请选择用例状态'), 'change'],
      },

      submitCase: throttle(async function () {
        const validateResult = await uiCaseFormRef.value.validate()

        if (validateResult === true) {
          const data = {
            ...uiCaseForm.value,
            meta_data: map(
              filter(treeRef.value.getItems(), i => i.getLevel() == 0),
              'data'
            ),
          }
          if (route.query.id) {
            await fetchUpdateUiCase(data)
          } else {
            await fetchAddUiCase(data)
            setTimeout(() => {
              window.close()
            }, 800)
          }
          message.success('操作成功')
        }
      }, 1000),
    }
  },
}
</script>

<style lang="scss" scoped>
.add-ui-contaienr {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  background: white;
  padding: 0 30px;

  ::v-deep {
    .t-form-inline .t-form__item {
      min-width: auto;
    }
    .t-form .w-140 .t-input__wrap,
    .t-form .w-140 .t-input {
      width: 140px;
      min-width: 140px;
    }

    .t-input__prefix {
      .t-tag--close {
        position: relative;
        max-width: 110px;
        padding-right: 32px;
        display: inline-block;
        vertical-align: middle;
        @include ellipsis();

        svg {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          right: 8px;
        }
      }

      & ~ .t-input__inner {
        min-width: 0px;
      }
    }
  }
}
.tree-node-item {
  .tree-btn-group {
    display: none;

    .t-icon-add {
      color: $success-color-6;
    }

    .t-icon-close {
      color: $error-color-6;
    }
  }
  &:hover {
    .tree-btn-group {
      display: flex;
    }
  }
}
#tree-container {
  ::v-deep .t-tree__label {
    flex: 1;
  }
}

.case-btn {
  position: fixed;
  right: 40px;
  bottom: 60px;
  z-index: 100;
}
</style>
