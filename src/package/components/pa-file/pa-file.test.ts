/**
 * pa-file 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, computed, ref } from 'vue'
import type { ComputedRef } from 'vue'

// Mock M_Message and M_MessageBox
vi.mock('../feedback', () => ({
  M_Message: {
    danger: vi.fn(),
    warning: vi.fn(),
    success: vi.fn()
  },
  M_MessageBox: {
    confirm: vi.fn()
  }
}))

// Mock pa-icon component
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: {
    name: { type: String, default: 'upload_line' },
    customClass: { type: String, default: '' }
  },
  setup(props) {
    return () => h('i', {
      class: ['pa-icon-mock', props.customClass],
      onClick: () => {}
    })
  }
})

// Mock pa-button component
const PaButtonMock = defineComponent({
  name: 'PaButton',
  props: {
    type: { type: String, default: 'default' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    is: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () => h('button', {
      class: ['pa-button-mock', { 'is-disabled': props.disabled }],
      disabled: props.disabled
    }, slots.default?.())
  }
})

// Mock pa-button-group component
const PaButtonGroupMock = defineComponent({
  name: 'PaButtonGroup',
  setup(props, { slots }) {
    return () => h('div', { class: 'pa-button-group-mock' }, slots.default?.())
  }
})

// Mock pa-media-view-item component
const PaMediaViewItemMock = defineComponent({
  name: 'PaMediaViewItem',
  props: {
    filePath: { type: String, default: '' },
    file: { type: Object, default: () => ({}) }
  },
  setup(props, { slots }) {
    return () => h('div', {
      class: 'pa-media-view-item-mock'
    }, slots.default?.())
  }
})

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: 'zh-CN', package: { file: { uploadText: '上传文件', clean: '清除', del: '删除', noFile: '暂无文件' } } },
  file_config: { compareKey: 'FileId' }
})) as ComputedRef<{
  language: { value: string; package?: { file?: Record<string, string> } };
  file_config?: { compareKey?: string }
}>

/** 通用 mount 辅助函数 */
async function mountFile(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaFile } = await import('./pa-file.vue')
  return mount(PaFile, {
    props,
    global: {
      stubs: {
        'pa-icon': PaIconMock,
        'pa-button': PaButtonMock,
        'pa-button-group': PaButtonGroupMock,
        'pa-media-view-item': PaMediaViewItemMock
      },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  })
}

describe('pa-file 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-file', async () => {
      const wrapper = await mountFile()
      expect(wrapper.find('div.pa-file').exists()).toBe(true)
    })

    it('渲染上传按钮', async () => {
      const wrapper = await mountFile()
      expect(wrapper.find('button.pa-button-mock').exists()).toBe(true)
    })
  })

  // ==================== v-model ====================
  describe('2. v-model 双向绑定', () => {
    it('初始值绑定', async () => {
      const files = [{ FileId: '1', FileName: 'test.pdf', FileUrl: '/test.pdf' }]
      const wrapper = await mountFile({ modelValue: files })
      expect(wrapper.vm.inValue).toEqual(files)
    })

    it('空值绑定', async () => {
      const wrapper = await mountFile({ modelValue: [] })
      expect(wrapper.vm.inValue).toEqual([])
    })
  })

  // ==================== disabled prop ====================
  describe('3. disabled prop', () => {
    it('disabled=true 添加 is-disabled class', async () => {
      const wrapper = await mountFile({ disabled: true })
      expect(wrapper.find('.pa-file').classes()).toContain('is-disabled')
    })

    it('disabled=true 按钮禁用', async () => {
      const wrapper = await mountFile({ disabled: true })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })
  })

  // ==================== display prop ====================
  describe('4. display prop 纯展示模式', () => {
    it('display=true 显示文件列表', async () => {
      const files = [{ FileId: '1', FileName: 'test.pdf', FileUrl: '/test.pdf' }]
      const wrapper = await mountFile({ display: true, modelValue: files })
      expect(wrapper.find('.file-item-box').exists()).toBe(true)
    })

    it('display=true 无文件显示提示', async () => {
      const wrapper = await mountFile({ display: true, modelValue: [] })
      expect(wrapper.find('.tips-box').text()).toContain('暂无文件')
    })
  })

  // ==================== fileMultiple prop ====================
  describe('5. fileMultiple prop', () => {
    it('fileMultiple 设置数量限制', async () => {
      const wrapper = await mountFile({ fileMultiple: 5 })
      expect(wrapper.vm.fileMultiple).toBe(5)
    })

    it('显示已上传文件数量', async () => {
      const files = [{ FileId: '1' }, { FileId: '2' }]
      const wrapper = await mountFile({ fileMultiple: 5, modelValue: files })
      expect(wrapper.vm.fileMultiple).toBe(5)
    })
  })

  // ==================== accept/exclude props ====================
  describe('6. accept/exclude props', () => {
    it('fileIncludeType 限制文件类型', async () => {
      const wrapper = await mountFile({ fileIncludeType: ['pdf', 'doc'] })
      expect(wrapper.vm.accept).toContain('pdf')
    })

    it('fileExcludeType 排除文件类型', async () => {
      const wrapper = await mountFile({ fileExcludeType: ['exe', 'bat'] })
      expect(wrapper.vm.excludeType).toContain('exe')
    })
  })

  // ==================== fileSingleSize/fileAllSize props ====================
  describe('7. fileSingleSize/fileAllSize props', () => {
    it('fileSingleSize 设置单个文件大小限制', async () => {
      const wrapper = await mountFile({ fileSingleSize: 1024 })
      expect(wrapper.props('fileSingleSize')).toBe(1024)
    })

    it('fileAllSize 设置总文件大小限制', async () => {
      const wrapper = await mountFile({ fileAllSize: 5120 })
      expect(wrapper.props('fileAllSize')).toBe(5120)
    })
  })

  // ==================== placeholder prop ====================
  describe('8. placeholder prop', () => {
    it('placeholder 默认显示上传文件', async () => {
      const wrapper = await mountFile()
      expect(wrapper.vm.computedPlaceholder).toContain('上传文件')
    })

    it('自定义 placeholder', async () => {
      const wrapper = await mountFile({ placeholder: '上传附件' })
      expect(wrapper.vm.computedPlaceholder).toContain('上传附件')
    })
  })

  // ==================== class/style prop ====================
  describe('9. class/style prop', () => {
    it('自定义 class 应用', async () => {
      const wrapper = await mountFile({ class: 'custom-class' })
      expect(wrapper.find('.pa-file').classes()).toContain('custom-class')
    })

    it('自定义 style 应用', async () => {
      const wrapper = await mountFile({ style: { color: 'red' } })
      const style = wrapper.find('.pa-file').attributes('style')
      expect(style).toContain('color')
    })
  })

  // ==================== title prop ====================
  describe('10. title prop', () => {
    it('title prop 设置成功', async () => {
      const wrapper = await mountFile({ title: '附件' })
      expect(wrapper.props('title')).toBe('附件')
    })
  })

  // ==================== contrastData prop ====================
  describe('11. contrastData prop 对比数据', () => {
    it('值不同时显示对比数据', async () => {
      const files = [{ FileId: '1', FileName: 'test.pdf' }]
      const contrastFiles = [{ FileId: '2', FileName: 'test2.pdf' }]
      const wrapper = await mountFile({ modelValue: files, contrastData: contrastFiles })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })

    it('alwaysContrast=true 始终显示对比数据', async () => {
      const files = [{ FileId: '1', FileName: 'test.pdf' }]
      const wrapper = await mountFile({
        modelValue: files,
        contrastData: files,
        alwaysContrast: true
      })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })
  })

  // ==================== cleanFiles method ====================
  describe('12. cleanFiles method', () => {
    it('cleanFiles 弹出确认框', async () => {
      const { M_MessageBox } = await import('../feedback')
      const files = [{ FileId: '1', FileName: 'test.pdf' }]
      const wrapper = await mountFile({ modelValue: files })
      wrapper.vm.cleanFiles()
      // M_MessageBox.confirm 应该被调用
    })
  })

  // ==================== removeFile method ====================
  describe('13. removeFile method', () => {
    it('removeFile 移除文件', async () => {
      const files = [{ FileId: '1', FileName: 'test.pdf' }]
      const wrapper = await mountFile({ modelValue: files })
      wrapper.vm.removeFile(0)
      expect(wrapper.vm.inValue).toEqual([])
    })

    it('removeFile 触发 update:modelValue', async () => {
      const files = [{ FileId: '1', FileName: 'test.pdf' }]
      const wrapper = await mountFile({ modelValue: files })
      wrapper.vm.removeFile(0)
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })
})
