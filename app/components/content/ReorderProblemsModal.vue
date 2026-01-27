<script setup lang="ts">
import { ref, watch } from 'vue';
import { GripVertical } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Problem } from '~/types';

interface Props {
  problems: Problem[];
  open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:open': [value: boolean];
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

const handleOpenChange = (open: boolean) => {
  emit('update:open', open);
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
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Reorder Problems</DialogTitle>
        <DialogDescription>
          Drag and drop to reorder problems. Changes will be saved when you click Save.
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto py-4">
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

      <DialogFooter>
        <Button variant="outline" @click="handleOpenChange(false)">
          Cancel
        </Button>
        <Button @click="handleSave">Save Order</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>