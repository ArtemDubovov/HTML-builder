const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8', error => console.error(error.message));
 
let content = '';

stream.on('data', chunk => content += chunk);
stream.on('end', () => process.stdout.write(content));
stream.on('error', error => process.stdout.write(error.message));