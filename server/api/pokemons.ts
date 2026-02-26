import { db } from "../db";
import { pokemons } from "../db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const userId = Number(user.id);
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
      imatge: body.imatge || '',
      userId: userId,
    }).returning();
  }

  if (method === 'PUT') {
    const query = getQuery(event);
    const idToUpdate = Number(query.id);
    const body = await readBody(event);
    
    await db.update(pokemons)
      .set({
        name: body.name,
        type: body.type,
        generation: Number(body.generation),
        imatge: body.imatge
      })
      .where(and(
        eq(pokemons.id, idToUpdate),
        eq(pokemons.userId, userId)
      ));
      
    return { message: "Pokémon modificat correctament" };
  }

  if (method === 'DELETE') {
    const query = getQuery(event);
    const idToDelete = Number(query.id);
    
    await db.delete(pokemons)
      .where(and(
        eq(pokemons.id, idToDelete),
        eq(pokemons.userId, userId)
      ));
      
    return { message: "Pokémon eliminat" };
  }
});