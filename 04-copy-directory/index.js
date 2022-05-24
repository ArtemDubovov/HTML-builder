const fs = require('fs');
const path = require('path');

// // function deleted old files

// async function deleted(pathItems, faceFiles){
//   try{
//     for await(let item of faceFiles){
//       fs.unlink(path.join(pathItems, item), err => {
//         if(err) throw err;
//       });
//     }
//   } catch (e){
//     process.stdout.write(e);
//   }
// }

// async function copyDir(){
//   try{
//     const dir = path.join(__dirname, 'files');
//     const dirCopy = path.join(__dirname, 'files-copy');

//     // Create folder

//     await fs.mkdir(dirCopy, {recursive : true}, error => {
//       if(error) throw error;
//     });

//     // Delete files-copy

//     await fs.readdir(dirCopy, {withFileTypes: false,}, (err, faceFiles) => {
//       if(err) throw err;
//       deleted(dirCopy, faceFiles);
//     });

//     // Copy-files

//     await fs.readdir(dir, {withFileTypes: false,}, (err, files) => {
//       if(err) throw err;
//       for (let file of files){
//         const filename = path.parse(file).base;
//         let stream = fs.createReadStream(path.join(dir, filename));
//         let output = fs.createWriteStream(path.join(dirCopy, filename));
//         stream.pipe(output);
//       }

//     });
//   } catch (e){
//     process.stdout.write(e);
//   }
// }

// copyDir();

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
