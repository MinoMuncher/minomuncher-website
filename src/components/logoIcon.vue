<script setup lang="ts">
import { computed } from 'vue'
import logo from '@/assets/logo.png' // Adjust path based on your project structure

const props = defineProps({
    width: {
        type: [String, Number],
        default: 100 // Default width in pixels
    }
})

const computedStyle = computed(() => {
    const widthValue = typeof props.width === 'number' ? `${props.width}px` : props.width
    return {
        width: widthValue,
        height: 'auto' // Maintains aspect ratio
    }
})
</script>

<template>
    <img :src="logo" :style="computedStyle" alt="Logo" class="logo-image" />
</template>

<style scoped>
.logo-image {
    display: block;
    max-width: 100%;
}
</style>