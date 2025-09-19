<template>
  <div class="autocomplete-container">
    <input
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      :placeholder="placeholder"
      :disabled="disabled"
      type="text"
      class="autocomplete-input"
    />
    
    <div 
      v-if="showSuggestions && suggestions.length > 0" 
      class="autocomplete-dropdown"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.code || index"
        :class="['autocomplete-item', { selected: selectedIndex === index }]"
        @mousedown="selectSuggestion(suggestion)"
        @mouseenter="selectedIndex = index"
      >
        <div class="suggestion-main">{{ suggestion.name }}</div>
        <div class="suggestion-sub">{{ suggestion.code }} - {{ suggestion.city_name }}</div>
      </div>
    </div>
    
    <div v-if="loading" class="autocomplete-loading">
      <div class="loading-spinner"></div>
      <span>Aranıyor...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'select'])

const showSuggestions = ref(false)
const selectedIndex = ref(-1)

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('search', value)
  showSuggestions.value = true
  selectedIndex.value = -1
}

const handleFocus = () => {
  if (props.suggestions.length > 0) {
    showSuggestions.value = true
  }
}

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
    selectedIndex.value = -1
  }, 150)
}

const handleKeydown = (event) => {
  if (!showSuggestions.value || props.suggestions.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, props.suggestions.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0) {
        selectSuggestion(props.suggestions[selectedIndex.value])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedIndex.value = -1
      break
  }
}

const selectSuggestion = (suggestion) => {
  emit('update:modelValue', suggestion.name)
  emit('select', suggestion)
  showSuggestions.value = false
  selectedIndex.value = -1
}

watch(() => props.suggestions, (newSuggestions) => {
  if (newSuggestions.length > 0 && props.modelValue.length >= 2) {
    showSuggestions.value = true
  }
})
</script>

<style scoped>
.autocomplete-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.autocomplete-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.autocomplete-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.autocomplete-item:hover,
.autocomplete-item.selected {
  background-color: #f8fafc;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.suggestion-main {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.suggestion-sub {
  font-size: 14px;
  color: #64748b;
}

.autocomplete-loading {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
