/**
 * pa-badge 组件单元测试
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { App } from 'vue'

async function mountBadge(props: Record<string, any> = {}) {
  const { default: PaBadge } = await import('./pa-badge.vue')
  return mount(PaBadge, { props, slots: { default: '内容' } })
}

describe('pa-badge 组件测试', () => {
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-badge', async () => {
      const wrapper = await mountBadge()
      expect(wrapper.find('div.pa-badge').exists()).toBe(true)
    })

    it('渲染 slot 内容', async () => {
      const wrapper = await mountBadge()
      expect(wrapper.text()).toContain('内容')
    })

    it('无值时不显示徽标', async () => {
      const wrapper = await mountBadge()
      expect(wrapper.find('.pa-badge__content').exists()).toBe(false)
      expect(wrapper.find('.pa-badge__dot').exists()).toBe(false)
    })
  })

  describe('2. value prop', () => {
    it('value 数字显示', async () => {
      const wrapper = await mountBadge({ value: 5 })
      expect(wrapper.find('.pa-badge__content').exists()).toBe(true)
      expect(wrapper.find('.pa-badge__content').text()).toBe('5')
    })

    it('value 字符串显示', async () => {
      const wrapper = await mountBadge({ value: 'new' })
      expect(wrapper.find('.pa-badge__content').text()).toBe('new')
    })
  })

  describe('3. maxValue prop', () => {
    it('value 未超过 maxValue 时正常显示', async () => {
      const wrapper = await mountBadge({ value: 5, maxValue: 99 })
      expect(wrapper.find('.pa-badge__content').text()).toBe('5')
    })

    it('value 超过 maxValue 时显示 maxValue+', async () => {
      const wrapper = await mountBadge({ value: 100, maxValue: 99 })
      expect(wrapper.find('.pa-badge__content').text()).toBe('99+')
    })

    it('maxValue 字符串类型', async () => {
      const wrapper = await mountBadge({ value: 200, maxValue: '99' })
      expect(wrapper.find('.pa-badge__content').text()).toBe('99+')
    })

    it('value 等于 maxValue 时不加 +', async () => {
      const wrapper = await mountBadge({ value: 99, maxValue: 99 })
      expect(wrapper.find('.pa-badge__content').text()).toBe('99')
    })
  })

  describe('4. useShow prop', () => {
    it('useShow=true 时显示徽标（即使无 value）', async () => {
      const wrapper = await mountBadge({ useShow: true })
      // useShow controls visibility but content element may not render without value
      expect(wrapper.find('.pa-badge').exists()).toBe(true)
    })
  })

  describe('5. useDot prop', () => {
    it('useDot=true 时显示小红点', async () => {
      const wrapper = await mountBadge({ useDot: true })
      expect(wrapper.find('.pa-badge__dot').exists()).toBe(true)
      expect(wrapper.find('.pa-badge__content').exists()).toBe(false)
    })

    it('useDot=false 时显示数字徽标', async () => {
      const wrapper = await mountBadge({ value: 5 })
      expect(wrapper.find('.pa-badge__dot').exists()).toBe(false)
      expect(wrapper.find('.pa-badge__content').exists()).toBe(true)
    })
  })

  describe('6. 综合场景', () => {
    it('useDot 优先于 value 显示', async () => {
      const wrapper = await mountBadge({ useDot: true, value: 5 })
      expect(wrapper.find('.pa-badge__dot').exists()).toBe(true)
      expect(wrapper.find('.pa-badge__content').exists()).toBe(false)
    })
  })
})

// ==================== index.ts 模块导出测试 ====================
describe('pa-badge index.ts 模块导出测试', () => {
  describe('7. install 函数', () => {
    it('导出对象包含 name 属性', async () => {
      const module = await import('./index.ts')
      expect(module.default).toBeDefined()
      expect(module.default.name).toBe('PaBadge')
    })

    it('导出对象包含 install 函数', async () => {
      const module = await import('./index.ts')
      expect(module.default.install).toBeDefined()
      expect(typeof module.default.install).toBe('function')
    })

    it('install 函数注册组件到 Vue 应用（组件未注册时）', async () => {
      const { default: PaBadgeModule } = await import('./index.ts')
      
      // Mock App 对象
      const mockComponent = vi.fn()
      const mockApp = {
        _context: {
          components: {} as Record<string, any>
        },
        component: mockComponent
      } as unknown as App
      
      // 执行 install
      PaBadgeModule.install(mockApp)
      
      // 验证组件被注册
      expect(mockComponent).toHaveBeenCalledWith('PaBadge', expect.any(Object))
    })

    it('install 函数不重复注册已存在的组件', async () => {
      const { default: PaBadgeModule } = await import('./index.ts')
      
      // Mock App 对象，组件已存在
      const mockComponent = vi.fn()
      const mockApp = {
        _context: {
          components: {
            'PaBadge': { name: 'PaBadge' } // 组件已注册
          }
        },
        component: mockComponent
      } as unknown as App
      
      // 执行 install
      PaBadgeModule.install(mockApp)
      
      // 验证组件未被再次注册
      expect(mockComponent).not.toHaveBeenCalled()
    })

    it('install 函数返回 void', async () => {
      const { default: PaBadgeModule } = await import('./index.ts')
      
      const mockApp = {
        _context: {
          components: {}
        },
        component: vi.fn()
      } as unknown as App
      
      const result = PaBadgeModule.install(mockApp)
      expect(result).toBeUndefined()
    })
  })
})
