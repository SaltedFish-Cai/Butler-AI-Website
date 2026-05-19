---
name: create-component
description: Create a new PancakeUI component with all required files following project conventions
---

# Create Component

Creates a new `pa-{name}` component with all scaffold files.

## Usage

Trigger with: "创建组件 xxx" or "create component xxx"

## Steps

1. Extract component name from the prompt (e.g., "创建组件 button" → "button")
2. Validate name (lowercase, letters/dashes only, no `pa-` prefix)
3. Check no existing directory at `src/package/components/pa-{name}/`
4. Create the component directory
5. Generate the following files following `checklist.md` and existing `pa-tag` conventions:

### Files to create

#### `src/package/components/pa-{name}/index.ts`
- Component registration file
- Import `Pa{Name}` from `./pa-{name}.vue`
- Export `{ name: "PaName", install }` following existing pattern
- JSDoc on all imports, name, install function per checklist.md

#### `src/package/components/pa-{name}/types.d.ts`
- `ComponentProps` — must include `id?`, `class?`, `style?`, plus component-specific props
- `ComponentEmits` (if needed) — function overload format
- JSDoc on all exports and properties per checklist.md
- Array types use `Array<T>` not `T[]`

#### `src/package/components/pa-{name}/pa-{name}.vue`
- `<script lang="ts" setup>` with `defineProps<ComponentProps>()`, `defineEmits<ComponentEmits>()`
- Code order: imports → const/let → function → lifecycle → watch per checklist.md
- JSDoc on all imports, variables, functions, lifecycle hooks, watch
- `<style lang="scss">` with `@use "./index.scss";`
- Root class: `pa-{name}`

#### `src/package/components/pa-{name}/index.scss`
- Root class `.pa-{name} { ... }`
- CSS variables for colors/sizes (--pa-color-*, --pa-size-*)
- 2-space indent, no hardcoded colors, no single-line comments per checklist.md

#### `src/package/components/pa-{name}/pa-{name}.test.ts`
- Vitest + `@vue/test-utils`
- Mock dependencies (pa-icon, pa-popover, etc.) following `pa-tag.test.ts` pattern
- Test categories: rendering, props, events, edge cases
- `install` function test block at the end

6. Report back with the created file list
7. Ask user to review before committing
