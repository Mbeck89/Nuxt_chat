<script setup>
import { useAuth } from '../composables/useAuth';

const { login } = useAuth()

definePageMeta({
  layout: "login"
})

</script>

<template>
  <div
    class="flex items-center justify-center h-screen content-center bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
    <div>
      <UButton @click="login">Login</UButton>
    </div>

  </div>
</template>

<style scoped></style>
