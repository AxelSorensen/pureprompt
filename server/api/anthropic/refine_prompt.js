import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatAnthropic } from "@langchain/anthropic";

const instruction = `Given a prompt write a refined improved more detailed prompt. If the original prompt is empty, make up your own prompt. Only output the final prompt text`
const variable_instruction = `Given a prompt write a refined improved more detailed prompt. If the prompt contains any words in double curly braces these are variables which should be incooperated in the refined prompt as placeholders. Only add one placeholder per variable. If the original prompt is empty, make up your own prompt with placeholder variable with double curly brackets on each side. The placeholder variables should be one word and if replaced should change the context of the prompt. Only output the final prompt text`;


export default defineEventHandler(async (event) => {
    const parameters = JSON.parse(getCookie(event, 'parameters')).anthropic
    const api_key = JSON.parse(getCookie(event, 'api_key')).anthropic

    const model = JSON.parse(getCookie(event, 'model')).anthropic
    const body = await readBody(event)
    let prompt;
    if (body.with_variables) {

        prompt = ChatPromptTemplate.fromMessages([
            ["system", variable_instruction],
            ["user", "Prompt: {prompt}\nRefined prompt: "],
        ]);
    } else {
        prompt = ChatPromptTemplate.fromMessages([
            ["system", instruction],
            ["user", "Prompt: {prompt}\nRefined prompt: "],
        ]);
    }

    const outputParser = new StringOutputParser();
    try {
        // const { api_key, model } = $fetch('api/getCookies')
        const chatModel = new ChatAnthropic({
            apiKey: api_key,
            model: model,
            temperature: parameters.temp,
            maxTokens: parameters.max_tokens
        });
        const llmChain = prompt.pipe(chatModel).pipe(outputParser);
        return await llmChain.invoke({
            prompt: body.prompt
        })


    } catch (error) {
        console.error(error)
        if (error.status == 401) {
            return ('Invalid API key! Set your API key in Settings ⚙️')
        }
        return error.message.toString()

    }


})