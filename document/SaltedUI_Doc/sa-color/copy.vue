<template>
  <div class="">
    <m-title> 快速选择颜色 </m-title>

    <div class="flex-center">
      <template v-if="selectItem.length">
        <div
          v-for="(item, index) in selectItem"
          :key="index"
          class="color-box hand"
          :style="{ backgroundColor: item }"
          @click="selectedColor(item)"
        ></div
      ></template>
      <template v-else><div>点击下方色卡</div></template>
    </div>

    <div class="flex-center flex-col">
      <div v-for="(item, index) in outColor" :key="index" class="flex mt20">
        <div v-for="its in item" :key="its">
          <div class="color-box hand" @click="selectedColor(its)" :style="{ backgroundColor: its }"></div>
        </div>
      </div>
    </div>

    <div class="flex-center-start mt30">
      <code-view style="width: 100%" v-model:html="params" copyable> </code-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, Ref, computed } from "vue";
import { getDarkColor } from "@/package/components/tools/color";

const baseColor = [
  "#ff0000",
  "#ff8000",
  "#ffff00",
  "#00ffc4",
  "#00ff18",
  "#00e3ff",
  "#0084ff",
  "#0025ff",
  "#4700ff",
  "#f100ff",
  "#c9c9c9"
];

const outColor: [string[]] = [[]];
for (let index = 0; index < baseColor.length; index++) {
  const color = baseColor[index];
  const baseColors: string[] = [];
  for (let i = 3; i <= 15; i++) {
    baseColors.push(getDarkColor(color, i / 28));
  }
  outColor.push(baseColors);
}

const selectItem: Ref<string[]> = ref([]);

const params = computed(() => {
  return selectItem.value;
});

function selectedColor(color) {
  const findIndex = selectItem.value?.indexOf(color);
  if (findIndex > -1) {
    selectItem.value.splice(findIndex, 1);
  } else {
    selectItem.value.push(color);
  }
}

// function handleCopy(text) {
//   const copyInput = document.createElement("input");
//   document.body.appendChild(copyInput);
//   copyInput.setAttribute("value", text);
//   copyInput.select();
//   document.execCommand("Copy");
//   ElMessage.success("图标名—已复制！");
//   document.body.removeChild(copyInput);
// }
</script>

<style lang="scss" scoped>
.color-box {
  width: 50px;
  height: 20px;
  margin-right: 10px;
}
.hand {
  transition: 0.2s;
  &:hover {
    transform: scale(1.5);
    cursor: pointer;
  }
}
</style>
