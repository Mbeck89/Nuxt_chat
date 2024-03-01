<script lang="ts" setup>
const visible = ref(true)
</script>

<template>
  <div>
    <!-- <Sidebar v-model:visible="visible">
      <template #header>
        <div class="flex align-items-center gap-2">
          <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
          <span class="font-bold">Amy Elsner</span>
        </div>
      </template>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.</p>
    </Sidebar> -->
    <slot />
  </div>
</template>

<style scoped></style>
