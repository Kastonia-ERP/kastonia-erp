const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
fs.rmSync('dist-tests', {recursive:true, force:true});
execFileSync('npx', ['tsc', 'lib/models/operations-center.ts', '--target', 'ES2020', '--module', 'commonjs', '--outDir', 'dist-tests', '--skipLibCheck', '--esModuleInterop'], {stdio:'inherit'});
fs.renameSync('dist-tests/models/operations-center.js', 'dist-tests/operations-center.cjs');
