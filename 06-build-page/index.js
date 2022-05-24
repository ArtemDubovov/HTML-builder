const fs = require('fs');
const path = require('path');

const dirOutput = path.join(__dirname , 'styles');
const dirInput = path.join(__dirname, 'project-dist');

let templateItems;    
let template = '';   
let templates = {};

/**********Functions ********************************************************************************************/ 


function copyFiles(dirInput, dirOutput, files){
  files.forEach(item => {
    if(item.isFile() && path.extname(item.name) == '.css'){
      let wrapper = '';
      const inp = fs.createReadStream(path.join(dirOutput, item.name), 'utf-8');
      inp.on('data', chunk => wrapper += chunk);
      inp.on('end', () => {
        fs.appendFile(path.join(dirInput, 'style.css'), wrapper, err => {
          if(err) throw err;
        });
      });
    }
  });
}



function searchItems(dir, dirCopy){
  fs.readdir(dir, {withFileTypes: true,}, (err, files) => {
    if(err) throw err;
    let arch = dir;
    for (let file of files){
      if(file.isDirectory()) {
        // создаем копию папки
        fs.mkdir(path.join(dirCopy, file.name), {recursive : true}, e => {
          if(e) console.log(e);
        });
        let copy = path.join(dirCopy, file.name);
        searchItems(path.join(arch, file.name), copy);
      } else {
        const filename = path.parse(path.join(__dirname, file.name));
        let stream = fs.createReadStream(path.join(dir, filename.base));
        let output = fs.createWriteStream(path.join(dirCopy, filename.base));
        stream.pipe(output);
      }
    }
  });
}
function copyDir(){

  const dir = path.join(__dirname, 'assets');
  const dirCopy = path.join(__dirname, 'project-dist', 'assets');

  fs.mkdir(dirCopy, {recursive : true}, error => {
    if(error) throw error;
  });

  searchItems(dir, dirCopy);

}

/**********Start script ********************************************************************************************/ 


fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, e => {
  if(e) console.log(e);
  fs.rm(path.join(__dirname, 'project-dist'), {recursive: true}, e => {
    if(e) console.log(e);
    fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, e => {
      if(e) console.log(e);
      fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (e, files)  => {
        if(e) console.log(e);
        templates = files;
        for (let el of templates){
          let item = path.parse(path.join(__dirname, 'components', el.name));
          let key = item.name;
          let copy = fs.createReadStream(path.join(__dirname, 'components', el.name), 'utf-8');
          templates[key] = '';
          copy.on('data', chunk => templates[key] += chunk);
          copy.on('end', () => {}); 
          copy.on('error', e => {
            if(e) console.log(e);
          });
        }

        const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

        stream.on('data', chunk => template += chunk);
        stream.on('end', () => {
          templateItems = template.match(/{{.*}}/gi);
          (async () => {
            for await (let el of templateItems){
              let nameEl = el.replace(/[{|}]/gi, '');
              template = template.replace(el, templates[nameEl]);
            }
          })();
          // запись шаблона в файл index.html в папке project-dist
          fs.open(path.join(__dirname, 'project-dist', 'index.html'), 'w', e => {
            if(e) console.log(e);
            fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, e => {
              if(e) console.log(e);
              fs.writeFile(path.join(dirInput, 'style.css'), '', err => {
                if(err) throw err;
                fs.readdir(dirOutput, {withFileTypes: true}, (err, files) => {
                  (async () => {
                    try{
                      if(err) throw err;
                      await copyFiles(dirInput, dirOutput, files);
                    } catch (e){
                      process.stdout.write(e);
                    }
                  })();
                  copyDir();
                });
              });
            });
          });
        });
      });
    });
  });
});