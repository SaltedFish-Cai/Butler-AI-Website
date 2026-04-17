<template>
  <div class="playground-demo">
    <sa-playground :data="playgroundConfig" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const playgroundConfig = ref({
  id: "demo-playground",
  name: "示例配置面板",
  description: "一个基础的可视化配置面板示例",
  adminX: 0,
  adminY: 0,
  adminScale: 1,
  pagesConfigs: [
    {
      pageId: "page-1",
      name: "基础配置",
      x: 0,
      y: 0,
      itemConfigs: [
        {
          itemId: "form-1",
          width: 400,
          height: 300,
          type: "form",
          structure: [
            {
              label: { "zh-CN": "项目名称", "en-US": "Project Name" },
              prop: "projectName",
              type: "input",
              rules: [{ required: true }]
            },
            {
              label: { "zh-CN": "项目描述", "en-US": "Description" },
              prop: "description",
              type: "input"
            },
            {
              label: { "zh-CN": "项目状态", "en-US": "Status" },
              prop: "status",
              type: "select",
              exOptions: [
                { label: "进行中", value: "active" },
                { label: "已完成", value: "completed" },
                { label: "已暂停", value: "paused" }
              ]
            },
            {
              label: { "zh-CN": "优先级", "en-US": "Priority" },
              prop: "priority",
              type: "radio",
              exOptions: [
                { label: "高", value: "high" },
                { label: "中", value: "medium" },
                { label: "低", value: "low" }
              ]
            },
            {
              label: { "zh-CN": "启用通知", "en-US": "Enable Notification" },
              prop: "enableNotification",
              type: "switch"
            }
          ],
          actionButtons: [],
          exOptions: {},
          sourceTable: "projects"
        }
      ]
    },
    {
      pageId: "page-2",
      name: "高级设置",
      x: 500,
      y: 0,
      itemConfigs: [
        {
          itemId: "form-2",
          width: 400,
          height: 250,
          type: "form",
          structure: [
            {
              label: { "zh-CN": "创建时间", "en-US": "Create Time" },
              prop: "createTime",
              type: "date-picker"
            },
            {
              label: { "zh-CN": "截止日期", "en-US": "Deadline" },
              prop: "deadline",
              type: "date-time-picker"
            },
            {
              label: { "zh-CN": "预算", "en-US": "Budget" },
              prop: "budget",
              type: "number",
              min: 0,
              precision: 2,
              unit: "元"
            }
          ],
          actionButtons: [],
          exOptions: {},
          sourceTable: "projects"
        }
      ]
    }
  ],
  interfaceConfigs: [
    {
      id: "save-project",
      name: "保存项目",
      apiUrl: "/api/projects/save",
      apiType: "post",
      dataStructure: "project"
    },
    {
      id: "get-project",
      name: "获取项目",
      apiUrl: "/api/projects/:id",
      apiType: "get",
      dataStructure: "project",
      requestParameters: ["id"]
    }
  ],
  dataStructures: [
    {
      id: "project",
      description: "项目数据结构",
      indexKey: "id",
      config: [
        { id: "1", prop: "id", description: "项目ID", label: { "zh-CN": "ID", "en-US": "ID" } },
        { id: "2", prop: "projectName", description: "项目名称", label: { "zh-CN": "项目名称", "en-US": "Project Name" } },
        { id: "3", prop: "description", description: "项目描述", label: { "zh-CN": "项目描述", "en-US": "Description" } },
        { id: "4", prop: "status", description: "项目状态", label: { "zh-CN": "状态", "en-US": "Status" } }
      ]
    }
  ],
  exOptions: []
});
</script>

<style scoped>
.playground-demo {
  width: 100%;
  height: 500px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
}
</style>
