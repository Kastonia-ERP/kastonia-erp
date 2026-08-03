const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const page=fs.readFileSync('app/auth/reset-password/page.tsx','utf8');

test('password recovery sends a non-disclosing reset response',()=>{
 assert.match(page,/resetPasswordForEmail\(email,\{redirectTo\}\)/);
 assert.match(page,/Falls ein Konto mit dieser E-Mail-Adresse existiert/);
 assert.doesNotMatch(page,/setError\([^)]*\.message/);
});

test('password recovery accepts the recovery session and updates the password',()=>{
 assert.match(page,/event==='PASSWORD_RECOVERY'/);
 assert.match(page,/updateUser\(\{password\}\)/);
 assert.match(page,/password\.length<8/);
 assert.match(page,/password!==confirmation/);
 assert.match(page,/auth\.signOut\(\)/);
});
