export default defineEventHandler(async (event) => {

    const cookies = parseCookies(event)
    return cookies
})