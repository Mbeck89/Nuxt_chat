<template>

  <UCard class="w-full">
    <template #header>
      <div class="flex items-center gap-2 font-bold">
        <UIcon name=" i-heroicons-beaker" />
        <span>Define your own Copilot</span>
      </div>
    </template>
    <div class="flex flex-col justify-center align-center gap-2">

      <UForm :schema="CopilotValidationSchema" :state="state" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput icon="i-heroicons-tag-solid" v-model="state.name" :trailing="false" placeholder="Name"
            class="w-full" />
        </UFormGroup>
        <UFormGroup label="Site" name="site">
          <UInputMenu v-model="state.site" placeholder="Select a Site" :options="sites" option-attribute="displayName"
            valueAttribute="id" />
        </UFormGroup>
        <UFormGroup label="Library" name="library">
          <UInputMenu v-model="state.library" placeholder="Select a Library" :options="libraries"
            option-attribute="name" valueAttribute="id" :disabled="state.site.length === 0" :loading="loadLibraries" />
        </UFormGroup>
        <UFormGroup label="Share" name="shared">
          <USelectMenu v-model="state.shared" placeholder="Share with users" option-attribute="displayName"
            :searchable="searchUsers" :loading="loading" by="id" multiple />
        </UFormGroup>
        <div class="flex mt-4  border-2 rounded-lg p-4 items-center" v-if="Object.keys(state.library).length > 0">
          <UIcon name="i-heroicons-light-bulb" class="mr-2 text-amber-400" /> Only .docs, .doc and .pdf files are
          supported! <br>
          {{ state.files.length }} Dateien gefunden!
        </div>
        <UButton type="submit" class="mt-4">Save</UButton>
      </UForm>
    </div>
  </UCard>

</template>

<script setup>

import { CopilotValidationSchema } from '~/schemas/copilotSchema'
const { callGraph, user } = useAuth()
const { notify } = useNotify()

// load sites
const sites = ref([])
await callGraph(["Sites.Read.All"], '/sites?search=*').then(res => {
  sites.value = res.value
})



const state = reactive({
  source: "Sharepoint",
  name: "",
  site: "",
  library: "",
  createdBy: user.value.localAccountId,
  shared: [],
  files: []
})

// load libraries  when site selected
const libraries = ref([])
const loadLibraries = ref(false)


watch(() => state.site, async newValue => {
  try {
    loadLibraries.value = true
    const result = await callGraph(["Sites.Read.All"], `/sites/${newValue}/drives`)
    libraries.value = result.value ?? []
    loadLibraries.value = false
  } catch (error) {
    console.log(error)
    loadLibraries.value = false
  }

})
// load files when library selected

watch(() => state.library, async newValue => {
  state.files = await getFiles(newValue)
})
const getFiles = async (driveid) => {
  const files = await callGraph(["Files.Read.All"], `/drives/${driveid}/items/root/children?$select=id,name,folder`, "Files.Read.All")
  const filtered = files.value.filter(item => {
    if (!("folder" in item) && [".docx", ".pdf", ".doc"].some(type => item.name.toLowerCase().includes(type))) {
      return item
    }
  }).map(i => i.id)
  return filtered
}

// search users
const loading = ref(false)
const searchUsers = async (searchterm) => {
  try {
    loading.value = true
    const query = searchterm.length > 0 ? `/users?$search=%22displayName:${searchterm}%22` : `/users`
    const users = await callGraph(["User.ReadBasic.All"], query)
    loading.value = false
    return users.value ?? []
  } catch (error) {
    loading.value = false
    console.log(error)
    return []
  }
}


// submit

const onSubmit = (event) => {
  console.log(event)
}


</script>
