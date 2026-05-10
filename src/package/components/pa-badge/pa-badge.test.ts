/**
 * pa-badge 组件单元测试
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

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
      expect(wrapper.find('.pa-badge__content').exists()).toBe(true)
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
