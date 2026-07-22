import {NextResponse,type NextRequest} from 'next/server';
const protectedPrefixes=['/dashboard','/operations','/mitarbeiter-mobile','/admin','/benutzer'];
export function middleware(req:NextRequest){const {pathname}=req.nextUrl;const hasSupabaseSession=req.cookies.getAll().some(c=>c.name.startsWith('sb-')&&c.name.includes('auth-token'));const hasDemoSession=req.cookies.get('kastonia-demo-session')?.value==='1';if(protectedPrefixes.some(p=>pathname.startsWith(p))&&!hasSupabaseSession&&!hasDemoSession){const url=req.nextUrl.clone();url.pathname='/';url.searchParams.set('redirect',pathname);return NextResponse.redirect(url)}return NextResponse.next()}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
