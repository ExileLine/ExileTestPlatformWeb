<template>
  <page-container>
    <div class="flex">
      <div class="flex-1 pr-30">
        <div v-for="control in controlList" class="mb-20">
          <div class="flex-center mb-10">
            <t-tag :theme="controlType[control.type]" variant="light">
              {{ control.title }}
            </t-tag>
          </div>
          <t-row :gutter="16">
            <t-col v-for="(child, idx) in control.business_list" :key="idx" :span="6" class="mb-10">
              <t-tag :theme="controlType[child.type]" class="block text-center ellipsis">
                {{ child.title }}
              </t-tag>
            </t-col>
          </t-row>
        </div>
      </div>
      <div id="tree-container" class="flex-2">
        <div class="justify-end">
          <t-switch v-model="expandAll" :label="['展开', '折叠']"></t-switch>
        </div>
        <t-tree
          ref="treeRef"
          :data="treeData"
          line
          hover
          expand-all
          activable
          draggable
          :keys="treeKeys"
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

    <t-dialog v-model:visible="treeDialogVisible" header="URL配置">
      <div class="ptb-10">
        <t-form :data="dialogDetail">
          <t-form-item
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
  </page-container>
</template>

<script lang="jsx">
import { confirmDialog } from '@/utils/business'
import { ref } from 'vue'

export default {
  setup() {
    const treeRef = ref()
    const treeDialogVisible = ref(false)
    const dialogDetail = ref({ args: {} })

    return {
      treeRef,
      treeKeys: { value: 'uuid', label: 'title', children: 'business_list' },
      treeData: [
        {
          uuid: 'VbdCosRFXfrUaRaEJh2NKB',
          index: 1,
          title: '开始',
          type: 'master',
          business_list: [
            {
              uuid: 'RS8HLZnzpXztjgq8YXP8Hp',
              index: 1,
              type: 'ui_control',
              title: '启动浏览器控件',
              function: 'open',
              args: { url: 'https://www.github.com' },
            },
          ],
        },
        {
          uuid: 'mgM3NJD787DKM3TXgmbd6r',
          index: 2,
          title: '登录',
          type: 'master',
          business_list: [
            {
              uuid: '74h88n4VCmgY4h6uaxP7ph',
              index: 1,
              type: 'ui_control',
              title: '输入控件',
              function: 'input',
              args: { username: 'admin' },
            },
            {
              uuid: 'kxLJQcWhnyR8zHSRwrUZWh',
              index: 2,
              type: 'ui_control',
              title: '输入控件',
              function: 'input',
              args: { password: '123456' },
            },
            {
              uuid: 'Pew9TT56amZrVatsnkZQJy',
              index: 3,
              type: 'ui_control',
              title: '点击控件',
              function: 'click',
              args: {},
            },
            {
              uuid: 'T8veyakeSQ2m6WCBV3Gghi',
              index: 4,
              title: '检验是否登录成功',
              type: 'master',
              business_list: [
                {
                  uuid: '9EJFu3LRJ2SKqdMnwtyEdb',
                  index: 1,
                  type: 'assert_control',
                  title: 'UI断言控件',
                  function: 'ui_assert',
                  args: {
                    expected_results: 'aaa',
                    rule: '==',
                    actual_results: '',
                    actual_results_source: {
                      source: 'web_ui',
                      args: { web_ui: {}, api_response: {} },
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          uuid: 'QSQ7s2WZYSARRjpfFVSptw',
          index: 3,
          title: '循环录入数据',
          type: 'master',
          business_list: [
            {
              uuid: 'aHcd3mon2XpStFq4U4x7pK',
              index: 1,
              type: 'logic_control',
              title: '循环控件',
              function: 'for',
              num: 2,
              data_source: [],
              business_list: [
                {
                  uuid: 'nncsP2DZjyM86Jh349zw23',
                  index: 1,
                  type: 'ui_control',
                  title: '输入控件A',
                  function: 'input',
                  args: { username: 'admin' },
                },
                {
                  uuid: '6PCAzwDbcE9rAKvXBetQn7',
                  index: 2,
                  type: 'ui_control',
                  title: '输入控件B',
                  function: 'input',
                  args: { password: '123456' },
                },
                {
                  uuid: 'SjcwU9nmdN6zhaarNUCrKZ',
                  index: 3,
                  type: 'ui_control',
                  title: '点击控件C',
                  function: 'click',
                  args: {},
                },
                {
                  uuid: 'TPdrgeZ7z4oneGXr7UXExD',
                  index: 4,
                  type: 'logic',
                  title: '循环二(逻辑块)',
                  function: 'for',
                  num: 3,
                  data_source: [],
                  business_list: [
                    {
                      uuid: 'XdGDxPm3w8XzJtCPzJJo9Z',
                      index: 11,
                      type: 'ui_control',
                      title: '点击控件X-3',
                      function: 'click',
                      args: {},
                    },
                    {
                      uuid: 'n6DD8PhFLuxLLJS9xuxoMu',
                      index: 22,
                      type: 'ui_control',
                      title: '点击控件Y-3',
                      function: 'click',
                      args: {},
                    },
                    {
                      uuid: 'Nv4qe49Wt6usSdZKXTFvxB',
                      index: 33,
                      type: 'ui_control',
                      title: '点击控件Z-3',
                      function: 'click',
                      args: {},
                    },
                    {
                      uuid: 'H86TXyAXn5hGaqk6ppDsk9',
                      index: 44,
                      type: 'logic',
                      title: '循环三(逻辑块)',
                      function: 'for',
                      num: 2,
                      data_source: [],
                      business_list: [
                        {
                          uuid: 'AudvrACKFXwo6K4usrzWWS',
                          index: 3331,
                          type: 'ui_control',
                          title: '===点击控件OKC===2',
                          function: 'click',
                          args: {},
                        },
                        {
                          uuid: 'LXfCLjBnAMrFwdh3i26Kyv',
                          index: 3332,
                          type: 'ui_control',
                          title: '===点击控件LOL===2',
                          function: 'click',
                          args: {},
                        },
                      ],
                    },
                  ],
                },
                {
                  uuid: 'TUicmsNP6P2Q54u83EEjjJ',
                  index: 5,
                  title: '循环四(业务块)',
                  type: 'master',
                  business_list: [
                    {
                      uuid: 'K4GfsnaFcYy9adRKUbfWos',
                      index: 1,
                      type: 'ui_control',
                      title: '循环四-点击控件1',
                      function: 'click',
                      args: {},
                    },
                    {
                      uuid: '6TJCSPuWh8DCGFkDTyS8Ge',
                      index: 2,
                      type: 'logic_control',
                      title: '循环控件',
                      function: 'for',
                      num: 2,
                      data_source: [],
                      business_list: [
                        {
                          uuid: 'fbZE5i3u2eBou9bCW8tQ28',
                          index: 771,
                          type: 'ui_control',
                          title: '循环四-内循环-点击控件2',
                          function: 'click',
                          args: {},
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              uuid: 'XqwukjuockaFpzp7WP6Cok',
              index: 2,
              title: '操作2',
              type: 'master',
              business_list: [
                {
                  uuid: 'GK9qPhLMfsBDxkRwFvY78Y',
                  index: 1,
                  type: 'ui_control',
                  title: '点击控件',
                  function: 'click',
                  args: {},
                },
              ],
            },
          ],
        },
      ],
      controlList: [
        {
          type: 'ui_control',
          title: 'ui',
          business_list: [
            {
              type: 'ui_control',
              title: '启动(URL)',
            },
            {
              type: 'ui_control',
              title: '启动(URL)111111111111',
            },
            {
              type: 'ui_control',
              title: '启动(URL)2',
            },
            {
              type: 'ui_control',
              title: '启动(URL)2',
            },
          ],
        },
        {
          type: 'api_control',
          title: 'api',
          business_list: [
            {
              type: 'api_control',
              title: '启动(URL)',
            },
            {
              type: 'api_control',
              title: '启动(URL)1',
            },
            {
              type: 'api_control',
              title: '启动(URL)2',
            },
            {
              type: 'api_control',
              title: '启动(URL)2',
            },
          ],
        },
        {
          type: 'logic_control',
          title: 'logic',
          business_list: [
            {
              type: 'logic_control',
              title: '启动(URL)',
            },
            {
              type: 'logic_control',
              title: '启动(URL)1',
            },
            {
              type: 'logic_control',
              title: '启动(URL)2',
            },
            {
              type: 'logic_control',
              title: '启动(URL)2',
            },
          ],
        },
      ],
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
      expandAll: ref(true),
      treeDialogVisible,
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
    }
  },
}
</script>

<style lang="scss" scoped>
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
</style>
