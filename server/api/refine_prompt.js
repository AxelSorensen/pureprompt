
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const instruction = `Given a prompt write a refined improved prompt. If the prompt contains any words in double curly braces these are variables which should be incooperated in the refined prompt as placeholders. Only add one placeholder per variable. If the original prompt is empty, make up your own prompt with placeholder variable with double curly brackets on each side. The placeholder variables should be one word and if replaced should change the context of the prompt. Only output the final prompt text`;


const prompt = ChatPromptTemplate.fromMessages([
    ["system", instruction],
    ["user", "Prompt: {prompt}\nRefined prompt: "],
]);

const outputParser = new StringOutputParser();

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    try {

        const api_key = getCookie(event, 'api_key')
        const model = getCookie(event, 'model')
        // const { api_key, model } = $fetch('api/getCookies')
        const chatModel = new ChatOpenAI({
            apiKey: api_key,
            model: model,
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