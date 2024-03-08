<script setup >
import { marked } from "marked";
import { useChat } from 'ai/vue';


const {userPicture, user} = useAuth()

const model = ref("gpt-4-fra")
// {
//     _index: 'models',
//     _id: 'HzFb-o0BN5pUxYtoLQrj',
//     _score: 1.0418735,
//     _source: {
//       name: 'GPT-4',
//       source: 'gpt-4-fra',
//       shared: [Array],
//       status: 'ready'
//     }


const settings = ref({
  systemPrompt: "You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.",
  temperature: 0.5,
  topp: 0.95
})
const body = ref({ modelDeployment: model.value, settings: settings.value })
watch(() => body.value, (newValue, oldValue) => {
  console.log(newValue)
}, {
  deep: true
})
const { messages, input, handleSubmit } = useChat({ api: "/api/chat/llm", body:body.value });


const loading = ref(false)
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}

const markdownToHtml = (markdown) => {  
  return marked(markdown)
}
console.log("in chat" + user)
const { data: models, error } = await useFetch('/api/models', {  
  query: {
    userid: 123
  }
})



</script>
 
<template>
  <div class="flex flex-col h-screen mx-8">
    
    <div class="p-2 flex gap-2 align-center">
      <Dropdown v-model="model" :options="models" optionLabel="name" placeholder="Select a Model" class="w-80"/>
      <Button icon="pi pi-cog" severity="secondary" @click="toggle" />
    </div>
    
    <div class="flex-1 overflow-auto p-4 gap-2 flex flex-col-reverse">
      <div v-for="(message, index) in messages" :key="index"
        class="shadow-md p-2 bg-red-200 w-auto">
        <div class="flex gap-2 align-center bg-blue-200">
          <Avatar image="/blankProfile.jpg"></Avatar>
          <span class="text-sm"> 05.10.2023 14:00</span>
        </div>
        
        <span v-html="markdownToHtml(message.content)"></span>
      </div>
    </div>
    <div class="w-full flex justify-center items-center py-2 gap-2">
      <Textarea v-model="input" class="w-3/4" autoResize rows="2" placeholder="start prompting..."
        :loading="loading"></Textarea>
      <Button icon="pi pi-send" severity="primary" @click="handleSubmit" />
      
    </div>
  </div>
  <OverlayPanel ref="op">
    <div class="flex flex-col gap-3 w-25rem p-2">
      <span class="font-bold">Customize your chat with a system prompt</span>
      <Avatar :image="userPicture"></Avatar>
      <Textarea v-model="settings.systemPrompt" placeholder="Your Systemprompt..." rows="4" autoResize />
      <span class="font-bold">LLM Settings</span>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <span class="text-sm">Temperatur</span>
          <i class="pi pi-info-circle" size="xs"
            v-tooltip="'Steuert die Zufallszufälligkeit. Wenn Sie die Temperatur senken, führt das Modell zu sich wiederholenden und deterministischeren Antworten. Eine Erhöhung der Temperatur führt zu unerwarteteren oder kreativeren Antworten. Versuchen Sie, die Temperatur oder Top P anzupassen, aber nicht beides.'"
            style="font-size: 1rem; color: rgb(206, 123, 123)" />
        </div>

        <Slider v-model="settings.temperature" :min="0.1" :max="1" :step="0.1" />
        <InputText v-model.number="settings.temperature" />
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <span class="text-sm">Top P</span>
          <i class="pi pi-info-circle" size="xs"
            v-tooltip="'Ähnlich wie bei der Temperatur steuert dies die Zufallszufälligkeit, verwendet aber eine andere Methode. Durch das Senken des Top P wird die Tokenauswahl des Modells auf wahrscheinlichere Token eingegrenzt. Durch Erhöhen des Top P kann das Modell aus Token mit hoher und niedriger Wahrscheinlichkeit auswählen. Versuchen Sie, die Temperatur oder Top P anzupassen, aber nicht beides.'"
            style="font-size: 1rem; color: rgb(206, 123, 123)" />
        </div>
        <Slider v-model="settings.topp" :min="0.1" :max="1" :step="0.1" />
        <InputText v-model.number="settings.topp" />
      </div>
      <Button icon="pi pi-check" label="Save as default"></Button>




    </div>
  </OverlayPanel>
</template>