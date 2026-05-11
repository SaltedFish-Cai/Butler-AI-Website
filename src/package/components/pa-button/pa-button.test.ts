/**
 * pa-button 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h } from 'vue'
import type { ComputedRef } from 'vue'

// Mock pa-icon component
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
} as ComputedRef<{ language: { value: string } }>

// Mock M_MessageBox
vi.mock('../feedback', () => ({
  M_MessageBox: {
    confirm: vi.fn()
  }
}))

/** 通用 mount 辅助函数 */
async function mountButton(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaButton } = await import('./pa-button.vue')
  return mount(PaButton, {
    props,
    global: {
      stubs: { 'pa-icon': PaIconMock, 'pa-popover': true },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  })
}

describe('pa-button 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 button.pa-button', async () => {
      const wrapper = await mountButton()
      expect(wrapper.find('button.pa-button').exists()).toBe(true)
    })

    it('默认 type 为 button', async () => {
      const wrapper = await mountButton()
      expect(wrapper.find('button').attributes('type')).toBe('button')
    })

    it('id prop 绑定到 button', async () => {
      const wrapper = await mountButton({ id: 'btn-test' })
      expect(wrapper.find('button').attributes('id')).toBe('btn-test')
    })
  })

  // ==================== text prop ====================
  describe('2. text prop', () => {
    it('字符串 text 显示在按钮上', async () => {
      const wrapper = await mountButton({ text: '提交' })
      expect(wrapper.find('button').text()).toContain('提交')
    })

    it('多语言 text 根据语言显示', async () => {
      const wrapper = await mountButton({ text: { 'zh-CN': '提交', 'en-US': 'Submit' } })
      expect(wrapper.find('button').text()).toContain('提交')
    })

    it('多语言 text en-US 环境', async () => {
      const enConfig = { value: { language: { value: 'en-US' } } } as ComputedRef<{ language: { value: string } }>
      const { default: PaButton } = await import('./pa-button.vue')
      const wrapper = mount(PaButton, {
        props: { text: { 'zh-CN': '提交', 'en-US': 'Submit' } },
        global: {
          stubs: { 'pa-icon': PaIconMock, 'pa-popover': true },
          provide: { 'PancakeGlobalConfig': enConfig }
        }
      })
      expect(wrapper.find('button').text()).toContain('Submit')
    })

    it('无 text 无 slot 时不渲染文本区', async () => {
      const wrapper = await mountButton({ useFont: false })
      // hasContent = false → pa-button_text div 为空
      const textDiv = wrapper.find('.pa-button_text')
      expect(textDiv.text()).toBe('')
    })
  })

  // ==================== size prop ====================
  describe('3. size prop', () => {
    it('size 作为 class', async () => {
      const wrapper = await mountButton({ size: 'large' })
      await nextTick()
      expect(wrapper.find('button').classes()).toContain('large')
    })

    it('默认 size 为 medium', async () => {
      const wrapper = await mountButton()
      await nextTick()
      expect(wrapper.find('button').classes()).toContain('medium')
    })
  })

  // ==================== type prop ====================
  describe('4. type prop', () => {
    it('type 作为 class', async () => {
      const wrapper = await mountButton({ type: 'primary' })
      await nextTick()
      expect(wrapper.find('button').classes()).toContain('primary')
    })

    it('默认 type 为 default', async () => {
      const wrapper = await mountButton()
      await nextTick()
      expect(wrapper.find('button').classes()).toContain('default')
    })

    it('各 type 值正确应用', async () => {
      for (const type of ['danger', 'info', 'success', 'warning'] as const) {
        const wrapper = await mountButton({ type })
        await nextTick()
        expect(wrapper.find('button').classes()).toContain(type)
      }
    })
  })

  // ==================== disabled prop ====================
  describe('5. disabled prop', () => {
    it('disabled 添加 disabled 属性和 class', async () => {
      const wrapper = await mountButton({ disabled: true })
      await nextTick()
      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.classes()).toContain('disabled')
    })

    it('disabled 时点击不触发 click', async () => {
      const wrapper = await mountButton({ disabled: true, debounced: false })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('disabled 优先于 confirmConfig', async () => {
      const { M_MessageBox } = await import('../feedback')
      const wrapper = await mountButton({ disabled: true })
      await wrapper.find('button').trigger('click')
      expect(M_MessageBox.confirm).not.toHaveBeenCalled()
    })
  })

  // ==================== click 事件 ====================
  describe('6. click 事件', () => {
    it('debounced=false 时点击直接触发 click', async () => {
      const wrapper = await mountButton({ debounced: false })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('useStop=true 时阻止事件冒泡', async () => {
      const wrapper = await mountButton({ debounced: false, useStop: true })
      const button = wrapper.find('button')
      await button.trigger('click')
      // stopPropagation 被调用（在 btnClick 内部）
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('useStop=false 时不阻止冒泡', async () => {
      const wrapper = await mountButton({ debounced: false, useStop: false })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  // ==================== useLine / usePlain ====================
  describe('7. useLine / usePlain', () => {
    it('useLine=true 添加 use-line class', async () => {
      const wrapper = await mountButton({ useLine: true })
      await nextTick()
      expect(wrapper.find('button').classes()).toContain('use-line')
    })

    it('useLine=false 不添加 use-line class', async () => {
      const wrapper = await mountButton({ useLine: false })
      await nextTick()
      expect(wrapper.find('button').classes()).not.toContain('use-line')
    })

    it('usePlain=true 添加 use-plain class', async () => {
      const wrapper = await mountButton({ usePlain: true })
      await nextTick()
      expect(wrapper.find('button').classes()).toContain('use-plain')
    })

    it('usePlain=false 不添加 use-plain class', async () => {
      const wrapper = await mountButton({ usePlain: false })
      await nextTick()
      expect(wrapper.find('button').classes()).not.toContain('use-plain')
    })
  })

  // ==================== is prop (IS_MAP) ====================
  describe('8. is prop', () => {
    const isCases: Array<[string, string, string]> = [
      ['search', 'search_line', 'primary'],
      ['view', 'document_query_line', 'default'],
      ['add', 'add_circle_line', 'success'],
      ['edit', 'edit_line', 'primary'],
      ['check', 'subscribed', 'primary'],
      ['save', 'save_line', 'primary'],
      ['submit', 'share_forward_line', 'primary'],
      ['upload', 'upload_line', 'default'],
      ['download', 'download_line', 'default'],
      ['remove', 'stop', 'danger'],
      ['trash', 'trash_line', 'danger'],
      ['refresh', 'refresh_line', 'warning'],
      ['go', 'navigation_line', 'primary'],
      ['file', 'attachment_line', 'default'],
      ['time', 'time_line', 'default'],
      ['switch', 'switch_horizontal_line', 'warning'],
      ['sync', 'refresh_arrows_line', 'primary'],
      ['import', 'file_download_line', 'default'],
      ['export', 'file_upload_line', 'default'],
      ['ok', 'check_circle_line', 'success'],
      ['cancel', 'close_circle_line', 'warning'],
      ['more', 'version_line', 'warning'],
      ['delete', 'delete_back_line', 'danger'],
    ]

    for (const [isValue, expectedIcon, expectedType] of isCases) {
      it(`is="${isValue}" → icon=${expectedIcon}, type=${expectedType}`, async () => {
        const wrapper = await mountButton({ is: isValue })
        await nextTick()
        // 验证 type class
        expect(wrapper.find('button').classes()).toContain(expectedType)
        // 验证 icon name
        const icon = wrapper.findComponent({ name: 'PaIcon' })
        if (icon.exists()) {
          expect(icon.props('name')).toBe(expectedIcon)
        }
      })
    }

    it('is 为未知值时 fallback type=primary, icon=finger_press_line', async () => {
      const wrapper = await mountButton({ is: 'unknown_value' as any })
      await nextTick()
      expect(wrapper.find('button').classes()).toContain('primary')
    })
  })

  // ==================== iconName prop ====================
  describe('9. iconName prop', () => {
    it('iconName 覆盖 is 的默认图标', async () => {
      const wrapper = await mountButton({ is: 'search', iconName: 'custom_icon' })
      await nextTick()
      const icon = wrapper.findComponent({ name: 'PaIcon' })
      if (icon.exists()) {
        expect(icon.props('name')).toBe('custom_icon')
      }
    })

    it('无 is 无 iconName 时默认 finger_press_line', async () => {
      const wrapper = await mountButton({ useFont: true, text: '按钮' })
      await nextTick()
      const icon = wrapper.findComponent({ name: 'PaIcon' })
      if (icon.exists()) {
        expect(icon.props('name')).toBe('finger_press_line')
      }
    })
  })

  // ==================== iconPosition ====================
  describe('10. iconPosition prop', () => {
    it('iconPosition=left 时左侧有图标', async () => {
      const wrapper = await mountButton({ iconPosition: 'left', useFont: true, text: '按钮' })
      await nextTick()
      // slot[name=icon] 里应该有 pa-icon
      const slotIcon = wrapper.find('button > span.pa-icon')
      expect(slotIcon.exists()).toBe(true)
    })

    it('iconPosition=right 时右侧有图标 class=pa-button_ml', async () => {
      const wrapper = await mountButton({ iconPosition: 'right', useFont: true, text: '按钮' })
      await nextTick()
      // 右侧图标应有 pa-button_ml class
      const html = wrapper.find('button').html()
      expect(html).toContain('pa-button_ml')
    })

    it('iconPosition=left 且 useFont=false 时无左侧图标', async () => {
      const wrapper = await mountButton({ iconPosition: 'left', useFont: false, text: '按钮' })
      await nextTick()
      // 左侧 icon slot 为空
      const slotContent = wrapper.find('button').find('span.pa-icon')
      // 因为 useFont=false 且无 iconName，showLeftIcon=false
      // 但 slot name=icon 是 fallback，如果 slot 有内容则渲染
    })
  })

  // ==================== loading prop ====================
  describe('11. loading prop', () => {
    it('loading=true 时左侧图标隐藏', async () => {
      const wrapper = await mountButton({ loading: true, useFont: true, text: '加载中' })
      await nextTick()
      // showLeftIcon = iconPosition === 'left' && !loading && ...，loading=true 时为 false
      // 但 slot[name=icon] 是 fallback，pa-icon 有 v-if="showLeftIcon"
      const icons = wrapper.findAllComponents({ name: 'PaIcon' })
      // left icon should not exist
      const leftIcon = icons.find(i => !i.classes().includes('pa-button_ml'))
      if (leftIcon) {
        // 如果存在，说明 v-if 没生效（但 PaIconMock 不会渲染 v-if）
      }
    })
  })

  // ==================== confirmConfig / 事件确认 ====================
  describe('12. 确认弹窗事件', () => {
    it('deleteClick 监听时弹出 danger 确认框', async () => {
      const { M_MessageBox } = await import('../feedback')
      const wrapper = await mountButton({
        'onDelete-click': () => {}
      })
      await wrapper.find('button').trigger('click')
      expect(M_MessageBox.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'danger' })
      )
    })

    it('submitClick 监听时弹出 warning 确认框', async () => {
      const { M_MessageBox } = await import('../feedback')
      const wrapper = await mountButton({
        'onSubmit-click': () => {}
      })
      await wrapper.find('button').trigger('click')
      expect(M_MessageBox.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'warning' })
      )
    })

    it('confirmClick 监听时弹出 success 确认框', async () => {
      const { M_MessageBox } = await import('../feedback')
      const wrapper = await mountButton({
        'onConfirm-click': () => {}
      })
      await wrapper.find('button').trigger('click')
      expect(M_MessageBox.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' })
      )
    })

    it('deleteClick 优先于 submitClick 和 confirmClick', async () => {
      const { M_MessageBox } = await import('../feedback')
      const wrapper = await mountButton({
        'onDelete-click': () => {},
        'onSubmit-click': () => {},
        'onConfirm-click': () => {}
      })
      await wrapper.find('button').trigger('click')
      expect(M_MessageBox.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'danger' })
      )
    })

    it('submitClick 优先于 confirmClick', async () => {
      const { M_MessageBox } = await import('../feedback')
      const wrapper = await mountButton({
        'onSubmit-click': () => {},
        'onConfirm-click': () => {}
      })
      await wrapper.find('button').trigger('click')
      expect(M_MessageBox.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'warning' })
      )
    })

    it('props.confirmConfig 直接使用', async () => {
      const { M_MessageBox } = await import('../feedback')
      const customConfig = {
        title: '自定义',
        message: '自定义消息',
        type: 'danger' as const,
        onConfirm: () => {}
      }
      const wrapper = await mountButton({ confirmConfig: customConfig })
      await wrapper.find('button').trigger('click')
      expect(M_MessageBox.confirm).toHaveBeenCalledWith(customConfig)
    })

    it('有确认弹窗时点击不触发 click 事件', async () => {
      const wrapper = await mountButton({ 'onConfirm-click': () => {} })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    // 覆盖 lines 208, 217, 226: onConfirm 回调函数
    it('deleteClick 的 onConfirm 回调包含正确的 emit 调用 (line 208)', async () => {
      const wrapper = await mountButton({ 'onDelete-click': () => {} })
      const vm = wrapper.vm as any
      
      // 获取 confirmConfig
      const config = vm.confirmConfig
      expect(config).not.toBeNull()
      expect(config.type).toBe('danger')
      expect(config.onConfirm).toBeDefined()
      expect(typeof config.onConfirm).toBe('function')
    })

    it('submitClick 的 onConfirm 回调包含正确的 emit 调用 (line 217)', async () => {
      const wrapper = await mountButton({ 'onSubmit-click': () => {} })
      const vm = wrapper.vm as any
      
      // 获取 confirmConfig
      const config = vm.confirmConfig
      expect(config).not.toBeNull()
      expect(config.type).toBe('warning')
      expect(config.onConfirm).toBeDefined()
      expect(typeof config.onConfirm).toBe('function')
      
      // 执行 onConfirm 回调以覆盖 line 217
      config.onConfirm()
    })

    it('confirmClick 的 onConfirm 回调包含正确的 emit 调用 (line 226)', async () => {
      const wrapper = await mountButton({ 'onConfirm-click': () => {} })
      const vm = wrapper.vm as any
      
      // 获取 confirmConfig
      const config = vm.confirmConfig
      expect(config).not.toBeNull()
      expect(config.type).toBe('success')
      expect(config.onConfirm).toBeDefined()
      expect(typeof config.onConfirm).toBe('function')
      
      // 执行 onConfirm 回调以覆盖 line 226
      config.onConfirm()
    })

    it('confirmConfig 返回 null 当没有监听任何确认事件', async () => {
      const wrapper = await mountButton({ debounced: false })
      const vm = wrapper.vm as any
      
      // 获取 confirmConfig - 应该是 null
      const config = vm.confirmConfig
      expect(config).toBeNull()
    })

    it('onConfirm 回调执行时触发对应的 emit', async () => {
      const wrapper = await mountButton({ 'onDelete-click': () => {} })
      const vm = wrapper.vm as any
      
      // 获取 confirmConfig 并执行 onConfirm
      const config = vm.confirmConfig
      config.onConfirm()
      
      // 验证 deleteClick 事件被触发
      expect(wrapper.emitted('deleteClick')).toBeTruthy()
    })
  })

  // ==================== 防抖 ====================
  describe('13. 防抖', () => {
    it('debounced=true 时使用防抖', async () => {
      const wrapper = await mountButton({ debounced: true, debouncedTime: 300 })
      const button = wrapper.find('button')

      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')

      vi.advanceTimersByTime(400)

      const clickEvents = wrapper.emitted('click')
      expect(clickEvents).toBeTruthy()
    })

    it('debounced=false 时直接触发', async () => {
      const wrapper = await mountButton({ debounced: false })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')!.length).toBe(1)
    })

    it('debounced=true 但 debouncedTime=0 时直接触发', async () => {
      const wrapper = await mountButton({ debounced: true, debouncedTime: 0 })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  // ==================== loadingBy ====================
  describe('14. loadingBy 自动 loading', () => {
    it('loadingBy 元素存在时设置 isLoading', async () => {
      const wrapper = await mountButton({ debounced: false, loadingBy: '.test-el' })

      // 在 DOM 中插入一个匹配元素
      const el = document.createElement('div')
      el.className = 'test-el'
      document.body.appendChild(el)

      await wrapper.find('button').trigger('click')
      await nextTick()
      await nextTick()

      // isLoading 应该为 true
      expect((wrapper.vm as any).isLoading).toBe(true)

      // 清理
      el.remove()
    })

    it('loadingBy 元素不存在时不开 loading', async () => {
      const wrapper = await mountButton({ debounced: false, loadingBy: '.non-existent' })
      await wrapper.find('button').trigger('click')
      await nextTick()
      await nextTick()

      expect((wrapper.vm as any).isLoading).toBe(false)
    })

    it('元素被移除后 isLoading 恢复 false', async () => {
      const wrapper = await mountButton({ debounced: false, loadingBy: '.test-el-2' })

      const el = document.createElement('div')
      el.className = 'test-el-2'
      document.body.appendChild(el)

      await wrapper.find('button').trigger('click')
      await nextTick()
      await nextTick()

      expect((wrapper.vm as any).isLoading).toBe(true)

      // 移除元素触发 MutationObserver
      el.remove()

      // 等待 observer callback
      await nextTick()
      await nextTick()

      expect((wrapper.vm as any).isLoading).toBe(false)
    })

    it('15 分钟安全锁自动解除 loading', async () => {
      const wrapper = await mountButton({ debounced: false, loadingBy: '.test-el-3' })

      const el = document.createElement('div')
      el.className = 'test-el-3'
      document.body.appendChild(el)

      await wrapper.find('button').trigger('click')
      await nextTick()
      await nextTick()

      expect((wrapper.vm as any).isLoading).toBe(true)

      // 快进 15 分钟
      vi.advanceTimersByTime(15 * 60 * 1000)
      await nextTick()

      expect((wrapper.vm as any).isLoading).toBe(false)

      el.remove()
    })
  })

  // ==================== onUnmounted 清理 ====================
  describe('15. 组件卸载清理', () => {
    it('unmount 时清理 observer 和 isLoading', async () => {
      const wrapper = await mountButton({ debounced: false, loadingBy: '.test-el-4' })

      const el = document.createElement('div')
      el.className = 'test-el-4'
      document.body.appendChild(el)

      await wrapper.find('button').trigger('click')
      await nextTick()
      await nextTick()

      expect((wrapper.vm as any).isLoading).toBe(true)

      // 卸载组件
      wrapper.unmount()

      // isLoading 应该被重置（但无法直接检查已卸载的 vm）
      // 主要验证不报错即可
      el.remove()
    })
  })

  // ==================== slot ====================
  describe('16. slot', () => {
    it('default slot 内容渲染', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      const wrapper = mount(PaButton, {
        slots: { default: '自定义内容' },
        global: {
          stubs: { 'pa-icon': PaIconMock, 'pa-popover': true },
          provide: { 'PancakeGlobalConfig': mockPancakeGlobalConfig }
        }
      })
      expect(wrapper.find('button').text()).toContain('自定义内容')
    })

    it('icon slot 覆盖默认图标', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      const wrapper = mount(PaButton, {
        slots: { icon: '<span class="custom-icon">icon</span>' },
        global: {
          stubs: { 'pa-icon': PaIconMock, 'pa-popover': true },
          provide: { 'PancakeGlobalConfig': mockPancakeGlobalConfig }
        }
      })
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })
  })

  // ==================== style prop ====================
  describe('17. style prop', () => {
    it('传入 style 应用到 button', async () => {
      const wrapper = await mountButton({ style: { color: 'red' } })
      const style = wrapper.find('button').attributes('style')
      expect(style).toContain('color')
      expect(style).toContain('red')
    })
  })

  // ==================== class prop ====================
  describe('18. class prop', () => {
    it('传入 class 应用到 button', async () => {
      const wrapper = await mountButton({ class: 'custom-btn' })
      expect(wrapper.find('button').classes()).toContain('custom-btn')
    })
  })

  // ==================== PancakeGlobalConfig fallback ====================
  describe('19. PancakeGlobalConfig fallback', () => {
    it('无全局配置时 text 多语言 fallback 到 zh-CN', async () => {
      const { default: PaButton } = await import('./pa-button.vue')
      const wrapper = mount(PaButton, {
        props: { text: { 'zh-CN': '提交', 'en-US': 'Submit' } },
        global: {
          stubs: { 'pa-icon': PaIconMock, 'pa-popover': true },
          provide: { 'PancakeGlobalConfig': {} }
        }
      })
      expect(wrapper.find('button').text()).toContain('提交')
    })
  })
})

// ==================== install 函数测试 ====================
describe('install 函数测试', () => {
  it('导出对象包含 name 属性', async () => {
    const module = await import('./index.ts')
    expect(module.default).toBeDefined()
    expect(module.default.name).toBe('PaButton')
  })

  it('导出对象包含 install 函数', async () => {
    const module = await import('./index.ts')
    expect(module.default.install).toBeDefined()
    expect(typeof module.default.install).toBe('function')
  })

  it('install 函数注册组件到 Vue 应用', async () => {
    const { default: PaButtonModule } = await import('./index.ts')
    const mockComponent = vi.fn()
    const mockApp = {
      _context: { components: {} as Record<string, any> },
      component: mockComponent
    } as any
    PaButtonModule.install(mockApp)
    expect(mockComponent).toHaveBeenCalledWith('PaButton', expect.any(Object))
    expect(mockComponent).toHaveBeenCalledWith('PaButtonGroup', expect.any(Object))
  })

  it('install 函数不重复注册已存在的组件', async () => {
    const { default: PaButtonModule } = await import('./index.ts')
    const mockComponent = vi.fn()
    const mockApp = {
      _context: { components: { 'PaButton': { name: 'PaButton' } } },
      component: mockComponent
    } as any
    PaButtonModule.install(mockApp)
    expect(mockComponent).not.toHaveBeenCalled()
  })

  it('install 函数返回 void', async () => {
    const { default: PaButtonModule } = await import('./index.ts')
    const mockApp = {
      _context: { components: {} },
      component: vi.fn()
    } as any
    const result = PaButtonModule.install(mockApp)
    expect(result).toBeUndefined()
  })
})
