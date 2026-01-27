<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Problem, Solution } from '~/types';

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
const expandedSolutions = ref<Set<string>>(new Set());
const editingSolutionId = ref<string | null>(null);
const draggedIndex = ref<number | null>(null);

const isNewProblem = computed(() => !props.problem?.name);

watch(
  () => props.problem,
  (newProblem) => {
    if (newProblem) {
      editedProblem.value = {
        ...newProblem,
        solutions: [...newProblem.solutions],
      };
      expandedSolutions.value = new Set();
      editingSolutionId.value = null;
    }
  },
  { immediate: true },
);

const handleSave = () => {
  if (editedProblem.value) {
    emit('save', editedProblem.value);
  }
};

const handleOpenChange = (open: boolean) => {
  emit('update:open', open);
};

const toggleSolutionExpand = (solutionId: string) => {
  const newSet = new Set(expandedSolutions.value);
  if (newSet.has(solutionId)) {
    newSet.delete(solutionId);
  } else {
    newSet.add(solutionId);
  }
  expandedSolutions.value = newSet;
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
  expandedSolutions.value = new Set([
    ...expandedSolutions.value,
    newSolutionId,
  ]);
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
      class="!sm:max-w-4xl max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <DialogHeader>
        <DialogTitle>
          {{ isNewProblem ? 'Add New Problem' : 'Edit Problem' }}
        </DialogTitle>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto space-y-6">
        <div class="space-y-5">
          <h3
            class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            Problem Details
          </h3>

          <div v-if="!isNewProblem" class="p-2">
            <label
              class="mb-2 block text-sm font-medium text-foreground"
              for="problem-id"
            >
              Problem ID
            </label>
            <input
              v-model="editedProblem.id"
              type="text"
              readonly
              class="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground"
              id="problem-id"
            />
          </div>

          <div class="p-2">
            <label
              class="mb-2 block text-sm font-medium text-foreground"
              for="problem-name"
            >
              Problem Name
            </label>
            <input
              v-model="editedProblem.name"
              type="text"
              class="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter problem type"
              id="problem-name"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-foreground">Active</label>
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
          <div class="flex items-center justify-between">
            <h3
              class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
            >
              Solutions ({{ editedProblem.solutions.length }})
            </h3>
            <Button
              size="sm"
              variant="outline"
              class="gap-2 bg-transparent"
              @click="handleAddSolution"
            >
              <Plus class="h-4 w-4" />
              Add Solution
            </Button>
          </div>

          <div
            v-if="editedProblem.solutions.length === 0"
            class="rounded-lg border border-dashed border-border py-8 text-center"
          >
            <p class="text-sm text-muted-foreground">
              No solutions yet. Add one above.
            </p>
          </div>

          <ul v-else class="space-y-2">
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
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-medium text-muted-foreground">
                      {{ solution.id }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                      Order: {{ solution.displayOrder }}
                    </span>
                  </div>

                  <textarea
                    v-if="editingSolutionId === solution.id"
                    :value="solution.text"
                    rows="3"
                    class="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Enter solution text..."
                    autofocus
                    @input="
                      handleUpdateSolution(
                        solution.id,
                        ($event.target as HTMLTextAreaElement).value,
                      )
                    "
                    @blur="editingSolutionId = null"
                  />

                  <p
                    v-else
                    :class="[
                      'mt-1 text-sm text-foreground',
                      !expandedSolutions.has(solution.id) && 'line-clamp-2',
                    ]"
                  >
                    <span v-if="solution.text">{{ solution.text }}</span>
                    <span v-else class="italic text-muted-foreground"
                      >No text entered</span
                    >
                  </p>
                </div>

                <div class="flex items-center gap-1">
                  <button
                    v-if="
                      solution.text.length > 100 &&
                      editingSolutionId !== solution.id
                    "
                    class="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    @click="toggleSolutionExpand(solution.id)"
                  >
                    <ChevronUp
                      v-if="expandedSolutions.has(solution.id)"
                      class="h-4 w-4"
                    />
                    <ChevronDown v-else class="h-4 w-4" />
                  </button>
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
