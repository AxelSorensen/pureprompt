import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";




export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const instruction = `Given a description and a desired JSON structure, create a JSON object with the main key 'test_cases' and a list of objects with keys corresponding to a given list`;
    const example_instruction = `Given a description and a json object with example entries, create a json object with main key test_cases and entries in json format, using the same keys as the examples and filling with similar but diverse content:`;
    let prompt = null

    if (!body.use_examples) {

        prompt = ChatPromptTemplate.fromMessages([
            ["system", instruction],
            ["user", "Description: {description}\nList of keys: {variables} Generate {num_cases} test cases. The output should have {tokens_per_case} tokens per case.\n Output: "],

        ]);
    } else {

        prompt = ChatPromptTemplate.fromMessages([
            ["system", example_instruction],
            ["user", "Description: {description}\n,Examples: {examples}\n Generate {num_cases} test cases. The output should have {tokens_per_case} tokens per case.\n Output: "],

        ]);
    }

    const outputParser = new StringOutputParser();

    const api_key = JSON.parse(getCookie(event, 'api_key')).openai
    const parameters = JSON.parse(getCookie(event, 'parameters')).openai
    const model = JSON.parse(getCookie(event, 'model')).openai
    try {
        const chatModel = new ChatOpenAI({
            apiKey: api_key,
            model: model,
            temperature: parameters.temp,
            maxTokens: parameters.max_tokens,
            modelKwargs: {
                "response_format": {
                    type: "json_object"
                }
            }
        });

        const llmChain = prompt.pipe(chatModel).pipe(outputParser);

        return await llmChain.invoke({
            description: body.description,
            variables: body.variables,
            use_examples: body.use_examples,
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