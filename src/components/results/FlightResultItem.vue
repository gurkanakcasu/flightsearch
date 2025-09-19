<template>
  <div class="result-item">
    <div class="result-header">
      <div class="route">{{ flight.origin }} → {{ flight.destination }}</div>
      <div class="price">{{ formatPrice(flight.price) }}</div>
    </div>
    
    <div class="flight-details">
      <div class="time-info">
        <div class="time">{{ flight.departureTime }}</div>
        <div class="airport">{{ flight.originCode }}</div>
      </div>
      
      <div class="flight-info">
        <div class="duration">{{ flight.duration }}</div>
        <div class="airline">{{ flight.flightNumber || flight.airline }}</div>
        <div v-if="flight.availableSeats" class="seats">{{ flight.availableSeats }} koltuk kaldı</div>
      </div>
      
      <div class="time-info">
        <div class="time">{{ flight.arrivalTime }}</div>
        <div class="airport">{{ flight.destinationCode }}</div>
      </div>
    </div>
    
    <!-- Baggage Information -->
    <div v-if="flight.baggageInfo" class="baggage-info">
      <div class="baggage-label">Bagaj Bilgisi:</div>
      <div class="baggage-details">
        <span v-for="(info, type) in flight.baggageInfo" :key="type">
          {{ info.quantity }} {{ info.unit }}
        </span>
      </div>
    </div>
    
    <!-- Provider Package Information -->
    <div v-if="flight.providerPackage" class="package-info">
      <div class="package-name">{{ flight.providerPackage.name }}</div>
      <div class="amenities">
        <span v-for="amenity in flight.providerPackage.amenities" :key="amenity.code" class="amenity">
          {{ amenity.description }}
        </span>
      </div>
    </div>
    
    <!-- Other Options -->
    <div v-if="flight.otherOptions && flight.otherOptions.length > 0" class="other-options">
      <div class="options-label">Diğer Seçenekler:</div>
      <div class="options-list">
        <div v-for="option in flight.otherOptions" :key="option.id" class="option-item">
          <span class="option-name">{{ option.providerPackage.name }}</span>
          <span class="option-price">{{ formatPrice(option.price) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  flight: {
    type: Object,
    required: true
  }
})

const formatPrice = (price) => {
  if (!price) return 'Fiyat bilgisi yok'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(price)
}
</script>

<style scoped>
.result-item {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
}

.result-item:hover {
  background-color: #f8fafc;
}

.result-item:last-child {
  border-bottom: none;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.route {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #059669;
}

.flight-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.time-info {
  text-align: center;
}

.time {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.airport {
  font-size: 14px;
  color: #64748b;
}

.flight-info {
  text-align: center;
  flex: 1;
  margin: 0 20px;
}

.duration {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.airline {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.return-flight {
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
}

.return-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.return-details {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
}

.return-airline {
  font-weight: 500;
}

.seats {
  font-size: 12px;
  color: #059669;
  font-weight: 500;
  margin-top: 2px;
}

.baggage-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.baggage-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
}

.baggage-details {
  font-size: 13px;
  color: #64748b;
}

.package-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.package-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.amenity {
  font-size: 12px;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
}

.other-options {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.options-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 6px 8px;
  background-color: #f8fafc;
  border-radius: 4px;
}

.option-name {
  color: #64748b;
}

.option-price {
  color: #059669;
  font-weight: 500;
}

@media (max-width: 768px) {
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .flight-details {
    flex-direction: column;
    gap: 12px;
  }
  
  .flight-info {
    margin: 0;
  }
  
  .return-flight {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .return-details {
    flex-direction: column;
    gap: 4px;
  }
  
  .amenities {
    flex-direction: column;
    gap: 4px;
  }
  
  .option-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
