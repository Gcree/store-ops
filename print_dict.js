const fs = require('fs');

const code = fs.readFileSync('index.html', 'utf8');
const lines = code.split('\n');

const startDict = lines.findIndex(l => l.includes('{/* 中下方：商品條碼庫管理 */}'));
let dictDivs = 0;
let endDict = -1;
for(let i=startDict + 1; i<lines.length; i++) {
    const opens = (lines[i].match(/<div/g) || []).length;
    const closes = (lines[i].match(/<\/div>/g) || []).length;
    dictDivs += (opens - closes);
    if(dictDivs === 0) { // Since the first div is at startDict + 1 and closes exactly at 0! Wait, let's see.
        // Actually, let's just count them properly.
    }
}

for(let i=startDict; i<=startDict+3; i++) {
   console.log(i + ': ' + lines[i]);
}

let sum = 0;
for(let i=startDict+1; i<startDict+150; i++) {
    const opens = (lines[i].match(/<div/g) || []).length;
    const closes = (lines[i].match(/<\/div>/g) || []).length;
    sum += (opens - closes);
    if(sum === 0 && opens === 0 && closes === 1) { // It reached 0 by a close!
        console.log("End dict at " + i + ": " + lines[i]);
        break;
    }
}
