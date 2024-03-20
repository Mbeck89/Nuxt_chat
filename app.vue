<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <!-- <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/Users">Users</NuxtLink>
      <NuxtLink to="https://google.com">Google</NuxtLink>

    </nav> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />

  </div>
</template>
<script setup>
//import { useAuth } from './composables/useAuth';
const { getUser, getUserPicture } = useAuth()


await callOnce
  (async () => {
    getUser()
    await getUserPicture()
  })




</script>