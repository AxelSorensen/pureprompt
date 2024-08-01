import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";



export default defineEventHandler(async (event) => {
    // const api_key = getCookie(event, 'api_key')
    // const model = getCookie(event, 'model')
    const body = await readBody(event)
    const chatModel = new ChatOpenAI({
        apiKey: body.api_key,
        model: body.model,
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ["user", '{prompt}'],
    ]);

    const outputParser = new StringOutputParser();

    const llmChain = prompt.pipe(chatModel).pipe(outputParser);


    return await llmChain.invoke({
        prompt: body.prompt
    })

})