<template>
    <div class="grid grid-cols-[2fr,1fr] gap-4">

        <div class="bg-neutral-900 rounded-md p-4 h-full flex flex-col gap-4 contain">

            <div class="flex flex-col gap-2">
                <div class=" text-neutral-600 text-sm font-medium">SYSTEM PROMPT</div>

                <div class="bg-neutral-800 h-40 w-full p-2 rounded-sm relative">
                    <p class="text-xs text-neutral-400 animate-pulse" v-if="pending.system_prompt">Generating refined
                        prompt...</p>
                    <textarea v-else v-model="prompt"
                        class="bg-transparent outline-none resize-none h-full text-xs w-full caret-white text-neutral-200"
                        placeholder="Instruction for the system">

                </textarea>
                    <div class="absolute flex items-center cursor-pointer group gap-2  right-2 bottom-4"
                        @click="refine_prompt">
                        <p v-if="!prompt" class="text-xs text-gray-500 group-hover:text-purple-500">Generate
                            example</p>
                        <Sparkles class="text-gray-500 size-4 group-hover:text-purple-500 cursor-pointer" />
                    </div>
                </div>
            </div>
            <button v-if="isValidApiKey"
                class="text-white justify-center flex bg-purple-800 rounded-sm hover:bg-purple-700 text-xs p-2"
                @click="submit_prompt">SUBMIT</button>
            <div @click="modal_open.settings = true"
                class="flex gap-2 justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-purple-500 hover:bg-purple-900 hover:bg-opacity-40 cursor-pointer shadow border border-purple-500 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(-45deg,transparent_25%,#a855f740_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:animate-[slide_2s_ease-in-out_infinite]"
                v-else>Add
                API key in
                Settings
                <div class="flex items-center">
                    <Cog class="text-purple-500 size-4" />
                </div>
            </div>
            <div class="flex flex-col gap-2 overflow-hidden">
                <div class=" text-neutral-600 text-sm font-medium">TEMPLATE</div>
                <div class=" overflow-scroll">
                    <div v-html="template_prompt"
                        class=" resize-none whitespace-pre rounded-sm outline-none text-xs caret-white text-neutral-400">
                    </div>
                </div>


            </div>
        </div>

        <div class="bg-neutral-900 rounded-md p-4 flex flex-col gap-4">
            <div class="flex gap-2 items-center">
                <div class=" text-neutral-600 text-sm font-medium">VARIABLES</div>
                <div>

                    <Info class="text-neutral-600 cursor-pointer hover:text-neutral-400 size-4 right-2 bottom-4" />

                    <div id="tooltip-default" role="tooltip"
                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                        Tooltip content
                        <div class="tooltip-arrow" data-popper-arrow></div>
                    </div>
                </div>
            </div>
            <div v-if="!Object.keys(variables).length" class="flex items-center gap-2">

                <div>
                    <Exclamation class="text-amber-500 size-4 right-2 bottom-4" />
                </div>
                <div class="text-xs text-amber-500">Currently no placeholder variables in prompt</div>
            </div>

            <div class="flex flex-col gap-2 text-neutral-400" v-for="(value, key) in variables">
                <div class="flex gap-2 text-sm items-center justify-between">
                    <p class="text-purple-500">{{ key }}</p>
                    <!-- <button class="font-bold flex " @click="deleteVariable(key)">
                        <Trash class="text-gray-500 size-4 hover:text-red-500" />
                    </button> -->
                </div>
                <div class="relative">
                    <textarea
                        class="bg-neutral-800 h-20 w-full resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                        type="text" v-model="variables[key]" placeholder="Value">
                </textarea>
                    <!-- <Icon name="heroicons:sparkles-16-solid"
                        class="text-gray-500 absolute hover:text-purple-500 cursor-pointer right-2 bottom-4" /> -->

                </div>

            </div>
            <button v-if="isValidApiKey" class="text-white bg-purple-800 rounded-sm hover:bg-purple-700 text-xs p-2"
                @click="get_response">

                <div class="animate-pulse" v-if="pending.model_response">Generating...</div>
                <div v-else>RUN PROMPT</div>
            </button>
            <div class=" text-neutral-600 text-sm font-medium">RESPONSE</div>
            <div v-if="pending.model_response" class="flex gap-4 items-center">
                <div class="w-2 h-2 bg-neutral-400 rounded-full animate-ping"></div>
                <p class="text-xs  text-neutral-400 animate-pulse">
                    Generating
                    test cases...</p>
            </div>
            <div v-else class="text-neutral-400 text-xs">{{ response }}</div>

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
const model = useModelType()
const api_key = useApiKey()
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
            variables.value[word] = '';
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

async function refine_prompt() {
    pending.value.system_prompt = true
    prompt.value = await $fetch('/api/refine_prompt', {
        method: 'POST',
        body: {
            "prompt": prompt.value,
            "model": model.value,
            "api_key": api_key.value,
        }
    })
    pending.value.system_prompt = false


}

async function get_response() {

    pending.value.model_response = true
    let replaced_prompt = prompt.value
    Object.keys(variables.value).forEach(variable => {
        replaced_prompt = replaced_prompt.replace(variable, variables.value[variable])
    })

    response.value = await $fetch('/api/get_response', {
        method: 'POST',
        body: {
            "prompt": replaced_prompt,
        }
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