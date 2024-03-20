<script setup>
import { marked } from "marked";
import { useChat } from 'ai/vue';




const { user, userPicture, logout, getUser, getUserPicture } = useAuth()
const { notify } = useNotify()
const aiIcon = "/chatgpt.svg"

const { data: models, error } = await useFetch('/api/models', {
  query: {
    userid: user.value.localAccountId
  }
})
console.log(models.value)
const { data: personas } = await useFetch('/api/personas', {
  query: {
    userid: user.value.localAccountId
  }
})
const selectedModel = ref({})
selectedModel.value = models.value[0] ?? []
const selectedPersona = ref({})
selectedPersona.value = personas.value.filter(per => per.name === "Default")[0]

const openSettings = ref(false)

const apiRoute = computed(() => {
  console.log(selectedModel.value.source)
  return selectedModel.value.source === "Sharepoint" ? "/api/chat/db" : "/api/chat/llm"
})

// const settings = ref({
//   systemPrompt: "You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.",
//   temperature: 0.5,
//   topp: 0.95
// })
const body = ref({ modelDeployment: selectedModel, settings: selectedPersona })
const { messages, input, handleSubmit, isLoading, stop } = useChat({ api: apiRoute.value, body: body.value });


const iconSend = computed(() => {
  return isLoading.value ? "i-heroicons-stop" : "i-heroicons-rocket-launch"
})

const markdownToHtml = (markdown) => {
  return marked(markdown)
}

const now = computed(() => {
  return new Date().toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year:
      'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}
)




const newModel = ref(false)


</script>

<template>
  <div class="flex flex-col h-screen mx-8" @keyup.enter="handleSubmit">

    <div class="p-2 flex gap-2 align-center">
      <UInputMenu v-model="selectedModel" :options="models" option-attribute="name" placeholder="Select a Model"
        class="w-80" />
      <UInputMenu v-model="selectedPersona" :options="personas" option-attribute="name" placeholder="Select a Persona"
        class="w-80" />


      <UPopover>
        <UButton icon="i-heroicons-cog-8-tooth" />
        <template #panel>
          <UCard class="w-96">
            <template #header>
              <div class="flex items-center gap-2 font-bold">
                <UIcon name=" i-heroicons-academic-cap" />
                <span>Change Settings</span>
              </div>
            </template>
            <div class="flex flex-col justify-center align-center gap-2">
              <div class="flex flex-col gap-2">
                <span>System Prompt</span>
                <UTextarea v-model="selectedPersona.persona" :rows="8"></UTextarea>
              </div>
              <div class="flex flex-col gap-2">
                <span>Temperature</span>
                <UInput icon="i-heroicons-fire-16-solid" v-model="selectedPersona.temperature" :trailing="false"
                  placeholder="Temperature" class="w-40" />
              </div>
              <div class="flex flex-col gap-2">
                <span>Top P</span>
                <UInput icon="i-heroicons-adjustments-horizontal" v-model="selectedPersona.topp" :trailing="false"
                  placeholder="Search..." class="w-40" />
              </div>
            </div>
            <template #footer>
              <UButton>Save</UButton>
            </template>
          </UCard>
        </template>
      </UPopover>
      <UButton icon="i-heroicons-plus-circle" color="white" @click="newModel = true" />
      <UButton icon="i-heroicons-arrow-left-end-on-rectangle" color="white" @click="logout" />


    </div>

    <div class="flex-1 overflow-auto p-4 gap-2 flex flex-col">
      <div v-for="(message, index) in messages" :key="index" class="shadow-md p-2 bg-slate-300 rounded w-auto"
        :class="message.role === 'user' ? 'bg-primary-700' : 'bg-slate-600'">
        <div class="flex relative gap-2 pb-1 items-center font-thin font-xs after:h-[1px] after:w-[200px] after:bg-gradient-to-r after:from-transparent after:via-primary
    after:to-transparent after:absolute after:-bottom-[2px] after:content-['']">
          <UAvatar :src="message.role === 'user' ? userPicture : aiIcon" />
          <span v-html="message.role === 'user' ? user.name : selectedModel.name" />
        </div>
        <div v-html="markdownToHtml(message.content)" class="pt-1" />

      </div>
    </div>
    <div class="w-full flex justify-center items-center py-2 gap-2">
      <UTextarea v-model="input" class="w-3/4" autoResize placeholder="start prompting..." :disabled="isLoading">
      </UTextarea>
      <UButton :icon="iconSend" color="primary" @click="event => isLoading ? stop(event) : handleSubmit(event)" />

    </div>
  </div>
  <ModalNewModel v-model="newModel" />
</template>