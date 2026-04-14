<template>
  <teleport to="body" v-if="menu.visible">
    <div class="m-development-v2">
      <div class="menu_hide" @click="menu.visible = false" @contextmenu.prevent="menu.visible = false"></div>
      <div class="card content-menu" :style="{ top: menu.top, left: menu.left }">
        <div class="content-menu——item" @click="copyInfo">
          <m-icon name="link_line" />
          复制当前组件ID
        </div>
        <div class="content-menu——item" @click="copyUrl">
          <m-icon name="link_line" />
          复制当前组件路径
        </div>
      </div>
    </div>
  </teleport>
  <slot></slot>
</template>

<script lang="ts" setup>
import { reactive, inject, ComputedRef, onMounted, nextTick, onUnmounted } from "vue";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";
import { M_Message } from "../feedback";

const props = withDefaults(defineProps<{ id: string }>(), { id: "" });

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const menu = reactive({
  visible: false,
  top: "-100%",
  left: "-100%"
});

function copyInfo() {
  const copyInput = document.createElement("input");
  document.body.appendChild(copyInput);
  copyInput.setAttribute("value", `${props.id}`);
  copyInput.select();
  document.execCommand("Copy");
  M_Message.success({
    message: { "en-US": "Copied!", "zh-CN": "已复制！" }
  });
  document.body.removeChild(copyInput);
  menu.visible = false;
}

function copyUrl() {
  const copyInput = document.createElement("input");
  document.body.appendChild(copyInput);
  copyInput.setAttribute("value", `${window.location.hash.split("#")[1]?.split("?")[0]}`);
  copyInput.select();
  document.execCommand("Copy");
  M_Message.success({
    message: { "en-US": "Copied!", "zh-CN": "已复制！" }
  });
  document.body.removeChild(copyInput);
  menu.visible = false;
}

function onContextMenu(e) {
  e.preventDefault();
  menu.top = `${e.clientY}px`;
  menu.left = `${e.clientX}px`;
  menu.visible = !menu.visible;
}

if (ManagerGlobalConfig.value.env == "development") {
  onMounted(() => {
    nextTick(() => {
      const element = window.document.getElementById(props.id);
      if (element) {
        element.addEventListener("contextmenu", onContextMenu);
      }
    });
  });

  onUnmounted(() => {
    const element = window.document.getElementById(props.id);
    if (element) {
      element.removeEventListener("contextmenu", onContextMenu);
    }
  });
}
</script>

<style lang="scss" scoped>
.m-development-v2 {
  .content-menu {
    position: fixed;
    z-index: 999999;
    top: -100%;
    left: -100%;
    height: auto;
    padding: 4px 0px;

    .content-menu——item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 6px 12px;
      font-size: calc(var(--el-font-base-size-default));
      border-radius: 3px;
      .m-icon {
        margin-right: 5px;
        font-size: var(--el-font-base-size-default);
      }
      &:hover {
        cursor: pointer;
        background-color: var(--el-color-primary);
        color: var(--el-color-white);
      }
    }
  }

  .menu_hide {
    position: fixed;
    z-index: 999999;
    top: 0%;
    left: 0%;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.3);
  }
}
</style>
