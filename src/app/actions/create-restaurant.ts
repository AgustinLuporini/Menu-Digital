"use server";

import { createClient } from "@supabase/supabase-js";

export async function createRestaurantAndOwner(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const email = formData.get("email") as string;
  // Contraseña por defecto para facilitar tu testing (luego se podrá cambiar)
  const password = "123456"; 

  console.log("Creating restaurant:", name, slug, email);

  // 1. Iniciamos Supabase con la LLAVE MAESTRA (Service Role)
  // Esto nos permite crear usuarios sin estar logueados
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 2. Crear el Usuario (Owner) en Auth
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Lo confirmamos automáticamente para que pueda entrar ya
    user_metadata: { role: 'owner' } // Ya lo marcamos como owner
  });

  if (userError) {
    return { success: false, error: "Error creando usuario: " + userError.message };
  }

  const userId = userData.user.id;

  // 3. Crear el Restaurante en la DB y vincularlo al Usuario
  const { error: restError } = await supabaseAdmin
    .from("restaurants")
    .insert([
      {
        name: name,
        slug: slug.toLowerCase().replace(/ /g, "-"),
        owner_id: userId, // <--- AQUÍ ESTÁ LA VINCULACIÓN
      },
    ]);

  if (restError) {
    return { success: false, error: "Usuario creado, pero falló la DB: " + restError.message };
  }

  return { success: true, message: `Listo. Usuario: ${email} | Pass: ${password}` };
}