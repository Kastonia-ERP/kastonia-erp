import {getCloudConfigStatus} from './config';
export type SupabaseAuthResult={error?:{message:string}|null};
export type SupabaseLikeClient={auth:{signInWithPassword:(input:{email:string;password:string})=>Promise<SupabaseAuthResult>;signOut:()=>Promise<SupabaseAuthResult>;resetPasswordForEmail:(email:string,options:{redirectTo:string})=>Promise<SupabaseAuthResult>;getSession:()=>Promise<{data:{session:unknown|null};error?:{message:string}|null}>}};
let client:SupabaseLikeClient|null=null;
export function getSupabaseBrowserClient():SupabaseLikeClient|null{const cfg=getCloudConfigStatus();if(!cfg.configured)return null;if(!client){client={auth:{async signInWithPassword(){return {error:null}},async signOut(){return {error:null}},async resetPasswordForEmail(){return {error:null}},async getSession(){return {data:{session:null},error:null}}}};}return client;}
export const AUTH_REDIRECT_PATHS={login:'/login',afterLogin:'/dashboard',resetPassword:'/auth/reset-password',setup:'/admin/cloud-setup'} as const;
