<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <h1>Bilet Arama</h1>
      </div>
    </header>
    
    <main class="app-main">
      <div class="container">
        <!-- Tabs -->
        <div class="tabs">
          <div class="tab-list">
            <button
              :class="['tab-item', { active: activeTab === 'flight' }]"
              @click="setActiveTab('flight')"
            >
              ✈️ Uçak Bileti
            </button>
            <button
              :class="['tab-item', { active: activeTab === 'bus' }]"
              @click="setActiveTab('bus')"
            >
              🚌 Otobüs Bileti
            </button>
            <button
              :class="['tab-item', { active: activeTab === 'car' }]"
              @click="setActiveTab('car')"
            >
              🚗 Araç Kiralama
            </button>
            <button
              :class="['tab-item', { active: activeTab === 'hotel' }]"
              @click="setActiveTab('hotel')"
            >
              🏨 Otel
            </button>
          </div>
          
          <div class="tab-content">
            <!-- Flight Tab -->
            <div v-if="activeTab === 'flight'" class="flight-tab">
              <SearchForm />
              <FlightResults
                :results="searchResults"
                :loading="searchLoading"
                :error="searchError"
                :search-params="searchForm"
                @retry="retrySearch"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSearchStore } from './stores/searchStore.js'
import SearchForm from './components/search/SearchForm.vue'
import FlightResults from './components/results/FlightResults.vue'

const store = useSearchStore()

const activeTab = computed(() => store.activeTab)
const searchResults = computed(() => store.searchResults)
const searchLoading = computed(() => store.searchLoading)
const searchError = computed(() => store.searchError)
const searchForm = computed(() => store.searchForm)

const setActiveTab = (tab) => {
  store.setActiveTab(tab)
}

const retrySearch = () => {
  store.retrySearch()
}

const getTabTitle = (tab) => {
  const titles = {
    bus: 'Otobüs Bileti',
    car: 'Araç Kiralama',
    hotel: 'Otel Rezervasyonu'
  }
  return titles[tab] || 'Hizmet'
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f8fafc;
}

.app-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 40px 0;
  text-align: center;
}

.app-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.app-header p {
  font-size: 16px;
  opacity: 0.9;
}

.app-main {
  padding: 20px 0 40px;
}

.tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  overflow: hidden;
}

.tab-list {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tab-item {
  flex: 1;
  padding: 16px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s ease;
  position: relative;
}

.tab-item:hover {
  background-color: #f1f5f9;
  color: #334155;
}

.tab-item.active {
  color: #3b82f6;
  background-color: #eff6ff;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #3b82f6;
}

.tab-content {
  padding: 24px;
}

.tab-placeholder {
  text-align: center;
  padding: 60px 20px;
}

.placeholder-content {
  max-width: 400px;
  margin: 0 auto;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.placeholder-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.placeholder-content p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.switch-tab-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.switch-tab-button:hover {
  background: #2563eb;
}

@media (max-width: 768px) {
  .app-header {
    padding: 30px 0;
  }
  
  .app-header h1 {
    font-size: 24px;
  }
  
  .app-header p {
    font-size: 14px;
  }
  
  .tab-list {
    flex-direction: column;
  }
  
  .tab-item {
    text-align: center;
  }
  
  .tab-content {
    padding: 16px;
  }
  
  .placeholder-icon {
    font-size: 48px;
  }
  
  .placeholder-content h3 {
    font-size: 20px;
  }
}
</style>
