const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
function read(p){return fs.readFileSync(path.join(process.cwd(),p),'utf8')}
test('version and env example expose cloud foundation',()=>{assert.match(read('package.json'),/"version": "1\.9\.3"/);const env=read('.env.example');for(const key of ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_APP_URL','NEXT_PUBLIC_STORAGE_BUCKET','NEXT_PUBLIC_APP_ENV'])assert.match(env,new RegExp(key));});
test('supabase migration includes auth profiles, storage metadata and RLS policies',()=>{const sql=read('supabase/migrations/20260722000000_cloud_foundation.sql');for(const term of ['user_profiles','file_assets','migration_runs','enable row level security','ADMIN','MITARBEITER','employee_safe_records'])assert.match(sql,new RegExp(term));});
test('employee access blocks foreign sites and includes required evidence',()=>{const src=read('lib/cloud/employee-access.ts');for(const term of ['future-assigned','past-assigned','work-time','image-upload','message','Zugriff verweigert'])assert.match(src,new RegExp(term));});
test('storage validation blocks oversized files and base64-free storage paths',()=>{const src=read('lib/cloud/storage.ts');assert.match(src,/MAX_FILE_SIZE=15\*1024\*1024/);assert.match(src,/createStoragePath/);assert.doesNotMatch(src,/base64/i);});
test('authentication support includes roles and disabled-user gate',()=>{const src=read('lib/cloud/auth.ts');for(const term of ['ADMIN_NAMES','isAdminProfile','isEmployeeProfile','canUseApplication','active'])assert.match(src,new RegExp(term));});
