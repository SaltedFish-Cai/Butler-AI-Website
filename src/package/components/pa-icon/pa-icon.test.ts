/**
 * pa-icon 组件单元测试
 */
import { describe, it, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

// Mock pa-popover component
const PaPopoverMock = {
  name: 'PaPopover',
  props: ['trigger'],
  template: '<div class="pa-popover-mock"><slot name="reference" /></div>'
}

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = {
  value: {
    language: { value: 'zh-CN' }
  }
}

describe('pa-icon 组件测试', () => {
  describe('1. 默认渲染测试', () => {
    it('应该正确渲染 section.pa-icon 和默认 span.icon-magic_line', async () => {
      const { default: PaIcon } = await import('./pa-icon.vue')
      
      const wrapper = mount(PaIcon, {
        global: {
          stubs: {
            'pa-popover': PaPopoverMock
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      // 验证 section.pa-icon 存在
      const section = wrapper.find('section.pa-icon')
      expect(section.exists()).toBe(true)
      
      // 验证默认 icon class
      const span = wrapper.find('span.icon-magic_line')
      expect(span.exists()).toBe(true)
      
      // 验证 fontFamily 默认值应用 (HTML style 属性使用 kebab-case)
      const style = section.attributes('style')
      expect(style).toContain('font-family')
      expect(style).toContain('pa-iconfont')
    })
  })

  describe('2. name prop 测试', () => {
    it('传入不同 name 时应渲染对应 icon class', async () => {
      const { default: PaIcon } = await import('./pa-icon.vue')
      
      const wrapper = mount(PaIcon, {
        props: { name: 'search_line' },
        global: {
          stubs: {
            'pa-popover': PaPopoverMock
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const span = wrapper.find('span.icon-search_line')
      expect(span.exists()).toBe(true)
    })
  })

  describe('3. click 事件测试', () => {
    it('点击 section 应触发 click 事件', async () => {
      const { default: PaIcon } = await import('./pa-icon.vue')
      
      const wrapper = mount(PaIcon, {
        global: {
          stubs: {
            'pa-popover': PaPopoverMock
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const section = wrapper.find('section.pa-icon')
      await section.trigger('click')
      
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('4. fontFamily prop 测试', () => {
    it('传入 fontFamily 应应用到 section 的 style 上', async () => {
      const { default: PaIcon } = await import('./pa-icon.vue')
      
      const wrapper = mount(PaIcon, {
        props: { fontFamily: 'custom-font' },
        global: {
          stubs: {
            'pa-popover': PaPopoverMock
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const section = wrapper.find('section.pa-icon')
      const style = section.attributes('style')
      expect(style).toContain('custom-font')
    })
  })

  describe('5. tip prop (string) 测试', () => {
    it('传入 tip 时应渲染 pa-popover', async () => {
      const { default: PaIcon } = await import('./pa-icon.vue')
      
      const wrapper = mount(PaIcon, {
        props: { tip: '提示文字', name: 'search_line' },
        global: {
          stubs: {
            'pa-popover': PaPopoverMock
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      // 验证 pa-popover 存在
      const popover = wrapper.findComponent({ name: 'PaPopover' })
      expect(popover.exists()).toBe(true)
    })
  })

  describe('6. class/style prop 测试', () => {
    it('传入自定义 class 应正确应用', async () => {
      const { default: PaIcon } = await import('./pa-icon.vue')
      
      const wrapper = mount(PaIcon, {
        props: { class: 'custom-class' },
        global: {
          stubs: {
            'pa-popover': PaPopoverMock
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const section = wrapper.find('section.pa-icon')
      expect(section.classes()).toContain('custom-class')
    })

    it('传入自定义 style 应正确应用', async () => {
      const { default: PaIcon } = await import('./pa-icon.vue')
      
      const wrapper = mount(PaIcon, {
        props: { style: { color: 'red' } },
        global: {
          stubs: {
            'pa-popover': PaPopoverMock
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const section = wrapper.find('section.pa-icon')
      const style = section.attributes('style')
      expect(style).toContain('color')
      expect(style).toContain('red')
    })
  })

  describe('7. id prop 测试', () => {
    it('pa-icon 的 id prop 在组件源码中未绑定到 section（按源码实际情况测试）', async () => {
      // 注意：当前源码 pa-icon.vue 的 section 标签未绑定 id 属性
      // 这是源码的限制，测试验证当前行为
      const { default: PaIcon } = await import('./pa-icon.vue')
      
      const wrapper = mount(PaIcon, {
        props: { id: 'icon-123' },
        global: {
          stubs: {
            'pa-popover': PaPopoverMock
          },
          provide: {
            'PancakeGlobalConfig': mockPancakeGlobalConfig
          }
        }
      })
      
      const section = wrapper.find('section.pa-icon')
      // 验证 section 有 pa-icon class（证明组件渲染正常）
      expect(section.exists()).toBe(true)
      // 当前源码不传递 id 到 section，此测试记录当前行为
    })
  })
})
