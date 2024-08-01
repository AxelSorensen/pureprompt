<template>

    <div class="col-span-2 relative text-xs bg-neutral-900 rounded-md p-4 flex items-center justify-center">
        <div class="flex absolute items-center gap-4 left-0 p-4">
            <div class="text-purple-500 text-sm">@PurePrompt</div>
            <div class="text-xs hidden md:block text-neutral-600">By Axel Sorensen</div>

        </div>

        <div class="flex bg-neutral-800 rounded-full p-1 relative">

            <div @click="page = 'prompt'"
                :class="{ 'bg-neutral-700 text-neutral-200': page == 'prompt', 'text-neutral-600': page != 'prompt' }"
                class=" p-1 px-4 rounded-full cursor-pointer z-10">Prompt</div>
            <div @click="page = 'generate'"
                :class="{ 'bg-neutral-700 text-neutral-200': page == 'generate', 'text-neutral-600': page != 'generate' }"
                class=" p-1 px-4 rounded-full cursor-pointer z-10">Generate</div>
            <div @click="page = 'eval'"
                :class="{ 'bg-neutral-700 text-neutral-200': page == 'eval', 'text-neutral-600': page != 'eval' }"
                class="p-1 px-4 rounded-full cursor-pointer z-10">Evaluate</div>
        </div>
        <div class="flex gap-4 absolute right-0 p-4">
            <div class="text-xs items-center text-neutral-600 flex gap-2">
                <p class="text-neutral-400 hidden md:block">Current model:</p>
                <div class="bg-purple-900 text-purple-400 px-2 p-[2px] rounded-full"> {{ model }}</div>

            </div>
            <div @click="modal_open.settings = true" class="flex">

                <Icon name="heroicons:cog-6-tooth-16-solid" size="20"
                    class="text-gray-500 cursor-pointer hover:text-gray-400" />
            </div>
        </div>

    </div>
</template>

<script setup>
const page = defineModel('page')
const modal_open = defineModel('modal_open')
const model = useCookie('model')

</script>

<style lang="scss" scoped></style>
