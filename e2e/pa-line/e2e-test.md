---
title: Line E2E Test
---

## Basic Line
<pa-line data-testid="line-basic" />

## Line with Custom Height
<pa-line data-testid="line-height" height="5px" />

## Line with Custom Width
<pa-line data-testid="line-width" width="200px" />

## Line with Custom Color
<pa-line data-testid="line-color" border-color="#ff0000" />

## Line with Solid Style
<pa-line data-testid="line-solid" border-style="solid" />

## Line with Dashed Style
<pa-line data-testid="line-dashed" border-style="dashed" />

## Line with Dotted Style
<pa-line data-testid="line-dotted" border-style="dotted" />

## Line with Double Style
<pa-line data-testid="line-double" border-style="double" />

## Line with Custom Padding
<pa-line data-testid="line-padding" :padding="[10, 20, 10, 20]" />

## Line with Slot Content
<pa-line data-testid="line-slot">
  <span>插槽内容</span>
</pa-line>

## Line with All Styles Combined
<pa-line 
  data-testid="line-combined"
  height="4px"
  width="300px"
  border-color="#1890ff"
  border-style="dashed"
/>

## Line with Groove Style
<pa-line data-testid="line-groove" border-style="groove" />

## Line with Inset Style
<pa-line data-testid="line-inset" border-style="inset" />

## Line with Outset Style
<pa-line data-testid="line-outset" border-style="outset" />

## Line with Ridge Style
<pa-line data-testid="line-ridge" border-style="ridge" />

<style scoped>
div {
  margin: 16px 0;
}
</style>
