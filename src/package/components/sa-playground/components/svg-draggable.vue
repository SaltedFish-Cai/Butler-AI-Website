<template>
  <g :transform="`translate(${x}, ${y})`" @click="handleClick">
    <slot></slot>
  </g>
</template>

<script lang="tsx" setup>
import { ref } from "vue";

const props = defineProps<{
  x: number;
  y: number;
  scale?: number;
  index?: number;
}>();

const emit = defineEmits<{
  "update:x": [value: number];
  "update:y": [value: number];
  click: [index: number];
}>();

const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const startOffsetX = ref(0);
const startOffsetY = ref(0);

// 鼠标按下事件
const handleMouseDown = (event: MouseEvent) => {
  event.stopPropagation();
  isDragging.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;
  startOffsetX.value = props.x;
  startOffsetY.value = props.y;

  // 添加鼠标移动和释放事件监听器
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

// 鼠标移动事件
const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value) {
    // 考虑缩放因子，计算实际的移动距离
    const scaleValue = props.scale || 1;
    const deltaX = (event.clientX - startX.value) / scaleValue;
    const deltaY = (event.clientY - startY.value) / scaleValue;
    const newX = startOffsetX.value + deltaX;
    const newY = startOffsetY.value + deltaY;

    // 发射更新事件
    emit("update:x", newX);
    emit("update:y", newY);
  }
};

// 鼠标释放事件
const handleMouseUp = () => {
  isDragging.value = false;
  // 移除事件监听器
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

// 处理点击事件
const handleClick = () => {
  if (props.index !== undefined) {
    emit("click", props.index);
  }
};

defineExpose({
  handleMouseDown
});
</script>

<style scoped lang="scss">
.move-btn {
  line-height: 30px;
  text-align: center;
  color: var(--sa-color-primary);
  border: 1px solid var(--sa-color-primary);
  background-color: var(--sa-color-primary-light-9);
  border-radius: var(--sa-size-radius, 3px);
  &:hover {
    color: var(--sa-color-white);
    background-color: var(--sa-color-primary);
  }
}
</style>
