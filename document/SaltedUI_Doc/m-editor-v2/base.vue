<template>
  <m-title-v2 :padding="['bottom']">基础使用</m-title-v2>
  <div class="rich-editor-section">
    <div class="editor-container-v2">
      <m-editor-v2 v-model="editorContent" :config="{ uploadImage: { attachedData } }" placeholder="请输入内容..." />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
// const editorContent = ref(`<meta charset="UTF-8">
//     <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container-A { max-width: 600px; margin: 0 auto; padding: 20px; }
//         {{~ if IsSuccess ~}}
//         .header { background-color: #5cb85c; color: white; padding: 15px; border-radius: 5px 5px 0 0; }
//         {{~ else ~}}
//         .header { background-color: #d9534f; color: white; padding: 15px; border-radius: 5px 5px 0 0; }
//         {{~ end ~}}
//         .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
//         .info-row { margin: 10px 0; padding: 10px; background-color: white; border-left: 3px solid #00a47e; }
//         .label { font-weight: bold; color: #555; }
//         .value { color: #333; margin-left: 10px; }
//         .success { color: #5cb85c; font-weight: bold; }
//         .error { color: #d9534f; font-weight: bold; }
//         .footer { margin-top: 20px; padding: 15px; text-align: center; color: #777; font-size: 12px; }
//         .status-badge { display: inline-block; padding: 5px 15px; border-radius: 3px; font-weight: bold; }
//         {{~ if IsSuccess ~}}
//         .status-badge { background-color: #d4edda; color: #155724; }
//         {{~ else ~}}
//         .status-badge { background-color: #f8d7da; color: #721c24; }
//         {{~ end ~}}
//     </style>

//     <div class="container-A">
//         <div class="header">
//             <h2 style="margin: 0;">合并医院{{Result}}通知</h2>
//             <p style="margin: 5px 0 0 0; font-size: 14px;">Merge Hospital {{Result}} Notification</p>
//         </div>
//         <div class="content">
//             <p>您好，</p>
//             <p>合并医院任务已完成，执行结果如下：</p>

//             <div style="text-align: center; margin: 20px 0;">
//                 <span class="status-badge">{{Result}}</span>
//             </div>

//             <div class="info-row">
//                 <span class="label">目标医院 (Target Hospital):</span>
//                 <span class="value">{{TargetHospital}}</span>
//             </div>

//             <div class="info-row">
//                 <span class="label">来源医院 (Source Hospitals):</span>
//                 <span class="value">{{SourceHospitals}}</span>
//             </div>

//             {{~ if IsSuccess ~}}
//             <div class="info-row" style="border-left-color: #5cb85c;">
//                 <span class="label">执行结果:</span>
//                 <span class="value success">? {{Message}}</span>
//             </div>
//             {{~ else ~}}
//             <div class="info-row" style="border-left-color: #d9534f;">
//                 <span class="label">失败原因 (Failure Reason):</span>
//                 <span class="value error">? {{Message}}</span>
//             </div>
//             <p style="margin-top: 20px; color: #d9534f;">请登录系统查看详情并尽快处理此问题。</p>
//             {{~ end ~}}
//         </div>
//         <div class="footer">
//             <p>此邮件由系统自动发送，请勿直接回复。</p>
//             <p>This is an automated email, please do not reply directly.</p>
//         </div>
//     </div>`);
const editorContent = ref(
  `
  <div style="color: #1d1d1d;">
  <div style="display: inline-block; max-width: 100%; overflow: auto;">
    <table style="border-collapse: collapse; width: fit-content;">
      <tbody>
        <tr>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>

          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>

          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>

          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
        </tr>
        <tr>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>

          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>

          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>

          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
          <td style="border: 1px solid rgb(204, 204, 204); padding: 8px; text-align: left; min-width: 100px;">&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
  <br />
  <p style="margin: 0px;">&nbsp;</p>
  <div>
    <img
      src="//www.baidu.com/img/flexible/logo/pc/result@2.png"
      alt="9ea0c880a61a8dcbd2fa1de3372bf08f6870.jpeg"
      style="display: inline-block; width: 171px; height: auto;" />
  </div>
  <p style="margin: 0px;"></p>
</div>
<p style="color: rgb(29, 29, 29); margin: 0px;">
  ASDF{{
  <span style="font-size: 16px; color: red;">ASDF</span>
  }}ASDF{{
  <a
    target="_blank"
    href="/wwwwwwww">
    ThresholdDays
  </a>
  }}ASDF:
</p>
<div style="color: #1d1d1d;">
  {{~ for AAAA in Array ~}}
  <p style="color: rgb(173, 43, 43); margin: 0px;">
    {{AAAA}} ({{AAAA.
    <span style="font-size: 20px; background-color: inherit;">DDDDD</span>
    }})
  </p>
  <p style="margin: 0px;">AAAAAA:</p>
  <div style="border: 1px solid #ddd; width: 100%; margin: 10px 0;">
    <div style="display: flex; background-color: #f5f5f5; border-bottom: 1px solid #ddd; padding: 8px 0;">
      <div style="flex: 1; padding: 0 8px; font-weight: bold; border-right: 1px solid #ddd;">BBBB</div>
      <div style="flex: 1; padding: 0 8px; font-weight: bold; border-right: 1px solid #ddd;">CCCC</div>
      <div style="flex: 1; padding: 0 8px; font-weight: bold; border-right: 1px solid #ddd;">DDDD</div>
    </div>
  </div>
  {{~ end ~}}
  <p style="margin: 0px;">ASDF</p>

  <p style="margin: 0px;">&nbsp;</p>
  <p style="margin: 0px;"></p>
</div>

`
);
const attachedData = {
  FileTypeCode: "SystemAnnouncementContentFiles"
};
</script>

<style scoped>
/* 富文本编辑器组件样式 */
.rich-editor-section {
  margin-bottom: 3rem;
  text-align: center;
}

.editor-container-v2 {
  margin: 0 auto 2rem;
  text-align: left;
  height: 500px;
}
</style>
