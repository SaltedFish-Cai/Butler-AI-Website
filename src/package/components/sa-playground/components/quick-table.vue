<template>
  <div
    class="m-playground-dialog-container"
    :class="[props.class]"
    :style="{ ...props.style, overflow: useScroll ? 'auto' : 'hidden' }"
    :id="id"
  >
    <div class="m-playground-dialog-content" :class="{ scroll: useScroll }">
      <div class="m-playground-dialog-header">
        <slot name="Header"></slot>
      </div>
      <div class="m-playground-dialog-table">
        <div class="m-playground-dialog-table-header">
          <div class="m-playground-dialog-table-row">
            <div
              v-for="item in tableConfig"
              :key="item.prop"
              class="m-playground-dialog-table-cell"
              :class="[item.class, item.prop === 'operation' ? 'operation' : '']"
              :style="item.prop === 'operation' ? operationStyle : item.width ? { flex: `0 0 ${item.width || 'auto'}` } : {}"
            >
              <div :style="{ width: item.prop === 'operation' ? 'max-content' : 'auto' }">
                {{ typeof item.label === "object" ? item.label[languageValue] : item.label }}
              </div>
            </div>
          </div>
        </div>
        <div class="m-playground-dialog-table-body">
          <template v-if="tableData?.length">
            <div
              v-for="(Operation, index) in tableData"
              :key="index"
              class="m-playground-dialog-table-row"
              draggable="true"
              @dragstart="handleDragStart($event, index)"
              @dragover.prevent="handleDragOver($event)"
              @dragenter.prevent="handleDragEnter($event)"
              @dragleave="handleDragLeave($event)"
              @dragend="handleDragEnd($event)"
              @drop.prevent="handleDrop($event, index)"
            >
              <!-- 按钮功能 -->
              <div
                v-for="item in tableConfig"
                :key="item.prop"
                class="m-playground-dialog-table-cell"
                :class="[item.class, item.prop === 'operation' ? 'operation' : '']"
                :style="item.prop === 'operation' ? operationStyle : item.width ? { flex: `0 0 ${item.width || 'auto'}` } : {}"
              >
                <div :style="{ width: item.prop === 'operation' ? 'max-content' : 'auto' }">
                  <slot v-if="item.prop" :name="item.prop" :data="Operation" :index="index" :config="item">
                    {{
                  item.prop &&
                  (item?.filterType === "select"
                    ? (setLabel((exOptions[item.prop] as SaOptionType.SelectList)?.find(i => i.value === Operation[(item.prop as string)]) as SaOptionType.Select) || {}) || ""
                    : Operation[item.prop] || "")
                    }}
                  </slot>
                </div>
              </div>
            </div>
          </template>

          <div v-else class="m-playground-dialog-table-row">
            <div class="m-playground-dialog-table-cell" :colspan="6" style="text-align: center">
              {{ languageValue === "zh-CN" ? "暂无数据" : "No Data" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ref, computed, ComputedRef, inject, onMounted, watch, nextTick } from "vue";
import { SaOptionType, SaStructureType } from "M_Types";
import { SaltedGlobalConfigType } from "../../sa-content/type";

const id = ref("table_" + new Date().getTime().toString());
const SaltedGlobalConfig = inject("SaltedGlobalConfig") as ComputedRef<SaltedGlobalConfigType>;
const languageValue = computed(() => {
  return SaltedGlobalConfig.value?.language?.value || "zh-CN";
});

const operationStyle = ref("");

const setLabel = (item: SaOptionType.Select) => {
  if (!item) return "";
  return typeof item.label === "object" ? item.label[languageValue.value] : item.label;
};

const props = withDefaults(
  defineProps<{
    style?: Record<string, string>;
    class?: string;
    useScroll?: boolean;
    tableData: Array<Record<string, any>>;
    tableConfig: (SaStructureType.TableV2 & { class?: string })[];
    exOptions: SaOptionType.Default;
  }>(),
  {}
);

const setWidth = () => {
  nextTick(() => {
    const els = Array.from(document.querySelectorAll(`#${id.value} .m-playground-dialog-table-cell.operation`));
    const maxWidth = Math.max(...els.map((item: any) => item.firstChild?.clientWidth || 0));
    return (operationStyle.value = `flex:0 0 ${maxWidth + 24}px`);
  });
};
const draggedIndex = ref(-1);
const tableData = ref(props.tableData);
// 拖拽开始
const handleDragStart = (event: DragEvent, index: number) => {
  event.stopPropagation();
  event.dataTransfer?.setData("text/plain", index.toString());
  (event.target as HTMLElement).style.opacity = "0.5";
  (event.target as HTMLElement).classList.add("dragging");
  draggedIndex.value = index;
};

// 拖拽悬停
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  const items = document.querySelectorAll(".m-playground-dialog-table-row");
  items.forEach(item => item.classList.remove("dragover"));
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).classList.add("dragover");
  }
};

// 拖拽进入
const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

// 拖拽离开
const handleDragLeave = (event: DragEvent) => {
  event.stopPropagation();
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).classList.remove("dragover");
  }
};

// 拖拽结束
const handleDragEnd = (event: DragEvent) => {
  event.stopPropagation();
  (event.target as HTMLElement).style.opacity = "1";
  (event.target as HTMLElement).classList.remove("dragging");
  const items = document.querySelectorAll(".m-playground-dialog-table-row");
  items.forEach(item => item.classList.remove("dragover"));
  draggedIndex.value = -1;
};

// 拖拽结束，处理排序
const handleDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault();
  event.stopPropagation();

  const oldIndex = parseInt(event.dataTransfer!.getData("text/plain"));
  if (oldIndex !== -1 && oldIndex !== targetIndex) {
    const newArray = [...tableData.value];
    const [draggedItem] = newArray.splice(oldIndex, 1);
    newArray.splice(targetIndex, 0, draggedItem);
    tableData.value = newArray;
  }

  // 重置拖拽状态
  (event.target as HTMLElement).style.opacity = "1";
  (event.target as HTMLElement).classList.remove("dragging");
  const items = document.querySelectorAll(".m-playground-dialog-table-row");
  items.forEach(item => item.classList.remove("dragover"));
  draggedIndex.value = -1;
};

onMounted(() => {
  setTimeout(() => {
    setWidth();
  }, 0);
});

const emit = defineEmits(["update"]);
watch(
  () => tableData.value,
  data => {
    emit("update", data);
  }
);

watch(
  () => props.tableData,
  data => {
    tableData.value = data;
    setTimeout(() => {
      setWidth();
    }, 0);
  }
);

defineExpose({ setWidth });
</script>

<style lang="scss" scoped>
@use "./style.scss";
</style>
