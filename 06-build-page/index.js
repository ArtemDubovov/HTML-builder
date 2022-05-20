// 1. Импорт всех требуемых модулей
// 2. Прочтение и сохранение в переменной файла-шаблона
// 3. Нахождение всех имён тегов в файле шаблона
// 4. Замена шаблонных тегов содержимым файлов-компонентов
// 5. Запись изменённого шаблона в файл **index.html** в папке **project-dist**
// 6. Использовать скрипт написанный в задании **05-merge-styles** для создания файла **style.css**
// 7. Использовать скрипт из задания **04-copy-directory** для переноса папки **assets** в папку project-dist 

const fs = require('fs');
const path = require('path');

function error(e){
  if(e){
    process.stdout.write('Error: ' + e);
  }
}
async function clearFolder(dir, el){
  // if(el.isFile()){
  //   await fs.unlink(path.join(dir, el.name), e => error(e));
  // } else {
  //   let nextDir = path.join(dir, el.name);
  //   let items;
  //   await fs.readdir(nextDir, {withFileTypes: true}, (e, files) => {
  //     error(e);
  //     items = files;
  //   });
  //   if(!items){
  //     console.log(items, ' - items');
  //     await fs.rmdir(dir, e => error(e));
  //     return;
  //   }
  //   for await (let el of items){
  //     clearFolder(nextDir, el);
  //   }
  //   await fs.rmdir(nextDir);
  // }
}

(async () => {
  try{
    let templateItems;    // список найденых шаблонов в template.html
    let template = '';    // сам template.html в текстовом представлении
    let templates = {};        // шаблоны в components

    // создание папки
    await fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, e => error(e));

    // очищение папки если она была забита
    let oldItems;
    await fs.readdir(path.join(__dirname, 'project-dist'), {withFileTypes: true}, (e, files) => {
      error(e);
      for (let el of files){
        clearFolder(path.join(__dirname, 'project-dist'), el);
      }
      
    });


    

    await fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (e, files)  => {
      error(e);
      templates = files;
      (async () => {
        try{
          for await(let el of templates){
            let item = path.parse(path.join(__dirname, 'components', el.name));
            let key = item.name;
            let copy = fs.createReadStream(path.join(__dirname, 'components', el.name), 'utf-8');
            templates[key] = '';

            copy.on('data', chunk => templates[key] += chunk);
            copy.on('end', () => {}); 
            copy.on('error', e => error(e));
          }
          
        } catch (e){
          error(e);
        }
      })();

    });


    const stream = await fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    

    //  создание и запись шаблона в переменной
    await stream.on('data', chunk => template += chunk);
    await stream.on('end', () => {
      templateItems = template.match(/{{.*}}/gi);
      for(let el of templateItems){
        let nameEl = el.replace(/[{|}]/gi, '');
        template = template.replace(el, templates[nameEl]);
      }
      // запись шаблона в файл index.html в папке project-dist
      fs.open(path.join(__dirname, 'project-dist', 'index.html'), 'w', e => error(e));
      fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, e => error(e));
    });
  } catch (e){
    error(e);
  }
})();



// добавление стилей из 5 задания

const dirOutput = path.join(__dirname , 'styles');
const dirInput = path.join(__dirname, 'project-dist');

async function copyFiles(dir, files){
  try {
    for await (let item of files){
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
    }
  } catch (e){
    process.stdout.write(e);
  }
}

async function start(){
  try { 
    // создать файл пустой
    await fs.open(path.join(dirInput, 'style.css'), 'w', err => {
      if(err) throw err;
      fs.writeFile(path.join(dirInput, 'style.css'), '', err => {
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

  } catch (e) {
    process.stdout.write(e);
  }
}
start();

// копирование из 4 задания

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

async function searchItems(dir, dirCopy){
  fs.readdir(dir, {withFileTypes: true,}, (err, files) => {
    if(err) throw err;
    let arch = dir;
    for (let file of files){
      if(file.isDirectory()) {
        // создаем копию папки
        fs.mkdir(path.join(dirCopy, file.name), e => error(e));
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

async function copyDir(){
  try{
    const dir = path.join(__dirname, 'assets');
    const dirCopy = path.join(__dirname, 'project-dist', 'assets');

    // Create folder

    await fs.mkdir(dirCopy, {recursive : true}, error => {
      if(error) throw error;
    });

    // Delete files-copy

    // await fs.readdir(dirCopy, {withFileTypes: true,}, (err, faceFiles) => {
    //   if(err) throw err;
    //   //deleted(dirCopy, faceFiles);
    // });

    
    await searchItems(dir, dirCopy);
  } catch (e){
    process.stdout.write(e);
  }
}

copyDir();
