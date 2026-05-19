const fs = require('fs');

const code = fs.readFileSync('index.html', 'utf8');
const lines = code.split('\n');

const startAlias = lines.findIndex(l => l.includes('{/* 動態欄位對應表 */}'));
let aliasDivs = 0;
let endAlias = -1;
for(let i=startAlias + 1; i<lines.length; i++) {
    const opens = (lines[i].match(/<div/g) || []).length;
    const closes = (lines[i].match(/<\/div>/g) || []).length;
    aliasDivs += (opens - closes);
    if(aliasDivs === -1) { 
        endAlias = i;
        break;
    }
}

for(let i=startAlias; i<=endAlias+5; i++) {
   console.log(i + ': ' + lines[i]);
}

