import { db } from "../db";
import { pokemons } from "../db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const origin = getRequestHeader(event, 'origin') || '*';
  
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': origin === '*' ? 'http://localhost' : origin,
    'Access-Control-Allow-Credentials': 'true',    
    'Access-Control-Allow-Headers': 'Content-Type, Cookie, Authorization, x-user-id',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  });

  if (event.method === 'OPTIONS') {
    return null;
  }

  const headerUserId = getRequestHeader(event, 'x-user-id');
  let userId = 0;

  if (headerUserId) {
    userId = Number(headerUserId);
  } else {
    const session = await getUserSession(event);
    if (session && session.user) {
      userId = Number(session.user.id);
    } else {
      throw createError({ statusCode: 401, message: 'La sessió ha caducat' });
    }
  }

  const method = event.method;

  if (method === 'GET') {
    return await db.select()
      .from(pokemons)
      .where(eq(pokemons.userId, userId));
  }

  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(pokemons).values({
      name: body.name,
      type: body.type,
      generation: Number(body.generation),
      userId: userId,
      ...(body.imatge && body.imatge.trim() !== '' ? { imatge: body.imatge } : {})
    }).returning();
  }

  if (method === 'PUT') {
    const query = getQuery(event);
    const body = await readBody(event);
    await db.update(pokemons)
      .set({
        name: body.name,
        type: body.type,
        generation: Number(body.generation),
        imatge: body.imatge
      })
      .where(and(eq(pokemons.id, Number(query.id)), eq(pokemons.userId, userId)));
    return { message: "Pokémon modificat" };
  }

  if (method === 'DELETE') {
    const query = getQuery(event);
    await db.delete(pokemons).where(and(eq(pokemons.id, Number(query.id)), eq(pokemons.userId, userId)));
    return { message: "Pokémon eliminat" };
  }
});