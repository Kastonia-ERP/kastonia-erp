import {NextResponse,type NextRequest} from 'next/server';
const publicPrefixes=['/','/auth/reset-password'];
const employeePages=['/mitarbeiter','/mitarbeiter-mobile'];
export function middleware(req:NextRequest){const {pathname}=req.nextUrl;if(publicPrefixes.includes(pathname))return NextResponse.next();const hasSupabaseSession=req.cookies.getAll().some(c=>c.name.startsWith('sb-')&&c.name.includes('auth-token'));const hasDemoSession=req.cookies.get('kastonia-demo-session')?.value==='1';if(!hasSupabaseSession&&!hasDemoSession){const url=req.nextUrl.clone();url.pathname='/';url.searchParams.set('redirect',pathname);return NextResponse.redirect(url)}const role=req.cookies.get('kastonia-role')?.value;if(hasDemoSession&&role!=='ADMIN'&&!employeePages.some(page=>pathname.startsWith(page))){const url=req.nextUrl.clone();url.pathname='/mitarbeiter';return NextResponse.redirect(url)}return NextResponse.next()}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
