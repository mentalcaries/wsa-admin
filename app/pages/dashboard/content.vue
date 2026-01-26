<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Plus,
  FileText,
  Lightbulb,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { Problem } from '~/types';
import { initialProblems } from '~/utils/content-data';

definePageMeta({
  layout: 'dashboard',
});

const ITEMS_PER_PAGE = 10;

const problems = ref<Problem[]>([...initialProblems]);
const searchQuery = ref('');
const currentPage = ref(1);
const editingProblem = ref<Problem | null>(null);
const isModalOpen = ref(false);
const deletingProblem = ref<Problem | null>(null);
const isDeleteDialogOpen = ref(false);

const filteredProblems = computed(() => {
  return problems.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredProblems.value.length / ITEMS_PER_PAGE),
);

const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);

const paginatedProblems = computed(() => {
  return filteredProblems.value.slice(
    startIndex.value,
    startIndex.value + ITEMS_PER_PAGE,
  );
});

const totalSolutions = computed(() => {
  return problems.value.reduce((sum, p) => sum + p.solutions.length, 0);
});

const handleToggleActive = (problemId: string) => {
  problems.value = problems.value.map((p) =>
    p.id === problemId ? { ...p, active: !p.active } : p,
  );
};

const handleEdit = (problem: Problem) => {
  editingProblem.value = problem;
  isModalOpen.value = true;
};

const handleAddNew = () => {
  const newId = String(
    Math.max(...problems.value.map((p) => Number(p.id))) + 1,
  );
  const newProblem: Problem = {
    id: newId,
    name: '',
    solutions: [],
    active: true,
    displayOrder: problems.value.length + 1,
  };
  editingProblem.value = newProblem;
  isModalOpen.value = true;
};

const handleSave = (updatedProblem: Problem) => {
  const exists = problems.value.find((p) => p.id === updatedProblem.id);
  if (exists) {
    problems.value = problems.value.map((p) =>
      p.id === updatedProblem.id ? updatedProblem : p,
    );
  } else {
    problems.value = [...problems.value, updatedProblem];
  }
  isModalOpen.value = false;
  editingProblem.value = null;
};

const handleDeleteClick = (problem: Problem) => {
  deletingProblem.value = problem;
  isDeleteDialogOpen.value = true;
};

const handleConfirmDelete = () => {
  if (deletingProblem.value) {
    problems.value = problems.value.filter(
      (p) => p.id !== deletingProblem.value!.id,
    );
  }
  isDeleteDialogOpen.value = false;
  deletingProblem.value = null;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingProblem.value = null;
};

const closeDeleteDialog = () => {
  isDeleteDialogOpen.value = false;
  deletingProblem.value = null;
};

const handleSearchChange = (value: string) => {
  searchQuery.value = value;
  currentPage.value = 1;
};

const goToPrevPage = () => {
  currentPage.value = Math.max(1, currentPage.value - 1);
};

const goToNextPage = () => {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
};
</script>

<template>
  <div class="min-h-screen bg-background">

    <main class="pt-14">
      <div class="mx-auto max-w-7xl px-6 py-10">
        <!-- Header -->
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <h1 class="text-2xl font-semibold text-foreground">
            Content Management
          </h1>
          <Button class="gap-2" @click="handleAddNew">
            <Plus class="h-4 w-4" />
            Add Problem
          </Button>
        </div>

        <!-- Stats Cards -->
        <div class="mt-8 grid grid-cols-2 gap-6 sm:max-w-md">
          <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
              >
                <FileText class="h-6 w-6 text-primary" />
              </div>
              <div>
                <p class="text-3xl font-semibold text-foreground">
                  {{ problems.length }}
                </p>
                <p class="text-sm text-muted-foreground">Problems</p>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10"
              >
                <Lightbulb class="h-6 w-6 text-success" />
              </div>
              <div>
                <p class="text-3xl font-semibold text-foreground">
                  {{ totalSolutions }}
                </p>
                <p class="text-sm text-muted-foreground">Solutions</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="mt-8">
          <div class="relative max-w-md">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              :value="searchQuery"
              type="text"
              placeholder="Search problems..."
              class="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              @input="
                handleSearchChange(($event.target as HTMLInputElement).value)
              "
            />
          </div>
        </div>

        <!-- Problems Table -->
        <div
          class="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border bg-muted/50">
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    ID
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Problem Name
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Solutions
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Active
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  v-for="problem in paginatedProblems"
                  :key="problem.id"
                  class="transition-colors hover:bg-muted/30"
                >
                  <td
                    class="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground"
                  >
                    {{ problem.id }}
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-foreground">
                    {{ problem.name }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      class="inline-flex items-center rounded-full bg-/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {{ problem.solutions.length }} solutions
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <Switch
                      :checked="problem.active"
                      @update:checked="handleToggleActive(problem.id)"
                    />
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0"
                        @click="handleEdit(problem)"
                      >
                        <Pencil class="h-4 w-4" />
                        <span class="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        @click="handleDeleteClick(problem)"
                      >
                        <Trash2 class="h-4 w-4" />
                        <span class="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            class="flex items-center justify-between border-t border-border px-6 py-4"
          >
            <p class="text-sm text-muted-foreground">
              {{ startIndex + 1 }}-{{
                Math.min(startIndex + ITEMS_PER_PAGE, filteredProblems.length)
              }}
              of {{ filteredProblems.length }}
            </p>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0 bg-transparent"
                :disabled="currentPage === 1"
                @click="goToPrevPage"
              >
                <ChevronLeft class="h-4 w-4" />
                <span class="sr-only">Previous</span>
              </Button>
              <span class="text-sm text-muted-foreground">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0 bg-transparent"
                :disabled="currentPage === totalPages"
                @click="goToNextPage"
              >
                <ChevronRight class="h-4 w-4" />
                <span class="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Problem Edit Modal -->
    <ContentProblemModal
      :problem="editingProblem"
      :is-open="isModalOpen"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Dialog -->
    <ContentDeleteConfirmDialog
      :is-open="isDeleteDialogOpen"
      :problem-name="deletingProblem?.name || ''"
      @close="closeDeleteDialog"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>
