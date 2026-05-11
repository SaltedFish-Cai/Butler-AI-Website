/**
 * pa-overlay 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, ref } from 'vue'

// Mock getPaAnagerGlobalZIndex
const mockGetPaAnagerGlobalZIndex = vi.fn(() => 1000)

/** 通用 mount 辅助函数 */
async function mountOverlay(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaOverlay } = await import('./pa-overlay.vue')
  return mount(PaOverlay, {
    props,
    global: {
      stubs: {
        teleport: {
          template: '<div class="teleported"><slot /></div>',
          props: ['to']
        }
      },
      provide: {
        'getPaAnagerGlobalZIndex': mockGetPaAnagerGlobalZIndex,
        ...provideOverride
      }
    }
  })
}

describe('pa-overlay 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-overlay', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      expect(wrapper.find('div.pa-overlay').exists()).toBe(true)
    })

    it('默认 useBlock 为 true', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      expect(wrapper.props('useBlock')).toBe(true)
    })
  })

  // ==================== v-model ====================
  describe('2. v-model 双向绑定', () => {
    it('modelValue=true 时 state.visible 为 true', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      expect(wrapper.vm.state.visible).toBe(true)
    })

    it('modelValue=false 时 state.visible 为 false', async () => {
      const wrapper = await mountOverlay({ modelValue: false })
      expect(wrapper.vm.state.visible).toBe(false)
    })

    it('modelValue 变化时 state.visible 同步更新', async () => {
      const wrapper = await mountOverlay({ modelValue: false })
      await wrapper.setProps({ modelValue: true })
      expect(wrapper.vm.state.visible).toBe(true)
    })
  })

  // ==================== class/style prop ====================
  describe('3. class/style prop', () => {
    it('自定义 class 应用', async () => {
      const wrapper = await mountOverlay({ modelValue: true, class: 'custom-class' })
      expect(wrapper.find('.pa-overlay').classes()).toContain('custom-class')
    })

    it('自定义 style 应用', async () => {
      const wrapper = await mountOverlay({ modelValue: true, style: { color: 'red' } })
      const style = wrapper.find('.pa-overlay').attributes('style')
      expect(style).toContain('color')
      expect(style).toContain('red')
    })

    it('zIndex 应用到 overlay', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      const style = wrapper.find('.pa-overlay').attributes('style')
      // style 属性会被转换为 CSS 格式 (z-index: 1000;)
      expect(style).toContain('z-index')
      expect(style).toContain('1000')
    })
  })

  // ==================== closeOverlay 事件 ====================
  describe('4. closeOverlay 点击遮罩层', () => {
    it('点击遮罩层触发 clickOverlay 事件', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      await wrapper.find('.pa-overlay-content').trigger('click')
      expect(wrapper.emitted('clickOverlay')).toBeTruthy()
    })

    it('点击遮罩层触发 update:modelValue 事件', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      await wrapper.find('.pa-overlay-content').trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })
  })

  // ==================== defineExpose ====================
  describe('5. defineExpose', () => {
    it('暴露 closeMenu 方法', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      expect(typeof wrapper.vm.closeMenu).toBe('function')
    })

    it('closeMenu 方法触发 update:modelValue(false)', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      wrapper.vm.closeMenu()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })
  })

  // ==================== teleportTo prop ====================
  describe('6. teleportTo prop', () => {
    it('teleport 组件正确渲染', async () => {
      const wrapper = await mountOverlay({ modelValue: true })
      expect(wrapper.find('.teleported').exists()).toBe(true)
    })
  })

  // ==================== transition ====================
  describe('7. transition', () => {
    it('v-show 控制显示隐藏', async () => {
      const wrapper1 = await mountOverlay({ modelValue: true })
      // visible=true 时 state.visible 为 true
      expect(wrapper1.vm.state.visible).toBe(true)

      const wrapper2 = await mountOverlay({ modelValue: false })
      // visible=false 时 state.visible 为 false
      expect(wrapper2.vm.state.visible).toBe(false)
    })
  })
})
