import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import autocompleteService from '../services/autocompleteService.js'
import flightService from '../services/flightService.js'

export const useSearchStore = defineStore('search', () => {
  // Tab state
  const activeTab = ref('flight')
  
  // Form state
  const searchForm = ref({
    origin: '',
    destination: '',
    originCode: '',
    destinationCode: '',
    departureDate: '',
    returnDate: '',
    passengers: 1
  })

  // Autocomplete state
  const originSuggestions = ref([])
  const destinationSuggestions = ref([])
  const originLoading = ref(false)
  const destinationLoading = ref(false)
  const originSelected = ref(false)
  const destinationSelected = ref(false)

  // Search results state
  const searchResults = ref([])
  const searchLoading = ref(false)
  const searchError = ref(null)
  const lastSearchId = ref(0)

  // Computed
  const isFormValid = computed(() => {
    return searchForm.value.origin && 
           searchForm.value.destination && 
           searchForm.value.departureDate &&
           searchForm.value.origin !== searchForm.value.destination
  })

  const hasResults = computed(() => {
    return searchResults.value.length > 0
  })

  // Actions
  const setActiveTab = (tab) => {
    activeTab.value = tab
  }

  const updateFormField = (field, value) => {
    searchForm.value[field] = value
  }

  const setOrigin = (suggestion) => {
    searchForm.value.origin = suggestion.name
    searchForm.value.originCode = suggestion.code
    originSelected.value = true
    originSuggestions.value = []
  }

  const setDestination = (suggestion) => {
    searchForm.value.destination = suggestion.name
    searchForm.value.destinationCode = suggestion.code
    destinationSelected.value = true
    destinationSuggestions.value = []
  }

  const searchOriginAirports = async (term) => {
    if (term.length < 2) {
      originSuggestions.value = []
      return
    }

    originLoading.value = true
    originSelected.value = false

    try {
      const suggestions = await autocompleteService.searchAirports(term)
      originSuggestions.value = suggestions
    } catch (error) {
      console.error('Origin autocomplete error:', error)
      originSuggestions.value = []
    } finally {
      originLoading.value = false
    }
  }

  const searchDestinationAirports = async (term) => {
    if (term.length < 2) {
      destinationSuggestions.value = []
      return
    }

    destinationLoading.value = true
    destinationSelected.value = false

    try {
      const suggestions = await autocompleteService.searchAirports(term)
      destinationSuggestions.value = suggestions
    } catch (error) {
      console.error('Destination autocomplete error:', error)
      destinationSuggestions.value = []
    } finally {
      destinationLoading.value = false
    }
  }

  const searchFlights = async () => {
    if (!isFormValid.value) return

    // Yeni arama ID'si oluştur
    const currentSearchId = ++lastSearchId.value
    
    searchLoading.value = true
    searchError.value = null
    searchResults.value = []

    try {
      const results = await flightService.searchFlights(searchForm.value)
      
      // Sadece en güncel aramanın sonucunu göster
      if (currentSearchId === lastSearchId.value) {
        searchResults.value = results
      }
    } catch (error) {
      if (currentSearchId === lastSearchId.value) {
        if (error.message === 'REQUEST_CANCELLED') {
          // İstek iptal edildi, sessizce geç
          return
        }
        searchError.value = error.message || 'Arama sırasında bir hata oluştu'
      }
    } finally {
      if (currentSearchId === lastSearchId.value) {
        searchLoading.value = false
      }
    }
  }

  const retrySearch = () => {
    searchError.value = null
    searchFlights()
  }

  const clearResults = () => {
    searchResults.value = []
    searchError.value = null
  }

  const clearSuggestions = () => {
    originSuggestions.value = []
    destinationSuggestions.value = []
    originSelected.value = false
    destinationSelected.value = false
  }

  const resetForm = () => {
    searchForm.value = {
      origin: '',
      destination: '',
      originCode: '',
      destinationCode: '',
      departureDate: '',
      returnDate: '',
      passengers: 1
    }
    clearResults()
    clearSuggestions()
  }

  return {
    // State
    activeTab,
    searchForm,
    originSuggestions,
    destinationSuggestions,
    originLoading,
    destinationLoading,
    originSelected,
    destinationSelected,
    searchResults,
    searchLoading,
    searchError,
    
    // Computed
    isFormValid,
    hasResults,
    
    // Actions
    setActiveTab,
    updateFormField,
    setOrigin,
    setDestination,
    searchOriginAirports,
    searchDestinationAirports,
    searchFlights,
    retrySearch,
    clearResults,
    clearSuggestions,
    resetForm
  }
})
