---
title: Badge E2E Test
---

## Basic Badge with Value
<pa-badge data-testid="badge-value" value="5">
  <div class="badge-target">通知</div>
</pa-badge>

## Badge with Max Value
<pa-badge data-testid="badge-max" value="100" :max-value="99">
  <div class="badge-target">消息</div>
</pa-badge>

## Badge with Number Value
<pa-badge data-testid="badge-number" :value="42">
  <div class="badge-target">数字</div>
</pa-badge>

## Dot Badge
<pa-badge data-testid="badge-dot" use-dot>
  <div class="badge-target">点状</div>
</pa-badge>

## Badge without Show
<pa-badge data-testid="badge-hidden" :use-show="false">
  <div class="badge-target">隐藏</div>
</pa-badge>

## Badge with Show True
<pa-badge data-testid="badge-show" :use-show="true">
  <div class="badge-target">显示</div>
</pa-badge>

## Badge with String Value
<pa-badge data-testid="badge-string" value="new">
  <div class="badge-target">新</div>
</pa-badge>

<style scoped>
.badge-target {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
div {
  margin: 16px 0;
}
</style>
