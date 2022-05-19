const fs = require('fs');
const path = require('path');

const dirOutput = path.join(__dirname, 'styles');
const dirInput = path.join(__dirname, 'project-dist');

async function copyFiles(dir, files){
  try {
    for await (let item of files){
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
    }
  } catch (e){
    process.stdout.write(e);
  }
}

async function start(){
  try { 
    // создать файл пустой
    await fs.open(path.join(dirInput, 'bundle.css'), 'w', err => {
      if(err) throw err;
      fs.writeFile(path.join(dirInput, 'bundle.css'), '', err => {
        if(err) throw err;
      });
    });
    // прочитать папку
    await fs.readdir(dirOutput, {withFileTypes: true}, (err, files) => {
      (async () => {
        try{
          if(err) throw err;
          await copyFiles(dirOutput, files);
        } catch (e){
          process.stdout.write(e);
        }
      })();
      
    });

    // скопировать папаку
  } catch (e) {
    process.stdout.write(e);
  }
}
start();