import { createBrowserClient } from "@supabase/ssr";

// Fase 0: sin `Database` genérico (no hay proyecto Supabase enlazado todavía).
// Cuando el proyecto exista, generar tipos con `supabase gen types typescript`
// y pasarlos aquí como `createBrowserClient<Database>(...)`.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
