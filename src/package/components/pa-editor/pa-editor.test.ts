/**
 * pa-editor 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, ref } from 'vue'

// Mock prettier
vi.mock('prettier/standalone', () => ({}))
vi.mock('prettier/parser-html', () => ({}))

// Mock highlight.js
vi.mock('highlight.js', () => ({
  default: {
    highlight: vi.fn(() => ({ value: 'highlighted code' }))
  }
}))

// Mock lodash
vi.mock('lodash', () => ({
  default: {
    debounce: vi.fn((fn) => {
      const debounced = (...args) => fn(...args)
      debounced.cancel = vi.fn()
      return debounced
    })
  }
}))

// Mock randChar
vi.mock('../tools/rand-char', () => ({
  randChar: () => 'test123'
}))

// Mock PaScrollbar
const PaScrollbarMock = defineComponent({
  name: 'PaScrollbar',
  props: {
    useShadow: { type: Boolean, default: false },
    useScrollX: { type: Boolean, default: true },
    contentStyle: { type: Object, default: () => ({}) }
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'pa-scrollbar-mock' }, slots.default?.())
  }
})

// Mock PaSwitch
const PaSwitchMock = defineComponent({
  name: 'PaSwitch',
  props: {
    modelValue: { type: Boolean, default: false },
    activeText: { type: String, default: '' },
    inActiveText: { type: String, default: '' },
    activeIcon: { type: String, default: '' },
    inActiveIcon: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () => h('div', {
      class: 'pa-switch-mock',
      onClick: () => emit('update:modelValue', !props.modelValue)
    })
  }
})

// Mock m-editor-tools
const MEditorToolsMock = defineComponent({
  name: 'MEditorTools',
  props: {
    isSourceCodeMode: { type: String, default: 'edit' }
  },
  emits: ['popver-change', 'source-code-mode-change'],
  setup(props, { slots }) {
    return () => h('div', { class: 'm-editor-tools-mock' }, slots.default?.())
  }
})

// Mock edit-image
const EditImageMock = defineComponent({
  name: 'EditImage',
  props: {
    id: { type: String, default: '' }
  },
  setup() {
    return () => h('div', { class: 'edit-image-mock' })
  }
})

// Mock edit-table
const EditTableMock = defineComponent({
  name: 'EditTable',
  setup() {
    return () => h('div', { class: 'edit-table-mock' })
  }
})

// Mock useToolsHooks
vi.mock('./use-tools-hooks', () => ({
  useToolsHooks: vi.fn(() => ({
    wordCount: ref(0),
    isToolActive: vi.fn(() => false),
    findFontSize: vi.fn(() => 14)
  }))
}))

describe('pa-editor 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==================== 默认渲染 ====================
  describe('1. 默认渲染', () => {
    it('组件正常挂载', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('渲染编辑器容器', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      expect(wrapper.find('.pa-editor').exists()).toBe(true)
    })
  })

  // ==================== props ====================
  describe('2. props', () => {
    it('接受 id prop', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'my-editor-id',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      expect((wrapper.props() as any).id).toBe('my-editor-id')
    })

    it('接受 modelValue prop', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: '<p>Hello World</p>'
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      expect((wrapper.props() as any).modelValue).toBe('<p>Hello World</p>')
    })

    it('接受 style prop', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: '',
          style: { height: '300px' }
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      expect(wrapper.find('.pa-editor').exists()).toBe(true)
    })

    it('接受 class prop', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: '',
          class: 'custom-editor'
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      expect(wrapper.find('.pa-editor').exists()).toBe(true)
    })
  })

  // ==================== 初始状态 ====================
  describe('3. 初始状态', () => {
    it('isSourceCodeMode 默认为 edit', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(vm.isSourceCodeMode).toBe('edit')
    })

    it('openPopover 默认为 false', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(vm.openPopover).toBe(false)
    })
  })

  // ==================== 方法测试 ====================
  describe('4. 方法测试', () => {
    it('getEditorValue 方法可访问', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(typeof vm.getEditorValue).toBe('function')
    })

    it('insertTextAtCursor 方法可访问', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(typeof vm.insertTextAtCursor).toBe('function')
    })

    it('onContentChange 方法可访问', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(typeof vm.onContentChange).toBe('function')
    })
  })

  // ==================== 暴露方法 ====================
  describe('5. 暴露方法', () => {
    it('暴露 setEditorValue 方法', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(typeof vm.setEditorValue).toBe('function')
    })

    it('暴露 getEditorValue 方法', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(typeof vm.getEditorValue).toBe('function')
    })

    it('暴露 insertTextAtCursor 方法', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(typeof vm.insertTextAtCursor).toBe('function')
    })
  })

  // ==================== 边界情况 ====================
  describe('6. 边界情况', () => {
    it('不传 id 时自动生成', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      const vm = wrapper.vm as any
      expect(vm.ID).toBeDefined()
    })

    it('modelValue 为空时正常工作', async () => {
      const { default: PaEditor } = await import('./pa-editor.vue')
      const wrapper = mount(PaEditor, {
        props: {
          id: 'test-editor',
          modelValue: ''
        },
        global: {
          stubs: {
            'pa-scrollbar': PaScrollbarMock,
            'pa-switch': PaSwitchMock,
            'm-editor-tools': MEditorToolsMock,
            'edit-image': EditImageMock,
            'edit-table': EditTableMock
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
    })
  })
})
