<template>
  <pa-dialog
    v-model="visible"
    :title="{ 'zh-CN': '项目配置', 'en-US': 'Project Config' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="s"
  >
    <pa-form
      id="pa-playground_base"
      ref="formRef"
      :structure="config"
      :data="props.editBaseData"
      :ex-span="1"
      :ex-options="exOptions"
    >
    </pa-form>

    <template #footer>
      <pa-button is="save" @click="handleSubmit" :text="{ 'zh-CN': '保存配置', 'en-US': 'Save Config' }" />
    </template>
  </pa-dialog>
</template>

<script lang="tsx" setup>
import { ref, useTemplateRef } from "vue";
import { PaPlaygroundPagesType, PaPlaygroundType } from "../types";
import { PaStructureType } from "M_Types";

const props = withDefaults(
  defineProps<{
    editBaseData: PaPlaygroundType;
    playgroundItems: PaPlaygroundPagesType[];
  }>(),
  {}
);

const formRef = useTemplateRef("formRef");
const emits = defineEmits(["submit"]);

const visible = ref(false);

const config = ref<PaStructureType.FormV2[]>([
  { label: { "en-US": "Project Name", "zh-CN": "项目名称" }, prop: "name", type: "input" },
  { label: { "en-US": "Admin Index", "zh-CN": "主页面" }, prop: "adminIndex", type: "select" },
  { label: { "en-US": "Description", "zh-CN": "描述" }, prop: "description", type: "input", rules: [{ required: false }] }
]);

const exOptions = ref({
  adminIndex: props.playgroundItems.map(item => ({ label: item.name + "(" + item.pageId + ")", value: item.pageId }))
});

// # 打开编辑表格列弹窗
const openEditTableColDialog = () => {
  visible.value = true;
  exOptions.value.adminIndex = props.playgroundItems.map(item => ({
    label: item.name + "(" + item.pageId + ")",
    value: item.pageId
  }));
};

// 提交表单
async function handleSubmit() {
  const formData = await formRef.value?.getSubmitForm();
  if (formData && formData != "no-change") {
    const exData = { ...formData };
    visible.value = false;
    emits("submit", exData);
  }
}

defineExpose({
  open: openEditTableColDialog
});
</script>

<style scoped></style>
