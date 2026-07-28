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
            v-if="extraProps.exportApi"
            is="export"
            @click="extraProps.exportApi"
            :text="{ 'zh-CN': '导出报表', 'en-US': 'Export Report' }"
          />

          <pa-button
            iconName="reset_line"
            type="default"
            @click="refreshTable({ Page: {} })"
            :text="{ 'zh-CN': '刷新', 'en-US': 'Refresh' }"
          />

          <pa-button
            :use-plain="false"
            iconName="filter_line"
            type="primary"
            @click="() => configRef?.changeColSetting(true)"
            :text="{ 'zh-CN': '筛选', 'en-US': 'Filter' }"
          />
        </div>
      </slot>
    </div>
  </div>

  <!-- 普通搜索结果展示 -->
  <section v-if="Query.length" class="flex pa-table-query">
    <pa-language class="table-title-label mr-size" :text="{ 'zh-CN': '搜索条件', 'en-US': 'Search Filter' }"> </pa-language>
    <div class="mr-size query_item" v-for="(item, index) in Query" :key="item.label + item.value">
      <span class="icon_highlight mr5">#{{ Number(index) + 1 }}</span>
      <span>{{ item.label }} :</span>

      <template
        v-for="(relationshipItem, relationshipIndex) in item.relationshipGroup"
        :key="'relationshipItem' + relationshipIndex"
      >
        <!-- :style="{
                backgroundColor: relationshipItem?.tagStyle?.bgColor,
                color:
                  relationshipItem?.tagStyle?.bgColor && isDarkColor(relationshipItem?.tagStyle?.bgColor) ? '#fff' : '#818181'
              }" -->
        <span
          class="flex-center query_item_box query_item_box2"
          :style="{
            backgroundColor: 'var(--pa-color-primary-light-8)',
            color: '#818181'
          }"
        >
          <div :title="relationshipItem.value">
            {{ relationshipItem.value }}
          </div>
          <pa-icon class="ml5 hand remove-icon" name="close_circle_line" @click="handleRemoveQ(relationshipItem)"></pa-icon>
        </span>
      </template>
    </div>

    <pa-button
      is="trash"
      size="small"
      @click="handleCleanAllQuery"
      :label="{ 'zh-CN': '清除空条件', 'en-US': 'Clear Empty Conditions' }"
    />
  </section>

  <!-- 高级搜索结果展示 -->
  <section v-if="AdvancedQuery.length" class="flex mb-size pa-table-query">
    <pa-language class="table-title-label mr-size" :text="{ 'zh-CN': '高级搜索', 'en-US': 'Advanced Search' }"> </pa-language>
    <div class="mr-size query_item" v-for="(item, index) in AdvancedQuery" :key="item.label + item.value">
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
      <pa-icon class="ml5 hand remove-icon" name="close_circle_line" @click="handleRemoveSenior(item)"></pa-icon>
    </div>

    <pa-button
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
    :tableStructure="tableStructure"
    ref="configRef"
    :id="extraProps.id"
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
