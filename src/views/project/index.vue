<template>
  <div class="root">
    <head-part v-model:collapsed="collapsed" />
    <div id="layout">
      <div class="content-box">
        <div class="main-box">
          <div id="project-search-container" class="plr-30 ptb-20">
            <div class="flex-between">
              <t-input-adornment :append="renderSearchIcon">
                <t-input clearable placeholder="请输入项目名称" size="large" />
              </t-input-adornment>
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
          <div class="p-20">
            <t-row :gutter="20">
              <t-col
                v-bind="colSpan"
                v-for="project in projectList"
                :key="project.id"
                class="mb-20 pointer"
              >
                <t-card shadow>
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
                      <t-icon name="setting" size="30px" class="setting-icon" />
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

            <t-divider>已经到底了</t-divider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { map, range } from 'lodash'
// search
import { SearchIcon, AddIcon } from 'tdesign-icons-vue-next'
import HeadPart from '@/layout/components/HeadPart.vue'
import projectIcon from '@/assets/project-icon.png'
const projectList = map(range(10), id => ({
  id,
  create_time: '2022-06-27 14:02:18',
  create_timestamp: 1656309738,
  creator: 'shell',
  creator_id: 999999,
  is_deleted: 0,
  modifier: null,
  modifier_id: null,
  project_name:
    '初始化项目脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成',
  remark:
    '脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成脚本生成',
  status: 1,
  update_time: '2022-06-27 14:02:18',
  update_timestamp: null
}))

const colSpan = {
  xxl: 2,
  xl: 3,
  sm: 4,
  xs: 12
}

const renderSearchIcon = () => <SearchIcon onClick={() => console.log(123)} />
const renderAddBtnIcon = () => <AddIcon />

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
    }
    .t-input--focused {
      border: none;
      box-shadow: none;
    }
    .t-input {
      transition: none;
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
