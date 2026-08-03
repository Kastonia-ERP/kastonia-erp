'use client';

import {FormEvent,useEffect,useState} from 'react';
import Link from 'next/link';
import {getSupabaseBrowserClient} from '../../../lib/cloud/supabase';

type Step='request'|'update'|'complete';

export default function ResetPasswordPage(){
 const [step,setStep]=useState<Step>('request');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [confirmation,setConfirmation]=useState('');
 const [message,setMessage]=useState('');
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);

 useEffect(()=>{
  let active=true;
  try{
   const supabase=getSupabaseBrowserClient();
   void supabase.auth.getSession().then(({data}:{data:{session:unknown}})=>{if(active&&data.session)setStep('update')});
   const {data:{subscription}}=supabase.auth.onAuthStateChange((event:string)=>{
    if(active&&(event==='PASSWORD_RECOVERY'||event==='SIGNED_IN'))setStep('update');
   });
   return ()=>{active=false;subscription.unsubscribe()};
  }catch{
   setError('Der Passwortdienst ist derzeit nicht konfiguriert. Bitte an die Administration wenden.');
  }
 },[]);

 async function requestReset(event:FormEvent){
  event.preventDefault();setBusy(true);setError('');setMessage('');
  try{
   const redirectTo=new URL('/auth/reset-password',process.env.NEXT_PUBLIC_APP_URL||window.location.origin).toString();
   const {error:resetError}=await getSupabaseBrowserClient().auth.resetPasswordForEmail(email,{redirectTo});
   if(resetError)throw resetError;
   setMessage('Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Reset-Link versendet. Bitte auch den Spam-Ordner prüfen.');
  }catch{
   setError('Der Reset-Link konnte nicht versendet werden. Bitte später erneut versuchen.');
  }finally{setBusy(false)}
 }

 async function updatePassword(event:FormEvent){
  event.preventDefault();setError('');setMessage('');
  if(password.length<8){setError('Das neue Passwort muss mindestens 8 Zeichen lang sein.');return}
  if(password!==confirmation){setError('Die eingegebenen Passwörter stimmen nicht überein.');return}
  setBusy(true);
  try{
   const {error:updateError}=await getSupabaseBrowserClient().auth.updateUser({password});
   if(updateError)throw updateError;
   await getSupabaseBrowserClient().auth.signOut();
   setPassword('');setConfirmation('');setStep('complete');
  }catch{
   setError('Das Passwort konnte nicht gespeichert werden. Der Link ist möglicherweise abgelaufen. Bitte einen neuen Link anfordern.');
  }finally{setBusy(false)}
 }

 return <main className="loginWrap"><section className="loginCard" aria-labelledby="reset-title">
  <div className="logoMark" aria-hidden="true">K</div>
  <h1 id="reset-title">{step==='update'?'Neues Passwort festlegen':step==='complete'?'Passwort geändert':'Passwort zurücksetzen'}</h1>
  {step==='request'&&<form onSubmit={requestReset} className="authForm">
   <p>Wir senden einen sicheren Link an die E-Mail-Adresse Ihres persönlichen Kastonia-Kontos.</p>
   <label htmlFor="reset-email">E-Mail-Adresse<input id="reset-email" required autoComplete="email" type="email" value={email} onChange={event=>setEmail(event.target.value)} /></label>
   <button className="primary" disabled={busy} type="submit">{busy?'Link wird gesendet …':'Reset-Link senden'}</button>
  </form>}
  {step==='update'&&<form onSubmit={updatePassword} className="authForm">
   <p>Wählen Sie ein neues Passwort mit mindestens 8 Zeichen.</p>
   <label htmlFor="new-password">Neues Passwort<input id="new-password" required minLength={8} autoComplete="new-password" type="password" value={password} onChange={event=>setPassword(event.target.value)} /></label>
   <label htmlFor="confirm-password">Passwort bestätigen<input id="confirm-password" required minLength={8} autoComplete="new-password" type="password" value={confirmation} onChange={event=>setConfirmation(event.target.value)} /></label>
   <button className="primary" disabled={busy} type="submit">{busy?'Passwort wird gespeichert …':'Passwort speichern'}</button>
  </form>}
  {step==='complete'&&<p>Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt mit dem neuen Passwort anmelden.</p>}
  {message&&<p className="successAlert" role="status">{message}</p>}
  {error&&<p className="dangerAlert" role="alert">{error}</p>}
  {step==='update'&&<button className="authLink" type="button" onClick={()=>{setStep('request');setError('')}}>Neuen Reset-Link anfordern</button>}
  <Link className="authLink" href="/">{step==='complete'?'Zur Anmeldung':'Zurück zur Anmeldung'}</Link>
 </section></main>;
}
