export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    Object.keys(body).forEach(key => {
        setCookie(event, key, body[key])
    })
    return

})