import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
    ["user", '{prompt}'],
]);

const outputParser = new StringOutputParser();

export default defineEventHandler(async (event) => {
    const api_key = getCookie(event, 'api_key')
    const model = getCookie(event, 'model')
    const body = await readBody(event)
    try {


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