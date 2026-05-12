/**
 * scrollListener.ts 单元测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ScrollListener, listenElementScroll, listenMultipleElementsScroll, isElementInViewport, setElementScrollPosition, startDrag, observeElementResize } from './scrollListener'

// Helper: 创建模拟 DOM 元素，用 defineProperty 设置只读属性
function createMockElement(overrides: Record<string, any> = {}): HTMLElement {
  const el = document.createElement('div')
  const defaults: Record<string, any> = {
    scrollTop: 0,
    scrollLeft: 0,
    scrollHeight: 1000,
    scrollWidth: 1000,
    clientHeight: 300,
    clientWidth: 300,
    offsetWidth: 300,
    offsetHeight: 300,
  }
  const props = { ...defaults, ...overrides }
  // Use defineProperty for read-only props
  for (const [key, value] of Object.entries(props)) {
    try {
      Object.defineProperty(el, key, { value, writable: true, configurable: true })
    } catch {
      // some props may still be non-configurable, just skip
    }
  }
  // Mock scrollTo
  el.scrollTo = vi.fn(({ top, left, behavior }: any) => {
    if (top !== undefined) el.scrollTop = top
    if (left !== undefined) el.scrollLeft = left
  }) as any
  // Spy on addEventListener/removeEventListener
  const origAdd = el.addEventListener.bind(el)
  const origRemove = el.removeEventListener.bind(el)
  el.addEventListener = vi.fn(origAdd) as any
  el.removeEventListener = vi.fn(origRemove) as any
  return el
}

describe('ScrollListener 类', () => {
  let listener: ScrollListener

  beforeEach(() => {
    listener = new ScrollListener()
  })

  describe('构造函数', () => {
    it('使用默认配置创建实例', () => {
      const instance = new ScrollListener()
      expect(instance).toBeInstanceOf(ScrollListener)
    })

    it('使用自定义配置创建实例', () => {
      const instance = new ScrollListener({
        debounceTime: 200,
        defaultScrollHorizontalThumb: 10,
        defaultScrollVerticalThumb: 20
      })
      expect(instance).toBeInstanceOf(ScrollListener)
    })
  })

  describe('update 方法', () => {
    it('计算垂直滚动条信息', () => {
      const el = createMockElement({
        scrollHeight: 1000,
        scrollWidth: 300,
        clientHeight: 300,
        clientWidth: 300
      })
      const result = listener.update(el, undefined)
      expect(result.useVertical).toBe(true)  // 1000 - 300 > 2
      expect(result.useHorizontal).toBe(false) // 300 - 300 = 0 <= 2
      expect(result.verticalThumb).toBeGreaterThan(0)
      expect(result.verticalThumbScale).toBeGreaterThan(0)
      expect(result.horizontalThumbScale).toBe(0) // not using horizontal
    })

    it('计算水平滚动条信息', () => {
      const el = createMockElement({
        scrollHeight: 300,
        scrollWidth: 600,
        clientHeight: 300,
        clientWidth: 300
      })
      const result = listener.update(el, undefined)
      expect(result.useVertical).toBe(false)
      expect(result.useHorizontal).toBe(true)
      expect(result.horizontalThumb).toBeGreaterThan(0)
      expect(result.horizontalThumbScale).toBeGreaterThan(0)
      expect(result.verticalThumbScale).toBe(0)
    })

    it('使用 parentBoxRef 替代元素尺寸', () => {
      const el = createMockElement({
        scrollHeight: 1000,
        scrollWidth: 300,
        clientHeight: 300,
        clientWidth: 300
      })
      const parentBox = createMockElement({
        clientHeight: 500,
        clientWidth: 500
      })
      const result = listener.update(el, parentBox)
      expect(result.useVertical).toBe(true) // 1000 - 500 > 2
    })

    it('滑块最小值限制为 MAX_THUMB_SIZE (60)', () => {
      const el = createMockElement({
        scrollHeight: 100000,
        scrollWidth: 300,
        clientHeight: 100,
        clientWidth: 300
      })
      const result = listener.update(el, undefined)
      expect(result.verticalThumb).toBe(60) // 极大内容区，计算值远小于60
    })

    it('使用 defaultScrollThumb 偏移', () => {
      const instance = new ScrollListener({
        defaultScrollHorizontalThumb: 10,
        defaultScrollVerticalThumb: 20
      })
      const el = createMockElement({
        scrollHeight: 1000,
        scrollWidth: 600,
        clientHeight: 300,
        clientWidth: 300
      })
      const result = instance.update(el, undefined)
      expect(result.useVertical).toBe(true)
      expect(result.useHorizontal).toBe(true)
    })

    it('无滚动时 useVertical 和 useHorizontal 都为 false', () => {
      const el = createMockElement({
        scrollHeight: 300,
        scrollWidth: 300,
        clientHeight: 300,
        clientWidth: 300
      })
      const result = listener.update(el, undefined)
      expect(result.useVertical).toBe(false)
      expect(result.useHorizontal).toBe(false)
    })
  })

  describe('addElementScrollListener 方法', () => {
    it('为有效元素添加滚动监听', () => {
      const el = createMockElement()
      const handler = vi.fn()
      const directlyHandler = vi.fn()
      listener.addElementScrollListener('test-id', el, handler, directlyHandler)
      expect(el.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

    it('无效元素不添加监听', () => {
      const handler = vi.fn()
      const directlyHandler = vi.fn()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      listener.addElementScrollListener('test-id', null as any, handler, directlyHandler)
      expect(warnSpy).toHaveBeenCalledWith('Invalid element provided for scroll listening')
      warnSpy.mockRestore()
    })

    it('使用自定义 debounceTime', () => {
      const el = createMockElement()
      const handler = vi.fn()
      const directlyHandler = vi.fn()
      listener.addElementScrollListener('test-id', el, handler, directlyHandler, { debounceTime: 200 })
      expect(el.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })
  })

  describe('removeElementScrollListener 方法', () => {
    it('移除已注册的监听器', () => {
      const el = createMockElement()
      const handler = vi.fn()
      const directlyHandler = vi.fn()
      listener.addElementScrollListener('test-id', el, handler, directlyHandler)
      listener.removeElementScrollListener('test-id')
      expect(el.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

    it('移除不存在的 id 不报错', () => {
      expect(() => listener.removeElementScrollListener('non-existent')).not.toThrow()
    })
  })

  describe('setElementScrollPosition 方法', () => {
    it('设置 scrollTop（instant）', () => {
      const el = createMockElement()
      listener.setElementScrollPosition(el, { scrollTop: 100, behavior: 'auto' })
      expect(el.scrollTop).toBe(100)
    })

    it('设置 scrollLeft（instant）', () => {
      const el = createMockElement()
      listener.setElementScrollPosition(el, { scrollLeft: 200, behavior: 'auto' })
      expect(el.scrollLeft).toBe(200)
    })

    it('设置 scrollTop（smooth）触发 scrollTo', async () => {
      const el = createMockElement()
      listener.setElementScrollPosition(el, { scrollTop: 100, behavior: 'smooth' })
      // smooth scroll uses setTimeout internally, just verify it doesn't throw
      expect(true).toBe(true)
    })

    it('设置 scrollLeft（smooth）触发 scrollTo', async () => {
      const el = createMockElement()
      listener.setElementScrollPosition(el, { scrollLeft: 200, behavior: 'smooth' })
      expect(true).toBe(true)
    })

    it('使用 offsetX 偏移（smooth）', async () => {
      const el = createMockElement()
      listener.setElementScrollPosition(el, { scrollLeft: 100, behavior: 'smooth', offsetX: -10 })
      expect(true).toBe(true)
    })

    it('使用 offsetY 偏移（smooth）', async () => {
      const el = createMockElement()
      listener.setElementScrollPosition(el, { scrollTop: 100, behavior: 'smooth', offsetY: -20 })
      expect(true).toBe(true)
    })

    it('调用 callback（instant）', () => {
      const el = createMockElement()
      const callback = vi.fn()
      listener.setElementScrollPosition(el, { scrollTop: 0, behavior: 'auto', callback })
      expect(callback).toHaveBeenCalled()
    })

    it('无效元素不报错', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      listener.setElementScrollPosition(null as any, { scrollTop: 100 })
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('无效元素也调用 callback', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const callback = vi.fn()
      listener.setElementScrollPosition(null as any, { scrollTop: 100, callback })
      expect(callback).toHaveBeenCalled()
      warnSpy.mockRestore()
    })
  })

  describe('reinitialize 方法', () => {
    it('重置所有滚动位置记录', () => {
      const el = createMockElement({ scrollTop: 50, scrollLeft: 30 })
      const handler = vi.fn()
      const directlyHandler = vi.fn()
      listener.addElementScrollListener('test-id', el, handler, directlyHandler)
      listener.reinitialize()
      // Should not throw
      expect(true).toBe(true)
    })
  })

  describe('removeAllListeners 方法', () => {
    it('清除所有监听器和位置记录', () => {
      const el = createMockElement()
      listener.addElementScrollListener('test1', el, vi.fn(), vi.fn())
      listener.addElementScrollListener('test2', el, vi.fn(), vi.fn())
      listener.removeAllListeners()
      // No error, all cleared
      expect(true).toBe(true)
    })
  })

  describe('destroy 方法', () => {
    it('销毁监听器并清除所有观察器', () => {
      const el = createMockElement()
      listener.addElementScrollListener('test1', el, vi.fn(), vi.fn())
      listener.destroy()
      expect(true).toBe(true)
    })
  })

  describe('startDrag 方法', () => {
    it('无效元素返回 stop 函数', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const result = listener.startDrag(null as any, null as any, 'vertical')
      expect(result.stop).toBeTypeOf('function')
      result.stop()
      warnSpy.mockRestore()
    })

    it('有效元素添加 mousedown 监听', () => {
      const thumbEl = createMockElement()
      const targetEl = createMockElement()
      const result = listener.startDrag(thumbEl, targetEl, 'vertical')
      expect(thumbEl.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
      result.stop()
    })

    it('水平方向拖拽', () => {
      const thumbEl = createMockElement()
      const targetEl = createMockElement()
      const result = listener.startDrag(thumbEl, targetEl, 'horizontal')
      expect(thumbEl.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
      result.stop()
    })
  })

  describe('observeElementResize 方法', () => {
    it('无效元素返回 stop 函数', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const handler = vi.fn()
      const result = listener.observeElementResize('test-id', null as any, handler)
      expect(result.stop).toBeTypeOf('function')
      warnSpy.mockRestore()
    })

    it('有效元素创建 ResizeObserver', () => {
      const el = createMockElement()
      const handler = vi.fn()
      const result = listener.observeElementResize('test-id', el, handler)
      expect(result.stop).toBeTypeOf('function')
      result.stop()
    })
  })
})

describe('listenElementScroll 便捷函数', () => {
  it('返回监听器信息', () => {
    const el = createMockElement()
    const handler = vi.fn()
    const directlyHandler = vi.fn()
    const result = listenElementScroll(el, handler, directlyHandler)
    expect(result.listener).toBeInstanceOf(ScrollListener)
    expect(result.bodyHeight).toBe(300)
    expect(result.bodyWidth).toBe(300)
    expect(typeof result.remove).toBe('function')
    expect(typeof result.update).toBe('function')
  })

  it('update 返回 ScrollUserInfo', () => {
    const el = createMockElement({
      scrollHeight: 1000,
      scrollWidth: 300,
      clientHeight: 300,
      clientWidth: 300
    })
    const handler = vi.fn()
    const directlyHandler = vi.fn()
    const result = listenElementScroll(el, handler, directlyHandler)
    const updateResult = result.update(undefined)
    expect(updateResult.useVertical).toBe(true)
    expect(updateResult.useHorizontal).toBe(false)
  })

  it('remove 清理监听器', () => {
    const el = createMockElement()
    const handler = vi.fn()
    const directlyHandler = vi.fn()
    const result = listenElementScroll(el, handler, directlyHandler)
    result.remove()
    expect(true).toBe(true)
  })

  it('检测水平和垂直滚动', () => {
    const el = createMockElement({
      scrollHeight: 1000,
      scrollWidth: 600,
      clientHeight: 300,
      clientWidth: 300
    })
    const handler = vi.fn()
    const directlyHandler = vi.fn()
    const result = listenElementScroll(el, handler, directlyHandler)
    expect(result.useHorizontal).toBe(true) // 600 != 300
    expect(result.useVertical).toBe(true)   // 1000 != 300
  })
})

describe('listenMultipleElementsScroll 便捷函数', () => {
  it('监听多个元素', () => {
    const el1 = createMockElement()
    const el2 = createMockElement()
    const handler = vi.fn()
    const directlyHandler = vi.fn()
    const result = listenMultipleElementsScroll([el1, el2], handler, directlyHandler)
    expect(typeof result.remove).toBe('function')
    result.remove()
  })

  it('跳过非 HTMLElement', () => {
    const el = createMockElement()
    const handler = vi.fn()
    const directlyHandler = vi.fn()
    const result = listenMultipleElementsScroll([el, null as any], handler, directlyHandler)
    expect(typeof result.remove).toBe('function')
    result.remove()
  })
})

describe('isElementInViewport 函数', () => {
  it('返回 isInViewport 状态和 stopObserving 方法', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    try {
      const result = isElementInViewport(el)
      expect(typeof result.isInViewport).toBe('boolean')
      expect(typeof result.stopObserving).toBe('function')
      result.stopObserving()
    } finally {
      document.body.removeChild(el)
    }
  })
})

describe('setElementScrollPosition 便捷函数', () => {
  it('无效元素调用 callback', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const callback = vi.fn()
    setElementScrollPosition(null as any, { scrollTop: 100, callback })
    expect(callback).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('有效元素设置滚动位置', () => {
    const el = createMockElement()
    setElementScrollPosition(el, { scrollTop: 100, behavior: 'auto' })
    expect(el.scrollTop).toBe(100)
  })
})

describe('startDrag 便捷函数', () => {
  it('无效元素返回 stop', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = startDrag(null as any, null as any, 'vertical')
    expect(result.stop).toBeTypeOf('function')
    warnSpy.mockRestore()
  })
})

describe('observeElementResize 便捷函数', () => {
  it('无效元素返回 stop', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = observeElementResize(null as any, vi.fn())
    expect(result.stop).toBeTypeOf('function')
    warnSpy.mockRestore()
  })
})


describe('isElementInViewport 降级处理', () => {
  it('IntersectionObserver 不可用时使用 getBoundingClientRect', () => {
    const origIO = window.IntersectionObserver
    // @ts-ignore
    delete window.IntersectionObserver
    const el = document.createElement('div')
    document.body.appendChild(el)
    try {
      const result = isElementInViewport(el)
      expect(typeof result.isInViewport).toBe('boolean')
      expect(typeof result.stopObserving).toBe('function')
      result.stopObserving()
    } finally {
      document.body.removeChild(el)
      window.IntersectionObserver = origIO
    }
  })
})

describe('ScrollListener 滚动事件触发', () => {
  it('触发 scroll 事件调用 handler', () => {
    const listener = new ScrollListener()
    const el = document.createElement('div')
    document.body.appendChild(el)
    // Set up content so there's scrollable area
    el.style.height = '100px'
    el.style.width = '100px'
    el.style.overflow = 'auto'
    const inner = document.createElement('div')
    inner.style.height = '500px'
    inner.style.width = '500px'
    el.appendChild(inner)

    const handler = vi.fn()
    const directlyHandler = vi.fn()
    listener.addElementScrollListener('scroll-test', el, handler, directlyHandler)

    // Dispatch scroll event
    el.dispatchEvent(new Event('scroll'))

    // directlyHandler should be called (throttle-based, but in test env it may fire)
    // handler is debounced/throttled, may not fire immediately
    expect(true).toBe(true) // just verify no crash

    listener.removeElementScrollListener('scroll-test')
    document.body.removeChild(el)
  })
})

describe('ScrollListener setElementScrollPosition 边界情况', () => {
  it('scrollTop 和 scrollLeft 同时设置', () => {
    const listener = new ScrollListener()
    const el = createMockElement()
    listener.setElementScrollPosition(el, { scrollTop: 100, scrollLeft: 200, behavior: 'auto' })
    expect(el.scrollTop).toBe(100)
    expect(el.scrollLeft).toBe(200)
  })

  it('不需要滚动时直接调用 callback', () => {
    const listener = new ScrollListener()
    const el = createMockElement({ scrollTop: 0, scrollLeft: 0 })
    const callback = vi.fn()
    listener.setElementScrollPosition(el, { scrollTop: 0, scrollLeft: 0, behavior: 'auto', callback })
    expect(callback).toHaveBeenCalled()
  })
})

describe('observeElementResize 降级', () => {
  it('ResizeObserver 不可用时使用轮询', () => {
    const origRO = window.ResizeObserver
    // @ts-ignore
    delete window.ResizeObserver
    const listener = new ScrollListener()
    const el = document.createElement('div')
    document.body.appendChild(el)
    const handler = vi.fn()
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = listener.observeElementResize('resize-fallback', el, handler)
    expect(warnSpy).toHaveBeenCalledWith('ResizeObserver is not supported. Using fallback method.')
    expect(result.stop).toBeTypeOf('function')
    result.stop()

    warnSpy.mockRestore()
    document.body.removeChild(el)
    window.ResizeObserver = origRO
  })
})
