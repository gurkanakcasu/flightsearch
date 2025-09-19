<template>
  <div class="loading-skeleton">
    <div v-for="i in count" :key="i" class="skeleton-item">
      <div class="skeleton-header">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line short"></div>
      </div>
      <div class="skeleton-details">
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.loading-skeleton {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.skeleton-item {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.skeleton-item:last-child {
  border-bottom: none;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.skeleton-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-line {
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-line.short {
  width: 120px;
}

.skeleton-line.medium {
  width: 200px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
