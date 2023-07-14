<template>
  <div ref="affixContainerRef" class="hp-100 flex-col add-ui-contaienr">
    <div class="p-20 bg-white">
      <common-form
        ref="uiCaseFormRef"
        layout="inline"
        :data="uiCaseForm"
        :field-list="fieldList"
        :rules="rules"
        action-class="hide"
      />
    </div>

    <div class="flex p-30 flex-1 overflow-hidden">
      <t-card class="flex-1 pr-30 hp-100 overflow-y narrow-scrollbar" bordered shadow>
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
                @click="showTreeDialog(child)"
                @dragend="() => uiTagDragEnd(child)"
              >
                {{ child.title }}
              </t-tag>
            </t-col>
          </t-row>
        </div>
      </t-card>
      <t-card
        id="tree-container"
        class="flex-1 mlr-20 hp-100 overflow-y narrow-scrollbar"
        bordered
        shadow
      >
        <div class="flex-between">
          <div>业务流程</div>
          <div>
            <t-switch v-model="expandAll" :label="['折叠', '展开']"></t-switch>
            <t-tooltip content="添加业务节点">
              <t-icon
                name="add-rectangle"
                size="20px"
                class="ml-30"
                @click="addMasterNode"
              ></t-icon>
            </t-tooltip>
          </div>
        </div>
        <t-tree
          ref="treeRef"
          v-model:expanded="metaDataKeys"
          :data="uiCaseForm.meta_data"
          line
          hover
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
                <template v-if="node.data.function">({{ node.data.function }})</template>
              </t-tag>

              <div class="tree-btn-group pl-20">
                <t-icon
                  v-if="hasAddBtn(node)"
                  name="add"
                  class="ml-10"
                  @click="appendNode(node)"
                ></t-icon>
                <t-icon name="close" class="ml-10" @click="removeTreeNode(node)"></t-icon>
              </div>
            </div>
          </template>
        </t-tree>
      </t-card>
      <t-card class="flex-2 pl-30 hp-100 overflow-y narrow-scrollbar" bordered shadow>
        <div class="flex-between">
          <span>数据驱动</span>
          <t-button theme="success" @click="showHelpDialog">使用帮助</t-button>
        </div>
      </t-card>
    </div>

    <t-button class="case-btn" size="medium" @click="submitCase">
      <template #icon><t-icon name="check" /></template>
      提交
    </t-button>
  </div>
  <t-dialog
    v-model:visible="treeDialogVisible"
    destroy-on-close
    header="添加控件"
    @confirm="addNodeToTree"
  >
    <t-tree
      ref="ctrlsTree"
      :data="uiCaseForm.meta_data"
      line
      hover
      checkable
      activable
      expandAll
      checkStrictly
      :filter="filterParentNode"
      :keys="treeKeys"
    >
      <template #label="{ node }">
        <div class="tree-node-item wp-100 align-center">
          <t-tag :theme="controlType[node.data.type]">
            {{ node.data.title }}
          </t-tag>
        </div>
      </template>
    </t-tree>
  </t-dialog>

  <t-dialog
    v-model:visible="formDialogVisible"
    :close-btn="false"
    :close-nn-overlay-click="false"
    :close-on-esc-keydown="false"
    :footer="null"
    :header="dialogDetail._title"
  >
    <div class="ptb-10">
      <common-form
        v-bind="currentControlMap && currentControlMap.extra"
        dialog
        :data="dialogDetail"
        :rules="currentControlMapRules"
        :field-list="currentControlMapFieldList"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="updateCtrl"
        @cancel="formDialogVisible = false"
      />
    </div>
  </t-dialog>
</template>

<script lang="jsx">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  isArray,
  flattenDeep,
  map,
  filter,
  throttle,
  join,
  includes,
  forEach,
  findIndex,
  omit,
  forIn,
} from 'lodash'
import { treeToObject } from '@/utils'
import { confirmDialog } from '@/utils/business'
import {
  fetchGetUiCase,
  fetchAddUiCase,
  fetchUpdateUiCase,
  fetchGetUiControlList,
  fetchGetUiControlMap,
} from '@api/ui-api-case'
import { caseStatusList } from '@/config/variables'
import { validateRequired } from '@/components/validate'
import { toSelectList, addVersionList, addModuleList } from '@/utils/business'
import add_ui_case from '@/assets/add_ui_case.png'
import add_ui_case1 from '@/assets/add_ui_case1.png'
import add_ui_case2 from '@/assets/add_ui_case2.png'
import { helpDialog } from '@/utils/helpDialog'

export default {
  setup() {
    const route = useRoute()
    const treeRef = ref()
    const ctrlsTree = ref()
    const message = inject('message')
    const formDialogVisible = ref(false)
    const treeDialogVisible = ref(false)
    const dialogDetail = ref({ args: {} })

    const metaDataKeys = ref([])
    const expandAll = ref(true)
    const uiCaseFormRef = ref()
    const affixContainerRef = ref(null)
    const controlList = ref([])
    const controlMap = ref({})

    const uiCaseForm = ref({
      module_list: [],
      version_list: [],
      case_name: '',
      // is_shared: true,
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

    const allTreeKey = computed(() =>
      filter(flattenDeep(map(uiCaseForm.value.meta_data, value => getValuesBy(value))))
    )

    const treeDataObject = computed(() => treeToObject({}, uiCaseForm.value.meta_data))

    const currentControlMap = computed(() => controlMap.value[dialogDetail.value._function])
    const currentControlMapFieldList = computed(() => [
      {
        value: 'title',
        label: '描述',
        component: 't-input',
      },
      ...(currentControlMap.value?.fieldList ?? []),
    ])
    const currentControlMapRules = computed(() => ({
      title: [validateRequired('请输入描述')],
      ...currentControlMap.value?.rules,
    }))

    const getUiControlList = async () => {
      controlList.value = await fetchGetUiControlList()
    }
    const getUiControlMap = async () => {
      controlMap.value = await fetchGetUiControlMap()
    }

    onMounted(async () => {
      if (route.query.id) {
        uiCaseForm.value = await fetchGetUiCase(route.query.id)
        !uiCaseForm.value.version_list && (uiCaseForm.value.version_list = [])
        !uiCaseForm.value.module_list && (uiCaseForm.value.module_list = [])
        uiCaseForm.value.version_list = toSelectList(uiCaseForm.value.version_list, 'version_name')
        uiCaseForm.value.module_list = toSelectList(uiCaseForm.value.module_list, 'module_name')
        metaDataKeys.value = allTreeKey.value
        document.title = '编辑UI用例-' + uiCaseForm.value.case_name
      } else {
        document.title = '新增UI用例'
      }
      getUiControlList()
      getUiControlMap()
    })
    watch(
      () => expandAll.value,
      expandAll => {
        metaDataKeys.value = expandAll ? allTreeKey.value : []
      }
    )
    const switchLabel = ['是', '否']
    const parentTreeType = ['master']

    const treeTargetNode = ref()
    const treeNode = ref({})

    const hasAddBtn = node => includes(parentTreeType, node.data.type)

    const genNodeData = () => ({
      uuid: Date.now().toString(),
      title: '未命名业务',
      type: 'master',
      business_list: [],
    })

    const showHelpDialog = () => {
      helpDialog(
        <div>
          <p>1.新增业务节点</p>
          <p>2.将控件添加到节点中</p>
          <p>3.点击节点中的控件进行配置</p>
          <p>PS.目前仅常规控件，需要更丰富的控件自行获取源码后增加，或者联系我们。</p>
          <img src={add_ui_case} class="wp-100" />
          <img src={add_ui_case1} class="wp-100" />
          <img src={add_ui_case2} class="wp-100" />
        </div>,
        'UI测试使用说明',
        1000
      )
    }
    return {
      showHelpDialog,
      treeRef,
      ctrlsTree,
      uiCaseForm,
      uiCaseFormRef,
      treeTargetNode,
      treeNode,
      treeKeys: { value: 'uuid', label: 'title', children: 'business_list' },
      metaDataKeys,
      controlList,
      controlMap,
      currentControlMap,
      currentControlMapFieldList,
      currentControlMapRules,
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
      formDialogVisible,
      treeDataObject,
      showDialog(node) {
        const { args, title, function: _function, uuid } = node.data
        dialogDetail.value = {
          ...args,
          _function,
          title: title,
          uuid,
          _title: `${title}${_function ? '(' + _function + ')' : ''}`,
        }
        formDialogVisible.value = true
      },
      appendNode(node) {
        const nodeData = genNodeData()
        treeDataObject.value[node.value].business_list.push(nodeData)
        treeRef.value.appendTo(node.value, nodeData)
      },

      async removeTreeNode(node) {
        const dialog = await confirmDialog(
          <div>
            是否删除：
            <span class="text-error-6">{node.data.title}</span>
          </div>
        )
        treeRef.value.remove(node.value)
        const parent = node.getParent()
        let currentBusinessList
        if (parent) {
          const { value } = node.getParent()
          currentBusinessList = treeDataObject.value[value].business_list
        } else {
          currentBusinessList = uiCaseForm.value.meta_data
        }
        const idx = findIndex(currentBusinessList, { uuid: node.data.uuid })
        currentBusinessList.splice(idx, 1)
        dialog.hide()
      },
      uiTagDragEnd(child) {
        // const targetNode = treeTargetNode.value
        // const treeNode = targetNode?.node
        // const classList = targetNode?.classList
        // if (treeNode) {
        //   if (includes(classList, 't-tree__item--tip-highlight')) {
        //     treeRef.value.appendTo(treeNode.value, child)
        //   } else if (includes(classList, 't-tree__item--tip-top')) {
        //     treeRef.value.insertBefore(treeNode.value, child)
        //   } else if (includes(classList, 't-tree__item--tip-bottom')) {
        //     treeRef.value.insertAfter(treeNode.value, child)
        //   }
        // }
        // treeTargetNode.value = null
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
        // {
        //   value: 'is_shared',
        //   label: '公开执行',
        //   component: 't-switch',
        //   extraProps: {
        //     label: switchLabel,
        //   },
        // },
      ],
      rules: {
        case_name: [validateRequired('请输入用例名称')],
        case_status: [validateRequired('请选择用例状态'), 'change'],
      },

      submitCase: throttle(async function () {
        const validateResult = await uiCaseFormRef.value.validate()
        if (validateResult === true) {
          forIn(treeDataObject.value, (node, uuid) => {
            node.index = treeRef.value.getItem(uuid).getIndex()
          })
          forIn(treeDataObject.value, node => {
            const child = node.business_list
            if (isArray(child)) {
              child.sort((left, next) => left.index - next.index)
            }
          })
          const data = addVersionList(addModuleList(uiCaseForm.value))
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

      hasAddBtn,
      filterParentNode(node) {
        return hasAddBtn(node)
      },
      showTreeDialog(node) {
        treeNode.value = node
        treeDialogVisible.value = true
      },
      updateCtrl() {
        const { uuid, title, ...rest } = dialogDetail.value
        const data = omit(rest, ['_function', '_title'])
        treeDataObject.value[uuid].args = data
        treeDataObject.value[uuid].uuid = uuid
        treeDataObject.value[uuid].title = title
        formDialogVisible.value = false
      },
      addNodeToTree() {
        forEach(
          filter(ctrlsTree.value.getItems(), i => i.checked),
          node => {
            const nodeData = {
              ...treeNode.value,
              uuid: Date.now().toString(),
            }
            treeDataObject.value[node.value].business_list.push(nodeData)
            treeRef.value.appendTo(node.value, nodeData)
          }
        )
        message.success('操作成功')
        treeDialogVisible.value = false
      },

      addMasterNode() {
        const nodeData = genNodeData()
        uiCaseForm.value.meta_data.push(nodeData)
        treeRef.value.appendTo('', nodeData)
      },
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
  background: var(--td-bg-color-page);

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
  bottom: 40px;
  z-index: 100;
}
</style>
