<template>
  <div class="m-line-map">
    <section
      class="m-line-map_body"
      :style="{
        '--svg-background-size': `${(12 * State.wheelDelta) / 100}px`,
        '--svg-background-font': `${(1 * State.wheelDelta) / 100 < 1 ? 1 : (1 * State.wheelDelta) / 100}px`
      }"
    >
      <!-- 设计 -->
      <section class="m-line-map_body_devise">
        <div class="svg-main">
          <svg
            ref="svgRef"
            class="svg-content"
            id="SvgContent"
            :onMousedown="e => mouseDown(e, 'svg')"
            :onMouseup="e => mouseUp(e)"
            :onMousemove="mouseMove"
            :onMousewheel="mouseWheel"
            :onMouseenter="() => (mouseInSve = true)"
            :onMouseleave="
              e => {
                mouseInSve = false;
                mouseUp();
              }
            "
            :viewBox="boxValue"
            type="svg"
          >
            <template v-for="(item, liIndex) in lineData" :key="'link' + liIndex">
              <path
                v-if="item.line?.length"
                :d="item.line"
                stroke="#00aa90"
                stroke-width="4.5"
                fill="none"
                class="line-tick"
                :onMouseenter="e => mouseEnterLeavePath('line-' + item.id, e)"
                :onMouseleave="e => mouseEnterLeavePath('', e)"
              />
            </template>

            <foreignObject
              :id="'foreign-' + item.id"
              v-for="(item, index) in coreData"
              :key="item.id"
              class="svg-content-foreign"
              v-bind="item.place"
              type="foreign"
              :index="index"
              :data-el="'foreignObject'"
            >
              <section
                class="svg-content-foreign_body"
                :index="index"
                :id="item.id"
                :onMouseenter="e => mouseEnter(item.id, e)"
                :onMouseleave="() => mouseLeave()"
                :onMousedown="e => mouseDown(e, 'foreign', { index, id: item.id })"
                :onMouseup="e => openMenu(e)"
                :data-el="'foreignObjectChild'"
              >
                <div class="pl-size pr-size">
                  <slot :data="item.data" :place="item.place" :id="item.id"></slot>
                </div>

                <!-- 右锚点 -->
                <div class="link" :onMousedown="(e: any) => mouseDown(e, 'link', item)" data-is="foreign" />
              </section>
            </foreignObject>

            <template v-for="(item, liIndex) in targetLineData" :key="'link' + liIndex">
              <path
                v-if="item.line?.length"
                :d="item.line"
                stroke="#f56c6c"
                stroke-width="4.5"
                fill="none"
                class="line-tick"
                :onMouseenter="e => mouseEnterLeavePath('line-' + item.id, e)"
                :onMouseleave="e => mouseEnterLeavePath('', e)"
              />
            </template>

            <path
              v-if="LinkState.ItemText?.length"
              :d="LinkState.ItemText"
              stroke="#00aa90"
              stroke-width="4"
              fill="none"
              class="line-tick-all"
            ></path>
          </svg>
        </div>

        <div class="zoom-page">缩放： {{ State.wheelDelta }}%</div>
      </section>
    </section>

    <div
      class="setting-menu"
      v-if="menuSettingVisible"
      :style="{ top: menuSettingPlace.y + 'px', left: menuSettingPlace.x + 'px' }"
    >
      <template v-if="menuSettingId">
        <template v-if="menuSettingId?.indexOf('line-') > -1">
          <div class="menu-item" @click="foreignRemoveLine">删除关系</div>
        </template>

        <template v-else>
          <div class="menu-item" @click="e => foreignAddItem(e)">新建下节点</div>
          <div class="menu-item" @click="foreignRemoveItem">删除节点</div>
          <div class="menu-item" @click="foreignEditItem">修改节点</div>
        </template>
      </template>

      <template v-else>
        <div class="menu-item" @click="e => foreignAddItem(e)">新建节点</div>
        <div class="menu-item" @click="() => repositioning()">格式化排版</div>
      </template>
    </div>

    <div
      class="setting-menu pl-size pr-size"
      v-if="linkInfo"
      :style="{ top: linkInfo.position.y + 'px', left: linkInfo.position.x + 'px' }"
    >
      <slot name="line" :data="linkInfo.data">{{ linkInfo.data }}</slot>
    </div>
  </div>
</template>

<script lang="tsx" setup>
// # Import
import { onMounted, reactive, ref, Ref, computed, watch } from "vue";
import lodashPkg from "lodash";
import { DataConfigType, PropsDataConfigType, DefaultPropsDataConfigType } from "./type";
import { useMouse } from "./hooks/useMouse";
import { useMenu } from "./hooks/useMenu";
import inBrowser from "../tools/inBrowser";

import { flatCoreData, flatLineData } from "./utils/index";

// # Var
const { cloneDeep, throttle } = lodashPkg;

type Props = {
  treeData: PropsDataConfigType[];
  defaultData: DefaultPropsDataConfigType;
};
const props = defineProps<Props>();

const coreData: Ref<DataConfigType[]> = ref([]);
const emptyData: Ref<any> = ref();
const lineDataObj: Ref<objectType> = ref({});
const targetLineDataObj: Ref<objectType> = ref({});
const setMapData: Ref<PropsDataConfigType[]> = ref([]);

const lineData = computed(() => {
  const arr: { line: string; id: string }[] = [];
  const _lineDataObj = lineDataObj.value;
  for (const key in _lineDataObj) {
    arr.push({ line: _lineDataObj[key].line, id: key });
  }
  return arr;
});

const targetLineData = computed(() => {
  const arr: { line: string; id: string }[] = [];
  const _lineDataObj = targetLineDataObj.value;
  for (const key in _lineDataObj) {
    arr.push({ line: _lineDataObj[key].line, id: key });
  }
  return arr;
});

const mouseInSve = ref(false);

// 大背景
const SvgState = reactive({
  boxValue: "0 0 0 0",
  box: [0, 0, 0, 0],
  global: [0, 0]
});

const boxValue = computed(() => {
  return SvgState.box.join(" ");
});

const ForeignState: any = reactive({
  CheckAll: [] as { all: boolean; indeterminate: boolean }[],
  List: [],
  Index: -1 as number,
  Icons: {},
  IsPrimaryTableName: "",
  titleList: []
});

const LinkState = reactive({
  List: [] as objectType[],
  ListMap: [] as string[],
  Item: "[0, 0, 0, 0]",
  ItemText: "",
  LinkOptions: []
});

const State = reactive({
  tabsIndex: "0",

  wheelDelta: 100
});

const staticState = {
  offset: [0, 0],
  svgPlace: { x: 0, y: 0 },
  SvgStateBox: [0, 0] as number[],
  wheelDelta: 1,

  MouseDownType: "",

  foreignList: [],
  foreignMap: [] as string[],
  mouseType: "await"
};

const linkItem = {} as { StartEl: any; EndEl: any; startPlace: [number, number]; overPlace: [number, number] };
const linkInfo: Ref<objectType | undefined> = ref(undefined);

const svgRef = ref();
const mouseEnterEl = ref("");
let observer;

// function setForeignCss(id) {
//   const window: any = typeof window == "undefined" ? global : window;
//   const el = window.document.getElementById(id);
//   return [el.offsetWidth, el.offsetHeight];
// }

// #Function 设置拖拽元素宽高
const setForeignCss = throttle(
  el => {
    const children = el.children;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      const targetEl = child.dataset?.el || "";
      // if (!targetEl) return;
      if (targetEl == "foreignObject") {
        const { offsetWidth, offsetHeight } = child.firstChild;
        if (offsetWidth && offsetHeight) {
          child.setAttribute("width", Math.round(offsetWidth));
          child.setAttribute("height", Math.round(offsetHeight));
        }
      }
    }
    if (mouseEnterEl.value && inBrowser) {
      const targetEl: any = window.document.getElementById("foreign-" + mouseEnterEl.value);
      if (targetEl && targetEl.firstChild) {
        const { offsetWidth, offsetHeight } = targetEl.firstChild;
        if (targetEl.width.baseVal.value != offsetWidth) {
          targetEl.setAttribute("width", Math.round(offsetWidth));
        }
        if (targetEl.height.baseVal.value != offsetHeight) {
          targetEl.setAttribute("height", Math.round(offsetHeight));
        }
      }
    }

    const _lineData = flatLineData(coreData.value, SvgState.box, staticState.wheelDelta);

    const id = mouseEnterEl.value;
    let otherArr = {};
    const targetArr = {};
    if (id) {
      for (const key in _lineData) {
        if (_lineData[key].to == id || _lineData[key].from == id) {
          targetArr[key] = _lineData[key];
        } else {
          otherArr[key] = _lineData[key];
        }
      }
    } else {
      otherArr = _lineData;
    }
    lineDataObj.value = otherArr;
    targetLineDataObj.value = targetArr;
  },
  30,
  { trailing: true }
);

// #Function 监听元素节点
function watchDom() {
  if (!inBrowser) return;
  // 目标节点
  const _id = `SvgContent`;
  const targetNode = window.document.getElementById(_id);
  if (targetNode) {
    // 观察器的配置（需要观察什么变动）
    const config = { childList: true, attributes: true, subtree: true };

    // 当观察到变动时执行的回调函数(mutationsList, observer)
    const callback = function (mutationsList) {
      for (const mutation of mutationsList) {
        const el = mutation.target;
        setForeignCss(el);
      }
    };

    // 创建一个观察器实例并传入回调函数
    observer = new MutationObserver(callback);

    // 开始观察目标节点
    observer.observe(targetNode, config);
  }
}

// # Vue onMounted
onMounted(() => {
  const _svg = svgRef.value;
  SvgState.box = [_svg.clientTop, _svg.clientLeft, _svg.clientWidth, _svg.clientHeight];
  setTimeout(() => {
    watchDom();
  }, 0);

  setTimeout(() => {
    if (props.defaultData) {
      const defaultData = cloneDeep(props.defaultData);
      if (defaultData.steps?.length) {
        const steps = defaultData.steps;
        const lines = defaultData.lines;
        const outData: DataConfigType[] = [];

        const isUse: string[] = [];

        function setChild(element, parent?: string) {
          isUse.push(element.id);

          if (!element.parent) element.parent = [];
          if (!element.children) element.children = [];
          if (parent) element.parent.push(parent);

          for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const lineItem = lines[lineIndex];
            if (lineItem.from == element.id) {
              const child = steps.find(item => item.id == lineItem.to);

              if (child) {
                element.children.push(child);
                setChild(child, element.id);
              }
            }
          }
        }

        for (let index = 0; index < steps.length; index++) {
          const element: PropsDataConfigType = cloneDeep(steps[index]);
          if (isUse.indexOf(element.id) < 0) {
            setChild(element);
            outData.push(element);
          }
        }

        setMapData.value = outData;
      }
    } else {
      setMapData.value = cloneDeep(props.treeData);
    }
    repositioning();
  }, 500);
});

// #Function 获取节点数据
function getMapData() {
  const data = cloneDeep(coreData.value);
  const steps = data.map(item => ({ ...item.data, id: item.id, place: item.place }));
  const _LineDataObj = lineDataObj.value;
  const _TargetLineDataObj = targetLineDataObj.value;
  const linesData = { ..._LineDataObj, ..._TargetLineDataObj };
  const lines: objectType[] = [];
  for (const key in linesData) {
    const item = linesData[key];
    lines.push({ ...item.condition, from: item.from, to: item.to });
  }

  return {
    steps,
    lines
  };
}

// #Function 获取连接关系节点数据
function getMapDataByTree() {
  const outData: PropsDataConfigType[] = [];
  const _CoreData: DataConfigType[] = cloneDeep(coreData.value);
  const actArr = _CoreData.filter(item => item.parent.length == 0);
  const actIdArr = actArr.map(item => item.id);

  function loopFn(_actIdArr, outData) {
    for (let index = 0; index < _actIdArr.length; index++) {
      const elementId = _actIdArr[index];
      const elementItem = _CoreData.find(item => item.id == elementId);
      const _elementItem = { ...elementItem, ...elementItem?.data };
      delete _elementItem.data;
      outData[index] = { ..._elementItem, children: [] };
      if (elementItem?.children) {
        loopFn(elementItem?.children, outData[index].children);
      }
    }
  }

  loopFn(actIdArr, outData);

  return outData;
}

defineExpose({ getMapData, getMapDataByTree });

// # useMenu
const { openMenu, closeMenu, menuSettingVisible, menuSettingPlace, menuSettingId } = useMenu(mouseInSve, mouseEnterEl);

// # useMouse
const {
  mouseDown,
  mouseMove,
  mouseUp,
  mouseWheel,
  mouseEnter,
  mouseLeave,
  mouseEnterLeavePath,
  foreignAddItem,
  foreignRemoveItem,
  foreignRemoveLine,
  foreignEditItem,
  repositioning
} = useMouse(
  svgRef,
  coreData,
  emptyData,
  State,
  staticState,
  SvgState,
  ForeignState,
  LinkState,
  lineDataObj,
  targetLineDataObj,
  linkItem,
  linkInfo,
  openMenu,
  closeMenu,
  menuSettingId,
  mouseEnterEl,
  setForeignCss
);

// #Watch setMapData
watch(
  () => setMapData.value,
  value => {
    const { outData, emptyValue } = flatCoreData(value);
    coreData.value = outData;
    emptyData.value = emptyValue;
  },
  { immediate: true }
);

let sizeTimeOut;
if (inBrowser) {
  window.onresize = function () {
    clearTimeout(sizeTimeOut);
    sizeTimeOut = setTimeout(() => {
      const _svg = svgRef.value;
      SvgState.box = [
        staticState.SvgStateBox[0] + (_svg.clientWidth - _svg.clientWidth / staticState.wheelDelta) / 2,
        staticState.SvgStateBox[1] + (_svg.clientHeight - _svg.clientHeight / staticState.wheelDelta) / 2,
        _svg.clientWidth / staticState.wheelDelta,
        _svg.clientHeight / staticState.wheelDelta
      ];
    }, 500);
  };
}
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

<style lang="scss">
.max_width {
  max-width: 70%;
  .ml5 {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
