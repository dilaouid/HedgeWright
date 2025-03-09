const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Commence par construire l'application React
console.log('Building React app...');
process.chdir(path.join(__dirname, '../../editor'));
execSync('npm run build', { stdio: 'inherit' });

// Puis construit et lance Electron
console.log('Building and running Electron app...');
process.chdir(path.join(__dirname, '..'));
execSync('npm run dev', { stdio: 'inherit' });
