<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Plus, GripVertical, Pencil, Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Problem, Solution } from '~/types';
import { toast } from 'vue-sonner';

interface Props {
  problem: Problem | null;
  open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:open': [value: boolean];
  save: [problem: Problem];
}>();

const editedProblem = ref<Problem | null>(null);
const editingSolutionId = ref<string | null>(null);
const draggedIndex = ref<number | null>(null);
const validationError = ref<string | null>(null);

const isNewProblem = computed(() => !props.problem?.name);

const addButtonText = computed(() => {
  if (!editedProblem.value || editedProblem.value.solutions.length === 0) {
    return 'Add Solution';
  }
  return 'Add Another';
});

watch(
  () => props.problem,
  (newProblem) => {
    if (newProblem) {
      editedProblem.value = {
        ...newProblem,
        solutions: [...newProblem.solutions],
      };
      editingSolutionId.value = null;
      validationError.value = null;
    }
  },
  { immediate: true },
);

const handleSave = () => {
  if (!editedProblem.value) return;

  const nonEmptySolutions = editedProblem.value.solutions.filter(
    (s) => s.text.trim() !== '',
  );

  if (editedProblem.value.solutions.length !== nonEmptySolutions.length) {
    toast({
      title: 'Validation Error',
      description:
        'Please fill in all solutions or remove empty ones before saving.',
      variant: 'destructive',
    });
    return;
  }

  validationError.value = null;
  emit('save', editedProblem.value);
};

const handleOpenChange = (open: boolean) => {
  if (!open) {
    validationError.value = null;
  }
  emit('update:open', open);
};

const handleAddSolution = () => {
  if (!editedProblem.value) return;

  const newSolutionId = `${editedProblem.value.id}${String.fromCharCode(65 + editedProblem.value.solutions.length)}`;
  const newSolution: Solution = {
    id: newSolutionId,
    text: '',
    displayOrder: editedProblem.value.solutions.length + 1,
  };
  editedProblem.value = {
    ...editedProblem.value,
    solutions: [...editedProblem.value.solutions, newSolution],
  };
  editingSolutionId.value = newSolutionId;
};

const handleUpdateSolution = (solutionId: string, newText: string) => {
  if (!editedProblem.value) return;

  editedProblem.value = {
    ...editedProblem.value,
    solutions: editedProblem.value.solutions.map((s) =>
      s.id === solutionId ? { ...s, text: newText } : s,
    ),
  };
};

const handleDeleteSolution = (solutionId: string) => {
  if (!editedProblem.value) return;

  editedProblem.value = {
    ...editedProblem.value,
    solutions: editedProblem.value.solutions
      .filter((s) => s.id !== solutionId)
      .map((s, idx) => ({ ...s, displayOrder: idx + 1 })),
  };
};

const handleDragStart = (index: number) => {
  draggedIndex.value = index;
};

const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (
    draggedIndex.value === null ||
    draggedIndex.value === index ||
    !editedProblem.value
  )
    return;

  const newSolutions = [...editedProblem.value.solutions];
  const draggedItem = newSolutions[draggedIndex.value];

  if (!draggedItem) return;

  newSolutions.splice(draggedIndex.value, 1);
  newSolutions.splice(index, 0, draggedItem);

  const reorderedSolutions = newSolutions.map((s, idx) => ({
    ...s,
    displayOrder: idx + 1,
  }));

  editedProblem.value = {
    ...editedProblem.value,
    solutions: reorderedSolutions,
  };
  draggedIndex.value = index;
};

const handleDragEnd = () => {
  draggedIndex.value = null;
};
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent
      v-if="editedProblem"
      class="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      @interact-outside="
        (event) => {
          const target = event.target as HTMLElement;
          if (target?.closest('[data-sonner-toaster]')) {
            event.preventDefault();
          }
        }
      "
    >
      <DialogHeader>
        <DialogTitle>
          {{ isNewProblem ? 'Add New Problem' : 'Edit Problem' }}
        </DialogTitle>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto space-y-6 px-2 py-5">
        <div
          v-if="validationError"
          class="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {{ validationError }}
        </div>

        <div class="space-y-5">
          <h3
            class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            Problem Details
          </h3>

          <div
            v-if="!isNewProblem"
            class="flex gap-3 rounded-lg bg-muted px-4 py-2.5"
          >
            <Label class="text-md text-muted-foreground">Problem ID</Label>
            <p class="text-md font-medium">{{ editedProblem.id }}</p>
          </div>

          <div class="space-y-2">
            <Label for="problem-name">Problem Name</Label>
            <Input
              id="problem-name"
              v-model="editedProblem.name"
              placeholder="Enter problem type"
            />
          </div>

          <div class="flex items-center gap-5">
            <Label>Active</Label>
            <Switch
              :model-value="editedProblem.active"
              @update:model-value="
                (checked: boolean) => (editedProblem!.active = checked)
              "
            />
          </div>
        </div>

        <div class="h-px bg-border" />

        <div class="space-y-4">
          <h3
            class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            Solutions ({{ editedProblem.solutions.length }})
          </h3>

          <ul v-if="editedProblem.solutions.length > 0" class="space-y-2">
            <li
              v-for="(solution, index) in editedProblem.solutions"
              :key="solution.id"
              draggable="true"
              :class="[
                'rounded-lg border border-border bg-muted/30 transition-all',
                draggedIndex === index && 'opacity-50',
              ]"
              @dragstart="handleDragStart(index)"
              @dragover="(e) => handleDragOver(e, index)"
              @dragend="handleDragEnd"
            >
              <div class="flex items-start gap-3 px-4 py-3">
                <button
                  class="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
                  @mousedown.stop
                >
                  <GripVertical class="h-4 w-4" />
                </button>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-xs font-medium text-muted-foreground">
                      {{ solution.id }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                      Order: {{ solution.displayOrder }}
                    </span>
                  </div>

                  <Textarea
                    v-if="editingSolutionId === solution.id"
                    :model-value="solution.text"
                    rows="3"
                    placeholder="Enter solution text..."
                    autofocus
                    @update:model-value="
                      (value) =>
                        handleUpdateSolution(solution.id, String(value))
                    "
                    @blur="editingSolutionId = null"
                  />
                  <p
                    v-else
                    class="text-sm text-foreground cursor-pointer hover:bg-muted/50 rounded p-2 -mx-2"
                    @click="editingSolutionId = solution.id"
                  >
                    <span v-if="solution.text">{{ solution.text }}</span>
                    <span v-else class="italic text-muted-foreground"
                      >Click to add solution text</span
                    >
                  </p>
                </div>

                <div class="flex items-center gap-1">
                  <button
                    class="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    @click="editingSolutionId = solution.id"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                    @click="handleDeleteSolution(solution.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          </ul>

          <Button
            size="sm"
            variant="default"
            class="w-full gap-2 my-8"
            @click="handleAddSolution"
          >
            <Plus class="h-4 w-4" />
            {{ addButtonText }}
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleOpenChange(false)">
          Cancel
        </Button>
        <Button @click="handleSave">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
