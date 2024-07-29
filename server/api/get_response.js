import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
function setup(body) {
    const chatModel = new ChatOpenAI({
        model: 'gpt-4o-mini'
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ["user", body.prompt],
    ]);

    const outputParser = new StringOutputParser();

    const llmChain = prompt.pipe(chatModel).pipe(outputParser);

    return llmChain
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const llmChain = setup(body)
    return await llmChain.invoke()

})