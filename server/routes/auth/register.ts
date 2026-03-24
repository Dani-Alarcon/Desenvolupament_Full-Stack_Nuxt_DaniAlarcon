import { registerUser, throwIfUserExist } from "~~/server/utils/registerUtils"

export default defineEventHandler(async (event) => {
    if (event.method === 'OPTIONS') {
        return 'OK'
    }

    if (event.method !== 'POST') {
        throw createError({ statusCode: 405, statusMessage: "Mètode no permès" })
    }

    const body = await readBody(event)
    const { name, email, password } = body

    if (!name || !email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: "Falten camps per introduir"
        })
    }

    await throwIfUserExist(email)

    const newUser = await registerUser(name, email, password)

    const { password: repassword, ...userWithOutPassword } = newUser

    await setUserSession(event, {
        user: userWithOutPassword
    })

    return userWithOutPassword
})