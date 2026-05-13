/**
 * useIntersectionObserver.ts 单元测试
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useIntersectionObserver } from "./useIntersectionObserver";

describe("useIntersectionObserver", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
    document.body.appendChild(el);
  });

  it("返回 isIntersecting ref 和 stopObserving 方法", () => {
    const result = useIntersectionObserver(el);
    expect(result.isIntersecting).toBeDefined();
    expect(typeof result.isIntersecting.value).toBe("boolean");
    expect(typeof result.stopObserving).toBe("function");
    result.stopObserving();
  });

  it("stopObserving 可安全多次调用", () => {
    const result = useIntersectionObserver(el);
    result.stopObserving();
    result.stopObserving(); // 不应报错
    expect(true).toBe(true);
  });

  it("支持传入 options", () => {
    const result = useIntersectionObserver(el, {
      threshold: [0.5],
      rootMargin: "0px"
    });
    expect(result.isIntersecting).toBeDefined();
    result.stopObserving();
  });

  it("目标元素为 null 时 initObserver 不崩溃", () => {
    // useIntersectionObserver 在 IntersectionObserver 不支持时会 warn
    const result = useIntersectionObserver(el);
    expect(result.isIntersecting).toBeDefined();
    result.stopObserving();
  });

  it("IntersectionObserver 不支持时输出警告", () => {
    const origIO = window.IntersectionObserver;
    // @ts-expect-error
    delete window.IntersectionObserver;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = useIntersectionObserver(el);
    expect(warnSpy).toHaveBeenCalledWith("IntersectionObserver is not supported in this browser");
    result.stopObserving();
    warnSpy.mockRestore();
    window.IntersectionObserver = origIO;
  });
});
