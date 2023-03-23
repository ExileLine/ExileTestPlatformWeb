import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { prefix } from '@/config/global'
import pgk from '../../../package.json'
import MenuContent from './MenuContent'
import { getActive, pageRoutes } from '@/router'
import { MIN_POINT } from '@/config/global'

const useComputed = props => {
  const active = computed(() => getActive())

  const sideNavCls = computed(() => {
    const { isCompact } = props
    return [
      `${prefix}-sidebar-layout`,
      {
        [`${prefix}-sidebar-compact`]: isCompact,
      },
    ]
  })

  const menuCls = computed(() => {
    const { showLogo, isFixed, layout } = props
    return [
      `${prefix}-side-nav`,
      {
        [`${prefix}-side-nav-no-logo`]: !showLogo,
        [`${prefix}-side-nav-no-fixed`]: !isFixed,
        [`${prefix}-side-nav-mix-fixed`]: layout === 'mix' && isFixed,
      },
    ]
  })

  const layoutCls = computed(() => {
    const { layout } = props
    return [`${prefix}-side-nav-${layout}`, `${prefix}-sidebar-layout`]
  })

  return {
    active,
    sideNavCls,
    menuCls,
    layoutCls,
    menu: pageRoutes,
  }
}

export default defineComponent({
  name: 'SideNav',
  components: {
    MenuContent,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
    isFixed: {
      type: Boolean,
      default: true,
    },
    layout: {
      type: String,
      default: '',
    },
    headerHeight: {
      type: String,
      default: '64px',
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const router = useRouter()
    const changeCollapsed = () => {
      emit('update:collapsed', props.collapse)
    }
    const store = useStore()

    const theme = computed(() => store.getters.theme)

    const autoCollapsed = () => {
      const isCompact = window.innerWidth <= MIN_POINT
      emit('update:collapsed', isCompact)
      store.commit('app/setMobile', isCompact)
    }

    onMounted(() => {
      autoCollapsed()
      window.onresize = () => {
        autoCollapsed()
      }
    })

    const goHome = () => {
      router.push('/dashboard/base')
    }

    return {
      prefix,
      theme,
      ...useComputed(props),
      autoCollapsed,
      changeCollapsed,
      goHome,
    }
  },
  render() {
    return (
      <div class={this.sideNavCls}>
        <t-menu
          class={this.menuCls}
          theme={this.theme}
          value={this.active}
          collapsed={this.collapsed}
          v-slots={{
            operations: () => (
              <span class="version-container">
                {!this.collapsed && pgk.name} {pgk.version}
              </span>
            ),
          }}
        >
          <menu-content navData={this.menu} />
        </t-menu>
        <div class={`${prefix}-side-nav-placeholder${this.collapsed ? '-hidden' : ''}`}></div>
      </div>
    )
  },
})
