const fs = require('fs');
const path = require('path');

const envFile = process.argv[2] === 'production' 
  ? 'src/environments/environment.prod.ts' 
  : 'src/environments/environment.ts';

const defaultApiUrl = process.argv[2] === 'production' 
  ? 'https://tuvision-production.up.railway.app'
  : 'http://localhost:3000';
const apiUrl = process.env.API_URL || defaultApiUrl;
const isProduction = process.argv[2] === 'production';

const content = `export const environment = {
  production: ${isProduction},
  apiUrl: '${apiUrl}'
};
`;

const filePath = path.join(__dirname, '..', envFile);
fs.writeFileSync(filePath, content);

console.log(`Environment file generated: ${envFile}`);
console.log(`API URL: ${apiUrl}`);
