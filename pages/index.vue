<template>
    <div v-if="modal_open.info" @mousedown.self="modal_open.settings = false, modal_open.info = false"
        class="fixed z-30 w-screen h-screen  bg-black bg-opacity-70 flex justify-center items-center">
        <div
            class="bg-neutral-900 w-1/2 h-fit max-w-[400px] min-w-[200px] gap-8 flex flex-col justify-between rounded-md p-4">

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
        class="fixed z-30 w-screen h-screen  bg-black bg-opacity-70 flex justify-center items-center">
        <div
            class="bg-neutral-900 w-1/2 h-fit max-w-[400px] min-w-[200px] gap-8 flex flex-col justify-between rounded-md p-4">

            <div class="flex gap-4 flex-col h-full">
                <div class=" text-neutral-600 text-sm font-medium pb-4">SETTINGS</div>

                <div class="flex justify-between gap-2 items-center relative">
                    <div class=" text-neutral-600 text-xs font-medium">OPENAI API KEY</div>

                    <input
                        class="bg-neutral-800 truncate w-full resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                        type="password" v-model="api_key" placeholder="sk-xxxxxxxxx" />
                    <div v-if="isValidApiKey" class="flex">
                        <Check class="text-green-500 size-6 right-2 bottom-4" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-2">
                    <div class=" text-neutral-600 text-xs font-medium">MODEL</div>
                    <select v-model="model"
                        class="bg-neutral-700 text-xs w-24 h-6 text-neutral-200 outline-none rounded-sm">
                        <option>gpt-4o-mini</option>
                        <option>gpt-4o</option>
                        <option>gpt-4-turbo</option>
                        <option>gpt-3.5-turbo</option>

                    </select>




                </div>
                <div class="flex items-center gap-2">
                    <Exclamation class="text-amber-500 size-4 right-2 bottom-4" />
                    <div class="text-xs text-amber-500">Hugging Face support coming soon</div>
                </div>
            </div>
            <button class="text-white bg-purple-800 hover:bg-purple-700 rounded-sm text-xs p-2"
                @click="modal_open.settings = false">CLOSE</button>

        </div>


    </div>

    <div class=" bg-neutral-800 w-screen absolute h-screen grid grid-rows-[50px,1fr] grid-cols-1 p-4 gap-y-4">

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
import Exclamation from '~icons/heroicons/exclamation-circle-16-solid'
// const api_key = useApiKey()
// const model = useModelType()
const api_key = useCookie('api_key')
if (!api_key.value) {
    api_key.value = ''
}


const model = useCookie('model')
if (!model.value) {
    model.value = 'gpt-4o-mini'
}

// const updateCookie = async ($event, key) => {

//     await $fetch('/api/cookies/setCookie', {
//         method: 'POST',
//         body: {
//             [key]: $event.target.value,
//         }
//     })
// }

const isValidApiKey = computed(() => {
    const apiKeyRegex = /^sk-proj-[A-Za-z0-9]{48}$/;
    return apiKeyRegex.test(api_key.value);
})


const page = ref('prompt')

const variables = ref({})
const modal_open = ref({ settings: false, generate: false, info: false })
const test_cases = ref([])
const prompt = ref('')
const responses = ref([])

</script>
