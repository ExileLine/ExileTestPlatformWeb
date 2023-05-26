<template>
  <div>
    <div id="project-search-container" class="plr-30 ptb-20">
      <div class="flex-between">
        <t-form class="flex-1" @submit="search">
          <t-input-adornment :append="renderSearchIcon">
            <t-input
              v-model="version_name"
              clearable
              placeholder="请输入版本迭代名称"
              size="large"
              @clear="clearVersion"
            />
          </t-input-adornment>
        </t-form>
        <div class="justify-end">
          <t-button
            shape="round"
            variant="outline"
            theme="primary"
            size="large"
            :icon="renderAddBtnIcon"
            @click="versionDialogVisible = true"
          >
            新增
          </t-button>
        </div>
      </div>
    </div>
    <div
      v-infinite-scroll="fetchVersionList"
      :infinite-scroll-disabled="loading"
      class="mt-20 narrow-scrollbar"
    >
      <t-row :gutter="20">
        <t-col
          v-bind="colSpan"
          v-for="version in versionList"
          :key="version.id"
          class="mb-20 pointer"
        >
          <t-card shadow @click="gotoPath(version)">
            <div class="flex relative">
              <t-avatar :image="imgList[version.icon - 1]" size="70px" />
              <div class="flex-1 ml-20 w-0">
                <t-tooltip :content="version.version_name" placement="top-left">
                  <div class="fs-16 mb-5 pr-30 ellipsis">{{ version.version_name }}</div>
                </t-tooltip>
                <div class="project-desc">
                  <div>版本号：{{ version.version_number }}</div>
                  <div>创建时间：{{ version.create_time }}</div>
                  <div>更新时间：{{ version.update_time }}</div>
                  <div>负责人：{{ version.creator }}</div>
                  <t-tooltip :content="version.remark" placement="bottom-left">
                    <div class="ellipsis">备注：{{ version.remark }}</div>
                  </t-tooltip>
                </div>
              </div>

              <t-dropdown trigger="click" max-column-width="200">
                <div class="setting-icon" @click.stop>
                  <t-icon name="setting" size="30px" />
                </div>
                <template #dropdown>
                  <t-dropdown-menu>
                    <t-dropdown-item
                      v-for="option in versionDropdownOptions"
                      :key="option.name"
                      @click="option.handle(version)"
                    >
                      <div class="align-center">
                        <t-icon :name="option.icon" class="mr-10" />
                        {{ option.name }}
                      </div>
                    </t-dropdown-item>
                  </t-dropdown-menu>
                </template>
              </t-dropdown>
            </div>
          </t-card>
        </t-col>
      </t-row>
      <template v-if="error">
        <div class="flex-center">
          <t-button variant="text" @click=";(error = false), fetchVersionList">
            请求失败，点击重新加载
          </t-button>
        </div>
      </template>
      <template v-else>
        <base-empty v-if="!versionList.length && finished" description="暂无项目" />
        <t-divider v-else>已经到底了</t-divider>
      </template>
    </div>

    <t-dialog v-model:visible="versionDialogVisible" :footer="false" :header="title" @close="close">
      <common-form
        dialog
        :data="versionForm"
        :rules="versionRules"
        :field-list="versionFieldList"
        label-width="6em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="updateVersion"
        @cancel="close"
      />
    </t-dialog>

    <execute-dialog
      v-model:visible="executeDialogVisible"
      :info="record"
      :execute-name="record.version_name"
      execute-type="version"
    />
    <ui-execute-dialog
      v-model:visible="uiExecuteDialogVisible"
      :info="record"
      :execute-name="record.version_name"
      execute-key="ui_version_all"
      execute-type="ui_version_all"
    />
  </div>
</template>

<script setup lang="jsx">
import { nextTick, ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
// search、add图标
import { SearchIcon, AddIcon } from 'tdesign-icons-vue-next'
import { keys, cloneDeep } from 'lodash'
import BaseEmpty from '@/components/BaseEmpty/index.vue'
import ExecuteDialog from '@view/api-case/components/ExecuteDialog.vue'
import UiExecuteDialog from '@view/ui-case/components/UiExecuteDialog.vue'
import { post } from '@util/request'
import { validateRequired } from '@/components/validate'
import { fetchAddVersion, fetchUpdateVersion } from '@/api/project'

const message = inject('message')
const router = useRouter()

const imgPathList = import.meta.globEager('@/assets/version-icon0*.png')
const imgList = keys(imgPathList).map(key => imgPathList[key].default)

const versionList = ref([])
const colSpan = {
  xxl: 2,
  xl: 3,
  sm: 4,
  xs: 12,
}

const versionDialogVisible = ref(false)
const uiExecuteDialogVisible = ref(false)
const versionForm = ref({})
const versionFieldList = [
  {
    label: '版本名称',
    value: 'version_name',
  },
  {
    label: '版本号',
    value: 'version_number',
  },
  {
    label: '备注',
    value: 'remark',
  },
]
const versionRules = {
  version_name: [validateRequired('请输入版本名称')],
  version_number: [validateRequired('请输入版本号')],
}

const title = computed(() => (versionForm.value.id ? '编辑版本迭代' : '新增版本迭代'))

const executeDialogVisible = ref(false)
const record = ref({})
const versionDropdownOptions = [
  {
    name: '编辑',
    icon: 'edit-1',
    handle(version) {
      versionForm.value = cloneDeep(version)
      versionDialogVisible.value = true
    },
  },
  {
    name: '执行API用例',
    icon: 'play-circle',
    handle(version) {
      record.value = version
      executeDialogVisible.value = true
    },
  },
  {
    name: '执行UI用例',
    icon: 'play-circle',
    handle(version) {
      record.value = version
      uiExecuteDialogVisible.value = true
    },
  },
]

const page = ref(1)
const size = 20
const version_name = ref('')
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const fetchVersionList = async () => {
  if (finished.value || error.value) return
  loading.value = true
  try {
    const { records, total } = await post(
      '/api/project_version_page',
      {
        version_name: version_name.value,
        page: page.value,
        size,
      },
      {
        loading: false,
      }
    )
    page.value++
    versionList.value.push(...records)
    if (page.value > Math.ceil(total / size)) {
      finished.value = true
    }
  } catch (e) {
    console.log(e)
    error.value = true
  }
  loading.value = false
}

fetchVersionList()

const search = () => {
  page.value = 1
  finished.value = false
  versionList.value = []
  fetchVersionList()
}
const clearVersion = () => {
  nextTick(() => search())
}
const renderSearchIcon = () => <SearchIcon onClick={() => search()} />
const renderAddBtnIcon = () => <AddIcon />

function close() {
  versionDialogVisible.value = false
  versionForm.value = {}
}

const updateVersion = async () => {
  const data = versionForm.value
  if (data.id) {
    await fetchUpdateVersion(data)
  } else {
    await fetchAddVersion(data)
  }
  versionDialogVisible.value = false
  close()
  clearVersion()
  message.success('操作成功')
}

const gotoPath = version => {
  router.push({
    path: '/version/task',
    query: {
      version_id: version.id,
    },
  })
}
</script>

<style lang="scss" scoped>
@import '@/views/project/project.scss';
</style>
