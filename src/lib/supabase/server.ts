import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Fase 0: sin `Database` genérico (no hay proyecto Supabase enlazado todavía).
// Cuando el proyecto exista, generar tipos con `supabase gen types typescript`
// y pasarlos aquí como `createServerClient<Database>(...)`.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Se llama desde un Server Component; el middleware ya refresca la sesión.
          }
        },
      },
    },
  );
}
