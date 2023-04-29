<template>
  <t-row :gutter="[16, 16]">
    <t-col :md="12" :lg="8">
      <div class="user-left-greeting">
        <div>
          Hi，{{ info.username }}
          <span class="regular">下午好，今天是你加入 ExileLine 的第 {{ joinDay }} 天～</span>
        </div>
        <img src="@/assets/new_logo.png" class="logo" />
      </div>

      <t-card class="user-info-list" title="个人信息" :bordered="false">
        <template #option>
          <t-button theme="default" shape="square" variant="text">
            <edit-icon size="18" />
          </t-button>
        </template>
        <t-row class="content" justify="space-between">
          <t-col
            v-for="(item, index) in USER_INFO_LIST"
            :key="index"
            class="contract"
            :span="item.span || 3"
          >
            <div class="contract-title">
              {{ item.title }}
            </div>
            <div class="contract-detail">
              {{ info[item.contentKey] || item.content }}
            </div>
          </t-col>
        </t-row>
      </t-card>
    </t-col>

    <t-col :md="12" :lg="4">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="90px">E</t-avatar>
        <div class="name">{{ info.nickname }}</div>
        <div class="position">总经办 CEO</div>
      </t-card>

      <t-card title="团队成员" class="user-team" :bordered="false">
        <template #option>
          <t-button theme="default" shape="square" variant="text">
            <edit-icon size="18" />
          </t-button>
        </template>
        <t-list :split="false">
          <t-list-item v-for="(item, index) in TEAM_MEMBERS" :key="index">
            <t-list-item-meta
              :image="item.avatar"
              :title="item.title"
              :description="item.description"
            />
          </t-list-item>
        </t-list>
      </t-card>
    </t-col>
  </t-row>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'

const store = useStore()
const info = computed(() => store.getters.info)

const joinDay = computed(() => {
  return dayjs().diff(info.value.create_timestamp * 1000, 'd')
})

const USER_INFO_LIST = [
  {
    title: '手机',
    contentKey: 'phone',
  },
  {
    title: '工号',
    contentKey: 'code',
  },
  {
    title: '邮箱',
    contentKey: 'mail',
  },
  {
    title: '座位',
    contentKey: 'seat',
  },
  {
    title: '管理主体',
    contentKey: 'department',
  },
  {
    title: '直属上级',
    contentKey: 'superior',
  },
  {
    title: '职位',
    contentKey: 'position',
  },
  {
    title: '入职时间',
    contentKey: 'create_time',
  },
  // {
  //   title: '所属团队',
  //   content: '腾讯/腾讯公司/某事业群/某产品部/某运营中心/商户服务组',
  //   span: 6,
  // },
]

const TEAM_MEMBERS = [
  {
    avatar: 'https://avatars.githubusercontent.com/Wen1kang',
    title: 'YangYueXiong',
    description: '设计者;开发者',
  },
  {
    avatar: 'https://avatars.githubusercontent.com/pengYYYYY',
    title: 'GATING ',
    description: '开发者',
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/24469546?s=96&v=4',
    title: 'yugijiudai',
    description: '开发者',
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/88708072?s=96&v=4',
    title: 'miterwan',
    description: '开发者',
  },
]
</script>

<style lang="scss" scoped>
.user-left-greeting {
  padding: 28px 32px;
  line-height: 28px;
  font-size: 20px;
  background: var(--td-bg-color-container);
  color: var(--td-text-color-primary);
  text-align: left;
  border-radius: var(--td-radius-default);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .regular {
    margin-right: 15px;
    font-size: 14px;
  }

  .logo {
    width: 50px;
  }
}

.user-info-list {
  margin-top: 16px;

  .content {
    width: 90%;
  }

  .contract {
    width: 340px;
    height: 88px;
    border-radius: var(--td-radius-default);
    margin: 8px 0;

    &-title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 24px;
      margin: 20px 0 6px;
      font-size: 14px;
      color: var(--td-text-color-placeholder);
    }

    &-detail {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 40px;
      font-size: 14px;
      color: var(--td-text-color-secondary);
    }
  }

  .contract:last-child {
    margin-bottom: 0;
  }
}

.user-intro {
  padding: 32px 24px;
  background: var(--td-brand-color);
  border-radius: var(--td-radius-default);
  color: var(--td-text-color-primary);

  .name {
    line-height: 37px;
    font-size: 20px;
    margin-top: 36px;
    color: #fff;
  }

  .position {
    line-height: 24px;
    font-size: 14px;
    margin-top: 8px;
    color: #fff;
  }

  .user-info {
    line-height: 24px;
    font-size: 14px;
    color: var(--td-text-color-primary);

    .hiredate,
    .del,
    .mail {
      display: flex;
    }

    .t-icon {
      height: 24px;
      margin-right: 8px;
    }

    .del {
      margin: 16px 0;
    }
  }
}

.product-container {
  margin-top: 16px;
  border-radius: var(--td-radius-default);

  .content {
    width: 100%;
    margin: 24px 0 12px;
  }

  .logo {
    width: 48px;
  }
}

.content-container {
  margin-top: 16px;
  background: var(--td-bg-color-container);
  border-radius: var(--td-radius-default);
}

.user-team {
  margin-top: 16px;

  .t-list-item {
    padding: 15px 0;

    .t-list-item__meta-avatar {
      height: 50px;
      width: 50px;
      margin: 0 24px 0 0;
    }

    .t-list-item__meta-description {
      display: inline-block;
      color: rgb(0 0 0 / 40%);
      font-size: 14px;
    }
  }
}
</style>
