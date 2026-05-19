const fs = require('fs');
const babel = require('@babel/core');

function testBabel(code) {
  try {
    babel.transformSync(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.js'
    });
    console.log("SUCCESS!");
    return true;
  } catch(e) {
    console.log("ERROR at line " + (e.loc ? e.loc.line : '?') + ": " + e.message);
    return false;
  }
}

const code = fs.readFileSync('index.html', 'utf8');
const scriptMatch = code.match(/<script type=\"text\/babel\">([\s\S]*?)<\/script>/);
let js = scriptMatch[1];
const lines = js.split('\n');

// Try fixing by removing 4201
let fixed1 = [...lines];
fixed1.splice(4200, 1);
console.log("Testing removal of 4201 (index 4200)");
testBabel(fixed1.join('\n'));

// Try fixing by adding a div
let fixed2 = [...lines];
fixed2.splice(4201, 0, "</div>");
console.log("Testing addition of div");
testBabel(fixed2.join('\n'));

