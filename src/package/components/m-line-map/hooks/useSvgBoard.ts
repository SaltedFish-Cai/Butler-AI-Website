// # Import
// import { reactive, toRefs } from "vue";

export const useSvgBoard = (SvgRef, SvgState, StaticState) => {
  function mousedown() {
    SvgState.global = [SvgState.box[0], SvgState.box[1]];
  }
  function mousemove(e: { clientX: any; clientY: any }) {
    const offset = StaticState.offset;
    SvgState.box = [
      SvgState.global[0] - e.clientX / StaticState.wheelDelta + offset[0],
      SvgState.global[1] - e.clientY / StaticState.wheelDelta + offset[1],
      SvgState.box[2],
      SvgState.box[3]
    ];
  }
  function mouseup() {
    const _svg = SvgRef.value;
    const _w = (_svg.clientWidth - _svg.clientWidth / StaticState.wheelDelta) / 2;
    const _h = (_svg.clientHeight - _svg.clientHeight / StaticState.wheelDelta) / 2;

    StaticState.SvgStateBox = [
      SvgState.global[0] - (SvgState.global[0] - SvgState.box[0]) - _w,
      SvgState.global[1] - (SvgState.global[1] - SvgState.box[1]) - _h
    ];
  }

  return {
    boardMousedown: mousedown,
    boardMousemove: mousemove,
    boardMouseup: mouseup
  };
};
