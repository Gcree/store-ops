const fs = require('fs');
const babel = require('@babel/core');

function test(code) {
  try {
    const scriptMatch = code.match(/<script type=\"text\/babel\">([\s\S]*?)<\/script>/);
    babel.transformSync(scriptMatch[1], { presets: ['@babel/preset-react'], filename: 'test.js' });
    return true;
  } catch(e) {
    console.log("ERROR at line " + (e.loc ? e.loc.line : '?') + ": " + e.message);
    return false;
  }
}

const orig = fs.readFileSync('index.html', 'utf8');
const lines = orig.split('\n');

// 1. We know from earlier that adding `</div>` at 4202 (before nav) works. Let's try that alone.
let fixed1 = [...lines];
const nav1 = fixed1.findIndex(l => l.includes('<nav className="fixed bottom-6'));
fixed1.splice(nav1, 0, "                    </div>");
console.log("Just adding div before nav:");
test(fixed1.join('\n'));

// 2. Now let's try moving the alias block
let fixed2 = [...fixed1];
const startAlias = fixed2.findIndex(l => l.includes('{/* 動態欄位對應表 */}'));
let aliasDivs = 0;
let endAlias = -1;
for(let i=startAlias + 1; i<fixed2.length; i++) {
    const opens = (fixed2[i].match(/<div/g) || []).length;
    const closes = (fixed2[i].match(/<\/div>/g) || []).length;
    aliasDivs += (opens - closes);
    if(aliasDivs === -1) {
        endAlias = i;
        break;
    }
}
console.log("Alias block is:", startAlias, "to", endAlias);

const aliasBlock = fixed2.slice(startAlias, endAlias + 1);
fixed2.splice(startAlias, endAlias - startAlias + 1);

const startDict = fixed2.findIndex(l => l.includes('{/* 中下方：商品條碼庫管理 */}'));
let dictDivs = 0;
let endDict = -1;
for(let i=startDict + 1; i<fixed2.length; i++) {
    const opens = (fixed2[i].match(/<div/g) || []).length;
    const closes = (fixed2[i].match(/<\/div>/g) || []).length;
    dictDivs += (opens - closes);
    if(dictDivs === -1) {
        endDict = i;
        break;
    }
}
console.log("Dict block is:", startDict, "to", endDict);

fixed2.splice(endDict + 1, 0, ...aliasBlock);

console.log("After moving:");
test(fixed2.join('\n'));

