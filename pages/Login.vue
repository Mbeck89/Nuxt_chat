<script setup>
import { useAuth } from '../composables/useAuth';

const { login } = useAuth()

definePageMeta({
  layout: "login"
})

</script>

<template>
  <div
    class="flex items-center justify-center h-screen content-center bg-gradient-to-r from-primary-200 from-10% to-primary-900 to-90%">
    <div>
      <UButton @click="login">Login</UButton>
    </div>

  </div>
</template>

<style scoped></style>
