
export default defineEventHandler(async (event) => {
  
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: 'No estas logat' })
  }

  return [
    { id: 1, name: 'Pikachu', type: 'Electric', generation: 1, imatge: '', userId: 1 }
  ]
})