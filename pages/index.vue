<template>

    <div v-if="modal_open.settings" @mousedown.self="modal_open.settings = false"
        class="fixed z-30 w-screen h-screen  bg-black bg-opacity-70 flex justify-center items-center">
        <div
            class="bg-neutral-900 w-1/2 h-[30%] max-w-[400px] min-h-[200px] flex flex-col justify-between rounded-md p-4">
            <div class="flex gap-4 flex-col">
                <div class=" text-neutral-600 text-sm font-medium">SETTINGS</div>
                <div class="relative">



                </div>
                <div class="flex justify-between gap-2 items-center relative">
                    <div class=" text-neutral-600 text-xs font-medium">OPENAI API KEY</div>

                    <input
                        class="bg-neutral-800 truncate w-full resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                        type="password" :value="api_key" @input="updateCookie($event, 'api_key')"
                        placeholder="sk-xxxxxxxxx" />
                    <div v-if="isValidApiKey" class="flex">
                        <Icon name="heroicons:check-16-solid" class="text-green-500 size-6 right-2 bottom-4" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-2">
                    <div class=" text-neutral-600 text-xs font-medium">MODEL</div>
                    <select @input="updateCookie($event, 'model')" :value="model"
                        class="bg-neutral-700 text-xs w-24 h-6 text-neutral-200 outline-none rounded-sm">
                        <option>gpt-4o-mini</option>
                        <option>gpt-4o</option>
                        <option>gpt-4-turbo</option>
                        <option>gpt-4</option>
                        <option>gpt-3.5-turbo</option>

                    </select>




                </div>
                <div class="flex items-center gap-2">
                    <Icon name="heroicons:exclamation-circle-16-solid"
                        class="text-yellow-600 size-4 right-2 bottom-4" />
                    <div class="text-xs text-yellow-600">Hugging Face support coming soon</div>
                </div>
            </div>
            <button class="text-white bg-purple-800 hover:bg-purple-700 rounded-sm text-xs p-2"
                @click="modal_open.settings = false">CLOSE</button>

        </div>


    </div>
    <div class=" bg-neutral-800 w-screen absolute h-screen grid grid-rows-[50px,1fr] grid-cols-1 p-4 gap-y-4">

        <NavBar v-model:page="page" v-model:modal_open="modal_open" />
        <KeepAlive>
            <Prompt v-if="page == 'prompt'" v-model:variables="variables" v-model:prompt="prompt" />
        </KeepAlive>
        <KeepAlive>
            <Generate v-if="page == 'generate'" :variables="variables" v-model:test_cases="test_cases"
                v-model:responses="responses" v-model:modal_open="modal_open" />
        </KeepAlive>
        <KeepAlive>
            <Evaluate v-if="page == 'eval'" :test_cases="test_cases" :variables="variables" :prompt="prompt"
                v-model:responses="responses" />
        </KeepAlive>

    </div>

</template>

<script setup>

// const api_key = useApiKey()
// const model = useModelType()


const api_key = ref(useCookie('api_key', { httpOnly: true, }))
const model = useCookie('model', { httpOnly: true, default: () => 'gpt-4o-mini' })
const updateCookie = async ($event, key) => {

    await $fetch('/api/cookies/setCookie', {
        method: 'POST',
        body: {
            [key]: $event.target.value,
        }
    })
}

const isValidApiKey = computed(() => {
    const apiKeyRegex = /^sk-proj-[A-Za-z0-9]{48}$/;
    return apiKeyRegex.test(api_key.value);
})


const page = ref('prompt')

const variables = ref({})
const modal_open = ref({ settings: false, generate: false })
const test_cases = ref([])
const prompt = ref('')
const responses = ref([])



</script>
