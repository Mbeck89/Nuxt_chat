<script setup>
import form_Copilot from './form_Copilot.vue';
import form_Persona from './form_Persona.vue';

const showModal = defineModel()

const options = [{
  label: "New Persona",
  key: "newpersona"
},
{
  label: "New Copilot",
  key: "newcopilot"
}
]



</script>

<template>
  <UModal v-model="showModal">
    <UTabs :items="options" class="w-full">
      <template #item="{ item }">
        <component :is="item.key === 'newpersona' ? form_Persona : form_Copilot" />
      </template>
    </UTabs>
  </UModal>
</template>

<style scoped></style>
