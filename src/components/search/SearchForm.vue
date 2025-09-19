<template>
  <div class="search-form">
    <div class="form-grid">
      <div class="form-group">
        <label for="origin">Nereden</label>
        <AutocompleteInput
          id="origin"
          v-model="localForm.origin"
          :suggestions="originSuggestions"
          :loading="originLoading"
          placeholder="Şehir veya havaalanı adı"
          @search="handleOriginSearch"
          @select="handleOriginSelect"
        />
      </div>
      
      <div class="form-group">
        <label for="destination">Nereye</label>
        <AutocompleteInput
          id="destination"
          v-model="localForm.destination"
          :suggestions="destinationSuggestions"
          :loading="destinationLoading"
          placeholder="Şehir veya havaalanı adı"
          @search="handleDestinationSearch"
          @select="handleDestinationSelect"
        />
      </div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="departureDate">Gidiş Tarihi</label>
        <input
          id="departureDate"
          v-model="localForm.departureDate"
          type="date"
          :min="today"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="returnDate">Dönüş Tarihi (Opsiyonel)</label>
        <input
          id="returnDate"
          v-model="localForm.returnDate"
          type="date"
          :min="localForm.departureDate || today"
          :disabled="!localForm.departureDate"
        />
      </div>
    </div>
    
    <div class="form-actions">
      <button
        type="button"
        class="search-button"
        :disabled="!isFormValid || searchLoading"
        @click="handleSearch"
      >
        <span v-if="searchLoading">Aranıyor...</span>
        <span v-else>Uçuş Ara</span>
      </button>
    </div>
    
    <div v-if="formError" class="form-error">
      {{ formError }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AutocompleteInput from './AutocompleteInput.vue'
import { useSearchStore } from '../../stores/searchStore.js'

const store = useSearchStore()

const localForm = ref({
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: ''
})

const formError = ref('')

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return localForm.value.origin && 
         localForm.value.destination && 
         localForm.value.departureDate &&
         localForm.value.origin !== localForm.value.destination
})

const originSuggestions = computed(() => store.originSuggestions)
const destinationSuggestions = computed(() => store.destinationSuggestions)
const originLoading = computed(() => store.originLoading)
const destinationLoading = computed(() => store.destinationLoading)
const searchLoading = computed(() => store.searchLoading)

const handleOriginSearch = (term) => {
  formError.value = ''
  store.searchOriginAirports(term)
}

const handleDestinationSearch = (term) => {
  formError.value = ''
  store.searchDestinationAirports(term)
}

const handleOriginSelect = (suggestion) => {
  store.setOrigin(suggestion)
  localForm.value.origin = suggestion.name
}

const handleDestinationSelect = (suggestion) => {
  store.setDestination(suggestion)
  localForm.value.destination = suggestion.name
}

const handleSearch = () => {
  formError.value = ''
  
  if (!isFormValid.value) {
    if (localForm.value.origin === localForm.value.destination) {
      formError.value = 'Kalkış ve varış noktaları aynı olamaz'
    } else {
      formError.value = 'Lütfen tüm gerekli alanları doldurun'
    }
    return
  }
  
  store.updateFormField('origin', localForm.value.origin)
  store.updateFormField('destination', localForm.value.destination)
  store.updateFormField('departureDate', localForm.value.departureDate)
  store.updateFormField('returnDate', localForm.value.returnDate)
  
  store.searchFlights()
}

watch(() => store.searchForm, (newForm) => {
  localForm.value = {
    origin: newForm.origin,
    destination: newForm.destination,
    departureDate: newForm.departureDate,
    returnDate: newForm.returnDate
  }
}, { deep: true })
</script>

<style scoped>
.search-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input:disabled {
  background-color: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 20px;
}

.search-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.search-button:hover:not(:disabled) {
  background: #2563eb;
}

.search-button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.form-error {
  margin-top: 12px;
  padding: 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 14px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
  }
}
</style>
