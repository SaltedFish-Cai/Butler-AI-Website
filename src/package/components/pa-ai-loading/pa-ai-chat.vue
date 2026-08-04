<template>
  <div :id="renderId" class="pa-ai-chat" :style="{ width: `${FORM_WIDTH}px`, height: `${FORM_HEIGHT}px` }">
    <div ref="wrapperRef" class="pa-ai-chat__panel" :class="{ 'pa-ai-chat__panel--open': showForm }">
      <!-- Dock bar (固定在底部) -->
      <footer class="pa-ai-chat__dock">
        <div class="pa-ai-chat__dock-inner">
          <div class="pa-ai-chat__dock-left">
            <Transition name="pa-ai-chat-fade" mode="out-in">
              <div v-if="!showForm" key="orb" class="pa-ai-chat__dock-orb">
                <div class="color-orb" :style="orbStyle24" />
              </div>
              <span v-else key="blank" class="pa-ai-chat__dock-blank" />
            </Transition>
          </div>
          <button type="button" class="pa-ai-chat__ask-btn" @click="triggerOpen">
            <span class="pa-ai-chat__ask-text">Ask AI</span>
          </button>
        </div>
      </footer>

      <!-- 输入表单（绝对定位覆盖面板） -->
      <form
        class="pa-ai-chat__form"
        :class="{ 'pa-ai-chat__form--visible': showForm }"
        :style="{ pointerEvents: showForm ? 'all' : 'none' }"
        @submit.prevent="handleSubmit"
      >
        <Transition name="pa-ai-chat-fade">
          <div v-if="showForm" key="form-body" class="pa-ai-chat__form-body">
            <div class="pa-ai-chat__form-header">
              <div class="pa-ai-chat__form-orb">
                <div class="color-orb" :style="orbStyle24" />
              </div>
              <span class="pa-ai-chat__form-title">AI Input</span>
              <div class="pa-ai-chat__form-shortcut">
                <button type="submit" ref="submitBtnRef" class="pa-ai-chat__submit-btn">
                  <kbd class="pa-ai-chat__kbd">⌘</kbd>
                  <kbd class="pa-ai-chat__kbd">Enter</kbd>
                </button>
              </div>
            </div>
            <textarea
              ref="textareaRef"
              class="pa-ai-chat__textarea"
              placeholder="Ask me anything..."
              name="message"
              required
              :spellcheck="false"
              @keydown="handleKeys"
            />
          </div>
        </Transition>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, nextTick } from "vue";
import useRenderId from "../tools/render-id";

const props = defineProps<{ id?: string; renderId?: string }>();
const renderId = ref(props.renderId || (props.id ? props.id + "_" + useRenderId() : "pa-ai-chat_" + useRenderId()));

// ─── Constants ───────────────────────────────────────────────────────

const FORM_WIDTH = 360;
const FORM_HEIGHT = 200;

const SPEED_FACTOR = 1;

// ─── State ───────────────────────────────────────────────────────────

const showForm = ref(false);
const successFlag = ref(false);

const wrapperRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const submitBtnRef = ref<HTMLElement | null>(null);

// ─── ColorOrb styles ─────────────────────────────────────────────────

const orbStyle24 = computed(() => {
  const dimValue = 24;
  return {
    width: "24px",
    height: "24px",
    "--base": "oklch(22.64% 0 0)",
    "--accent1": "oklch(75% 0.15 350)",
    "--accent2": "oklch(80% 0.12 200)",
    "--accent3": "oklch(78% 0.14 280)",
    "--spin-duration": "20s",
    "--blur": `${Math.max(dimValue * 0.015, 4)}px`,
    "--contrast": String(Math.max(dimValue * 0.008, 1.5)),
    "--dot": `${Math.max(dimValue * 0.008, 0.1)}px`,
    "--shadow": `${Math.max(dimValue * 0.008, 2)}px`,
    "--mask": "25%"
  } as Record<string, string>;
});

// ─── Methods ─────────────────────────────────────────────────────────

const triggerClose = () => {
  showForm.value = false;
  textareaRef.value?.blur();
};

const triggerOpen = () => {
  showForm.value = true;
  nextTick(() => {
    textareaRef.value?.focus();
  });
};

const handleSuccess = () => {
  triggerClose();
  successFlag.value = true;
  setTimeout(() => {
    successFlag.value = false;
  }, 1500);
};

const handleSubmit = () => {
  handleSuccess();
};

const handleKeys = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    triggerClose();
  }
  if (e.key === "Enter" && e.metaKey) {
    e.preventDefault();
    submitBtnRef.value?.click();
  }
};

// ─── Click outside ───────────────────────────────────────────────────

const clickOutsideHandler = (e: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node) && showForm.value) {
    triggerClose();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", clickOutsideHandler);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", clickOutsideHandler);
});

// ─── Provide context for child components ────────────────────────────

provide("pa-ai-chat", {
  showForm,
  successFlag,
  triggerOpen,
  triggerClose
});
</script>

<style scoped lang="scss">
// ─── Container ───────────────────────────────────────────────────────

.pa-ai-chat {
  display: flex;
  align-items: center;
  justify-content: center;
}

// ─── Animated Panel ──────────────────────────────────────────────────

.pa-ai-chat__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 3;
  width: auto;
  height: 44px;
  border-radius: 20px;
  border: 1px solid var(--pa-color-border, rgba(255, 255, 255, 0.1));
  background: var(--pa-color-bg, #282828);
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-radius 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  &--open {
    width: 360px;
    height: 200px;
    border-radius: 14px;
  }
}

// ─── Dock Bar ────────────────────────────────────────────────────────

.pa-ai-chat__dock {
  margin-top: auto;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  user-select: none;
  flex-shrink: 0;
}

.pa-ai-chat__dock-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 12px;

  @media (max-width: 640px) {
    padding: 0 8px;
    height: 40px;
  }
}

.pa-ai-chat__dock-left {
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 8px;
}

.pa-ai-chat__dock-blank {
  display: block;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.pa-ai-chat__dock-orb {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pa-ai-chat__ask-btn {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  height: fit-content;
  padding: 1px 8px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--pa-color-font, rgba(255, 255, 255, 0.85));
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;

  &:hover {
    background: var(--pa-color-hover, rgba(255, 255, 255, 0.05));
  }
}

.pa-ai-chat__ask-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// ─── Form ────────────────────────────────────────────────────────────

.pa-ai-chat__form {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 360px;
  height: 200px;
  pointer-events: none;

  &--visible {
    pointer-events: all;
  }
}

.pa-ai-chat__form-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 4px;
}

.pa-ai-chat__form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.pa-ai-chat__form-orb {
  position: absolute;
  top: 8px;
  left: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pa-ai-chat__form-title {
  margin-left: 38px;
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  font-size: 14px;
  color: var(--pa-color-font, rgba(255, 255, 255, 0.85));
  z-index: 2;
}

.pa-ai-chat__form-shortcut {
  display: flex;
  align-items: center;
}

.pa-ai-chat__submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 4px;
  transform: translateY(-3px);
  padding: 0 4px 0 0;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  user-select: none;
  color: var(--pa-color-font, rgba(255, 255, 255, 0.85));
  font-size: 12px;
}

.pa-ai-chat__kbd {
  display: flex;
  height: 24px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--pa-color-border, rgba(255, 255, 255, 0.15));
  padding: 0 6px;
  font-family: sans-serif;
  font-size: 12px;
  color: var(--pa-color-font, rgba(255, 255, 255, 0.85));
}

.pa-ai-chat__textarea {
  height: 100%;
  width: 100%;
  resize: none;
  scroll-padding-top: 8px;
  border-radius: 6px;
  padding: 16px;
  outline: none;
  border: none;
  background: transparent;
  color: var(--pa-color-font, rgba(255, 255, 255, 0.85));
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;

  &::placeholder {
    color: var(--pa-color-placeholder, rgba(255, 255, 255, 0.3));
  }
}

// ─── ColorOrb CSS ────────────────────────────────────────────────────

.color-orb {
  display: grid;
  grid-template-areas: "stack";
  overflow: hidden;
  border-radius: 50%;
  position: relative;
  transform: scale(1.1);

  &::before,
  &::after {
    content: "";
    display: block;
    grid-area: stack;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: translateZ(0);
  }

  &::before {
    background: conic-gradient(from calc(var(--angle) * 2) at 25% 70%, var(--accent3), transparent 20% 80%, var(--accent3)),
      conic-gradient(from calc(var(--angle) * 2) at 45% 75%, var(--accent2), transparent 30% 60%, var(--accent2)),
      conic-gradient(from calc(var(--angle) * -3) at 80% 20%, var(--accent1), transparent 40% 60%, var(--accent1)),
      conic-gradient(from calc(var(--angle) * 2) at 15% 5%, var(--accent2), transparent 10% 90%, var(--accent2)),
      conic-gradient(from calc(var(--angle) * 1) at 20% 80%, var(--accent1), transparent 10% 90%, var(--accent1)),
      conic-gradient(from calc(var(--angle) * -2) at 85% 10%, var(--accent3), transparent 20% 80%, var(--accent3));
    box-shadow: inset var(--base) 0 0 var(--shadow) calc(var(--shadow) * 0.2);
    filter: blur(var(--blur)) contrast(var(--contrast));
    animation: pa-ai-chat-spin var(--spin-duration) linear infinite;
  }

  &::after {
    background-image: radial-gradient(circle at center, var(--base) var(--dot), transparent var(--dot));
    background-size: calc(var(--dot) * 2) calc(var(--dot) * 2);
    backdrop-filter: blur(calc(var(--blur) * 2)) contrast(calc(var(--contrast) * 2));
    mix-blend-mode: overlay;
  }
}

// ─── Keyframes ───────────────────────────────────────────────────────

@keyframes pa-ai-chat-spin {
  to {
    --angle: 360deg;
  }
}

// ─── Transition ──────────────────────────────────────────────────────

.pa-ai-chat-fade-enter-active,
.pa-ai-chat-fade-leave-active {
  transition: opacity 0.2s ease;
}

.pa-ai-chat-fade-enter-from,
.pa-ai-chat-fade-leave-to {
  opacity: 0;
}

// ─── Reduced motion ──────────────────────────────────────────────────

@media (prefers-reduced-motion: reduce) {
  .color-orb::before {
    animation: none;
  }

  .pa-ai-chat__panel {
    transition: none;
  }
}
</style>
