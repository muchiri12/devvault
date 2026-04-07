import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/env";

export function createServerSupabaseClient() {
    const cookieStore = cookies();

    return createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
        cookies: {
            get: async (name: string) => (await cookieStore).get(name)?.value,
            set: (name: string, value: string, options: any) => {
                cookieStore.then(store => store.set(name, value, options));
            },
            remove: (name: string, options: any) => {
                cookieStore.then(store => store.set(name, "", { ...options, maxAge: 0 }));
            },
        }
        },
    );
}