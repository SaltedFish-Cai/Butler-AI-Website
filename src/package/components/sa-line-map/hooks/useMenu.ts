// # Import
import lodashPkg from "lodash";
import { reactive, toRefs } from "vue";
import inBrowser from "../../tools/inBrowser";

const { cloneDeep } = lodashPkg;

export const useMenu = (mouseInSve, MouseEnterEl) => {
  const state = reactive({
    menuSettingId: "",
    menuSettingVisible: false,
    menuSettingPlace: { x: 0, y: 0 }
  });

  let isCreate = false;
  function createOncontextmenu() {
    if (window.document) {
      window.document.oncontextmenu = function () {
        isCreate = true;
        if (mouseInSve.value) {
          state.menuSettingId = cloneDeep(MouseEnterEl.value);
          return false;
        }
        return true;
      };
    }
  }

  function openMenu(e: any) {
    if (!isCreate && inBrowser) createOncontextmenu();
    state.menuSettingVisible = true;
    state.menuSettingPlace = { x: e.clientX + 5, y: e.clientY + 10 };
  }

  function closeMenu() {
    state.menuSettingVisible = false;
    state.menuSettingPlace = { x: 0, y: 0 };
  }

  return {
    ...toRefs(state),
    openMenu,
    closeMenu
  };
};
