<template>

    <div
        class="grid sm:grid-cols-[1fr,1fr,1fr] grid-cols-1 grid-rows-r overflow-hidden gap-4  text-xs bg-neutral-900  rounded-md p-4 items-center">
        <div class="sm:flex truncate hidden order-first items-center gap-4">
            <div class="text-purple-500 hidden sm:block text-sm">@PurePrompt</div>
            <div class="text-xs whitespace-nowrap truncate text-neutral-600">By Axel Sorensen</div>

        </div>

        <div
            class="flex order-last sm:order-2 xs:w-auto w-full justify-between bg-neutral-800 rounded-full p-1 relative select-none z-10">

            <div @click="page = 'prompt'"
                :class="{ 'bg-neutral-700 text-neutral-200': page == 'prompt', 'text-neutral-600': page != 'prompt' }"
                class=" p-1 px-4 truncate rounded-full cursor-pointer w-full text-center">Prompt</div>
            <div @click="page = 'generate'"
                :class="{ 'bg-neutral-700 text-neutral-200': page == 'generate', 'text-neutral-600': page != 'generate' }"
                class=" p-1 px-4 truncate rounded-full cursor-pointer w-full text-center ">Generate</div>
            <div @click="page = 'eval'"
                :class="{ 'bg-neutral-700 text-neutral-200': page == 'eval', 'text-neutral-600': page != 'eval' }"
                class="p-1 px-4 rounded-full truncate cursor-pointer w-full text-center">Evaluate</div>
        </div>
        <div class="flex order-first sm:order-last  gap-4 sm:justify-end w-full truncate justify-between">
            <div class="text-xs items-center truncate text-neutral-600 flex gap-2">
                <p class="text-neutral-400 truncate lg:block">Current model:</p>

                <div class="bg-purple-900 truncate text-purple-400 px-2 p-[2px] rounded-full"> {{
                    model?.[provider] ||
                    'Loading...' }}</div>


            </div>
            <div class="flex gap-2">
                <div @click="modal_open.settings = true" class="flex items-center gap-2">

                    <Cog class="text-gray-500 size-5 cursor-pointer hover:text-gray-400" />
                </div>
                <div @click="modal_open.info = true" class="flex items-center gap-2">

                    <Info class="text-amber-500 size-6 cursor-pointer hover:text-amber-400" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>

import Cog from '~icons/heroicons/cog-6-tooth-16-solid'
import Info from '~icons/uil/question-circle'

const page = defineModel('page')
const modal_open = defineModel('modal_open')
const model = useCookie('model')
const provider = useCookie('provider')

</script>

<style lang="scss" scoped></style>
