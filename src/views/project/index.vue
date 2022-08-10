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
            class="mt-20"
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

                    <t-dropdown :options="projectDropdownOptions" trigger="click">
                      <div class="setting-icon" @click.stop>
                        <t-icon name="setting" size="30px" />
                      </div>
                      <template #dropdown>
                        <t-dropdown-menu>
                          <t-dropdown-item
                            v-for="option in projectDropdownOptions"
                            :key="option.name"
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
            <div v-if="!projectList.length && finished" class="flex-col-center">
              <svg-icon icon="no-data" width="20em" height="20em" />
              <div>暂无项目</div>
            </div>
            <t-divider v-else>已经到底了</t-divider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// search、add图标
import { SearchIcon, AddIcon } from 'tdesign-icons-vue-next'
import HeadPart from '@/layout/components/HeadPart.vue'
import projectIcon from '@/assets/project-icon.png'
import { post } from '@util/request'

const router = useRouter()
const store = useStore()

const projectList = ref([])
const colSpan = {
  xxl: 2,
  xl: 3,
  sm: 4,
  xs: 12
}

const projectDropdownOptions = [
  {
    name: '编辑',
    icon: 'edit-1'
  },
  {
    name: '执行',
    icon: 'play-circle'
  }
]

const gotoHome = project => {
  store.commit('app/setProjectId', project.id)
  router.push('/')
}

const page = ref(1)
const size = 20
const project_name = ref('')
const loading = ref(false)
const finished = ref(false)
const fetchProjectList = async () => {
  if (finished.value) return
  loading.value = true
  try {
    const { records, total } = await post(
      '/api/project_page',
      {
        project_name: project_name.value,
        page: page.value,
        size
      },
      {
        loading: false
      }
    )
    page.value++
    projectList.value.push(...records)
    if (page.value > Math.ceil(total / size)) {
      finished.value = true
    }
  } catch (error) {
    console.log(error)
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
</script>

<style lang="scss" scoped>
#project-search-container {
  box-shadow: rgb(0 0 0 / 12%) 0px 2px 4px, rgb(0 0 0 / 4%) 0px 0px 6px;
  background-color: var(--td-bg-color-container);
  ::v-deep(.t-input-adornment) {
    flex: 1;
    max-width: 500px;
    border-radius: 100px;
    overflow: hidden;
    border: 1px solid var(--td-border-level-2-color);
    margin-right: 20px;
    .t-input-adornment__append,
    .t-input {
      border: none;
    }
    .t-input-adornment__append {
      border-left: 1px solid var(--td-border-level-2-color);
      cursor: pointer;
      padding: 0;
      .t-icon {
        font-size: 20px;
        padding: 0 12px;
        width: 100%;
        height: 100%;
      }
    }
    .t-input--focused {
      border: none;
      box-shadow: none;
    }
   
  }
  ::v-deep(.t-button) {
    transition: none;
  }
}
.project-desc {
  opacity: 0.5;
}
.setting-icon {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  cursor: pointer;
}
</style>
