<template>
  <div class="empty-state">
    <div class="empty-icon">✈️</div>
    <h3>Uçuş bulunamadı</h3>
    <p>{{ message || 'Arama kriterlerinize uygun uçuş bulunamadı. Lütfen farklı tarih veya güzergah deneyin.' }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #374151;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
}

.empty-state p {
  color: #64748b;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
}
</style>
