<template>
  <UCard class="w-full">
    <template #header>
      <div class="flex items-center gap-2 font-bold">
        <UIcon name=" i-heroicons-beaker" />
        <span>Define your own AI-Persona</span>
      </div>
    </template>
    <div class="flex flex-col justify-center align-center gap-2">

      <UForm :schema="PersonaValidationSchema" :state="personaState" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput icon="i-heroicons-tag-solid" v-model="personaState.name" :trailing="false" placeholder="Name"
            class="w-full" />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UTextarea v-model="personaState.description" :rows="2" placeholder="Describe for others..."></UTextarea>
        </UFormGroup>
        <UFormGroup label="Persona" name="persona">
          <UTextarea v-model="personaState.persona" :rows="8" placeholder="Describe your Persona"></UTextarea>
        </UFormGroup>
        <UFormGroup label="Temperature" name="temperature">
          <UInput icon="i-heroicons-fire-16-solid" v-model="personaState.temperature" :trailing="false" type="number"
            :step="0.1" />
        </UFormGroup>
        <UFormGroup label="Top P" name="topp">
          <UInput icon="i-heroicons-adjustments-horizontal" v-model="personaState.topp" :trailing="false" type="number"
            :step="0.1" />
        </UFormGroup>
        <UFormGroup label="Public" name="public">
          <UToggle v-model="personaState.public" />
        </UFormGroup>
        <UButton type="submit" class="mt-4">Save</UButton>
      </UForm>
    </div>
  </UCard>

</template>

<script setup>
import { PersonaValidationSchema } from '~/schemas/personaSchema'
const { notify } = useNotify()

const personaState = reactive({
  persona: "You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.",
  temperature: 0.5,
  topp: 0.95,
  name: "",
  description: "",
  public: false
})

async function onSubmit(event) {
  // Do something with data
  try {
    await $fetch('/api/models/personas',
      {
        method: 'POST',
        body: event
      }
    )
    notify("Success", "New Persona created succefully")
  } catch (error) {
    notify("Error", error)
  }

}

</script>
