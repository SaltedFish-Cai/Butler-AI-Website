/**
 * @description 导入 Vue 相关类型和生命周期
 * */
import { ref, watch, Ref, onUnmounted } from "vue";

/**
 * @description 自动保存选项接口
 * @type `object`
 * */
interface UseAutoSaveOptions {
  /** @type `number` @default `800` 自动保存延迟时间（毫秒） */
  delay?: number;
  /** @type `boolean` @default `false` 是否立即执行一次保存 */
  immediate?: boolean;
  /** @type `string` @default `undefined` sessionStorage 存储键名 */
  sessionKey?: string;
}

/**
 * @description 自动保存 Hook
 * @param data 需要保存的数据
 * @param saveFn 保存函数（可选，如果提供了sessionKey则自动保存到sessionStorage）
 * @param options 配置选项
 * @returns 自动保存相关状态和方法
 * */
export function useAutoSave(
  data: Ref<Record<string, any>>,
  saveFn: string | ((data: Record<string, any>) => Promise<void> | void),
  options: UseAutoSaveOptions = {}
) {
  const { delay = 800, immediate = false, sessionKey } = options;

  /** @type `ReturnType<typeof ref<boolean>>` 是否正在保存 */
  const isSaving = ref(false);
  /** @type `ReturnType<typeof ref<number | null>>` 上次保存时间 */
  const lastSaveTime = ref<number | null>(null);
  /** @type `ReturnType<typeof ref<string | null>>` 保存错误信息 */
  const saveError = ref<string | null>(null);

  /** @type `number | null` 保存定时器 ID */
  let saveTimer: number | null = null;
  /** @type `boolean` 是否激活 */
  let isActive = true;

  /** @type `(data: Record<string, any>) => Promise<void> | void` 最终的保存函数 */
  let finalSaveFn: (data: Record<string, any>) => Promise<void> | void;

  if (typeof saveFn === "string") {
    const key = saveFn;
    finalSaveFn = data => {
      try {
        if (typeof sessionStorage !== "undefined") sessionStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        throw new Error("保存到sessionStorage失败");
      }
    };
  } else if (sessionKey) {
    finalSaveFn = data => {
      try {
        if (typeof sessionStorage !== "undefined") sessionStorage.setItem(sessionKey, JSON.stringify(data));
      } catch (error) {
        throw new Error("保存到sessionStorage失败");
      }
    };
  } else {
    if (!saveFn) {
      throw new Error("必须提供saveFn或sessionKey");
    }
    finalSaveFn = saveFn;
  }

  /**
   * @description 保存函数
   * @returns `Promise<void>`
   * */
  async function save(): Promise<void> {
    if (!isActive || isSaving.value) return;

    try {
      isSaving.value = true;
      saveError.value = null;

      const saveData = data.value;
      console.log("++++++++++> 自动保存:", saveData);
      await finalSaveFn(saveData);

      lastSaveTime.value = Date.now();
    } catch (error) {
      saveError.value = error instanceof Error ? error.message : "保存失败";
      console.error("自动保存失败:", error);
    } finally {
      isSaving.value = false;
    }
  }

  /**
   * @description 防抖保存
   * @returns `void`
   * */
  function debouncedSave(): void {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    saveTimer = window.setTimeout(save, delay);
  }

  /**
   * @description 开始自动保存
   * @returns `void`
   * */
  function start(): void {
    isActive = true;
    save();
    console.log("++++++++++> 开启自动保存:");
  }

  /**
   * @description 停止自动保存
   * @returns `void`
   * */
  function stop(): void {
    isActive = false;
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    const key = typeof saveFn === "string" ? saveFn : sessionKey;
    if (!key) {
      throw new Error("没有提供sessionKey");
    }
    if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(key);
    console.log("++++++++++> 停止自动保存:");
  }

  /**
   * @description 手动保存
   * @returns `void`
   * */
  function saveManually(): void {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    save();
  }

  watch(
    data,
    () => {
      if (isActive) {
        debouncedSave();
      }
    },
    { deep: true }
  );

  /** @description 组件卸载时清理 */
  onUnmounted(() => {
    stop();
  });

  /** @description 初始化时立即执行保存 */
  if (immediate) {
    save();
  }

  /**
   * @description 获取保存的值
   * @returns `Record<string, any> | null`
   * */
  function getSavedValue(): Record<string, any> | null {
    try {
      const key = typeof saveFn === "string" ? saveFn : sessionKey;
      if (!key) {
        throw new Error("没有提供sessionKey");
      }
      const savedValue = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(key) : null;
      return savedValue ? JSON.parse(savedValue) : null;
    } catch (error) {
      console.error("获取保存值失败:", error);
      return null;
    }
  }

  return {
    isSaving,
    lastSaveTime,
    saveError,
    start,
    stop,
    save: saveManually,
    getSavedValue
  };
}
