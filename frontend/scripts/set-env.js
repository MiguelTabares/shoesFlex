const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/environments/environment.ts');

const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || 'http://localhost:3000/api'}'
};
`;

console.log('The file `environment.ts` will be written with the following content: \\n');
console.log(envConfigFile);

fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        throw console.error(err);
    } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
    }
});
