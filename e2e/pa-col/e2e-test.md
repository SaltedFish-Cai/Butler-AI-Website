---
title: Col E2E Test
---

## Basic Col
<pa-row>
  <pa-col data-testid="col-basic" :span="12">Basic Col 12/24</pa-col>
</pa-row>

## Col with Different Span Values
<pa-row data-testid="row-spans">
  <pa-col data-testid="col-span-4" :span="4">4</pa-col>
  <pa-col data-testid="col-span-8" :span="8">8</pa-col>
  <pa-col data-testid="col-span-12" :span="12">12</pa-col>
</pa-row>

## Col with Offset
<pa-row>
  <pa-col data-testid="col-offset-4" :span="8" :offset="4">Offset 4</pa-col>
</pa-row>

## Col with Multiple Offsets
<pa-row>
  <pa-col data-testid="col-offset-8" :span="8" :offset="8">Offset 8</pa-col>
  <pa-col data-testid="col-offset-12" :span="12">No Offset</pa-col>
</pa-row>

## Col Responsive - xs
<pa-row>
  <pa-col data-testid="col-xs-24" :xs="24">xs 24</pa-col>
</pa-row>
<pa-row>
  <pa-col data-testid="col-xs-12" :xs="12">xs 12</pa-col>
  <pa-col data-testid="col-xs-12-2" :xs="12">xs 12</pa-col>
</pa-row>

## Col Responsive - sm
<pa-row>
  <pa-col data-testid="col-sm-12" :sm="12">sm 12</pa-col>
</pa-row>

## Col Responsive - md
<pa-row>
  <pa-col data-testid="col-md-8" :md="8">md 8</pa-col>
  <pa-col data-testid="col-md-8-2" :md="8">md 8</pa-col>
  <pa-col data-testid="col-md-8-3" :md="8">md 8</pa-col>
</pa-row>

## Col Responsive - lg
<pa-row>
  <pa-col data-testid="col-lg-6" :lg="6">lg 6</pa-col>
  <pa-col data-testid="col-lg-6-2" :lg="6">lg 6</pa-col>
  <pa-col data-testid="col-lg-6-3" :lg="6">lg 6</pa-col>
  <pa-col data-testid="col-lg-6-4" :lg="6">lg 6</pa-col>
</pa-row>

## Col with Responsive Object
<pa-row>
  <pa-col data-testid="col-responsive-obj" :xs="{span: 24, offset: 0}" :md="{span: 12, offset: 0}" :lg="{span: 8, offset: 0}">
    Responsive Object
  </pa-col>
</pa-row>

## Col with Responsive Offset Object
<pa-row>
  <pa-col data-testid="col-responsive-offset" :xs="{span: 20, offset: 2}" :md="{span: 18, offset: 3}" :lg="{span: 16, offset: 4}">
    Responsive Offset
  </pa-col>
</pa-row>

## Col All Props Combined
<pa-row>
  <pa-col 
    data-testid="col-all-props" 
    :span="12" 
    :offset="6"
    :xs="{span: 24}"
    :sm="{span: 12}"
    :md="{span: 8}"
  >
    All Props Combined
  </pa-col>
</pa-row>

<style scoped>
div {
  margin: 8px 0;
}
</style>
