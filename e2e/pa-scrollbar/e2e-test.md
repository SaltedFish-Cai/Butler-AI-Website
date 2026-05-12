---
title: ScrollBar E2E Test
---

## Basic ScrollBar
<pa-scrollbar data-testid="scrollbar-basic" style="height: 200px;">
  <div style="height: 400px; padding: 16px;">
    <p>Scroll content - Basic</p>
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
    <p>Line 4</p>
    <p>Line 5</p>
  </div>
</pa-scrollbar>

## ScrollBar without Shadow
<pa-scrollbar data-testid="scrollbar-no-shadow" :use-shadow="false" style="height: 150px;">
  <div style="height: 300px; padding: 16px;">
    <p>No shadow scroll content</p>
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
    <p>Line 4</p>
    <p>Line 5</p>
  </div>
</pa-scrollbar>

## ScrollBar without Back Top
<pa-scrollbar data-testid="scrollbar-no-backtop" :use-back-top="false" style="height: 150px;">
  <div style="height: 300px; padding: 16px;">
    <p>No back top button</p>
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
  </div>
</pa-scrollbar>

## ScrollBar without Thumb
<pa-scrollbar data-testid="scrollbar-no-thumb" :show-thumb="false" style="height: 150px;">
  <div style="height: 300px; padding: 16px;">
    <p>No thumb scroll</p>
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
  </div>
</pa-scrollbar>

## ScrollBar Color Mode
<pa-scrollbar data-testid="scrollbar-color-mode" style-mode="color" style="height: 150px;">
  <div style="height: 300px; padding: 16px;">
    <p>Color mode scroll</p>
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
  </div>
</pa-scrollbar>

## ScrollBar with Padding
<pa-scrollbar data-testid="scrollbar-padding" :padding="['top', 'bottom', 'left', 'right']" style="height: 150px;">
  <div style="height: 300px;">
    <p>Padded scroll content</p>
    <p>Line 1</p>
    <p>Line 2</p>
  </div>
</pa-scrollbar>

## ScrollBar with Border
<pa-scrollbar data-testid="scrollbar-border" :border="['all']" style="height: 150px;">
  <div style="height: 300px; padding: 16px;">
    <p>Bordered scroll content</p>
    <p>Line 1</p>
    <p>Line 2</p>
  </div>
</pa-scrollbar>

## ScrollBar with Content Style
<pa-scrollbar 
  data-testid="scrollbar-content-style" 
  :content-style="{ backgroundColor: '#f5f5f5' }" 
  style="height: 150px;"
>
  <div style="height: 300px; padding: 16px;">
    <p>Custom content style</p>
    <p>Line 1</p>
    <p>Line 2</p>
  </div>
</pa-scrollbar>

## ScrollBar Horizontal Only
<pa-scrollbar 
  data-testid="scrollbar-horizontal" 
  :use-scroll-y="false" 
  :use-scroll-x="true" 
  style="height: 100px; width: 300px;"
>
  <div style="height: 60px; width: 600px; padding: 16px; display: flex;">
    <p style="white-space: nowrap;">Horizontal scroll content - very long text that needs horizontal scrolling</p>
  </div>
</pa-scrollbar>


## ScrollBar with Back Top Button
<pa-scrollbar data-testid="scrollbar-backtop" :use-back-top="true" style="height: 150px;">
  <div style="height: 500px; padding: 16px;">
    <p>Back top test content</p>
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
    <p>Line 4</p>
    <p>Line 5</p>
  </div>
</pa-scrollbar>

## ScrollBar with Padding Border
<pa-scrollbar data-testid="scrollbar-padding-border" :padding-border="['top', 'bottom']" style="height: 150px;">
  <div style="height: 300px; padding: 16px;">
    <p>Padding border content</p>
    <p>Line 1</p>
    <p>Line 2</p>
  </div>
</pa-scrollbar>

## ScrollBar with Both Scroll Directions
<pa-scrollbar 
  data-testid="scrollbar-both-directions" 
  :use-scroll-y="true" 
  :use-scroll-x="true" 
  style="height: 150px; width: 300px;">
  <div style="height: 500px; width: 600px; padding: 16px;">
    <p>Both directions scroll</p>
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
  </div>
</pa-scrollbar>

<style scoped>
div {
  margin: 16px 0;
}
</style>
