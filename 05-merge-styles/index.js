const fs = require('fs');
const path = require('path');

const dirOutput = path.join(__dirname, 'styles');
const dirInput = path.join(__dirname, 'project-dist');

function copyFiles(dir, files){

  files.forEach(item => {
    if(item.isFile() && path.extname(item.name) == '.css'){
      let wrapper = '';
      const inp = fs.createReadStream(path.join(dirOutput, item.name), 'utf-8');
      inp.on('data', chunk => wrapper += chunk);
      inp.on('end', () => {
        fs.appendFile(path.join(dirInput, 'bundle.css'), wrapper, err => {
          if(err) throw err;
        });
      });
    }
  });
}

fs.open(path.join(dirInput, 'bundle.css'), 'w', err => {
  if(err) console.log(err);
  fs.writeFile(path.join(dirInput, 'bundle.css'), '', err => {
    if(err) console.log(err);
    fs.readdir(dirOutput, {withFileTypes: true}, (err, files) => {
      if(err) console.log(err);
      copyFiles(dirOutput, files);
    });
  });
});