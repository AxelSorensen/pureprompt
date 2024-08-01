<template>
    <div class="grid grid-cols-[2fr,1fr] gap-4">

        <div class="bg-neutral-900 rounded-md p-4 h-full flex flex-col gap-4">

            <div class="flex flex-col gap-2">
                <div class=" text-neutral-600 text-sm font-medium">SYSTEM PROMPT</div>

                <div class="bg-neutral-800 h-40 w-full p-2 rounded-sm relative">
                    <p class="text-xs text-neutral-400 animate-pulse" v-if="pending.system_prompt">Generating refined
                        prompt...</p>
                    <textarea v-else v-model="prompt"
                        class="bg-transparent outline-none resize-none h-full text-xs w-full caret-white text-neutral-200"
                        placeholder="Instruction for the system">

                </textarea>
                    <div @click="refine_prompt">
                        <Icon name="heroicons:sparkles-16-solid"
                            class="text-gray-500 absolute hover:text-purple-500 cursor-pointer right-2 bottom-4" />
                    </div>
                </div>
            </div>
            <button class="text-white bg-purple-800 rounded-sm hover:bg-purple-700 text-xs p-2"
                @click="submit_prompt">SUBMIT</button>
            <div class="flex flex-col gap-2">
                <div class=" text-neutral-600 text-sm font-medium">TEMPLATE</div>
                <div v-html="template_prompt"
                    class="resize-none rounded-sm outline-none text-xs caret-white text-neutral-400"></div>

            </div>
        </div>
        <div class="bg-neutral-900 rounded-md p-4 flex flex-col gap-4">

            <div class=" text-neutral-600 text-sm font-medium">VARIABLES</div>

            <div class="flex flex-col gap-2 text-neutral-400" v-for="(value, key) in variables">
                <div class="flex gap-2 text-sm items-center justify-between">
                    <p class="text-purple-500">{{ key }}</p><button class="font-bold flex "
                        @click="deleteVariable(key)">
                        <Icon name="uil:trash" class="text-gray-500 hover:text-red-500" />
                    </button>
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
            <button class="text-white bg-purple-800 rounded-sm hover:bg-purple-700 text-xs p-2" @click="get_response">
                <div class="animate-pulse" v-if="pending.model_response">Generating...</div>
                <div v-else>RUN PROMPT</div>
            </button>
            <div class=" text-neutral-600 text-sm font-medium">RESPONSE</div>
            <div class="text-neutral-400 text-xs">{{ response }}</div>

        </div>
    </div>
</template>

<script setup>

const cookies = useCookie('api_key')
const model = useModelType()
const api_key = useApiKey()
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
            "model": model.value,
            "api_key": api_key.value,
        }
    })
    pending.value.model_response = false
}

</script>