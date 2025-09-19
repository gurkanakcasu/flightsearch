import axios from 'axios'

class AutocompleteService {
  constructor() {
    this.baseURL = import.meta.env.DEV ? '/api' : 'https://sorgulamax.com/api'
    this.debounceTimer = null
    this.abortController = null
  }

  async searchAirports(term, debounceMs = 300) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    if (this.abortController) {
      this.abortController.abort()
    }

    return new Promise((resolve, reject) => {
      this.debounceTimer = setTimeout(async () => {
        try {
          this.abortController = new AbortController()
          
          const response = await axios.get(
            `${this.baseURL}/autocomplete/flight-ticket`,
            {
              params: { term },
              signal: this.abortController.signal,
              timeout: 5000
            }
          )
          
          const data = response.data?.data || []
          resolve(Array.isArray(data) ? data : [])
        } catch (error) {
          if (error.name === 'AbortError') {
            resolve([])
          } else {
            reject(error)
          }
        }
      }, debounceMs)
    })
  }

  cleanup() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }
}

export default new AutocompleteService()
