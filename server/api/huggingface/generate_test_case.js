import { HfInference } from "@huggingface/inference";


const instruction = `Given a prompt write a refined improved more detailed prompt. If the original prompt is empty, make up your own prompt. Only output the final prompt text`
const variable_instruction = `Given a prompt write a refined improved more detailed prompt. If the prompt contains any words in double curly braces these are variables which should be incooperated in the refined prompt as placeholders. Only add one placeholder per variable. If the original prompt is empty, make up your own prompt with placeholder variable with double curly brackets on each side. The placeholder variables should be one word and if replaced should change the context of the prompt. Only output the final prompt text`;


export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const hf_token = JSON.parse(getCookie(event, 'api_key')).huggingface
    const parameters = JSON.parse(getCookie(event, 'parameters')).huggingface
    const HF_TOKEN = hf_token
    // const hf_token = getCookie(event, 'api_key')
    const inference = new HfInference(HF_TOKEN, { use_cache: false });
    const custom_endpoint = JSON.parse(getCookie(event, 'endpoint'))
    if (!custom_endpoint.url) {
        return ('No endpoint url provided! Set your endpoint url in Settings ⚙️')
    }
    const endpoint = inference.endpoint(custom_endpoint.url)

    const instruction = `Given a description and a desired JSON structure, create a JSON object with the main key 'test_cases' and a list of objects with keys corresponding to a given list. Only output json, without explanations`;
    const example_instruction = `Given a description and a json object with example entries, create a json object with main key test_cases and entries in json format, using the same keys as the examples and filling with similar but diverse content. Only output json, without explanations`;
    let final_instruction;
    let final_prompt;
    if (!body.use_examples) {
        final_instruction = instruction
        final_prompt = `${final_instruction} Description: ${body.description}\n\nList of keys: ${body.variables}\n\nGenerate ${body.num_cases} test cases. The output should have ${body.tokens_per_case} tokens per case.
Output: `

    } else {
        final_instruction = example_instruction
        final_prompt = `${final_instruction} Description: ${body.description}\n\n
Examples: ${body.examples}\n\n
Generate ${body.num_cases} test cases. The output should have ${body.tokens_per_case} tokens per case.
Output: `
    }

    try {
        if (custom_endpoint.type == 'chat') {

            const result = await endpoint.chatCompletion({
                messages: [{
                    "role": "user", "content": final_prompt
                }],
                stream: false,
                use_cache: false,
                temperature: parameters.temp, // Adjust temperature as needed
                max_tokens: parameters.max_tokens,
            }, { use_cache: false })
            console.log(result.choices[0].message.content)
            return result.choices[0].message.content
        }
        if (custom_endpoint.type == 'raw') {

            const result = await endpoint.textGeneration({
                "inputs": final_prompt,
                "parameters": {
                    "max_new_tokens": parameters.max_tokens,
                    "temperature": parameters.temp,
                },
                "options": {
                    "use_cache": false
                }
            })
            return result.generated_text.replace(final_prompt, '')

        }
        // if (custom_endpoint.type == 'stream') {
        //     let result = ''
        //     console.log(custom_endpoint)
        //     for await (const chunk of inference.chatCompletionStream({
        //         messages: [{ role: "user", content: body.prompt }],
        //         "parameters": {
        //             "max_new_tokens": 40,
        //             "temperature": 0.7


        //         },
        //         "options": {
        //             "use_cache": false
        //         },
        //         use_cache: false
        //     })) {
        //         result += chunk.choices[0]?.delta?.content
        //     }
        //     console.log(result)
        //     return result.replace(body.prompt, '')

        // }
    } catch (error) {
        console.error(error)
        if (error.status == 401) {
            return ('Invalid API key! Set your API key in Settings ⚙️')
        }
        return error.message.toString()

    }

})