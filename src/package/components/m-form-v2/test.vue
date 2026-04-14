<template>
  <m-form-v2-control
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    label-position="left"
    @submit="handleSubmit"
  >
    <m-form-v2-item label="姓名" prop="name">
      <input v-model="formData.name" placeholder="请输入姓名" />
    </m-form-v2-item>
    <m-form-v2-item label="年龄" prop="age">
      <input v-model.number="formData.age" type="number" placeholder="请输入年龄" />
    </m-form-v2-item>
    <m-form-v2-item>
      <button @click="submitForm">提交</button>
      <button @click="resetForm">重置</button>
    </m-form-v2-item>
  </m-form-v2-control>
</template>

<script setup>
import { ref, reactive } from "vue";

// 这里需要另外实现m-form-item组件，或者直接使用原生input等元素
// 为了简化示例，这里使用原生input元素

const formRef = ref();
const formData = reactive({
  name: "",
  age: null
});
const formRules = {
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度在2到20个字符之间", trigger: "blur" }
  ],
  age: [
    { required: true, message: "请输入年龄", trigger: "blur" },
    { type: "number", min: 18, max: 120, message: "年龄必须在18到120之间", trigger: "blur" }
  ]
};

function submitForm() {
  formRef.value.submitForm();
}

function resetForm() {
  formRef.value.resetForm();
}

function handleSubmit(data) {
  console.log("表单提交数据:", data);
}
</script>
