<template>
  <sa-dialog
    v-model="visible"
    :title="{ 'zh-CN': '表结构管理', 'en-US': 'Data Structure Management' }"
    :padding="['all']"
    :closeOnClickModal="false"
    @closed="handleClose"
  >
    <m-quick-table ref="visibleTableRef" :tableData="inEditData" :tableConfig="tableConfig" :ex-options="exOptions">
      <template #Header>
        <sa-button is="add" @click="handleAdd" :text="{ 'zh-CN': '新建表', 'en-US': 'New Structure' }" />
      </template>

      <template #operation="{ data }">
        <sa-button
          is="edit"
          @click="handleEdit(data as MStructureType)"
          :text="{ 'zh-CN': '编辑表', 'en-US': 'Edit Structure' }"
        />
        <sa-button
          is="delete"
          @click="handleDelete(data as MStructureType)"
          :text="{ 'zh-CN': '删除表', 'en-US': 'Delete Structure' }"
        />
      </template>
    </m-quick-table>
  </sa-dialog>

  <sa-dialog
    v-model="editVisible"
    :title="{ 'zh-CN': '表结构编辑', 'en-US': 'Data Structure Edit' }"
    :padding="['all']"
    :closeOnClickModal="false"
    size="l"
  >
    <sa-form
      id="sa-playground_base"
      ref="formRef"
      :structure="formConfig"
      :data="inEditDataItem"
      :ex-span="1"
      :ex-options="exOptions"
    >
    </sa-form>

    <m-quick-table
      ref="editTableRef"
      :tableData="inEditDataItem.config"
      :tableConfig="editTableConfig"
      :ex-options="exOptions"
      class="mt-size"
    >
      <template #Header>
        <sa-button
          is="add"
          @click="
            inEditDataItem.config.push({
              id: Date.now().toString(),
              prop: '',
              description: '',
              label: { 'zh-CN': '', 'en-US': '' }
            });
            editTableRef?.setWidth();
          "
          :debounced="false"
          :text="{ 'zh-CN': '新增属性', 'en-US': 'Add Property' }"
        />
        <!-- 上传属性JSON -->
        <sa-button-group is="default" class="ml-size">
          <sa-button
            is="upload"
            @click="triggerFileUpload"
            :debounced="false"
            :text="{ 'zh-CN': '上传JSON', 'en-US': 'Upload JSON' }"
          />
          <sa-button
            is="download"
            @click="generateJsonExample"
            :debounced="false"
            :text="{ 'zh-CN': 'JSON示例', 'en-US': 'JSON Example' }"
          />
        </sa-button-group>
        <input type="file" ref="fileInput" style="display: none" accept=".json" @change="handleFileUpload" />
      </template>

      <template #indexKey="{ data }">
        <sa-radio-item
          :isChecked="inEditDataItem.indexKey == data.id"
          @click="inEditDataItem.indexKey = data.id"
          v-model="inEditDataItem.indexKey"
        ></sa-radio-item
      ></template>

      <template #prop="{ data }">
        <sa-input
          :title="languageValue === 'zh-CN' ? '属性名' : 'Property Name'"
          v-model="data.prop"
          :placeholder="{ 'zh-CN': '请输入属性名', 'en-US': 'Please input property prop' }"
        ></sa-input>
      </template>

      <template #description="{ data }">
        <sa-input
          :title="languageValue === 'zh-CN' ? '属性描述' : 'Property Description'"
          v-model="data.description"
          :placeholder="{ 'zh-CN': '请输入属性描述', 'en-US': 'Please input property description' }"
        ></sa-input>
      </template>

      <template #label="{ data }">
        <sa-input
          v-model="data.label['zh-CN']"
          :title="languageValue === 'zh-CN' ? '中文文本' : 'Chinese Text'"
          :titleWidth="languageValue === 'zh-CN' ? '70px' : '100px'"
          :placeholder="{ 'zh-CN': '请输入中文文本', 'en-US': 'Please input Chinese text' }"
        ></sa-input>
        <sa-input
          class="mt-size"
          v-model="data.label['en-US']"
          :title="languageValue === 'zh-CN' ? '英文文本' : 'English Text'"
          :titleWidth="languageValue === 'zh-CN' ? '70px' : '100px'"
          :placeholder="{ 'zh-CN': '请输入英文文本', 'en-US': 'Please input English text' }"
        ></sa-input>
      </template>

      <template #visible="{ data }">
        <sa-select
          v-model="data.visible"
          :ex-options="[
            { label: { 'en-US': 'Yes', 'zh-CN': '是' }, value: 1 },
            { label: { 'en-US': 'No', 'zh-CN': '否' }, value: 0 }
          ]"
        ></sa-select>
      </template>

      <template v-for="item in props.authorizationFunction" :key="'dialog-edit-button_' + item.prop" #[item.prop]="{ data }">
        <slot :name="item.prop" :data="data"></slot>
      </template>

      <template #operation="{ data }">
        <sa-button
          is="delete"
          @click="handleDeleteProp(data as MStructureTypeItem)"
          :text="{ 'zh-CN': '删除属性', 'en-US': 'Delete Property' }"
        />
      </template>
    </m-quick-table>

    <template #footer>
      <sa-button is="save" @click="handleSubmit" :text="{ 'zh-CN': '保存表结构', 'en-US': 'Save Data Structure' }" />
    </template>
  </sa-dialog>
</template>

<script lang="tsx" setup>
import { computed, ComputedRef, inject, ref, useTemplateRef, watch } from "vue";
import { MStructureType, MStructureTypeItem } from "../type";
import { SaOptionType, SaStructureType } from "M_Types";
import { M_Message, M_MessageBox } from "../../feedback";
import { SaltedGlobalConfigType } from "../../sa-content/type";
import MQuickTable from "./quick-table.vue";
import _ from "lodash";

const { cloneDeep } = _;

const SaltedGlobalConfig = inject("SaltedGlobalConfig") as ComputedRef<SaltedGlobalConfigType>;
const languageValue = computed(() => {
  return SaltedGlobalConfig.value?.language?.value || "zh-CN";
});

const props = withDefaults(
  defineProps<{
    editBaseData: MStructureType[];
    authorizationFunction?: Array<SaStructureType.TableV2>;
  }>(),
  {}
);

const inEditData = ref<MStructureType[]>([]);
const inEditDataItem = ref<MStructureType>({} as MStructureType);

const formConfig = ref<SaStructureType.FormV2[]>([
  { label: { "zh-CN": "表描述", "en-US": "Table Description" }, prop: "description", type: "input" }
]);

const tableConfig = ref<SaStructureType.TableV2[]>([
  { label: { "zh-CN": "数据结构ID", "en-US": "Data Structure ID" }, prop: "id" },
  { label: { "zh-CN": "数据结构描述", "en-US": "Data Structure Description" }, prop: "description" },
  { label: { "zh-CN": "操作", "en-US": "Operation" }, prop: "operation", width: "200px" }
]);

const editTableConfig = ref<(SaStructureType.TableV2 & { class?: string })[]>([
  { label: { "zh-CN": "下标", "en-US": "Index" }, prop: "indexKey", width: "60px", class: "flex-center" },
  { label: { "zh-CN": "属性Key", "en-US": "Property Key" }, prop: "prop" },
  { label: { "zh-CN": "属性描述", "en-US": "Property Description" }, prop: "description" },
  { label: { "zh-CN": "属性标签", "en-US": "Property Label" }, prop: "label" },
  { label: { "zh-CN": "是否展示", "en-US": "Visible" }, prop: "visible", width: "100px" },
  ...(props.authorizationFunction || []),
  { label: { "zh-CN": "操作", "en-US": "Operation" }, prop: "operation", width: "120px" }
]);

const exOptions = ref<SaOptionType.Default>({
  apiType: [
    { value: "get", label: "GET" },
    { value: "post", label: "POST" }
  ]
});

const formRef = useTemplateRef("formRef");
const editTableRef = useTemplateRef("editTableRef");
const visibleTableRef = useTemplateRef("visibleTableRef");
const fileInput = useTemplateRef("fileInput");
const emits = defineEmits(["submit"]);

const visible = ref(false);
const editVisible = ref(false);

// # 打开新建接口弹窗
const handleAdd = () => {
  inEditDataItem.value = {
    id: "",
    description: "",
    indexKey: "",
    config: []
  } as MStructureType;
  editVisible.value = true;
};

// # 编辑接口
const handleEdit = (item: MStructureType) => {
  inEditDataItem.value = cloneDeep(item);
  editVisible.value = true;
};

// # 删除接口
const handleDelete = (item: MStructureType) => {
  M_MessageBox.delete({
    message: languageValue.value === "zh-CN" ? "确认删除表吗？" : "Are you sure you want to delete the table?",
    onConfirm: async () => {
      try {
        inEditData.value = inEditData.value.filter(i => i.id !== item.id);
        M_Message.success(languageValue.value === "zh-CN" ? "表删除成功" : "Table deleted successfully");
      } catch (error) {
        M_Message.danger(languageValue.value === "zh-CN" ? "表删除失败" + error : "Table deletion failed" + error);
      }
    }
  });
};

const handleDeleteProp = (item: MStructureTypeItem) => {
  M_MessageBox.delete({
    message: languageValue.value === "zh-CN" ? "确认删除属性吗？" : "Are you sure you want to delete the property?",
    onConfirm: async () => {
      try {
        inEditDataItem.value.config = inEditDataItem.value.config.filter(i => i.id !== item.id);
        M_Message.success(languageValue.value === "zh-CN" ? "属性删除成功" : "Property deleted successfully");
      } catch (error) {
        M_Message.danger(languageValue.value === "zh-CN" ? "属性删除失败" + error : "Property deletion failed" + error);
      }
    }
  });
};

// # 打开编辑表格列弹窗
const openEditTableColDialog = () => {
  visible.value = true;
};

// 提交表单
async function handleSubmit() {
  const formData = await formRef.value?.getSubmitForm();
  if (formData && formData != "no-change") {
    formData.config = inEditDataItem.value.config.filter(i => i.prop && i.description);
    formData.indexKey = inEditDataItem.value.indexKey;

    if (formData.id) {
      inEditData.value = inEditData.value.map(i => (i.id === formData.id ? { ...formData } : i)) as MStructureType[];
    } else {
      inEditData.value.push({ ...formData, id: Date.now().toString() } as MStructureType);
    }

    editVisible.value = false;
    visibleTableRef.value?.setWidth();
  }
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false;
  emits("submit", inEditData.value);
};

// 触发文件选择
const triggerFileUpload = () => {
  fileInput.value?.click();
};

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // 检查文件类型
  if (!file.name.endsWith(".json")) {
    M_Message.danger(languageValue.value === "zh-CN" ? "请上传JSON文件" : "Please upload a JSON file");
    return;
  }

  // 检查文件大小（限制为1MB）
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    M_Message.danger(languageValue.value === "zh-CN" ? "文件大小不能超过1MB" : "File size cannot exceed 1MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const jsonContent = e.target?.result as string;

      // 检查文件是否为空
      if (!jsonContent || jsonContent.trim() === "") {
        M_Message.danger(languageValue.value === "zh-CN" ? "JSON文件内容为空" : "JSON file content is empty");
        return;
      }

      const parsedData = JSON.parse(jsonContent);

      // 检查解析的数据格式
      if (Array.isArray(parsedData)) {
        // 检查数组是否为空
        if (parsedData.length === 0) {
          M_Message.danger(languageValue.value === "zh-CN" ? "JSON数组为空" : "JSON array is empty");
          return;
        }

        // 验证每个对象的结构
        const validData = parsedData.filter((item: any) => {
          return item && typeof item === "object";
        });

        if (validData.length === 0) {
          M_Message.danger(languageValue.value === "zh-CN" ? "JSON数组中没有有效的对象" : "No valid objects in JSON array");
          return;
        }

        // 清空现有配置
        inEditDataItem.value.config = [];

        // 添加解析的数据到表格
        validData.forEach((item: any, index: number) => {
          inEditDataItem.value.config.push({
            id: item.id || Date.now().toString() + "_" + index,
            prop: item.prop || "",
            description: item.description || "",
            label: item.label || { "zh-CN": "", "en-US": "" },
            visible: item.visible || 1
          });
        });

        M_Message.success(languageValue.value === "zh-CN" ? "JSON文件上传成功" : "JSON file uploaded successfully");
      } else {
        M_Message.danger(
          languageValue.value === "zh-CN"
            ? "JSON文件格式不正确，应包含属性数组"
            : "JSON file format is incorrect, should contain an array of properties"
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      M_Message.danger(
        languageValue.value === "zh-CN" ? `JSON文件解析失败: ${errorMessage}` : `JSON file parsing failed: ${errorMessage}`
      );
      console.error("JSON解析错误:", error);
    }
  };

  reader.onerror = () => {
    M_Message.danger(languageValue.value === "zh-CN" ? "文件读取失败" : "File reading failed");
  };

  reader.readAsText(file);

  // 重置文件输入，以便可以重复选择同一个文件
  target.value = "";
};

// 生成JSON示例
const generateJsonExample = () => {
  const example = [
    {
      id: "9999999",
      prop: "user_id",
      description: "ID",
      label: { "zh-CN": "ID", "en-US": "ID" }
    },
    {
      id: "1",
      prop: "user_name",
      description: "姓名",
      label: { "zh-CN": "姓名", "en-US": "user name" }
    },
    {
      id: "2",
      prop: "age",
      description: "年龄",
      label: { "zh-CN": "年龄", "en-US": "age" }
    },
    {
      id: "3",
      prop: "email",
      description: "邮箱",
      label: { "zh-CN": "邮箱", "en-US": "email" }
    }
  ];

  const exampleJson = JSON.stringify(example, null, 2);

  // 创建一个临时链接下载示例文件
  const blob = new Blob([exampleJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "properties-example.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  M_Message.success(languageValue.value === "zh-CN" ? "JSON示例已下载" : "JSON example downloaded");
};

watch(
  () => props.editBaseData,
  newVal => {
    inEditData.value = newVal || [];
  },
  { immediate: true }
);

defineExpose({
  open: openEditTableColDialog
});
</script>

<style lang="scss" scoped>
@use "./style.scss";
</style>
