<template>

    <div v-if="modal_open.generate" @mousedown.self="modal_open.generate = false"
        class="fixed z-30 w-screen h-screen  bg-black bg-opacity-70 flex justify-center items-center">
        <div
            class="bg-neutral-900 w-1/2 h-1/2 max-w-[400px] min-h-[400px] flex flex-col justify-between rounded-md p-4">
            <div class="flex gap-4 flex-col">
                <div class=" text-neutral-600 text-sm font-medium">DESCRIPTION</div>
                <div class="bg-neutral-800 h-20 w-full p-2 rounded-sm relative">
                    <p class="text-xs text-neutral-400 animate-pulse" v-if="pending.refine_prompt">Generating refined
                        prompt...</p>
                    <textarea v-else v-model="test_case_description"
                        class="bg-transparent outline-none resize-none h-full text-xs w-full caret-white text-neutral-200"
                        placeholder="Decribe the test cases">

                </textarea>


                    <div v-if="test_case_description" @click="refine_prompt">
                        <Sparkles
                            class="text-gray-500 absolute hover:text-purple-500 cursor-pointer size-4 right-2 bottom-4" />
                    </div>

                </div>
                <div class="flex justify-between items-center">
                    <div class=" text-neutral-600 text-xs font-medium"># OF CASES</div>

                    <input
                        class="bg-neutral-800 w-20 resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                        type="text" v-model="num_cases" placeholder="1-10" />



                </div>
                <div class="flex justify-between items-center">
                    <div class=" text-neutral-600 text-xs font-medium"># TOKENS (PER CASE)</div>

                    <input
                        class="bg-neutral-800 w-20 resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                        type="text" v-model="tokens_per_case" placeholder="1-10" />



                </div>
                <div class="flex justify-between items-center">

                    <div class="flex">

                        <div class="pr-4 text-neutral-600  text-xs font-medium">USE EXAMPLES</div>

                    </div>
                    <div v-if="!test_cases.length" class="flex gap-2">
                        <Exclamation class="text-yellow-600 size-4 right-2 bottom-4" />


                        <div class=" text-yellow-600  text-xs font-medium" v-if="!test_cases.length">Add examples
                        </div>
                    </div>
                    <input v-else v-model="use_examples"
                        class=" size-6 resize-none bg-opacity-20 rounded-sm text-xs accent-purple-800"
                        type="checkbox" />



                </div>
            </div>
            <button v-if="isValidApiKey" class="text-white bg-purple-800 hover:bg-purple-700 rounded-sm text-xs p-2"
                @click="generate_test_case">GENERATE
                TEST
                CASES</button>
            <div @click="modal_open.generate = false; modal_open.settings = true"
                class="flex items-center gap-2 justify-center whitespace-nowrap rounded-lg p-2 text-sm font-medium text-purple-500 hover:bg-purple-900 hover:bg-opacity-40 cursor-pointer shadow border border-purple-500 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(-45deg,transparent_25%,#a855f740_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:animate-[slide_2s_ease-in-out_infinite]"
                v-else>Add
                API key in
                Settings

                <Cog class="text-purple-500 size-4" />

            </div>
        </div>


    </div>

    <div class="bg-neutral-900 flex flex-col p-4 text-xs gap-4">

        <div class=" text-neutral-600 text-sm font-medium">TEST CASES</div>
        <div ref="test_case_container" class="overflow-scroll rounded-md max-h-[50vh]">
            <table class="bg-neutral-800 w-full table-fixed rounded-md text-center  divide-y divide-neutral-700">
                <thead class="sticky top-0 bg-neutral-800 z-10">
                    <tr class="text-center  text-purple-500 divide-x divide-neutral-700">
                        <th class="w-10 text-neutral-400">#</th>
                        <th v-for="variable in Object.keys(variables)" class="font-normal whitespace-nowrap">
                            <div class="flex justify-between gap-2 items-center p-4">
                                <p class="">{{ variable }}</p>

                            </div>
                        </th>
                        <th class="w-10 bg-neutral"></th>

                    </tr>
                </thead>


                <tr v-for="(item, key) in test_cases" class="divide-x divide-y divide-neutral-700">
                    <td class="text-neutral-400 p-2">{{ key }}</td>
                    <td v-for="variable in Object.keys(item)"
                        class="p-2 text-left align-text-top text-xs text-neutral-200 max-w-20">

                        <input :placeholder="`Write a ${variable}`" v-model="test_cases[key][variable]"
                            class="w-full top-0 bg-transparent outline-none block p-2" />


                    </td>
                    <td>
                        <div class="flex justify-center p-2" @click="deleteRow(key)">
                            <Trash class="text-gray-500 cursor-pointer size-4 hover:text-red-500" />
                        </div>
                    </td>
                </tr>


            </table>
            <div v-if="pending.generate_prompts" class="p-4 flex gap-4 items-center justify-center">
                <div class="w-2 h-2 bg-neutral-400 rounded-full animate-ping"></div>
                <p class="text-xs  text-neutral-400 animate-pulse">
                    Generating
                    test cases...</p>
            </div>
        </div>

        <div class="flex gap-2 justify-between">
            <div class="flex gap-2">
                <button @click="addRow"
                    class="bg-neutral-800 flex hover:bg-neutral-700 items-center gap-2 text-neutral-400 p-2 rounded-md">
                    <Plus class="text-gray-500 size-3" />Add Row
                </button>
                <button @click="openGenerateModal"
                    class="bg-neutral-800 items-center hover:bg-neutral-700 flex gap-2 text-neutral-400 p-2 rounded-md">
                    <Sparkles class="text-gray-500 size-3" />Generate
                    Test Case
                </button>
                <button @click="importJSON"
                    class="bg-neutral-800 items-center hover:bg-neutral-700 flex gap-2 text-neutral-400 p-2 rounded-md">
                    <Import class="text-gray-500 size-3" />
                    Import
                </button>
                <button @click="exportTestCases" :class="{ 'opacity-20 pointer-events-none': !test_cases.length }"
                    class="bg-neutral-800 items-center hover:bg-neutral-700 flex gap-2 text-neutral-400 p-2 rounded-md">
                    <Export class="text-gray-500 size-3" />
                    Export
                </button>
            </div>

            <button @click="deleteAllRows" :class="{ 'opacity-20 pointer-events-none': !test_cases.length }"
                class="bg-neutral-800 group flex hover:bg-neutral-700 items-center gap-2 text-neutral-400 p-2 rounded-md">
                <Trash class="text-gray-500 group-hover:text-red-500 size-3" />Clear All
            </button>
        </div>
    </div>


</template>

<script setup>
import Exclamation from '~icons/heroicons/exclamation-circle-16-solid'
import Cog from '~icons/heroicons/cog-6-tooth-16-solid'
import Sparkles from '~icons/heroicons/sparkles-16-solid'
import Plus from '~icons/heroicons/plus-16-solid'
import Import from '~icons/heroicons/document-arrow-up-16-solid'
import Export from '~icons/heroicons/arrow-down-tray-16-solid'
import Trash from '~icons/uil/trash'
const props = defineProps({
    variables: Object,
    isValidApiKey: Boolean
})
const { variables, isValidApiKey } = toRefs(props)
const responses = defineModel('responses')
const modal_open = defineModel('modal_open')
const test_case_description = ref('')
const use_examples = ref(false)

const test_cases = defineModel('test_cases')
const num_cases = ref(1)
const tokens_per_case = ref(10)
const test_case_container = ref(null);
const pending = ref({
    generate_prompts: false,
    refine_prompt: false
})



async function refine_prompt() {
    pending.value.refine_prompt = true
    test_case_description.value = await $fetch('/api/refine_prompt', {
        method: 'POST',
        body: {
            "prompt": test_case_description.value,
        }
    })
    pending.value.refine_prompt = false


}

async function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function addRow() {
    const obj = {};
    Object.keys(variables.value).forEach(item => {
        obj[item] = '';
    });
    test_cases.value.push(obj)

    nextTick(() => {
        test_case_container.value.scrollTop = test_case_container.value.scrollHeight
    });
}

function importJSON() {
    let element = document.createElement("input");
    element.setAttribute("type", "file");
    element.setAttribute("accept", ".json");
    element.style.display = "none";
    element.multiple = true;
    document.body.appendChild(element);
    element.click();
    element.addEventListener("change", async (e) => {
        let reader = new FileReader();
        reader.addEventListener("loadend", () => {
            test_cases.value.push(...JSON.parse(reader.result))

        });
        reader.readAsText(e.target.files[0]);
    });
}

function deleteRow(index) {
    test_cases.value.splice(index, 1)
    responses.value.splice(index, 1)
}

function deleteAllRows() {
    test_cases.value = []
}

function openGenerateModal() {
    modal_open.value.generate = true
}

function exportTestCases() {
    download(JSON.stringify(test_cases.value), 'test_cases', 'application/json')
}

async function generate_test_case() {
    pending.value.generate_prompts = true
    modal_open.value.generate = false
    let buffer = await $fetch('/api/generate_test_case', {
        method: 'POST',
        body: {
            "description": test_case_description.value,
            "variables": JSON.stringify(Object.keys(variables.value)),
            "use_examples": use_examples.value,
            "examples": JSON.stringify(test_cases.value),
            "num_cases": num_cases.value,
            "tokens_per_case": tokens_per_case.value,
        }
    })
    pending.value.generate_prompts = false
    buffer = JSON.parse(buffer)
    Object.values(buffer['test_cases']).forEach(test_case => {
        test_cases.value.push(test_case)
    })


    nextTick(() => {
        test_case_container.value.scrollTop = test_case_container.value.scrollHeight
    });

}
</script>

<style lang="scss" scoped></style>