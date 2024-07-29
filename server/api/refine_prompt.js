import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const chatModel = new ChatOpenAI({
    model: 'gpt-4o-mini'
});

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

const llmChain = prompt.pipe(chatModel).pipe(outputParser);


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await llmChain.invoke({
        prompt: body.prompt
    })

})