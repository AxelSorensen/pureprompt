import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
    ["user", '{prompt}'],
]);

const outputParser = new StringOutputParser();

export default defineEventHandler(async (event) => {
    const api_key = JSON.parse(getCookie(event, 'api_key'))?.openai

    const model = JSON.parse(getCookie(event, 'model'))?.openai
    const parameters = JSON.parse(getCookie(event, 'parameters'))?.openai
    const body = await readBody(event)
    try {
        const chatModel = new ChatOpenAI({
            apiKey: api_key,
            model: model,
            temperature: parameters.temp,
            maxTokens: parameters.max_tokens,
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