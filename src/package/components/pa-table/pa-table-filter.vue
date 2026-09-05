<template>
  <div
    v-if="
      extraProps.useToolButton ||
      $slots['HeaderLeft'] ||
      $slots['HeaderCenter'] ||
      $slots['ToolButton'] ||
      $slots['ToolButtonInline']
    "
    class="table-flex table-flex-header"
  >
    <div class="table-flex-lf">
      <slot name="HeaderLeft" />
    </div>
    <div class="table-flex-ct">
      <slot name="HeaderCenter" />
    </div>
    <div :class="[extraProps.embeddedToolButton ? 'table-flex-ri-embedded' : 'table-flex-ri']" v-if="extraProps.useToolButton">
      <slot name="ToolButton">
        <div class="flex-center-end">
          <slot name="ToolButtonInline"></slot>

          <pa-button
            :renderId="id + '_export-btn'"
            v-if="extraProps.exportApi"
            is="export"
            dataName="按钮 - 表格导出"
            @click="extraProps.exportApi"
            :text="{ 'zh-CN': '导出报表', 'en-US': 'Export Report' }"
          />

          <pa-button
            :renderId="id + '_refresh-btn'"
            iconName="reset_line"
            type="default"
            dataName="按钮 - 表格刷新"
            @click="refreshTable({ Page: {} })"
            :text="{ 'zh-CN': '刷新', 'en-US': 'Refresh' }"
          />

          <pa-button
            :renderId="id + '_filter-btn'"
            :use-plain="false"
            iconName="filter_line"
            type="primary"
            dataName="按钮 - 表格列筛选"
            @click="() => configRef?.changeColSetting(true)"
            :text="{ 'zh-CN': '筛选', 'en-US': 'Filter' }"
          />
        </div>
      </slot>
    </div>
  </div>

  <!-- 普通搜索结果展示 -->
  <section v-if="Query.length" class="flex pa-table-query">
    <pa-language class="table-title-label pa-mr-size" :text="{ 'zh-CN': '搜索条件', 'en-US': 'Search Filter' }" />
    <div class="pa-mr-size query_item" v-for="(item, index) in Query" :key="item.label + item.value">
      <span class="icon_highlight mr5">#{{ Number(index) + 1 }}</span>
      <span class="query_item_label" :class="[item.conditionalType == 3 ? 'start' : item.conditionalType == 5 ? 'end' : '']">
        {{ item.label }} :
      </span>

      <template
        v-for="(relationshipItem, relationshipIndex) in item.relationshipGroup"
        :key="'relationshipItem' + relationshipIndex"
      >
        <!-- :style="{
                backgroundColor: relationshipItem?.tagStyle?.bgColor,
                color:
                  relationshipItem?.tagStyle?.bgColor && isDarkColor(relationshipItem?.tagStyle?.bgColor) ? '#fff' : '#818181'
              }" -->

        <pa-tag type="info" :name="'删除表筛选 - ' + item.label" :renderId="id + '_' + relationshipItem.props">
          <div :title="relationshipItem.value">{{ relationshipItem.value }}</div>
          <pa-icon
            :renderId="id + '_' + relationshipItem.props + '_' + relationshipItem.relValue + '_remove-btn'"
            :data-name="'删除表筛选 - ' + item.label + ` (${relationshipItem.value})`"
            class="ml5 hand"
            name="close_circle_line"
            @click="handleRemoveQ(relationshipItem)"
          />
        </pa-tag>
      </template>
    </div>

    <pa-button
      :renderId="id + '_remove-filter-all-btn'"
      is="trash"
      size="small"
      @click="handleCleanAllQuery"
      data-name="删除全部表筛选"
      :label="{ 'zh-CN': '清除空条件', 'en-US': 'Clear Empty Conditions' }"
    />
  </section>

  <!-- 高级搜索结果展示 -->
  <section v-if="AdvancedQuery.length" class="flex pa-mb-size pa-table-query">
    <pa-language class="table-title-label pa-mr-size" :text="{ 'zh-CN': '高级搜索', 'en-US': 'Advanced Search' }" />
    <div class="pa-mr-size query_item" v-for="(item, index) in AdvancedQuery" :key="item.label + item.value">
      <span class="icon_highlight mr5">#{{ Number(index) + 1 }}</span>
      <span>{{ item.label }} :</span>
      <template
        v-for="(relationshipItem, relationshipIndex) in item.relationshipGroup"
        :key="'relationshipItem' + relationshipIndex"
      >
        <span class="flex-center query_item_box">
          <template v-for="(groupItem, groupItemIndex) in relationshipItem.group" :key="groupItem.key">
            <span class="query_item_text flex-center">
              <span class="query_item_text_relationship_link"> &lt;{{ setConditionalType(groupItem.conditionalType) }}&gt; </span>
              <span class="query_item_text_relationship_link_value">{{ groupItem.fieldValue }}</span>
            </span>

            <span class="query_item_text_group_link" v-if="Number(groupItemIndex) < Number(relationshipItem.group.length) - 1">
              &lt;{{ setRelationshipGroupLinkType(relationshipItem.groupLinkType) }}&gt;
            </span>
          </template>
        </span>
        <span class="query_item_text_group_link" v-if="Number(relationshipIndex) < Number(item.relationshipGroup.length) - 1">
          &lt;{{ setRelationshipGroupLinkType(item.relationshipGroupLinkType) }}&gt;
        </span>
      </template>
      <pa-icon
        :renderId="id + '_' + item.fieldName + '_remove-adv-icon'"
        class="ml5 hand remove-icon"
        name="close_circle_line"
        @click="handleRemoveSenior(item)"
      />
    </div>

    <pa-button
      :renderId="id + '_remove-adv-filter-all-btn'"
      is="trash"
      size="small"
      @click="handleCleanAllSeniorQuery"
      :label="{ 'zh-CN': '清除空条件', 'en-US': 'Clear Empty Conditions' }"
    />
  </section>

  <!-- 高级搜索 -->
  <SeniorFilter
    ref="seniorRef"
    v-model="seniorFilterData.visible"
    :table-query="tableQuery"
    :senior-filter-options="seniorFilterOptions"
    :propItem="seniorFilterData.propItem"
    @save-and-filter="handleSeniorSetting"
  />

  <!-- 表配置 -->
  <ConfigSetting
    :id="id"
    :tableStructure="tableStructure"
    ref="configRef"
    :table-query="tableQuery"
    :display="extraProps.display"
  />
</template>

<script setup lang="ts" name="LightTableFilter">
import { useTemplateRef, inject } from "vue";
import { PaTableUseType, ComponentUseItemProps, ComponentProps } from "./types";
import SeniorFilter from "./senior-filter.vue";
import ConfigSetting from "./config-setting.vue";
import { useFilterHooks } from "./hooks/use-filter-hooks";
import { useSeniorFilterHooks } from "./hooks/use-senior-filter-hooks";

type LightTableFilterPropsType = {
  id: string;
  tableStructure: Array<ComponentUseItemProps>;
  tableQuery: PaTableUseType.TableQueryType;
  extraProps: ComponentProps;
  state: PaTableUseType.TableStateType;
};
const props = defineProps<LightTableFilterPropsType>();
const language = inject("language") as string;

const configRef = useTemplateRef("configRef");
const refreshTable = inject("refreshTable") as (
  exQuery?: PaTableUseType.TableQueryType,
  _Observer?: {
    createObserver?: () => void;
    closeObserver?: () => void;
  }
) => Promise<void>;

const {
  Query,
  AdvancedQuery,
  handleSeniorSetting,
  handleRemoveQ,
  handleRemoveSenior,
  handleCleanAllQuery,
  handleCleanAllSeniorQuery
} = useFilterHooks(props.extraProps, props.state, language);

const { seniorFilterOptions, seniorFilterData, openSeniorFilter, setConditionalType, setRelationshipGroupLinkType } =
  useSeniorFilterHooks();

defineExpose({
  openSeniorFilter
});
</script>

<style lang="scss">
@use "./query.scss";
</style>
