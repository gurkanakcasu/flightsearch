import axios from 'axios'

class FlightService {
  constructor() {
    this.baseURL = import.meta.env.DEV ? '/api' : 'https://sorgulamax.com/api'
    this.abortController = null
  }

  async searchFlights(searchParams) {
    if (this.abortController) {
      this.abortController.abort()
    }

    this.abortController = new AbortController()

    try {
      const response = await axios.post(
        `${this.baseURL}/flight-ticket/get-flights`,
        {
          departure_date: searchParams.departureDate,
          destination: searchParams.destinationCode || searchParams.destination,
          origin: searchParams.originCode || searchParams.origin,
          passengers: { ADT: "1" },
          ...(searchParams.returnDate && { return_date: searchParams.returnDate })
        },
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          signal: this.abortController.signal,
          timeout: 10000
        }
      )

      const flightList = response.data?.data?.flightList || {}
      const departureFlights = flightList.departure || []
      const returnFlights = flightList.return || []
      
      return this.transformFlightData(departureFlights, returnFlights)
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('REQUEST_CANCELLED')
      }
      
      throw error
    }
  }

  transformFlightData(departureFlights, returnFlights = []) {
    const transformedDepartures = departureFlights.map(flight => {
      const flightInfo = typeof flight === 'string' ? JSON.parse(flight) : flight
      
      const segment = flightInfo.segments?.[0] || {}
      
      const duration = flightInfo.duration
      const durationText = duration ? 
        `${duration.hours}s ${duration.minutes}dk` : 
        'Süre bilgisi yok'
      
      const price = flightInfo.viewPrice || flightInfo.fares?.ADT?.baseFare || 0
      
      const departureTime = this.formatTime(flightInfo.departureDatetime)
      const arrivalTime = this.formatTime(flightInfo.arrivalDatetime)
      
      return {
        id: flightInfo.id,
        origin: flightInfo.departureAirport,
        destination: flightInfo.arrivalAirport,
        originCode: flightInfo.departureAirport,
        destinationCode: flightInfo.arrivalAirport,
        departureTime,
        arrivalTime,
        duration: durationText,
        airline: segment.airline || 'Bilinmeyen Havayolu',
        flightNumber: segment.flightNumber || '',
        price,
        availableSeats: flightInfo.availableSeats || 0,
        baggageInfo: flightInfo.baggageInfo,
        providerPackage: flightInfo.providerPackage,
        otherOptions: flightInfo.otherOptions || [],
        segments: flightInfo.segments || [],
        returnFlight: null 
      }
    })

    if (returnFlights.length > 0) {
      const transformedReturns = returnFlights.map(flight => {
        const flightInfo = typeof flight === 'string' ? JSON.parse(flight) : flight
        const segment = flightInfo.segments?.[0] || {}
        
        const duration = flightInfo.duration
        const durationText = duration ? 
          `${duration.hours}s ${duration.minutes}dk` : 
          'Süre bilgisi yok'
        
        const price = flightInfo.viewPrice || flightInfo.fares?.ADT?.baseFare || 0
        
        const departureTime = this.formatTime(flightInfo.departureDatetime)
        const arrivalTime = this.formatTime(flightInfo.arrivalDatetime)
        
        return {
          id: flightInfo.id,
          origin: flightInfo.departureAirport,
          destination: flightInfo.arrivalAirport,
          originCode: flightInfo.departureAirport,
          destinationCode: flightInfo.arrivalAirport,
          departureTime,
          arrivalTime,
          duration: durationText,
          airline: segment.airline || 'Bilinmeyen Havayolu',
          flightNumber: segment.flightNumber || '',
          price,
          availableSeats: flightInfo.availableSeats || 0,
          baggageInfo: flightInfo.baggageInfo,
          providerPackage: flightInfo.providerPackage,
          otherOptions: flightInfo.otherOptions || [],
          segments: flightInfo.segments || []
        }
      })

      return {
        departures: transformedDepartures,
        returns: transformedReturns
      }
    }

    return transformedDepartures
  }

  formatTime(datetime) {
    if (!datetime) return '--:--'
    try {
      const date = new Date(datetime)
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    } catch (error) {
      return '--:--'
    }
  }

  cancelRequest() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }
}

export default new FlightService()
