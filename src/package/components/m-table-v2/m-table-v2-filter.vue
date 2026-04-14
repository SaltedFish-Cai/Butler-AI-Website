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

          <m-button-v2 v-if="extraProps.exportApi" is="export" @click="extraProps.exportApi">
            {{ languagePackage["export"] }}
          </m-button-v2>
          <m-button-v2 font="reset_line" type="default" @click="refreshTable({ Page: {} })"
            >{{ languagePackage["refresh"] }}
          </m-button-v2>
          <m-button-v2 font="filter_line" :use-plain="false" type="primary" @click="() => configRef?.changeColSetting(true)"
            >{{ languagePackage["filter"] }}
          </m-button-v2>
        </div>
      </slot>
    </div>
  </div>

  <!-- 普通搜索结果展示 -->
  <section v-if="Query.length" class="flex m-table-v2-query">
    <div class="table-title-label mr-size-v2">{{ languagePackage["searchFilter"] }} :</div>
    <div class="mr-size-v2 query_item" v-for="(item, index) in Query" :key="item.label + item.value">
      <span class="icon_highlight mr5">#{{ index + 1 }}</span>
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
            backgroundColor: 'var(--m-color-primary-light-8)',
            color: '#818181'
          }"
        >
          <div :title="relationshipItem.value">
            {{ relationshipItem.value }}
          </div>
          <m-icon-v2
            class="ml5 hand remove-icon"
            name="close_circle_line"
            @click="handleRemoveQuery(relationshipItem)"
          ></m-icon-v2>
        </span>
      </template>
    </div>

    <m-button-v2 is="trash" size="small" @click="handleCleanAllQuery">{{ languagePackage["clean"] }}</m-button-v2>
  </section>

  <!-- 高级搜索结果展示 -->
  <section v-if="AdvancedQuery.length" class="flex mb-size-v2 m-table-v2-query">
    <div class="table-title-label mr-size-v2">{{ languagePackage["Advanced"] }} :</div>
    <div class="mr-size-v2 query_item" v-for="(item, index) in AdvancedQuery" :key="item.label + item.value">
      <span class="icon_highlight mr5">#{{ index + 1 }}</span>
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

            <span class="query_item_text_group_link" v-if="groupItemIndex < relationshipItem.group.length - 1">
              &lt;{{ setRelationshipGroupLinkType(relationshipItem.groupLinkType) }}&gt;
            </span>
          </template>
        </span>
        <span class="query_item_text_group_link" v-if="relationshipIndex < item.relationshipGroup.length - 1">
          &lt;{{ setRelationshipGroupLinkType(item.relationshipGroupLinkType) }}&gt;
        </span>
      </template>
      <m-icon-v2 class="ml5 hand remove-icon" name="close_circle_line" @click="handleRemoveSeniorQuery(item)"></m-icon-v2>
    </div>

    <m-button-v2 is="trash" size="small" @click="handleCleanAllSeniorQuery">{{ languagePackage["clean"] }}</m-button-v2>
  </section>

  <!-- 高级搜索 -->
  <SeniorFilter
    ref="seniorRef"
    v-model="seniorFilterData.visible"
    :table-query="tableQuery"
    :senior-filter-options="seniorFilterOptions"
    :propItem="seniorFilterData.propItem"
    :languagePackage="languagePackage"
    @save-and-filter="handleSeniorSetting"
  />

  <!-- 表配置 -->
  <ConfigSetting
    :tableStructure="tableStructure"
    ref="configRef"
    :id="extraProps.id"
    :table-query="tableQuery"
    :display="extraProps.display"
    :languagePackage="languagePackage"
  />
</template>

<script setup lang="ts" name="LightTableFilter">
import { useTemplateRef, inject } from "vue";
import { MTableV2UseType, MTableV2UseItemType, MTableV2Type } from "./type";
import SeniorFilter from "./senior-filter.vue";
import ConfigSetting from "./config-setting.vue";
import { useFilterHooks } from "./hooks/use-filter-hooks";
import { useSeniorFilterHooks } from "./hooks/use-senior-filter-hooks";

type LightTableFilterPropsType = {
  tableStructure: Array<MTableV2UseItemType>;
  tableQuery: MTableV2UseType.TableQueryType;
  extraProps: MTableV2Type;
  state: MTableV2UseType.TableStateType;
};
const props = defineProps<LightTableFilterPropsType>();

const configRef = useTemplateRef("configRef");
const refreshTable = inject("refreshTable") as (
  exQuery?: MTableV2UseType.TableQueryType,
  _Observer?: {
    createObserver?: () => void;
    closeObserver?: () => void;
  }
) => Promise<void>;

const {
  Query,
  AdvancedQuery,
  handleSeniorSetting,
  handleRemoveQuery,
  handleRemoveSeniorQuery,
  handleCleanAllQuery,
  handleCleanAllSeniorQuery
} = useFilterHooks(props.extraProps, props.state);

const { seniorFilterOptions, seniorFilterData, openSeniorFilter, setConditionalType, setRelationshipGroupLinkType } =
  useSeniorFilterHooks();

const languagePackage = inject("languagePackage") as Record<string, string>;

defineExpose({
  openSeniorFilter
});
</script>

<style lang="scss">
@import "./query.scss";
</style>
