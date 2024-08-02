import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


const instruction = `Given a description and a json object with example entries, create a json object with main key test_cases and entries in json format, using the same keys as the examples and filling with similar content
`;


const prompt = ChatPromptTemplate.fromMessages([
    ["system", instruction],
    ["user", "Description: {description}\nExamples: {examples}\n Generate {num_cases} test cases with {tokens_per_case} tokens per case.\n Output: "],

]);

const outputParser = new StringOutputParser();


export default defineEventHandler(async (event) => {
    const api_key = getCookie(event, 'api_key')
    const model = getCookie(event, 'model')
    try {


        const chatModel = new ChatOpenAI({
            apiKey: body.api_key,
            model: body.model,
            modelKwargs: {
                "response_format": {
                    type: "json_object"
                }
            }
        });

        const llmChain = prompt.pipe(chatModel).pipe(outputParser);

        return await llmChain.invoke({
            description: body.description,
            examples: body.examples,
            num_cases: body.num_cases,
            tokens_per_case: body.tokens_per_case
        })
    } catch (error) {
        console.error(error)
        if (error.status == 401) {
            return ('Invalid API key! Set your API key in Settings ⚙️')
        }
        return error.message.toString()

    }

})