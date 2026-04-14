<template>
  <RenderTableColumn v-bind="_props.slots" />
</template>

<script lang="tsx" setup name="TableColumn">
// # Import
import { inject, Ref } from "vue";
import { MTabsV2ItemTitleType } from "./type";
const tabsContext = inject("TabsContext") as Ref<{ mode: "default" | "portrait" | "slider" | "sticky"; tabsId: string }>;

// # Var
const _props = defineProps<MTabsV2ItemTitleType>();

// #Function Render方法
const RenderTableColumn = slots => {
  const _slots: any = [];
  for (const key in slots) {
    _slots.push(slots[key]);
  }
  const className = props => {
    const name =
      props?.name == _props.activeName
        ? `m-tabs-v2-title m-tabs-v2-title_action m-tabs-v2-title_action_${tabsContext.value.tabsId}`
        : "m-tabs-v2-title";
    return name;
  };
  if (!_slots) return <></>;
  return (
    <>
      {_slots.map(({ props, children }, index) => {
        return (
          <div class={className(props)} onClick={() => _props.changeTabs(props?.name, index)}>
            {props?.name && children.label ? (
              ""
            ) : (
              <m-icon-v2 class="mr3" name={props?.icon ? props?.icon : "grid_adaptive_line"} />
            )}
            {props?.name && children.label ? children.label(props) : props?.label}
          </div>
        );
      })}
    </>
  );
};
</script>

<style lang="scss"></style>
