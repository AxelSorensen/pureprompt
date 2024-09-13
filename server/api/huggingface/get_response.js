import { HfInference } from "@huggingface/inference";




export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const hf_token = JSON.parse(getCookie(event, 'api_key')).huggingface
    const HF_TOKEN = hf_token
    const parameters = JSON.parse(getCookie(event, 'parameters')).huggingface
    // const hf_token = getCookie(event, 'api_key')
    const inference = new HfInference(HF_TOKEN, { use_cache: false });
    const custom_endpoint = JSON.parse(getCookie(event, 'endpoint'))
    if (!custom_endpoint.url) {
        return ('No endpoint url provided! Set your endpoint url in Settings ⚙️')
    }
    const endpoint = inference.endpoint(custom_endpoint.url, { use_cache: false })

    try {
        if (custom_endpoint.type == 'chat') {

            const result = await endpoint.chatCompletion({
                messages: [{ "role": "user", "content": body.prompt }],
                max_tokens: parameters.max_tokens,
                temperature: parameters.temp,
                stream: false,
                use_cache: false
            }, { use_cache: false, })


            return result.choices[0].message.content
        }
        if (custom_endpoint.type == 'raw') {

            const result = await endpoint.textGeneration({
                "inputs": body.prompt,
                "parameters": {
                    "max_new_tokens": parameters.max_tokens,
                    "temperature": parameters.temp,
                },
                "options": {
                    "use_cache": false
                }
            })
            return result.generated_text.replace(body.prompt, '')
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