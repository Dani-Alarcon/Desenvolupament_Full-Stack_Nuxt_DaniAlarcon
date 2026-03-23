import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // --- INICIO BLOQUE CORS MANUAL ---
  const origin = getRequestHeader(event, 'origin') || '*';
  
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': origin === '*' ? 'http://localhost' : origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Cookie, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  });

  if (event.method === 'OPTIONS') {
    return null;
  }
  // --- FIN BLOQUE CORS MANUAL ---

  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed"
    });
  }

  const { email, password } = await readBody(event);
  
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Falten camps per introduir"
    });
  }

  const existingUser = await useDb().query.users.findFirst({
    where: eq(schema.users.email, email)
  });
  
  if (!existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'email o el password son incorrectes"
    });
  }
  
  if (!existingUser.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "El password de GitHub es incorrecte"
    });
  }

  const isValid = await verifyPassword(existingUser.password, password);

  if (!isValid) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password incorrecte"
    });
  }
  
  const { password: repassword, ...userWithoutPassword } = existingUser;
  
  await setUserSession(event, {
    user: userWithoutPassword,
  });

  return { success: true, user: userWithoutPassword };
});