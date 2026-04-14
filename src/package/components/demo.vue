<template>
  <div>
    <!-- form -->
    <template v-if="false">
      <m-switch-v2 v-model="switchValue" :disabled="disabled" :display="display"></m-switch-v2>

      <!-- <m-form ref="formARef" id="form_a" :data="formAData" :structure="formAConfig" :ex-options="exOptions" />
    <m-button-v2 type="primary" is="submit" index="1" @click="submitAForm"> 提交 </m-button-v2> -->

      <m-form-v2
        ref="formBRef"
        id="form_b"
        :data="formBData"
        :structure="formBConfig"
        :ex-options="exOptions"
        :ex-cell-dependent="cellDependent"
        :display="switchValue"
      />
      <m-button-v2 type="primary" is="submit" index="1" @click="submitBForm"> 提交 </m-button-v2>
    </template>

    <!-- tabs -->
    <template v-if="false">
      <m-tabs v-model="tabsIndex" class="h200" card slider>
        <m-tab-item label="aaaaaaaa" name="aa" scroll> <div style="height: 300px">1</div> </m-tab-item>
        <m-tab-item label="bbbbbbbb" name="bb"> <div style="height: 300px">2</div> </m-tab-item>
        <m-tab-item label="cccccccc" name="cc"> <div style="height: 300px">3</div> </m-tab-item>
        <m-tab-item label="dddddddd" name="dd"> <div style="height: 300px">4</div> </m-tab-item>
        <m-tab-item label="eeeeeeee" name="ee"> <div style="height: 300px">5</div> </m-tab-item>
        <m-tab-item label="ffffffff" name="ff"> <div style="height: 300px">6</div> </m-tab-item>
      </m-tabs>

      <m-tabs-v2 v-model="tabsIndex" class="h200" mode="portrait">
        <m-tab-v2-item label="aaaaaaaa" name="aa" scroll> <div style="height: 300px">1</div> </m-tab-v2-item>
        <m-tab-v2-item label="bbbbbbbb" name="bb"> <div style="height: 300px">2</div> </m-tab-v2-item>
        <m-tab-v2-item label="cccccccc" name="cc"> <div style="height: 300px">3</div> </m-tab-v2-item>
        <m-tab-v2-item label="dddddddd" name="dd"> <div style="height: 300px">4</div> </m-tab-v2-item>
        <m-tab-v2-item label="eeeeeeee" name="ee"> <div style="height: 300px">5</div> </m-tab-v2-item>
        <m-tab-v2-item label="ffffffff" name="ff"> <div style="height: 300px">6</div> </m-tab-v2-item>
        <m-tab-v2-item label="gggggggg" name="gg"> <div style="height: 300px">7</div> </m-tab-v2-item>
        <m-tab-v2-item label="hhhhhhhh" name="hh"> <div style="height: 300px">8</div> </m-tab-v2-item>
        <m-tab-v2-item label="iiiiiiii" name="ii"> <div style="height: 300px">9</div> </m-tab-v2-item>
        <m-tab-v2-item label="jjjjjjjj" name="jj"> <div style="height: 300px">10</div> </m-tab-v2-item>
      </m-tabs-v2>

      <m-tabs-v2 v-model="tabsIndex" class="h200" style-mode="default">
        <m-tab-v2-item label="aaaaaaaa" name="aa" scroll> <div style="height: 300px">1</div> </m-tab-v2-item>
        <m-tab-v2-item label="bbbbbbbb" name="bb"> <div style="height: 300px">2</div> </m-tab-v2-item>
        <m-tab-v2-item label="cccccccc" name="cc"> <div style="height: 300px">3</div> </m-tab-v2-item>
        <m-tab-v2-item label="dddddddd" name="dd"> <div style="height: 300px">4</div> </m-tab-v2-item>
        <m-tab-v2-item label="eeeeeeee" name="ee"> <div style="height: 300px">5</div> </m-tab-v2-item>
        <m-tab-v2-item label="ffffffff" name="ff"> <div style="height: 300px">6</div> </m-tab-v2-item>
        <m-tab-v2-item label="gggggggg" name="gg"> <div style="height: 300px">7</div> </m-tab-v2-item>
        <m-tab-v2-item label="hhhhhhhh" name="hh"> <div style="height: 300px">8</div> </m-tab-v2-item>
        <m-tab-v2-item label="iiiiiiii" name="ii"> <div style="height: 300px">9</div> </m-tab-v2-item>
        <m-tab-v2-item label="jjjjjjjj" name="jj"> <div style="height: 300px">10</div> </m-tab-v2-item>
      </m-tabs-v2>

      <m-tabs-v2 v-model="tabsIndex" class="h200" mode="slider">
        <m-tab-v2-item label="aaaaaaaa" name="aa"> <div style="height: 300px">1</div> </m-tab-v2-item>
        <m-tab-v2-item label="bbbbbbbb" name="bb"> <div style="height: 300px">2</div> </m-tab-v2-item>
        <m-tab-v2-item label="cccccccc" name="cc"> <div style="height: 300px">3</div> </m-tab-v2-item>
        <m-tab-v2-item label="dddddddd" name="dd"> <div style="height: 300px">4</div> </m-tab-v2-item>
        <m-tab-v2-item label="eeeeeeee" name="ee"> <div style="height: 300px">5</div> </m-tab-v2-item>
        <m-tab-v2-item label="ffffffff" name="ff"> <div style="height: 300px">6</div> </m-tab-v2-item>
        <m-tab-v2-item label="gggggggg" name="gg"> <div style="height: 300px">7</div> </m-tab-v2-item>
        <m-tab-v2-item label="hhhhhhhh" name="hh"> <div style="height: 300px">8</div> </m-tab-v2-item>
        <m-tab-v2-item label="iiiiiiii" name="ii"> <div style="height: 300px">9</div> </m-tab-v2-item>
        <m-tab-v2-item label="jjjjjjjj" name="jj"> <div style="height: 300px">10</div> </m-tab-v2-item>
      </m-tabs-v2>
    </template>

    <!-- table -->
    <template v-if="false">
      <code-view v-model:html="params"> </code-view>
      {{ JSON.stringify(params) }}
      <div class="h600">
        <m-table-v2
          id="base-table-demo"
          ref="proTable"
          flat
          :structure="tableConfig"
          :request-api="getTableList"
          :ex-options="exOptions"
          row-key="Text"
          useSummary
          useSelect
          useChildren
        >
          <template #operation="{ row, index }">
            <m-button-v2
              key="key1"
              is="save"
              index="1"
              type="default"
              @click="
                () => {
                  console.log(row, index);
                  isFalse = true;
                }
              "
            >
              编辑1
            </m-button-v2>
            <m-button-v2 key="key2" type="primary" is="edit" index="2" v-if="isFalse"> 编辑2 </m-button-v2>
            <m-button-v2 key="key3" type="danger" is="trash" index="3"> 编辑3 </m-button-v2>
            <m-button-v2 key="key4" type="warning" is="edit" index="4"> 编辑4 </m-button-v2>
            <m-button-v2 key="key5" type="info" is="edit" index="5"> 编辑5 </m-button-v2>
            <m-button-v2 key="key6" type="success" is="edit" index="6"> 编辑6 </m-button-v2>
          </template>
        </m-table-v2>
      </div>
    </template>

    <!-- cell -->
    <template v-if="true">
      <m-file v-model="fileData" :disabled="disabled" :display="display" :fileMultiple="3"></m-file>
      <m-file-v2
        v-model="fileData"
        :disabled="disabled"
        :display="display"
        :fileMultiple="3"
        :attachedData="attachedData"
      ></m-file-v2>

      <m-select-icon-v2 v-model="selectItem" :disabled="disabled" :display="display"></m-select-icon-v2>

      <m-switch v-model="switchValue" :disabled="disabled" :display="display"></m-switch>
      <m-switch-v2 v-model="switchValue" :disabled="disabled" :display="display"></m-switch-v2>

      <m-cascader
        v-model="cascaderValue"
        type="multiple-cascader-check"
        :exOptions="cascaderSelect"
        :disabled="disabled"
        :display="display"
      ></m-cascader>

      <m-cascader-v2
        v-model="cascaderValue"
        type="cascader"
        :exOptions="cascaderSelect"
        :disabled="disabled"
        :display="display"
      ></m-cascader-v2>

      <m-checkbox-v2 v-model="checkboxValue" :disabled="disabled" :display="display" :exOptions="select"></m-checkbox-v2>
      <m-radio-v2 v-model="radioValue" :disabled="disabled" :display="display" :exOptions="select"></m-radio-v2>
      <!-- <m-checkbox-v2 v-model="checkboxValue" :exOptions="checkboxOptions" :disabled="disabled" :display="display"></m-checkbox-v2> -->
      <div @click="disabled = !disabled">disabled</div>
      <div @click="display = !display">display</div>

      <m-title>time</m-title>
      <m-time v-model="timeValue" type="date-time-range"></m-time>
      <m-time-v2
        v-model="timeValue"
        :disabled="disabled"
        :display="display"
        :disabledDateFn="disabledDate"
        type="date-time-picker-group"
        :shortcuts="shortcuts"
      ></m-time-v2>
      <m-time-v2
        v-model="timeValue2"
        :disabled="disabled"
        :display="display"
        type="date-time-picker"
        :disabledDateFn="disabledDate"
      ></m-time-v2>

      <m-title>input</m-title>
      <m-input v-model="inputValue" placeholder="请输入" maxLength="1616" :disabled="disabled" :display="display"></m-input>
      <m-input-v2 v-model="inputValue" placeholder="请输入" maxLength="1616" :disabled="disabled" :display="display"></m-input-v2>
      <m-title>textarea</m-title>
      <m-input
        v-model="inputValue"
        placeholder="请输入"
        maxLength="1616"
        :disabled="disabled"
        :display="display"
        type="textarea"
      ></m-input>
      <m-input-v2
        v-model="inputValue"
        contrastData="bbb"
        placeholder="请输入"
        maxLength="1616"
        type="textarea"
        :disabled="disabled"
        :display="display"
      ></m-input-v2>

      <m-title>select</m-title>
      <m-select v-model="selectValue2" :exOptions="selectOptions" :disabled="disabled" :display="display"></m-select>
      <m-select-v2
        style="max-width: 300px"
        v-model="selectValue2"
        :contrastData="2"
        :exOptions="selectOptions"
        :disabled="disabled"
        :display="display"
      ></m-select-v2>

      <m-title>select-multiple</m-title>
      <m-select-v2
        style="max-width: 300px"
        v-model="selectValue"
        type="multiple-select"
        :exOptions="selectOptions"
        :disabled="disabled"
        :display="display"
      ></m-select-v2>
      <m-select
        style="max-width: 300px"
        v-model="selectValue"
        type="multiple-select"
        :exOptions="selectOptions"
        :disabled="disabled"
        :display="display"
      ></m-select>

      <m-title>number</m-title>
      {{ inputValue3 }}
      <m-number v-model="inputValue3" placeholder="请输入" controls :disabled="disabled" :display="display"></m-number>
      <m-number-v2
        v-model="inputValue3"
        placeholder="请输入"
        :disabled="disabled"
        :display="display"
        :min="-131.12"
        :max="1080.33"
        contrastData="1080.33"
      ></m-number-v2>

      <m-popover-v2 trigger="hover">
        <template #reference>
          <m-button-v2>Hover Popover</m-button-v2>
        </template>
        <div>
          9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        </div>
      </m-popover-v2>
      <m-button-v2 @click="dialogVisible = !dialogVisible">切换1</m-button-v2>
      <m-button-v2 @click="drawerVisible = !drawerVisible">切换2</m-button-v2>

      <m-dialog-v2 v-model="dialogVisible" title="弹窗" sub-title="弹窗副标题">
        <div style="height: 1500px">弹窗内容</div>
        <template #footer>
          <m-button-v2 type="primary" @click="dialogVisible = false">确定</m-button-v2>
        </template>
      </m-dialog-v2>

      <m-drawer-v2 v-model="drawerVisible" title="弹窗" sub-title="弹窗副标题" scroll>
        <div style="height: 1500px">弹窗内容</div>
        <template #footer>
          <m-button-v2 type="primary" @click="drawerVisible = false">确定</m-button-v2>
        </template>
      </m-drawer-v2>

      <div class="h312">
        <m-scrollbar-v2
          ref="scrollRef"
          :onScrollEnd="
            val => {
              if (val) {
                if (arr.length < 15) arr.push(arr.length);
              }
            }
          "
        >
          <div v-for="value in arr" :key="value" style="width: 1600px; height: 600px; background-color: bisque">
            {{ value }}- cadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsc
          </div>
        </m-scrollbar-v2>
        <div class="mt10"></div>
        <m-scrollbar always>
          <div style="width: 3200px; height: 3200px; background-color: bisque">
            cadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsc
          </div>
        </m-scrollbar>
      </div>

      <m-popover-v2>
        <template #reference>
          <m-button-v2>切换</m-button-v2>
        </template>
        <div>
          9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        </div>
      </m-popover-v2>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { MOptionType, MStructureType } from "MTypes";
import { ref } from "vue";

// // 带类型的通知

// // 关闭所有通知
// Notification.closeAll();

const formAData = ref({});
const formBData = ref({});
const formARef = ref();
const formBRef = ref();
const formAConfig: MStructureType.Form[] = [
  { label: "Label-Text", prop: "Text", type: "input", tip: { "zh-CN": "这是一个输入框" } },
  { label: "Label-Switch", prop: "Switch", type: "switch" },
  { label: "Label-Radio", prop: "Radio", type: "radio" },
  { label: "Label-Checkbox", prop: "Checkbox", type: "checkbox" },
  { label: "Label-Select", prop: "Select1", type: "select" },
  { label: "Label-Multiple-Select", prop: "Select2", type: "multiple-select" },
  { label: "Label-Cascader", prop: "Cascader", type: "cascader" },
  { label: "Label-Time", prop: "Time", type: "date-picker" },
  { label: "Label-Number", prop: "Number", type: "number", precision: 2 }
];

const formBConfig: MStructureType.FormV2[] = [
  { label: "Label-Text", prop: "Text", type: "input", tip: { "zh-CN": "这是一个输入框", "en-US": "This is an input box" } },
  { label: { "en-US": "Label-Switch1", "zh-CN": "Label-Switch2" }, prop: "Switch", type: "switch" },
  { label: "Label-Radio", prop: "Radio", type: "radio" },
  { label: "Label-Checkbox", prop: "Checkbox", type: "checkbox" },
  { label: "Label-Select", prop: "Select1", type: "select" },
  { label: "Label-Multiple-Select", prop: "Select2", type: "multiple-select" },
  { label: "Label-Cascader", prop: "Cascader", type: "cascader" },
  { label: "Label-Time", prop: "Time", type: "date-picker" },
  { label: "Label-Number", prop: "Number", type: "number", precision: 2 },
  { label: "Label-Select-Icon", prop: "SelectIcon", type: "select-icon" },
  { label: "Label-File", prop: "File", type: "file", fileMultiple: 2 }
];

const tabsIndex = ref("aa");
const selectItem = ref("unlink_line");

const fileData = ref([]);
const attachedData = {
  FileTypeCode: "WorkflowApprovalFile",
  BusinessIdentifier: "eba364a9-468e-46b8-a30f-f41b675ae559"
};

async function submitAForm() {
  const valid = await formARef.value.getSubmitForm();
  console.log("++++++++++> valid:", valid);
}

async function submitBForm() {
  const valid = await formBRef.value.getSubmitForm();
  console.log("++++++++++> valid:", valid);
}

const switchValue = ref(false);
const cascaderValue = ref();

const checkboxValue = ref([3, 4]);
const radioValue = ref(3);
const inputValue = ref("aaa");
const timeValue = ref(["2025-02-12 12:12:12", "2025-05-12 12:12:12"]);
const timeValue2 = ref("2025-02-12 12:12:12");

const shortcuts = [
  {
    text: "今天",
    value: [new Date(), new Date()]
  },
  {
    text: "最近一周",
    value: () => {
      const now = new Date();
      return [new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now];
    }
  }
];

const disabledDate = date => {
  return date > new Date();
};

const disabled = ref(false);
const display = ref(false);

const selectValue = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const selectValue2 = ref(2);
const inputValue3 = ref(154.56);

const select = [
  { label: "选项1", value: 1 },
  { label: "选项2", value: 2 },
  { label: "选项3", value: 3 },
  { label: "选项4", value: 4 },
  { label: "选项5", value: 5 },
  { label: "选项6", value: 6 },
  { label: "选项7", value: 7 },
  { label: "选项8", value: 8 },
  { label: "选项9", value: 9 },
  { label: "选项10", value: 10 }
];

const select2 = [
  { label: "选项1", value: 1 },
  { label: "选项2", value: 2 }
];

const cascaderSelect = [
  {
    label: "选项1",
    value: 1,
    children: [
      { label: "选项1-1", value: 11 },
      { label: "选项1-2", value: 12 }
    ]
  },
  {
    label: "选项2",
    value: 2,
    children: [
      {
        label: "选项2-1",
        value: 21,
        children: [
          { label: "选项2-1-1", value: 211 },
          { label: "选项2-1-2", value: 212 }
        ]
      },
      { label: "选项2-2", value: 22, children: [{ label: "选项2-2-1", value: 221 }] }
    ]
  }
];

const selectOptions = ref(select);

async function remoteMethodFn({ query }): Promise<MOptionType.Select[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { label: `选项${query}-1`, value: 1 },
        { label: `选项${query}-2`, value: 2 }
      ] as MOptionType.Select[]);
    }, 1000);
  });
}

const proTable = ref();
const params = ref({});
const isFalse = ref(false);
const arr = ref([1]);
const scrollRef = ref();
const dialogVisible = ref(false);
const drawerVisible = ref(false);

const exOptions = ref({});
const cellDependent = ref({
  file_attachedData: {
    File: attachedData
  }
});

const tableConfig: MStructureType.TableV2[] = [
  { label: "Label-Text", prop: "Text" },
  { label: "Label-Switch", prop: "Switch", cellConfig: { type: "switch" } },
  { label: "Label-Radio", prop: "Radio", width: 170, cellConfig: { type: "radio" } },
  { label: "Label-Checkbox", prop: "Checkbox", cellConfig: { type: "checkbox" } },
  { label: "Label-Select", prop: "Select1", cellConfig: { type: "select" } },
  { label: "Label-Multiple-Select", prop: "Select2", cellConfig: { type: "multiple-select" } },
  { label: "Label-Cascader", prop: "Cascader", cellConfig: { type: "cascader" } },
  { label: "Label-Time", prop: "Time", cellConfig: { type: "date-picker" } },
  { label: "Label-Number", prop: "Number", width: 150, cellConfig: { type: "number", precision: 2 } },
  { label: "Label-Icon", prop: "Icon", width: 250, cellConfig: { type: "select-icon" } },
  // { label: "Label-Text", prop: "Text1" },
  // { label: "Label-Text", prop: "Text2" },
  // { label: "Label-Text", prop: "Text3" },
  // { label: "Label-Text", prop: "Text4" },
  // { label: "Label-Text", prop: "Text5" },
  // { label: "Label-Text", prop: "Text6" },
  // { label: "Label-Text", prop: "Text7" },
  // { label: "Label-Text", prop: "Text8" },
  // { label: "Label-Text", prop: "Text9" },
  // { label: "Label-Text", prop: "Text10" },
  // { label: "Label-Select2", prop: "Select2", filterType: "select" },
  // { label: "Label-Select3", prop: "Select3", filterType: "select" },
  // { label: "Label-Select4", prop: "Select4", filterType: "select" },
  // { label: "Label-Select5", prop: "Select5", filterType: "select" },
  // { label: "Label-Select6", prop: "Select6", filterType: "select" },
  // { label: "Label-Select7", prop: "Select7", filterType: "select" },
  // { label: "Label-Select8", prop: "Select8", filterType: "select" },

  { label: "操作", prop: "operation" }
];

setTimeout(() => {
  exOptions.value = {
    Select1: select,
    Select2: select,
    Radio: select2,
    Checkbox: select2,
    Cascader: cascaderSelect
  };
}, 1000);

const maxLength = 10000;
const domeList = Array.from({ length: maxLength }, (_, i) => ({
  Text: `Text-${i + 1}`,
  Select1: 2,
  Switch: true,
  Number: 1.333,
  children: Array.from({ length: 5 }, (_, _i) => ({ Text: `Text-${i + 1}-${_i + 1}`, Switch: false, Select1: 1, Number: 1 }))

  // Number: Math.round(Math.random() * 300)
}));

async function getTableList(query) {
  params.value = query;
  const { PageNum, PageSize } = query.Page;
  const List: any = domeList.slice((PageNum - 1) * PageSize, PageNum * PageSize);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        Data: {
          TotalCount: domeList.length,
          List
        },
        Code: 200
      });
    }, 1000);
  });
  // return {
  //   Data: {
  //     TotalCount: domeList.length,
  //     List
  //   },
  //   Code: 200
  // };
}

// const a = 7;

// if ((a & 1) > 0) {
//   console.log("++++++++++> 1:", 1);
// }
// if ((a & 2) > 0) {
//   console.log("++++++++++> 2:", 2);
// }
</script>

<style scoped></style>
