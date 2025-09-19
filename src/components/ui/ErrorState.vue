<template>
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <h3>Bir hata oluştu</h3>
    <p>{{ message || 'Arama sırasında beklenmeyen bir hata oluştu.' }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
})

defineEmits(['retry'])
</script>

<style scoped>
.error-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3 {
  color: #dc2626;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
}

.error-state p {
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.5;
}

.retry-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background: #2563eb;
}
</style>
