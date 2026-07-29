'use client';
import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {getSupabaseBrowserClient} from '../lib/cloud/supabase';

export default function LoginPage(){
 const router=useRouter();const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError('');try{const {error}=await getSupabaseBrowserClient().auth.signInWithPassword({email,password});if(error)throw error;const requested=new URLSearchParams(window.location.search).get('redirect');router.replace(requested?.startsWith('/')&&!requested.startsWith('//')?requested:'/dashboard');router.refresh();}catch{setError('Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.');setBusy(false);}}
 return <div className="loginWrap"><form className="loginCard" onSubmit={submit}><div className="logoMark">K</div><h1>KASTONIA ERP</h1><p>Geschützter Zugang zu internen Seiten und Unternehmensdaten.</p><label>E-Mail<input required autoComplete="username" type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Passwort<input required autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="dangerAlert" role="alert">{error}</p>}<button className="primary" disabled={busy} type="submit">{busy?'Anmeldung läuft …':'Sicher anmelden'}</button><a href="/auth/reset-password">Passwort vergessen?</a><small>Persönliche Administratorkonten für Gökhan und Seda.</small></form></div>;
}
