<script setup >
import { useChat } from 'ai/vue';
const settings = ref({
  systemPrompt: "You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.",
  temperature: 0.5,
  topp: 0.95
})

const { messages, input, handleSubmit } = useChat({ api: "/api/llm", body: { modelDeployment: "gpt-4-fra", settings: settings.value } });
const prompt = ref("")
//const messages = ref([])
const loading = ref(false)
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}


// const submit = async () => {
//   try {
//     messages.value.push({ role: "user", content: prompt.value })
//     const { body } = await $fetch('/api/chat', {
//       method: 'POST',
//       body: {
//         messages: messages.value,
//         "modelDeployment": "gpt-4-fra"
//       }
//     })
//     console.log("body fetched")
//     messages.value.push({ role: 'assistant', content: "" })
//     loading.value = true
//     useChatStream({
//       body,
//       onChunk: ({ data }) => {
//         console.log(data)
//         messages.value[messages.value.length - 1].content += data;
//       },
//       onReady: () => {
//         console.log("done")
//         loading.value = false
//       },
//     });
//     console.log("result is")
//   } catch (error) {
//     throw createError({
//       statusCode: 500,
//       message: 'Failed to forward request to server',
//     })
//   }

// }

</script>
 
<template>
  <div class="flex flex-col w-full mx-auto min-h-screen relative justify-end px-20">
    <div class="flex flex-col-reverse items-center justify-start gap-3">
      <div v-for="(message, index) in messages" :key="index"
        class="shadow-md p-2 bg-red-200 w-auto self-end min-w-60 text-center">
        <span>{{ message.content }}</span>
      </div>
    </div>
    <div class="w-full bottom-0 sticky flex justify-center items-center py-2 gap-2">
      <Textarea v-model="input" class="w-3/4" autoResize rows="2" placeholder="start prompting..."
        :loading="loading"></Textarea>
      <Button icon="pi pi-send" severity="primary" @click="handleSubmit" />
      <Button icon="pi pi-cog" severity="secondary" @click="toggle" />
    </div>
  </div>
  <OverlayPanel ref="op">
    <div class="flex flex-col gap-3 w-25rem p-2">
      <span class="font-bold">Customize your chat with a system prompt</span>
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