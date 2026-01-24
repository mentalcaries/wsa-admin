<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  problemName: string;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const handleClose = () => {
  emit('close');
};

const handleConfirm = () => {
  emit('confirm');
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-foreground/20" @click="handleClose" />

    <!-- Dialog -->
    <div
      class="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg"
    >
      <div class="flex items-start gap-4">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10"
        >
          <AlertTriangle class="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Delete Problem</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete
            <span class="font-medium text-foreground">"{{ problemName }}"</span
            >? This action cannot be undone and will also delete all associated
            solutions.
          </p>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end gap-3">
        <Button variant="outline" class="bg-transparent" @click="handleClose">
          Cancel
        </Button>
        <Button variant="destructive" @click="handleConfirm"> Delete </Button>
      </div>
    </div>
  </div>
</template>
