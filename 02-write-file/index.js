const fs = require('fs');
const {stdin, stdout} = process;

function error(e){
  if(e) throw e;
}

// Create file

fs.open('text.txt', 'w', e => error(e));

// Write message

stdout.write('Enter your message:\n');

// 

stdin.on('data', data => {
  
  const text = data.toString().trim();

  if(text.toLowerCase() == 'exit') process.exit();

  fs.appendFile('text.txt', text + '\n', e => error(e));

});

process.on('SIGINT', () => {
  stdout.write('close enter');
  process.exit();
});