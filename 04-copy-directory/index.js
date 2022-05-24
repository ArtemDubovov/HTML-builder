const fs = require('fs');
const path = require('path');



function copyDir(dir, dirCopy){
  fs.readdir(dir, {withFileTypes: false,}, (err, files) => {
    if(err) throw err;
    files.forEach(el =>{
      const filename = path.parse(el).base;
      let stream = fs.createReadStream(path.join(dir, filename));
      let output = fs.createWriteStream(path.join(dirCopy, filename));
      stream.pipe(output);
    });
  });
}


fs.rm(path.join(__dirname, 'files-copy'), {recursive: true, force : true},  err => {
  if(err) {
    console.log('error');
  } else {
    fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, err => {
      if(err) {
        console.log('error');
      } else{ 
        copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
      }
    });
  }
  
});
