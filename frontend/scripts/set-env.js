const fs = require('fs');
const path = require('path');

const envFile = process.argv[2] === 'production' 
  ? 'src/environments/environment.prod.ts' 
  : 'src/environments/environment.ts';

const apiUrl = process.env.API_URL || 'http://localhost:3000';
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
