<template>
    <div
        class="grid grid-rows-[minmax(fit,_1fr),1fr] sm:grid-rows-1 h-full sm:grid-cols-[2fr_minmax(150px,_1fr)] gap-4">

        <div class="bg-neutral-900 contain rounded-md p-4 h-full flex flex-col gap-4 contain">

            <div class="flex flex-col gap-2">
                <div class=" text-neutral-600 text-sm hidden sm:block font-medium">SYSTEM PROMPT</div>

                <div class="bg-neutral-800 sm:h-40 h-20 w-full p-2 rounded-sm relative">
                    <p class="text-xs text-neutral-400 animate-pulse" v-if="pending.system_prompt">Generating refined
                        prompt...</p>
                    <textarea v-else v-model="prompt"
                        class="bg-transparent outline-none resize-none h-full text-xs w-full caret-white text-neutral-200"
                        placeholder="Instruction for the system">

                </textarea>
                    <div class="absolute flex items-center cursor-pointer group gap-2  right-2 bottom-4">

                        <div v-if="pending.system_prompt"
                            class="text-xs w-fit hover:text-red-500 select-none cursor-pointer rounded-sm text-neutral-600"
                            @click="abort('refine_prompt')">
                            Cancel</div>
                        <div class="flex gap-2" v-else @click="refine_prompt">
                            <p v-if="!prompt" class="text-xs hidden sm:block text-gray-500 group-hover:text-purple-500">
                                Generate
                                example</p>
                            <Sparkles class="text-gray-500  size-4 group-hover:text-purple-500 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>

            <button v-if="isValidApiKey"
                class="text-white justify-center flex bg-purple-800 rounded-sm hover:bg-purple-700 text-xs p-2"
                @click="submit_prompt">
                <p class="truncate">SUBMIT</p>
            </button>
            <div @click="modal_open.settings = true"
                class="flex text-center gap-2 justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-purple-500 hover:bg-purple-900 hover:bg-opacity-40 cursor-pointer shadow border border-purple-500 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(-45deg,transparent_25%,#a855f740_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:animate-[slide_2s_ease-in-out_infinite]"
                v-else>
                <div class="truncate">
                    Add
                    API key in
                    Settings
                </div>
                <div class="flex items-center">
                    <Cog class="text-purple-500 min-w-0  size-4" />
                </div>
            </div>
            <div class="flex flex-col gap-2 overflow-hidden">
                <div class=" text-neutral-600 text-sm hidden sm:block font-medium">TEMPLATE</div>
                <div class=" overflow-scroll">
                    <div v-html="template_prompt" class="rounded-sm text-xs text-neutral-400">
                    </div>
                </div>


            </div>
        </div>

        <div class="bg-neutral-900 rounded-md p-4 flex flex-col gap-4">
            <div class=" hidden sm:flex flex-col gap-2">
                <div class=" text-neutral-600 text-sm font-medium">VARIABLES</div>

                <div v-if="!Object.keys(variables).length" class="flex items-center gap-2 py-2">

                    <div>
                        <Exclamation class="text-amber-500 size-4 right-2 bottom-4" />
                    </div>
                    <div class="text-xs text-amber-500">Currently no placeholder variables in prompt</div>
                </div>
            </div>

            <div class="sm:min-h-fit flex flex-col gap-2 sm:overflow-visible">
                <div class="flex sm:flex-col justify-between gap-2 text-neutral-400" v-for="(value, key) in variables">
                    <div class="flex gap-2  text-sm items-center justify-between">
                        <p class="text-purple-500 truncate">{{ '&#123;&#123;' + key + '&#125;&#125;' }}</p>
                        <!-- <button class="font-bold flex " @click="deleteVariable(key)">
                        <Trash class="text-gray-500 size-4 hover:text-red-500" />
                    </button> -->
                    </div>
                    <div class="flex-grow sm:max-w-full max-w-[70%]">
                        <input
                            class="bg-neutral-800 p-2 w-full resize-none rounded-sm outline-none text-xs caret-white text-neutral-200"
                            type="text" :key="key" v-model="variables[key]" placeholder="Value" />

                        <!-- <Icon name="heroicons:sparkles-16-solid"
                        class="text-gray-500 absolute hover:text-purple-500 cursor-pointer right-2 bottom-4" /> -->

                    </div>

                </div>
            </div>
            <button v-if="isValidApiKey" class="text-white bg-purple-800 rounded-sm hover:bg-purple-700 text-xs p-2"
                @click="get_response">

                <div class="animate-pulse" v-if="pending.model_response">Generating...</div>
                <div v-else>RUN PROMPT</div>
            </button>
            <div class=" text-neutral-600 text-sm hidden sm:block font-medium">RESPONSE</div>
            <div v-if="pending.model_response" class="flex gap-4 items-center">
                <div>
                    <div class="w-2 h-2 bg-neutral-400 rounded-full animate-ping"></div>
                </div>
                <p class="text-xs text-neutral-400 animate-pulse">
                    Generating
                    response...</p>

            </div>
            <div class="overflow-scroll h-full contain" v-else>
                <div class="text-neutral-400 text-xs">{{ response }}</div>

            </div>
            <div class="flex justify-end">
                <div v-if="pending.model_response"
                    class="text-xs  w-fit hover:text-red-500 cursor-pointer flex justify-center p-2 rounded-sm text-neutral-600"
                    @click="abort('get_response')">
                    Cancel</div>
            </div>
        </div>





    </div>
</template>

<script setup>

import Info from '~icons/heroicons/information-circle-16-solid'
import Exclamation from '~icons/heroicons/exclamation-circle-16-solid'
import Trash from '~icons/uil/trash'
import Cog from '~icons/heroicons/cog-6-tooth-16-solid'
import Sparkles from '~icons/heroicons/sparkles-16-solid'

const props = defineProps({
    isValidApiKey: Boolean
})

const { isValidApiKey } = toRefs(props)
const provider = useCookie('provider')
const modal_open = defineModel('modal_open')
const variables = defineModel('variables')
const prompt = defineModel('prompt')
const response = ref('')
const template_prompt = ref('')
const pending = ref({
    system_prompt: false,
    model_response: false
})


function addVariable(key) {
    variables.value[key] = ''
}



function deleteVariable(key) {
    delete variables.value[key]
}

function createVariables() {
    const regex = /\{\{\w+\}\}/g;
    const matches = prompt.value.match(regex)
    if (matches) {
        matches.forEach(word => {
            variables.value[word.slice(2, -2)] = '';
        });
    }

}



function submit_prompt() {
    Object.keys(variables.value).forEach(key => {
        delete variables.value[key]
    })
    template_prompt.value = prompt.value.split(' ').map(word => {
        if (word.includes('{{') && word.includes('}}')) {
            return `<span class="text-purple-500">${word}</span>`
        } else {
            return word
        }
    }).join(' ')

    createVariables()
}

let get_response_controller;
let refine_prompt_controller;


async function refine_prompt() {
    refine_prompt_controller = new AbortController();
    pending.value.system_prompt = true
    prompt.value = await $fetch(`/api/${provider.value}/refine_prompt`, {
        signal: refine_prompt_controller.signal,
        method: 'POST',
        body: {
            "prompt": prompt.value,
            "with_variables": true
        }
    });
    pending.value.system_prompt = false;  // Reset pending state

}

function abort(id) {
    if (id == 'get_response') {
        get_response_controller.abort()
        response.value = ''
        pending.value.model_response = false
    }
    if (id == 'refine_prompt') {
        refine_prompt_controller.abort()
        prompt.value = ''
        pending.value.system_prompt = false
    }


}



async function get_response() {
    get_response_controller = new AbortController();
    pending.value.model_response = true
    let replaced_prompt = prompt.value
    Object.keys(variables.value).forEach(variable => {
        replaced_prompt = replaced_prompt.replace('{{' + variable + '}}', variables.value[variable])
    })

    response.value = await $fetch(`/api/${provider.value}/get_response`, {
        signal: get_response_controller.signal,
        method: 'POST',
        body: {
            "prompt": replaced_prompt,
        },
    })
    pending.value.model_response = false
}

</script>
<style>
@keyframes slide {
    0% {
        background-position: 200% 0, 0 0;
    }

    100% {
        background-position: -100% 0, 0 0;
    }
}
</style>