<template>
    <div v-if="modal_open.info" @mousedown.self="modal_open.settings = false, modal_open.info = false"
        class="fixed z-30 w-screen h-dvh  bg-black bg-opacity-80 flex justify-center items-center">
        <div
            class="bg-neutral-900 w-4/5 h-fit max-w-[400px] min-w-[200px] gap-8 flex flex-col justify-between rounded-md p-4">

            <div class="flex gap-4 flex-col h-full text-xs text-neutral-400">
                <div class=" text-neutral-600 text-sm font-medium">INFO</div>

                <p class=""><b class="font-medium text-purple-500">PurePrompt</b> is a simple
                    tool for prompt
                    robustness
                    and eval
                    augmentation</p>
                <div class=" text-neutral-600 text-xs font-medium">QUICKSTART</div>
                <div class="flex gap-4 items-center  ">
                    <div
                        class="bg-purple-900 rounded-full grow-0 shrink-0 justify-center items-center w-6 h-6 text-purple-400 flex text-xs">
                        1</div>
                    <p>Add a prompt template with placeholder
                        <span class="text-purple-500 text-nowrap">&#123;&#123;variables&#125;&#125;
                        </span> in double braces
                    </p>

                </div>
                <div class="flex gap-4 items-center  ">
                    <div
                        class="bg-purple-900 rounded-full grow-0 shrink-0 justify-center items-center w-6 h-6 text-purple-400 flex text-xs">
                        2</div>
                    <p>Add or generate a multitude of test cases with different inputs
                    </p>

                </div>
                <div class="flex gap-4 items-center  ">
                    <div
                        class="bg-purple-900 rounded-full grow-0 shrink-0 justify-center items-center w-6 h-6 text-purple-400 flex text-xs">
                        3</div>
                    <p>Run all prompts in parallel and evaluate the quality of each model response
                    </p>

                </div>

                <div class="flex flex-col gap-2">

                    <a class="break-all relative text-center items-center bg-amber-500 text-amber-800 p-2 rounded-sm  hover:bg-amber-400"
                        href="https://www.youtube.com/watch?v=P1PZFKiYNaQ&ab_channel=AxelSorensen" target="_blank">
                        <div></div>
                        <Play name="heroicons:play-16-solid" class="text-amber-800 absolute" />WATCH VIDEO TUTORIAL
                    </a>


                </div>
                <div class=" text-neutral-600 text-xs font-medium">LINKS</div>
                <div class="flex flex-col gap-2">
                    <p class="text-nowrap truncate">
                        Github:
                        <a class="text-purple-500 hover:text-purple-400"
                            href="https://github.com/AxelSorensen/pureprompt"
                            target="_blank">https://github.com/AxelSorensen/pureprompt</a>
                    </p>
                    <p class="text-nowrap truncate">
                        LinkedIn:
                        <a class="text-purple-500 hover:text-purple-400"
                            href="https://www.linkedin.com/in/axel-sorensen/"
                            target="_blank">https://www.linkedin.com/in/axel-sorensen/</a>
                    </p>

                    <p>Questions, suggestions and ideas are more than welcome at: <a
                            class="text-amber-500 hover:text-amber-400"
                            href="mailto:axelsorensenwork@gmail.com">axelsorensenwork@gmail.com</a></p>

                </div>
                <div class="flex flex-col gap-1">
                    <p class="text-center">
                        Created and maintained by:

                    </p>
                    <p class="text-sm font-medium text-center">
                        Axel Sorensen

                    </p>
                </div>


            </div>
            <button class="text-white bg-purple-800 hover:bg-purple-700 rounded-sm text-xs p-2"
                @click="modal_open.info = false">CLOSE</button>

        </div>


    </div>
    <div v-if="modal_open.settings" @mousedown.self="modal_open.settings = false"
        class="fixed z-30 w-screen h-dvh bg-black bg-opacity-80 flex justify-center items-center">
        <div
            class="bg-neutral-900 w-4/5 h-fit max-w-[600px] min-w-[200px] gap-8 flex flex-col justify-between rounded-md p-4">

            <div class="flex gap-4 flex-col h-full">
                <div class=" text-neutral-600 text-sm font-medium pb-4">SETTINGS</div>
                <div class="flex justify-between">
                    <div class=" text-neutral-600 text-xs pb-4 font-medium">PROVIDER</div>
                    <select v-model="provider"
                        class="bg-neutral-700 text-xs h-6 text-neutral-200 outline-none rounded-sm">
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="huggingface">HuggingFace</option>

                    </select>
                </div>
                <div v-if="provider == 'openai'" class="flex flex-col gap-4">
                    <div class="flex justify-between gap-4 items-center relative">
                        <div class=" text-neutral-600 text-xs font-medium">OPENAI API KEY</div>

                        <input
                            class="bg-neutral-800 truncate w-full resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                            type="password" v-model="api_key.openai" placeholder="sk-xxxxxxxxx" />
                        <div v-if="isValidApiKey" class="flex">
                            <Check class="text-green-500 size-6 right-2 bottom-4" />
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <div class=" text-neutral-600 text-xs font-medium">MODEL</div>
                        <select v-model="model.openai"
                            class="bg-neutral-700 text-xs h-6 text-neutral-200 outline-none rounded-sm">
                            <option>gpt-4o-mini</option>
                            <option>gpt-4o</option>
                            <option>gpt-4-turbo</option>
                            <option>gpt-3.5-turbo</option>
                        </select>




                    </div>
                    <div @click="show_advanced_settings = !show_advanced_settings"
                        class="flex group cursor-pointer items-center">
                        <div class=" flex justify-start">
                            <ChevronRight :class="{ 'rotate-90': show_advanced_settings }"
                                class="text-sm ml-[-6px] text-neutral-400 group-hover:text-purple-500" />
                        </div>
                        <p class="text-xs text-neutral-400 group-hover:text-purple-500">Advanced settings</p>
                    </div>
                    <div class="flex flex-col gap-2 pb-2" v-if="show_advanced_settings">
                        <div class="flex justify-between w-40 items-center gap-2">
                            <div class=" text-neutral-600 text-xs font-medium">MAX_TOKENS</div>
                            <input type="number" v-model="parameters.openai.max_tokens"
                                class="bg-neutral-700 p-1 text-xs h-6 w-12 text-neutral-200 outline-none rounded-sm" />

                        </div>
                        <div class="flex justify-between w-40 items-center gap-2">
                            <div class=" text-neutral-600 text-xs font-medium">TEMP</div>
                            <input type="number" v-model="parameters.openai.temp"
                                class="bg-neutral-700 p-1 text-xs h-6 w-12 text-neutral-200 outline-none rounded-sm" />

                        </div>
                    </div>
                </div>
                <div v-else-if="provider == 'anthropic'" class="flex flex-col gap-4">
                    <div class="flex justify-between gap-4 items-center relative">
                        <div class=" text-neutral-600 text-xs font-medium">ANTHROPIC API KEY</div>

                        <input
                            class="bg-neutral-800 truncate w-full resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                            type="password" v-model="api_key.anthropic" placeholder="sk-xxxxxxxxx" />
                        <div v-if="isValidApiKey" class="flex">
                            <Check class="text-green-500 size-6 right-2 bottom-4" />
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <div class=" text-neutral-600 text-xs font-medium">MODEL</div>
                        <select v-model="model.anthropic"
                            class="bg-neutral-700 text-xs h-6 text-neutral-200 outline-none rounded-sm">
                            <option value="claude-3-opus-20240229">claude-3-opus</option>
                            <option value="claude-3-sonnet-20240229">claude-3-sonnet</option>
                            <option value="claude-3-haiku-20240307">claude-3-haiku</option>
                        </select>
                    </div>
                    <div @click="show_advanced_settings = !show_advanced_settings"
                        class="flex group cursor-pointer items-center">
                        <div class=" flex justify-start">
                            <ChevronRight :class="{ 'rotate-90': show_advanced_settings }"
                                class="text-sm ml-[-6px] text-neutral-400 group-hover:text-purple-500" />
                        </div>
                        <p class="text-xs text-neutral-400 group-hover:text-purple-500">Advanced settings</p>
                    </div>
                    <div class="flex flex-col gap-2 pb-2" v-if="show_advanced_settings">
                        <div class="flex justify-between w-40 items-center gap-2">
                            <div class=" text-neutral-600 text-xs font-medium">MAX_TOKENS</div>
                            <input type="number" v-model="parameters.anthropic.max_tokens"
                                class="bg-neutral-700 p-1 text-xs h-6 w-12 text-neutral-200 outline-none rounded-sm" />

                        </div>
                        <div class="flex justify-between w-40 items-center gap-2">
                            <div class=" text-neutral-600 text-xs font-medium">TEMP</div>
                            <input type="number" v-model="parameters.anthropic.temp"
                                class="bg-neutral-700 p-1 text-xs h-6 w-12 text-neutral-200 outline-none rounded-sm" />

                        </div>
                    </div>
                </div>
                <div v-else-if="provider == 'huggingface'" class="flex flex-col gap-4">
                    <div class="flex justify-between gap-4 items-center relative">
                        <div class=" text-neutral-600 text-xs font-medium">HUGGINGFACE ACCESS TOKEN</div>

                        <input
                            class="bg-neutral-800 truncate w-full resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                            type="password" v-model="api_key.huggingface" placeholder="hf_xxxxxxxxx" />
                        <div v-if="isValidApiKey" class="flex">
                            <Check class="text-green-500 size-6 right-2 bottom-4" />
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <div class=" text-neutral-600 text-xs font-medium">FREE MODEL</div>
                        <select @change="changeModel" :class="{ 'opacity-25 pointer-events-none': use_custom_endpoint }"
                            v-model="model.huggingface"
                            class="bg-neutral-700 text-xs h-6 text-neutral-200 outline-none rounded-sm">
                            <option :value="item.name" v-for="item in endpoints">{{
                                item.name }}</option>
                            <option hidden>custom HF</option>


                        </select>




                    </div>
                    <div class="flex pb-4 items-center justify-end gap-2">
                        <Exclamation class="text-amber-500 size-4 right-2 bottom-4" />
                        <div class="text-xs text-amber-500">Free models may be slow and unreliable</div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-2">
                            <div class=" text-neutral-600 text-xs whitespace-nowrap font-medium">USE CUSTOM ENDPOINT
                            </div>
                            <input @change="setEndpoint" :class="{ 'opacity-50': !use_custom_endpoint }"
                                v-model="use_custom_endpoint"
                                class=" size-4 resize-none bg-opacity-20 rounded-sm text-xs accent-purple-800"
                                type="checkbox" />
                        </div>

                        <div class="relative flex items-center gap-4 w-full">

                            <input :class="{ 'opacity-25 pointer-events-none': !use_custom_endpoint }"
                                v-model="endpoint.url"
                                class="bg-neutral-800 truncate w-full resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                                type="text"
                                placeholder="Eg. https://api-inference.huggingface.co/models/openai-community/gpt2" />
                            <!-- <div v-if="hf_input_focused"
                                class="absolute w-full bg-neutral-800 overflow-hidden text-neutral-400 text-xs rounded-sm top-10 flex flex-col">
                                <div class="bg-neutral-800 text rounded-sm" v-for="result in endpoint_results">
                                    <div @mousedown="endpoint_input = result.url; hf_input_focused = false"
                                        class=" hover:bg-neutral-600 hover:text-neutral-200 p-2 cursor-pointer truncate">
                                        {{
                                            result.url }}
                                    </div>
                                </div>
                            </div> -->
                            <div v-if="isValidEndpoint && endpoint.url" class="flex">
                                <Check class="text-green-500 size-6 right-2 bottom-4" />
                            </div>

                        </div>
                        <div v-if="use_custom_endpoint" class="flex items-center gap-2">
                            <p class="text-xs text-red-500">* Check if the endpoint uses textGeneration (raw)
                                or
                                chatCompletion (chat)</p>
                            <div class=" text-neutral-600 text-xs whitespace-nowrap font-medium">CHAT
                            </div>
                            <input @click="endpoint.type = 'chat'" :checked="endpoint.type == 'chat'"
                                class=" size-4 resize-none bg-opacity-20 rounded-sm text-xs accent-purple-800"
                                type="radio" />
                            <div class=" text-neutral-600 text-xs whitespace-nowrap font-medium">RAW
                            </div>
                            <input @click="endpoint.type = 'raw'" :checked="endpoint.type == 'raw'"
                                class=" size-4 resize-none bg-opacity-20 rounded-sm text-xs accent-purple-800"
                                type="radio" />
                        </div>


                    </div>
                    <div @click="show_advanced_settings = !show_advanced_settings"
                        class="flex group cursor-pointer items-center">
                        <div class=" flex justify-start">
                            <ChevronRight :class="{ 'rotate-90': show_advanced_settings }"
                                class="text-sm ml-[-6px] text-neutral-400 group-hover:text-purple-500" />
                        </div>
                        <p class="text-xs text-neutral-400 group-hover:text-purple-500">Advanced settings</p>
                    </div>
                    <div class="flex flex-col gap-2 pb-2" v-if="show_advanced_settings">
                        <div class="flex justify-between w-40 items-center gap-2">
                            <div class=" text-neutral-600 text-xs font-medium">MAX_TOKENS</div>
                            <input type="number" v-model="parameters.huggingface.max_tokens"
                                class="bg-neutral-700 p-1 text-xs h-6 w-12 text-neutral-200 outline-none rounded-sm" />

                        </div>
                        <div class="flex justify-between w-40 items-center gap-2">
                            <div class=" text-neutral-600 text-xs font-medium">TEMP</div>
                            <input type="number" v-model="parameters.huggingface.temp"
                                class="bg-neutral-700 p-1 text-xs h-6 w-12 text-neutral-200 outline-none rounded-sm" />

                        </div>
                    </div>
                </div>

            </div>
            <button class="text-white bg-purple-800 hover:bg-purple-700 rounded-sm text-xs p-2"
                @click="modal_open.settings = false">CLOSE</button>

        </div>


    </div>

    <div class=" bg-neutral-800 w-screen absolute h-dvh grid grid-rows-[auto,1fr] grid-cols-1 p-4 gap-y-4">

        <NavBar v-model:page="page" v-model:modal_open="modal_open" />
        <KeepAlive>
            <Prompt v-if="page == 'prompt'" v-model:variables="variables" v-model:prompt="prompt"
                v-model:modal_open="modal_open" :isValidApiKey="isValidApiKey" />
        </KeepAlive>
        <KeepAlive>
            <Generate v-if="page == 'generate'" :variables="variables" v-model:test_cases="test_cases"
                v-model:responses="responses" v-model:modal_open="modal_open" :isValidApiKey="isValidApiKey" />
        </KeepAlive>
        <KeepAlive>
            <Evaluate v-if="page == 'eval'" :test_cases="test_cases" :variables="variables" :prompt="prompt"
                v-model:responses="responses" />
        </KeepAlive>

    </div>

</template>

<script setup>
import Check from '~icons/heroicons/check-16-solid'
import Play from '~icons/heroicons/play-16-solid'
import ChevronRight from '~icons/heroicons/chevron-right-16-solid'
import Exclamation from '~icons/heroicons/exclamation-circle-16-solid'
// const api_key = useApiKey()
// const model = useModelType()
const use_custom_endpoint = ref(false)
const show_advanced_settings = ref(false)
const api_key = useCookie('api_key')
if (!api_key.value) {
    api_key.value = { openai: '', anthropic: '', huggingface: '' }
}

const provider = useCookie('provider')
if (!provider.value) {
    provider.value = 'openai'
}

const model = useCookie('model')
if (!model.value) {
    model.value = { openai: 'gpt-4o-mini', anthropic: 'claude-3-opus', huggingface: 'gpt-2 (raw)' }
}

const endpoint = useCookie('endpoint')
if (!endpoint.value) {
    endpoint.value = { name: 'gpt-2 (raw)', url: 'https://api-inference.huggingface.co/models/openai-community/gpt2', type: 'raw' }
}

if (model.value.huggingface == 'custom HF') {
    use_custom_endpoint.value = true
}

const parameters = useCookie('parameters')
if (!parameters.value) {
    parameters.value = { openai: { max_tokens: 100, temp: .7 }, anthropic: { max_tokens: 100, temp: .7 }, huggingface: { max_tokens: 100, temp: .7 } }
}



// const updateCookie = async ($event, key) => {

//     await $fetch('/api/cookies/setCookie', {
//         method: 'POST',
//         body: {
//             [key]: $event.target.value,
//         }
//     })
// }
// const hf_search_results = ref(null)

const endpoints = [
    { name: 'gpt-2 (raw)', url: 'https://api-inference.huggingface.co/models/openai-community/gpt2', type: 'raw' },
    { name: 'yi-1.5-34B-Chat (chat) ', url: 'https://api-inference.huggingface.co/models/01-ai/Yi-1.5-34B-Chat/v1/chat/completions', type: 'chat' },

    { name: 'falcon-7b-instruct (raw)', url: 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct', type: 'raw' },
    // { name: 'TinyLlama-1.1B-Chat-v1.0 (chat/stream)', url: 'https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0/v1/chat/completions', type: 'chat' },
    { name: 'qwen2-1.5B-Instruct (chat)', url: 'https://api-inference.huggingface.co/models/Qwen/Qwen2-1.5B-Instruct/v1/chat/completions', type: 'chat' },
    { name: 'gpt-neox-20b (raw)', url: 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b', type: 'raw' },
    { name: 'gemma-2-2b-it (chat)', url: 'https://api-inference.huggingface.co/models/google/gemma-2-2b-it/v1/chat/completions', type: 'chat' },
    { name: 'distilgpt2 (raw)', url: 'https://api-inference.huggingface.co/models/distilbert/distilgpt2', type: 'raw' },
    // { name: 'phi-1_5 (raw)', url: 'https://api-inference.huggingface.co/models/microsoft/phi-1_5', type: 'raw' },
    // { name: 'zephyr-7b-beta (chat/stream)', url: 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta/v1/chat/completions', type: 'stream' },
    { name: 'codellama-13b-hf (raw)', url: 'https://api-inference.huggingface.co/models/codellama/CodeLlama-13b-hf', type: 'raw' },

]


// const endpoint_results = computed(() => {
//     return endpoints.filter(item => item.url.toLowerCase().includes(endpoint_input.value.toLowerCase()));
// })

// async function searchModels() {
//     const response = await $fetch(
//         `https://huggingface.co/api/models?search=${model.value.huggingface}&limit=5&full=true&config=true`,
//         {
//             method: "GET",
//             headers: {}
//         }
//     ).then(async (response) =>
//         hf_search_results.value = await response.json()
//     )
//     console.log(hf_search_results.value)
// }

const isValidApiKey = computed(() => {
    if (provider.value == 'openai') {
        const apiKeyRegex = /^sk-proj-[A-Za-z0-9]{48}$/;
        return apiKeyRegex.test(api_key.value?.openai);
    } else if (provider.value == 'anthropic') {
        const apiKeyRegex = /^sk-ant-[A-Za-z0-9_-]{101}$/;
        return apiKeyRegex.test(api_key.value?.anthropic);
    } else if (provider.value == 'huggingface') {
        const apiKeyRegex = /^hf_[A-Za-z0-9]{34}$/;
        return apiKeyRegex.test(api_key.value?.huggingface);
    }
})

const isValidEndpoint = ref(false);

function setEndpoint() {
    if (use_custom_endpoint.value) {
        endpoint.value = { name: 'custom HF', url: endpoint.url, type: 'raw' }
        model.value.huggingface = 'custom HF'
    } else {
        model.value.huggingface = 'gpt-2 (raw)'
        endpoint.value = endpoints.find(item => item.name == 'gpt-2 (raw)')
    }

}

function changeModel() {
    endpoint.value = endpoints.find(item => item.name == model.value.huggingface)
}

// async function checkEndpoint() {
//     try {
//         const response = await $fetch(endpoint.value.url, { method: 'HEAD' }); // Using HEAD request to check if the endpoint exists
//         isValidEndpoint.value = true
//         console.log(isValidEndpoint.value)// Response.ok is true for status codes 200-299
//     } catch (error) {
//         isValidEndpoint.value = false; // If there was an error with the fetch
//     }
// }



const hf_input_focused = ref(false)

const page = ref('prompt')

const variables = ref({})
const modal_open = ref({ settings: false, generate: false, info: false })
const test_cases = ref([])
const prompt = ref('')
const responses = ref([])

</script>
