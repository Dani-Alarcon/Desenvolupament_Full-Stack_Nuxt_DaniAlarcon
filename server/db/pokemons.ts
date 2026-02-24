import { eq, and } from 'drizzle-orm'
import { pokemons } from './schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = useDb()
  const method = getMethod(event)
  const idParam = getRouterParam(event, 'id')
  const id = idParam ? Number(idParam) : null

  const currentUserId = Number(user.id)

  try {
    if (method === 'GET') {
      return await db.select()
        .from(pokemons)
        .where(eq(pokemons.userId, currentUserId))
    }

    if (method === 'POST') {
      const body = await readBody(event)
      return await db.insert(pokemons).values({
        name: body.name,
        type: body.type,
        generation: Number(body.generation),
        imatge: body.imatge,
        userId: currentUserId 
      }).returning().get()
    }

    if (!id) throw createError({ statusCode: 400, message: 'ID necessari' })

    if (method === 'DELETE') {
      const deleted = await db.delete(pokemons)
        .where(
          and(
            eq(pokemons.id, id), 
            eq(pokemons.userId, currentUserId)
          )
        )
        .returning().get()
      
      if (!deleted) throw createError({ statusCode: 404, message: 'No trobat' })
      return { message: 'Eliminat correctament' }
    }

    if (method === 'PUT') {
      const body = await readBody(event)
      const updated = await db.update(pokemons)
        .set({
          name: body.name,
          type: body.type,
          generation: Number(body.generation),
          imatge: body.imatge
        })
        .where(
          and(
            eq(pokemons.id, id), 
            eq(pokemons.userId, currentUserId)
          )
        )
        .returning().get()

      if (!updated) throw createError({ statusCode: 404, message: 'No trobat' })
      return updated
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error del servidor'
    })
  }
})