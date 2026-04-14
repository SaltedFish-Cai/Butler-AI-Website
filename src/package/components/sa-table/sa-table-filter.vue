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

          <sa-button v-if="extraProps.exportApi" is="export" @click="extraProps.exportApi">
            {{ languagePackage["export"] }}
          </sa-button>
          <sa-button font="reset_line" type="default" @click="refreshTable({ Page: {} })"
            >{{ languagePackage["refresh"] }}
          </sa-button>
          <sa-button font="filter_line" :use-plain="false" type="primary" @click="() => configRef?.changeColSetting(true)"
            >{{ languagePackage["filter"] }}
          </sa-button>
        </div>
      </slot>
    </div>
  </div>

  <!-- 普通搜索结果展示 -->
  <section v-if="Query.length" class="flex sa-table-query">
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
          <sa-icon
            class="ml5 hand remove-icon"
            name="close_circle_line"
            @click="handleRemoveQuery(relationshipItem)"
          ></sa-icon>
        </span>
      </template>
    </div>

    <sa-button is="trash" size="small" @click="handleCleanAllQuery">{{ languagePackage["clean"] }}</sa-button>
  </section>

  <!-- 高级搜索结果展示 -->
  <section v-if="AdvancedQuery.length" class="flex mb-size-v2 sa-table-query">
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
      <sa-icon class="ml5 hand remove-icon" name="close_circle_line" @click="handleRemoveSeniorQuery(item)"></sa-icon>
    </div>

    <sa-button is="trash" size="small" @click="handleCleanAllSeniorQuery">{{ languagePackage["clean"] }}</sa-button>
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
import { SaTableUseType, SaTableUseItemType, SaTableType } from "./type";
import SeniorFilter from "./senior-filter.vue";
import ConfigSetting from "./config-setting.vue";
import { useFilterHooks } from "./hooks/use-filter-hooks";
import { useSeniorFilterHooks } from "./hooks/use-senior-filter-hooks";

type LightTableFilterPropsType = {
  tableStructure: Array<SaTableUseItemType>;
  tableQuery: SaTableUseType.TableQueryType;
  extraProps: SaTableType;
  state: SaTableUseType.TableStateType;
};
const props = defineProps<LightTableFilterPropsType>();

const configRef = useTemplateRef("configRef");
const refreshTable = inject("refreshTable") as (
  exQuery?: SaTableUseType.TableQueryType,
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
