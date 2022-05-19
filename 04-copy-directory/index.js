const fs = require('fs');
const path = require('path');


async function copyDir(){

  const dir = path.join(__dirname, 'files');
  const dirCopy = path.join(__dirname, 'files-copy');

  await fs.readdir(dir, {withFileTypes: false, encoding: 'utf-8'}, (err, files) => {
    if(err) throw err;

    // create folder
    fs.promises.mkdir(dirCopy, {recursive : true}, error => {
      if(error) throw error;
    });


    for (let file of files){
      const filename = path.parse(file).base;
      let stream = fs.createReadStream(path.join(dir, filename));
      let output = fs.createWriteStream(path.join(dirCopy, filename));
      stream.pipe(output);
    }

  });
}

copyDir();

