<template>
  <div class="">
    <div class="flex-center-start">
      <m-icon-v2 class="pop_icon-show ml15 mr25" :name="selectItem" />
      <code-view style="width: 100%" v-model:html="params"> </code-view>
    </div>

    <!-- <m-tabs v-model="activeName" class="no_flx_tabs">
      <m-tab-item v-for="its in Config" :key="its.name" :label="`${its.title}(${its.icons.length})`" :name="its.name"> -->
    <div class="h300">
      <div class="select_icon_popover">
        <template v-for="icon in Config[0].icons" :key="icon.value">
          <m-icon-v2
            class="pop_icon"
            :style="{ color: icon.value == selectItem ? 'var(--el-color-primary)' : '' }"
            :name="icon.value"
            @click="selectedIcon(icon.value)"
            @mouseover="hoverIcon(icon)"
          />
        </template>
      </div>
    </div>
    <!-- </m-tab-item>
    </m-tabs> -->
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";

import all from "./config/all.json";
import iconJson from "./config/icon.json";
import direction from "./config/direction.json";
import multiMedia from "./config/multi-media.json";
import office from "./config/office.json";
import shop from "./config/shop.json";
import cityJson from "./config/city.json";
import network from "./config/network.json";

const Config = ref([
  {
    title: "全部图标",
    name: "all",
    icons: setIconOptions([...all])
  },
  {
    title: "全部图标",
    name: "all",
    icons: setIconOptions([...iconJson, ...network, ...multiMedia, ...office, ...shop, ...cityJson, ...direction])
  },
  { title: "网络图标", name: "network", icons: setIconOptions(network) },
  { title: "方向图标", name: "direction", icons: setIconOptions(direction) },
  { title: "办公图标", name: "fileType", icons: setIconOptions(office) },
  { title: "娱乐图标", name: "multiMedia", icons: setIconOptions(multiMedia) },
  { title: "商城图标", name: "shop", icons: setIconOptions(shop) },
  { title: "城市图标", name: "city", icons: setIconOptions(cityJson) },
  { title: "其他图标", name: "default", icons: setIconOptions(iconJson) }
]);

function setIconOptions(icons) {
  const iconOptions = icons.map(item => {
    return { label: item.font_class, value: item.font_class };
  });
  return iconOptions;
}

type Props = { defaultIcon?: string };
const props = defineProps<Props>();
const selectItem = ref(props.defaultIcon || "finger_press_line");
const hoverItem = ref("finger_press_line");

// const activeName = ref("all");

const params = computed(() => {
  const data = {
    icon_name: selectItem.value,
    icon_element: `<m-icon-v2 :name="${selectItem.value}" />`
  };
  return data;
});

function selectedIcon(iconText) {
  selectItem.value = iconText;
  handleCopy(iconText);
}

function hoverIcon(iconText) {
  hoverItem.value = iconText.label;
}

function handleCopy(text) {
  const copyInput = document.createElement("input");
  document.body.appendChild(copyInput);
  copyInput.setAttribute("value", text);
  copyInput.select();
  document.execCommand("Copy");
  ElMessage.success("图标名—已复制！");
  document.body.removeChild(copyInput);
}

watch(
  () => props.defaultIcon,
  data => {
    selectItem.value = data || "finger_press_line";
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.h300 {
  overflow: scroll;
}
.select_icon_popover {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  .pop_icon {
    padding: 10px;
    font-size: 30px;
  }
}
.pop_icon-show {
  font-size: 38px;
}
.label-btn {
  width: 100%;
}
</style>
