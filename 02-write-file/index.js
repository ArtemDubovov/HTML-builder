const fs = require('fs');
const {stdin, stdout} = process;
const path = require('path');

function error(e){
  if(e) throw e;
}

fs.open(path.join(__dirname, 'text.txt'), 'w', e => error(e));


stdout.write('Start your message:\n');


stdin.on('data', data => {
  
  const text = data.toString().trim();

  if(text.toLowerCase() == 'exit'){
    stdout.write('finish!');
    process.exit();
  }

  fs.appendFile(path.join(__dirname, 'text.txt'), text + '\n', e => error(e));

});

process.on('SIGINT', () => {
  stdout.write('finish!');
  process.exit();
});