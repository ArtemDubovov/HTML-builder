const fs = require('fs');
const path = require('path');

const list = [];


async function findItems(files){
  try {
    for(let el of files){
      if(el.isFile()){
        const fileDir = path.join(__dirname, 'secret-folder', el.name);
        const file = path.parse(fileDir);
        let prom  = await fs.promises.stat(fileDir, (err) => {
          if(err) throw err;
        });
        const fileName = file.name;
        const fileExt = file.ext;
        const fileSize =  prom.size / 1000;
        const res = `${fileName} - ${fileExt.slice(1)} - ${fileSize}kb`;
        list.push(res);
      }
    }
  } finally{
    for(let el of list){
      process.stdout.write(el + '\n');
    }
    
  }
}

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (e, files) => {
  findItems(files);
});
