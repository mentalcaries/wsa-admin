<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, GripVertical } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { Problem } from '~/types';

interface Props {
  problems: Problem[];
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  save: [problems: Problem[]];
}>();

const reorderedProblems = ref<Problem[]>([]);
const draggedIndex = ref<number | null>(null);

watch(
  () => props.problems,
  (newProblems) => {
    if (newProblems) {
      reorderedProblems.value = [...newProblems].sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );
    }
  },
  { immediate: true },
);

const handleSave = () => {
  emit('save', reorderedProblems.value);
};

const handleClose = () => {
  emit('close');
};

const handleDragStart = (index: number) => {
  draggedIndex.value = index;
};

const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (
    draggedIndex.value === null ||
    draggedIndex.value === index ||
    !reorderedProblems.value
  )
    return;

  const newProblems = [...reorderedProblems.value];
  const draggedItem = newProblems[draggedIndex.value];

  if (!draggedItem) return;

  newProblems.splice(draggedIndex.value, 1);
  newProblems.splice(index, 0, draggedItem);

  reorderedProblems.value = newProblems;
  draggedIndex.value = index;
};

const handleDragEnd = () => {
  draggedIndex.value = null;
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-foreground/20" @click="handleClose" />

    <div
      class="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-lg"
    >
      <div
        class="flex items-center justify-between border-b border-border px-6 py-4"
      >
        <h2 class="text-lg font-semibold text-foreground">Reorder Problems</h2>
        <button
          class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          @click="handleClose"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="max-h-[calc(90vh-10rem)] overflow-y-auto px-6 py-6">
        <p class="text-sm text-muted-foreground mb-4">
          Drag and drop to reorder problems. Changes will be saved when you
          click Save.
        </p>

        <ul class="space-y-2">
          <li
            v-for="(problem, index) in reorderedProblems"
            :key="problem.id"
            draggable="true"
            :class="[
              'rounded-lg border border-border bg-card px-4 py-3 transition-all cursor-move',
              draggedIndex === index && 'opacity-50',
            ]"
            @dragstart="handleDragStart(index)"
            @dragover="(e) => handleDragOver(e, index)"
            @dragend="handleDragEnd"
          >
            <div class="flex items-center gap-3">
              <GripVertical class="h-5 w-5 text-muted-foreground shrink-0" />
              <span class="text-sm font-medium text-muted-foreground shrink-0">
                {{ index + 1 }}.
              </span>
              <span class="text-sm text-foreground flex-1">
                {{ problem.name }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div
        class="flex items-center justify-end gap-3 border-t border-border px-6 py-4"
      >
        <Button variant="outline" class="bg-transparent" @click="handleClose">
          Cancel
        </Button>
        <Button @click="handleSave">Save Order</Button>
      </div>
    </div>
  </div>
</template>
