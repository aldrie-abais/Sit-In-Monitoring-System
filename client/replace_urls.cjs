const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.js') || file.endsWith('.jsx')) {
          results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
let changed = 0;
files.forEach(file => {
    let original = fs.readFileSync(file, 'utf8');
    let content = original;
    
    content = content.replace(/(['"])http:\/\/localhost:8080\/api(.*?)\1/g, '`${import.meta.env.VITE_API_BASE_URL}$2`');
    content = content.replace(/http:\/\/localhost:8080\/api/g, '${import.meta.env.VITE_API_BASE_URL}');
    
    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        changed++;
    }
});
console.log(`Finished updating. Changed ${changed} files.`);
