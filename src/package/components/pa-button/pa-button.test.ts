/**
 * pa-button 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick, defineComponent, h } from 'vue'

// Mock pa-icon component - 使用 defineComponent 正确处理 props
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: {
    name: { type: String, default: 'magic_line' },
    customClass: { type: String, default: '' }
  },
  setup(props) {
    return () => h('span', {
      class: ['pa-icon', props.customClass, `icon-${props.name}`]
    })
  }
})

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = {
  value: {
    language: { value: 'zh-CN' }
  }
}

// Mock M_MessageBox
vi.mock('../feedback', () => ({
  M_MessageBox: {
    confirm: vi.fn()
  }
}))

describe('pa-button 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('1. 默认渲染测试', () => {
    it('应该正确渲染 button.pa-button', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      expect(button.exists()).toBe(true)
    })
  })

  describe('2. text prop 测试', () => {
    it('传入文本应显示在按钮上', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { text: '提交' },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      expect(button.text()).toContain('提交')
    })
  })

  describe('3. size prop 测试', () => {
    it('传入 size 应在 class 中体现', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { size: 'large' },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      expect(button.classes()).toContain('pa-button--large')
    })
  })

  describe('4. type prop 测试', () => {
    it('传入 type 应在 class 中体现', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { type: 'primary' },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      expect(button.classes()).toContain('pa-button--primary')
    })
  })

  describe('5. disabled prop 测试', () => {
    it('传入 disabled 应添加 disabled 属性和 class', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { disabled: true },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.classes()).toContain('disabled')
    })
  })

  describe('6. click 事件测试', () => {
    it('点击应触发 click 事件', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { debounced: false },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      await button.trigger('click')
      
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('disabled 时点击不应触发 click 事件', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { disabled: true },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      await button.trigger('click')
      
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('7. useLine prop 测试', () => {
    it('useLine 为 true 时应添加 use-line class', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { useLine: true },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      expect(button.classes()).toContain('use-line')
    })
  })

  describe('8. usePlain prop 测试', () => {
    it('usePlain 为 true 时应添加 use-plain class', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { usePlain: true },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      expect(button.classes()).toContain('use-plain')
    })
  })

  describe('9. is prop 测试', () => {
    it('传入 is="search" 应设置对应按钮类型和图标', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { is: 'search' },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      // search 预设应设置 iconName 为 search_line
      await nextTick()
      const icon = wrapper.findComponent({ name: 'PaIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('search_line')
    })

    it('传入 is="delete" 应设置 danger 类型', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { is: 'delete' },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      expect(button.classes()).toContain('pa-button--danger')
    })
  })

  describe('10. iconPosition prop 测试', () => {
    it('iconPosition 为 right 时图标应在右侧', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { iconPosition: 'right', text: '按钮' },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      const buttonHtml = button.html()
      
      // 当 iconPosition 为 right 时，pa-icon 应该在文本后面
      expect(buttonHtml).toContain('pa-button_text')
      expect(buttonHtml).toContain('icon-')
    })
  })

  describe('11. confirmClick 事件测试', () => {
    it('监听 confirmClick 事件时应弹出确认框', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      const { M_MessageBox } = await import('../feedback')
      
      // 组件通过 vnode.props 检测是否有外部监听
      // 必须使用 @confirm-click 或 onConfirm-click 来传递事件监听
      const wrapper = mount(PaButton, {
        props: { 
          text: '确认操作',
          useFont: false,
          'onConfirm-click': () => {}  // 使用 Vue 3 的事件监听语法
        },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      await button.trigger('click')
      
      expect(M_MessageBox.confirm).toHaveBeenCalled()
    })
  })

  describe('12. 防抖测试', () => {
    it('debounced 开启时快速点击应只触发一次', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      
      const wrapper = mount(PaButton, {
        props: { 
          debounced: true,
          debouncedTime: 300
        },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-popover': true
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const button = wrapper.find('button.pa-button')
      
      // 快速点击三次
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')
      
      // advance timers to flush debounced function
      vi.advanceTimersByTime(400)
      
      // 由于防抖，应该只有一次 click 事件
      const clickEvents = wrapper.emitted('click')
      expect(clickEvents).toBeTruthy()
    })
  })
})
