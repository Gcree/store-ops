const fs = require('fs');
const babel = require('@babel/core');

const code = fs.readFileSync('index.html', 'utf8');
const lines = code.split('\n');

const aliasStart = 4014; // {/* 動態欄位對應表 */}
const aliasEnd = 4064;   // </div> closing the alias block
const aliasBlock = lines.slice(aliasStart, aliasEnd + 1);

// Remove alias block from its original position
lines.splice(aliasStart, aliasEnd - aliasStart + 1);

// Find the new end of the dict block since line numbers have shifted
// Dict block original end was 4195. Since we removed (4064 - 4014 + 1) = 51 lines before it,
// the new end should be 4195 - 51 = 4144. Let's verify by finding it dynamically.
const startDict = lines.findIndex(l => l.includes('{/* 中下方：商品條碼庫管理 */}'));
let sum = 0;
let endDict = -1;
for(let i=startDict + 1; i<lines.length; i++) {
    const opens = (lines[i].match(/<div/g) || []).length;
    const closes = (lines[i].match(/<\/div>/g) || []).length;
    sum += (opens - closes);
    if(sum === 0 && opens === 0 && closes === 1) {
        endDict = i;
        break;
    }
}

// Insert alias block after endDict
lines.splice(endDict + 1, 0, ...aliasBlock);

fs.writeFileSync('index.html', lines.join('\n'));
console.log('Successfully moved Alias block to after line', endDict);

try {
    const newCode = fs.readFileSync('index.html', 'utf8');
    const scriptMatch = newCode.match(/<script type=\"text\/babel\">([\s\S]*?)<\/script>/);
    babel.transformSync(scriptMatch[1], {
        presets: ['@babel/preset-react'],
        filename: 'test.js'
    });
    console.log("SUCCESS: Babel compilation passed!");
} catch(e) {
    console.log("ERROR at line " + (e.loc ? e.loc.line : '?') + ": " + e.message);
}
