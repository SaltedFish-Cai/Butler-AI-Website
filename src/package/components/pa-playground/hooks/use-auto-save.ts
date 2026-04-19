import { ref, watch, Ref, onUnmounted } from "vue";

interface UseAutoSaveOptions {
  delay?: number; // 自动保存延迟时间（毫秒）
  immediate?: boolean; // 是否立即执行一次保存
  sessionKey?: string; // sessionStorage 存储键名
}

/**
 * 自动保存Hook
 * @param data 需要保存的数据
 * @param saveFn 保存函数（可选，如果提供了sessionKey则自动保存到sessionStorage）
 * @param options 配置选项
 * @returns 自动保存相关状态和方法
 */
export function useAutoSave(
  data: Ref<Record<string, any>>,
  saveFn: string | ((data: Record<string, any>) => Promise<void> | void),
  options: UseAutoSaveOptions = {}
) {
  const { delay = 800, immediate = false, sessionKey } = options;

  const isSaving = ref(false);
  const lastSaveTime = ref<number | null>(null);
  const saveError = ref<string | null>(null);

  let saveTimer: number | null = null;
  let isActive = true;

  // 确定最终的保存函数
  let finalSaveFn: (data: Record<string, any>) => Promise<void> | void;

  if (typeof saveFn === "string") {
    // 如果saveFn是字符串，则将其视为sessionKey
    const key = saveFn;
    finalSaveFn = data => {
      try {
        if (typeof sessionStorage !== "undefined") sessionStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        throw new Error("保存到sessionStorage失败");
      }
    };
  } else if (sessionKey) {
    // 如果提供了sessionKey，则自动保存到sessionStorage
    finalSaveFn = data => {
      try {
        if (typeof sessionStorage !== "undefined") sessionStorage.setItem(sessionKey, JSON.stringify(data));
      } catch (error) {
        throw new Error("保存到sessionStorage失败");
      }
    };
  } else {
    // 否则使用提供的保存函数
    if (!saveFn) {
      throw new Error("必须提供saveFn或sessionKey");
    }
    finalSaveFn = saveFn;
  }

  // 保存函数
  const save = async () => {
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
  };

  // 防抖保存
  const debouncedSave = () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    saveTimer = window.setTimeout(save, delay);
  };

  // 开始自动保存
  const start = () => {
    isActive = true;
    save();
    console.log("++++++++++> 开启自动保存:");
  };

  // 停止自动保存
  const stop = () => {
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
  };

  // 手动保存
  const saveManually = () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    save();
  };

  watch(
    data,
    () => {
      if (isActive) {
        debouncedSave();
      }
    },
    { deep: true }
  );

  // 组件卸载时清理
  onUnmounted(() => {
    stop();
  });

  // 初始化
  if (immediate) {
    save();
  }

  // 获取保存的值
  const getSavedValue = (): Record<string, any> | null => {
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
  };

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
