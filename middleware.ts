import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';

const publicPaths=new Set(['/','/auth/reset-password']);
export async function middleware(request:NextRequest){
 let response=NextResponse.next({request});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return publicPaths.has(request.nextUrl.pathname)?response:NextResponse.redirect(new URL('/?error=configuration',request.url));
 const supabase=createServerClient(url,key,{cookies:{getAll:()=>request.cookies.getAll(),setAll(values){values.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});values.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
 const {data:{user}}=await supabase.auth.getUser();
 if(!user&&!publicPaths.has(request.nextUrl.pathname)){const login=new URL('/',request.url);login.searchParams.set('redirect',request.nextUrl.pathname);return NextResponse.redirect(login);}
 if(user&&request.nextUrl.pathname==='/')return NextResponse.redirect(new URL('/dashboard',request.url));
 return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)']};
