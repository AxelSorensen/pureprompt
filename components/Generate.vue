<template>

    <div v-if="modal_open" @click.self="modal_open = false"
        class="fixed z-30 w-screen h-screen  bg-black bg-opacity-70 flex justify-center items-center">
        <div
            class="bg-neutral-900 w-1/2 h-1/2 max-w-[400px] min-h-[400px] flex flex-col justify-between rounded-md p-4">
            <div class="flex gap-4 flex-col">
                <div class=" text-neutral-600 text-sm font-medium">DESCRIPTION</div>
                <div class="relative">
                    <textarea
                        class="bg-neutral-800 h-20 w-full resize-none rounded-sm p-2 outline-none text-xs caret-white text-neutral-200"
                        type="text" v-model="test_case_description" placeholder="Decribe the test cases">
                </textarea>

                    <div @click="refine_prompt">
                        <Icon name="heroicons:sparkles-16-solid"
                            class="text-gray-500 absolute hover:text-purple-500 cursor-pointer right-2 bottom-4" />
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
                    <div class=" text-neutral-600  text-xs font-medium">USE EXAMPLES</div>

                    <input class=" size-6 resize-none bg-opacity-20 rounded-sm text-xs accent-purple-800"
                        type="checkbox" />



                </div>
            </div>
            <button class="text-white bg-purple-800 hover:bg-purple-700 rounded-sm text-xs p-2"
                @click="generate_test_case">GENERATE
                TEST
                CASES</button>
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
                    <td class="text-neutral-400">{{ key }}</td>
                    <td v-for="variable in Object.keys(item)"
                        class="p-2 text-left align-text-top text-xs text-neutral-200 max-w-20">

                        <input :placeholder="`Write a ${variable}`" v-model="test_cases[key][variable]"
                            class="w-full top-0 bg-transparent outline-none block p-2" />


                    </td>
                    <td>
                        <div @click="deleteRow(key)">
                            <Icon name="uil:trash" size="16" class="text-gray-500 cursor-pointer hover:text-red-500" />
                        </div>
                    </td>
                </tr>


            </table>
        </div>

        <div class="flex gap-2 justify-between">
            <div class="flex gap-2">
                <button @click="addRow"
                    class="bg-neutral-800 flex hover:bg-neutral-700 items-center gap-2 text-neutral-400 p-2 rounded-md">
                    <Icon name="heroicons:plus-16-solid" class="text-gray-500" />Add Row
                </button>
                <button @click="openGenerateModal"
                    class="bg-neutral-800 items-center hover:bg-neutral-700 flex gap-2 text-neutral-400 p-2 rounded-md">
                    <Icon name="heroicons:sparkles-16-solid" class="text-gray-500" />Generate
                    Test Case
                </button>
                <button @click="importJSON"
                    class="bg-neutral-800 items-center hover:bg-neutral-700 flex gap-2 text-neutral-400 p-2 rounded-md">
                    <Icon name="heroicons:document-arrow-up-16-solid" class="text-gray-500" />
                    Import JSON
                </button>
            </div>
            <button @click="deleteAllRows"
                class="bg-neutral-800 group flex hover:bg-neutral-700 items-center gap-2 text-neutral-400 p-2 rounded-md">
                <Icon name="uil:trash" class="text-gray-500 group-hover:text-red-500" />Clear All
            </button>
        </div>

    </div>


</template>

<script setup>

const props = defineProps({
    variables: Object
})
const responses = defineModel('responses')
const modal_open = defineModel('modal_open')
const test_case_description = ref('')
const { variables } = toRefs(props)
const test_cases = defineModel('test_cases')
const num_cases = ref(1)
const tokens_per_case = ref(100)
const test_case_container = ref(null);
const last_input = ref(null);

function addRow() {
    const obj = {};
    Object.keys(variables.value).forEach(item => {
        obj[item] = '';
    });
    test_cases.value.push(obj)

    nextTick(() => {
        test_case_container.value.scrollTop = test_case_container.value.scrollHeight
        last_input.value.$focus()
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
    modal_open.value = true
}

async function generate_test_case() {

    modal_open.value = false
    let buffer = await $fetch('/api/generate_test_case', {
        method: 'POST',
        body: {
            "description": test_case_description.value,
            "examples": JSON.stringify(test_cases.value),
            "num_cases": num_cases.value,
            "tokens_per_case": tokens_per_case.value,
        }
    })
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