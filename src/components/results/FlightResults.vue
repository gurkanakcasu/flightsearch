<template>
  <div class="results">
    <div v-if="loading" class="loading-container">
      <LoadingSkeleton :count="3" />
    </div>
    
    <div v-else-if="error" class="error-container">
      <ErrorState :message="error" @retry="$emit('retry')" />
    </div>
    
    <div v-else-if="!hasResults" class="empty-container">
      <EmptyState message="Arama kriterlerinize uygun uçuş bulunamadı. Lütfen farklı tarih veya güzergah deneyin." />
    </div>
    
    <div v-else class="results-list">
      <div class="results-header">
        <h3>{{ flightCountText }}</h3>
        <div class="search-info">
          {{ searchInfo }}
        </div>
      </div>
      
      <div class="results-items">
        <div v-if="displayResults.departures && displayResults.departures.length > 0" class="flight-section">
          <div class="section-header departure-header">
            <h4>Gidiş Uçuşları</h4>
          </div>
          <FlightResultItem
            v-for="flight in displayResults.departures"
            :key="flight.id"
            :flight="flight"
          />
        </div>
        
        <div v-if="displayResults.returns && displayResults.returns.length > 0" class="flight-section">
          <div class="section-header return-header">
            <h4>Dönüş Uçuşları</h4>
          </div>
          <FlightResultItem
            v-for="flight in displayResults.returns"
            :key="flight.id"
            :flight="flight"
          />
        </div>
        
        <FlightResultItem
          v-if="!displayResults.departures && !displayResults.returns"
          v-for="flight in results"
          :key="flight.id"
          :flight="flight"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSkeleton from '../ui/LoadingSkeleton.vue'
import ErrorState from '../ui/ErrorState.vue'
import EmptyState from '../ui/EmptyState.vue'
import FlightResultItem from './FlightResultItem.vue'

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  searchParams: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['retry'])

const hasResults = computed(() => {
  if (!props.results) return false
  
  if (typeof props.results === 'object' && !Array.isArray(props.results)) {
    return (props.results.departures && props.results.departures.length > 0) ||
           (props.results.returns && props.results.returns.length > 0)
  }
  
  return props.results.length > 0
})

const displayResults = computed(() => {
  if (props.results && typeof props.results === 'object' && !Array.isArray(props.results)) {
    return props.results
  }
  return { departures: props.results, returns: [] }
})

const flightCountText = computed(() => {
  if (!props.results) return 'Uçuş bulunamadı'
  
  if (typeof props.results === 'object' && !Array.isArray(props.results)) {
    const departures = props.results.departures || []
    const returns = props.results.returns || []
    
    let text = ''
    
    if (departures.length > 0) {
      text += `Gidiş: ${departures.length} uçuş`
    }
    
    if (returns.length > 0) {
      if (text) text += ' • '
      text += `Dönüş: ${returns.length} uçuş`
    }
    
    return text || 'Uçuş bulunamadı'
  }
  
  return `${props.results.length} uçuş bulundu`
})

const searchInfo = computed(() => {
  if (!props.searchParams.origin || !props.searchParams.destination) {
    return ''
  }
  
  const origin = props.searchParams.origin
  const destination = props.searchParams.destination
  const departureDate = props.searchParams.departureDate
  const returnDate = props.searchParams.returnDate
  
  let info = `${origin} → ${destination}`
  
  if (departureDate) {
    const date = new Date(departureDate).toLocaleDateString('tr-TR')
    info += ` • ${date}`
  }
  
  if (returnDate) {
    const date = new Date(returnDate).toLocaleDateString('tr-TR')
    info += ` • Dönüş: ${date}`
  }
  
  return info
})
</script>

<style scoped>
.results {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading-container,
.error-container,
.empty-container {
  padding: 0;
}

.results-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.results-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.search-info {
  font-size: 14px;
  color: #64748b;
}

.results-items {
  max-height: 600px;
  overflow-y: auto;
}

.flight-section {
  margin-bottom: 20px;
}

.section-header {
  padding: 16px 20px 8px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.section-header h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.departure-header h4 {
  color: #059669;
}

.return-header h4 {
  color: #dc2626;
}

@media (max-width: 768px) {
  .results-header {
    padding: 16px;
  }
  
  .results-header h3 {
    font-size: 16px;
  }
  
  .search-info {
    font-size: 13px;
  }
}
</style>
