---
name: test-component
description: Run unit tests for a specific PanckeUI component
---

# Test Component

Runs vitest unit tests for a specific `pa-{name}` component.

## Usage

Trigger with: "测试组件 xxx" or "test component xxx"

## Steps

1. Extract component name from the prompt (e.g., "测试组件 tag" → "tag")
2. Locate the test file at `src/package/components/pa-{name}/pa-{name}.test.ts`
3. If file doesn't exist, report and offer to create via `create-component` skill
4. Run the test:

   ```bash
   npx vitest run src/package/components/pa-{name}/pa-{name}.test.ts
   ```

5. Show the test results (pass/fail summary)
6. If tests fail:
   - Read the test file and the component source to understand failures
   - Fix issues in the component or test code
   - Re-run tests
   - Report what was fixed
7. If tests pass, report success with a summary (test count, duration)
