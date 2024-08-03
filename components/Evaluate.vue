<template>

    <div class="bg-neutral-900 flex flex-col p-4 text-xs gap-4">

        <div class=" text-neutral-600 text-sm font-medium">TEST CASES</div>
        <div ref="test_case_container" class="overflow-scroll rounded-md max-h-[50vh]">
            <table class="bg-neutral-800 w-full table-fixed rounded-md text-center  divide-y divide-neutral-700">
                <thead class="sticky top-0 bg-neutral-800 z-10">
                    <tr class="text-center   divide-x divide-neutral-700">
                        <th class="w-10 text-neutral-400">#</th>
                        <th v-for="variable in Object.keys(variables)" class="font-normal whitespace-nowrap">
                            <div class="flex justify-between gap-2 items-center text-purple-500 p-4">
                                <p class="">{{ variable }}</p>

                            </div>
                        </th>
                        <th class="text-neutral-400 font-normal">Model Response</th>
                        <th class="w-24 text-neutral-400 p-4">
                            <div class="flex justify-center items-center gap-2">
                                <div>{{ average_score || '-' }}</div>
                                <div class="w-8 h-2 bg-neutral-700 rounded-full">
                                    <div :style="{ 'width': (average_score / 5) * 32 + 'px' }"
                                        class="h-2 bg-neutral-200 rounded-full">
                                    </div>
                                </div>
                            </div>
                        </th>


                    </tr>
                </thead>


                <tr v-for="(item, key) in test_cases" class="divide-x divide-y divide-neutral-700">
                    <td class="text-neutral-400">{{ key }}</td>
                    <td v-for="variable in Object.keys(item)"
                        class="p-2 text-left align-text-top text-xs text-neutral-200 max-w-20">

                        <div :placeholder="`Write a ${variable}`"
                            class="w-full top-0 bg-transparent outline-none block p-2">{{ test_cases[key][variable]
                            }}</div>


                    </td>

                    <td class="p-4 text-left text-neutral-200">
                        <div v-if="responses?.[key]?.pending" class="animate-pulse text-neutral-400">Generating
                            response...
                        </div>
                        <div v-else>{{ responses?.[key]?.data?.response }}</div>

                    </td>
                    <td>
                        <div class="p-2">
                            <select v-if="responses?.[key]?.['data']" v-model="responses[key]['data']['score']"
                                class="bg-neutral-700 w-8 h-6 text-neutral-200 outline-none rounded-sm" name="cars"
                                id="cars">

                                <option value="0" selected disabled hidden>-</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                    </td>

                </tr>


            </table>
        </div>

        <div class="flex gap-2 justify-between">
            <div class="flex gap-2">
                <button @click="runPrompts(true)" :class="{ 'opacity-20 pointer-events-none': !test_cases.length }"
                    class="bg-neutral-800 flex hover:bg-neutral-700 items-center gap-2 text-neutral-400 p-2 rounded-md">
                    <Play name="heroicons:play-16-solid" class="text-gray-500" />Run All
                </button>
                <button @click="runPrompts(false)" :class="{ 'opacity-20 pointer-events-none': !test_cases.length }"
                    class="bg-neutral-800 flex hover:bg-neutral-700 items-center gap-2 text-neutral-400 p-2 rounded-md">
                    <Refresh name="heroicons:arrow-path-16-solid" class="text-gray-500" />Run Remaining
                </button>


            </div>
            <button @click="exportEval" :class="{ 'opacity-20 pointer-events-none': !test_cases.length }"
                class="bg-neutral-800 flex hover:bg-neutral-700 items-center gap-2 text-neutral-400 p-2 rounded-md">
                <Export name="heroicons:document-arrow-down-16-solid" class="text-gray-500" />Export Eval
            </button>
        </div>

    </div>



</template>

<script setup>
import Refresh from '~icons/heroicons/arrow-path-16-solid'
import Export from '~icons/heroicons/arrow-down-tray-16-solid'
import Play from '~icons/heroicons/play-16-solid'
import Trash from '~icons/uil/trash'

const props = defineProps({
    variables: Object,
    test_cases: Object,
    prompt: String,
})

function replacePlaceholders(template, data) {
    return template.replace(/\${(.*?)}/g, (match, varName) => data[varName]);
}

const { variables, test_cases, prompt } = toRefs(props)
const responses = defineModel('responses')

const average_score = computed(() => {
    const totalScore = responses.value.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.data.score), 0);
    return responses.value.length ? (totalScore / responses.value.length).toFixed(1) : 0;
});
const modal_open = defineModel('modal_open')

function exportEval() {
    let file = responses.value.map(response => {
        return response.data
    })
    download(JSON.stringify(file), 'evals', 'application/json')
}

async function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


async function runPrompts(all) {
    let ids = []
    let promises = []
    test_cases.value.forEach((test_case, index) => {
        let replaced_prompt = prompt.value

        if (all || !(responses.value[index]?.data?.response)) {
            responses.value[index] = { data: { response: '', score: '0' }, pending: true };
            ids.push(index)
            Object.keys(variables.value).forEach(variable => {
                replaced_prompt = replaced_prompt.replace(variable, test_case[variable])

            })
            promises.push($fetch('/api/get_response', {
                method: 'POST',
                body: {
                    "prompt": replaced_prompt,
                }
            }))
        }

    })
    Promise.all(promises).then(results => {
        results.forEach((response, index) => {
            responses.value[ids[index]].data.response = response
            responses.value[ids[index]].pending = false
        });
        // Do something with the responses (arrOfRes[x] = response)
    })



}

</script>

<style lang="scss" scoped></style>