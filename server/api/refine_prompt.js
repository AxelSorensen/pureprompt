
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const instruction = `Given a prompt write a refined improved prompt. If the prompt contains any words prepended with @, these are variables which should be incooperated in the refined prompt as placeholders. Only add one placeholder per variable
    
Example:
Prompt: Given a {{message}} translate into Spanish.
Refined prompt: Please translate the following message into English, providing not only a direct translation but also any cultural context, idiomatic expressions, or nuances that might be relevant for a better understanding of the original text. The text to translate is: {{message}}
`;


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