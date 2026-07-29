'use client';
import {createBrowserClient} from '@supabase/ssr';

let client:ReturnType<typeof createBrowserClient>|undefined;
export function getSupabaseBrowserClient(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)throw new Error('Supabase ist nicht konfiguriert.');
 return client??=createBrowserClient(url,key);
}
export const AUTH_REDIRECT_PATHS={login:'/',afterLogin:'/dashboard',resetPassword:'/auth/reset-password',setup:'/admin/cloud-setup'} as const;
