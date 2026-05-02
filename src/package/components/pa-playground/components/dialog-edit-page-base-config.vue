<template>
  <pa-dialog
    v-model="visible"
    :title="{ 'zh-CN': '页面配置', 'en-US': 'Page Config' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="s"
  >
    <pa-form id="pa-playground_base" ref="formRef" :structure="config" :data="editBaseData" :ex-span="1"> </pa-form>

    <template #footer>
      <pa-button is="save" @click="handleSubmit" :text="{ 'zh-CN': '保存配置', 'en-US': 'Save Config' }" />
    </template>
  </pa-dialog>
</template>

<script lang="tsx" setup>
import { ref, useTemplateRef } from "vue";
import { PaPlaygroundPagesType } from "../types";
import { PaStructureType } from "M_Types";

const props = withDefaults(
  defineProps<{
    playgroundItems: PaPlaygroundPagesType[];
  }>(),
  {}
);
const editBaseData = ref<PaPlaygroundPagesType>({
  pageId: "",
  name: "",
  x: 0,
  y: 0,
  itemConfigs: []
});

const formRef = useTemplateRef("formRef");
const emits = defineEmits(["submit"]);
const editIndex = ref(-1);
const visible = ref(false);

const config = ref<PaStructureType.FormV2[]>([
  { label: { "en-US": "Project Name", "zh-CN": "页面名称" }, prop: "name", type: "input" }
]);

// # 打开编辑表格列弹窗
const openEditTableColDialog = (index: number) => {
  editIndex.value = index;
  editBaseData.value = props.playgroundItems[index];
  visible.value = true;
};

// 提交表单
async function handleSubmit() {
  const formData = await formRef.value?.getSubmitForm();
  if (formData && formData != "no-change") {
    const exData = { ...formData };
    visible.value = false;
    emits("submit", { index: editIndex.value, ...exData });
  }
}

defineExpose({
  open: openEditTableColDialog
});
</script>

<style scoped></style>
