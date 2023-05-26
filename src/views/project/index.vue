<template>
  <div class="root">
    <head-part v-model:collapsed="collapsed" />
    <div id="layout">
      <div class="content-box">
        <div class="main-box">
          <div id="project-search-container" class="plr-30 ptb-20">
            <div class="flex-between">
              <t-form class="flex-1" @submit="search">
                <t-input-adornment :append="renderSearchIcon">
                  <t-input
                    v-model="project_name"
                    clearable
                    placeholder="请输入项目名称"
                    size="large"
                    @clear="clearProject"
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
                  @click="projectDialogVisible = true"
                >
                  新增
                </t-button>
              </div>
            </div>
          </div>
          <div
            v-infinite-scroll="fetchProjectList"
            :infinite-scroll-disabled="loading"
            id="main-container"
            class="mt-20 narrow-scrollbar"
          >
            <t-row :gutter="20">
              <t-col
                v-bind="colSpan"
                v-for="project in projectList"
                :key="project.id"
                class="mb-20 pointer"
              >
                <t-card shadow @click="gotoHome(project)">
                  <div class="flex relative">
                    <t-avatar :image="projectIcon" size="70px" />
                    <div class="flex-1 ml-20 w-0">
                      <t-tooltip :content="project.project_name" placement="top-left">
                        <div class="fs-16 mb-5 pr-30 ellipsis">{{ project.project_name }}</div>
                      </t-tooltip>
                      <div class="project-desc">
                        <div>创建时间：{{ project.create_time }}</div>
                        <div>更新时间：{{ project.update_time }}</div>
                        <div>负责人：{{ project.creator }}</div>
                        <t-tooltip :content="project.remark" placement="bottom-left">
                          <div class="ellipsis">备注：{{ project.remark }}</div>
                        </t-tooltip>
                      </div>
                    </div>

                    <t-dropdown trigger="click">
                      <div class="setting-icon" @click.stop>
                        <t-icon name="setting" size="30px" />
                      </div>
                      <template #dropdown>
                        <t-dropdown-menu>
                          <t-dropdown-item
                            v-for="option in projectDropdownOptions"
                            :key="option.name"
                            @click="option.handle(project)"
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
                <t-button variant="text" @click=";(error = false), fetchProjectList">
                  请求失败，点击重新加载
                </t-button>
              </div>
            </template>
            <template v-else>
              <base-empty v-if="!projectList.length && finished" description="暂无项目" />
              <t-divider v-else>已经到底了</t-divider>
            </template>
          </div>
        </div>
      </div>
    </div>

    <t-dialog v-model:visible="projectDialogVisible" :footer="false" :header="title" @close="close">
      <common-form
        dialog
        :data="projectForm"
        :rules="projectRules"
        :field-list="projectFieldList"
        label-width="6em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="updateProject"
        @cancel="projectDialogVisible = false"
      />
    </t-dialog>

    <execute-dialog
      v-model:visible="executeDialogVisible"
      :info="record"
      :execute-name="record.project_name"
      execute-type="project"
    />
  </div>
</template>

<script setup lang="jsx">
import { nextTick, ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash'

// search、add图标
import { SearchIcon, AddIcon } from 'tdesign-icons-vue-next'
import BaseEmpty from '@/components/BaseEmpty/index.vue'
import HeadPart from '@/layout/components/HeadPart.vue'
import ExecuteDialog from '@view/api-case/components/ExecuteDialog.vue'
import projectIcon from '@/assets/project-icon.png'
import { post } from '@util/request'
import { validateRequired } from '@/components/validate'
import { fetchAddProject, fetchUpdateProject } from '@/api/project'

const message = inject('message')

const router = useRouter()
const store = useStore()

const projectList = ref([])
const colSpan = {
  xxl: 2,
  xl: 3,
  sm: 4,
  xs: 12,
}

const projectDialogVisible = ref(false)
const projectForm = ref({})
const projectFieldList = [
  {
    label: '项目名称',
    value: 'project_name',
  },
  {
    label: '备注',
    value: 'remark',
  },
]
const projectRules = {
  project_name: [validateRequired('请输入版本名称')],
}

const title = computed(() => (projectForm.value.id ? '编辑项目' : '新增项目'))

const executeDialogVisible = ref(false)
const record = ref({})

const projectDropdownOptions = [
  {
    name: '编辑',
    icon: 'edit-1',
    handle(project) {
      projectForm.value = cloneDeep(project)
      projectDialogVisible.value = true
    },
  },
  // {
  //   name: '执行',
  //   icon: 'play-circle',
  //   handle(project) {
  //     record.value = project
  //     executeDialogVisible.value = true
  //   },
  // },
]

const gotoHome = project => {
  store.commit('app/setProjectId', project.id)
  router.push({
    path: '/dashboard',
  })
}

const page = ref(1)
const size = 20
const project_name = ref('')
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const fetchProjectList = async () => {
  if (finished.value || error.value) return
  loading.value = true
  try {
    const { records, total } = await post(
      '/api/project_page',
      {
        project_name: project_name.value,
        page: page.value,
        size,
      },
      {
        loading: false,
      }
    )
    page.value++
    projectList.value.push(...records)
    if (page.value > Math.ceil(total / size)) {
      finished.value = true
    }
  } catch (e) {
    console.log(e)
    error.value = true
  }
  loading.value = false
}

fetchProjectList()

const search = () => {
  page.value = 1
  finished.value = false
  projectList.value = []
  fetchProjectList()
}
const clearProject = () => {
  nextTick(() => search())
}
const renderSearchIcon = () => <SearchIcon onClick={() => search()} />
const renderAddBtnIcon = () => <AddIcon />

function close() {
  projectForm.value = {}
}

const updateProject = async () => {
  const data = projectForm.value
  if (data.id) {
    await fetchUpdateProject(data)
  } else {
    await fetchAddProject(data)
  }
  projectDialogVisible.value = false
  close()
  clearProject()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped>
@import './project.scss';
</style>
