const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf8');
const scriptMatch = code.match(/<script type=\"text\/babel\">([\s\S]*?)<\/script>/);
let js = scriptMatch[1];
const lines = js.split('\n');

const start = lines.findIndex(l => l.includes('return ('));
let currentLine = 0;

try {
  const babel = require('@babel/core');
  // we will feed Babel lines one by one until it throws
  let currentCode = lines.slice(0, start).join('\n') + '\n';
  currentCode += 'return (\n';
  
  for(let i=start+1; i<=lines.length; i++) {
     currentCode += lines[i] + '\n';
     // Just check if we reached 4130
     if (i === 4130) {
        console.log("Up to 4130 is fine? Let's check open tags.");
        break;
     }
  }
} catch(e) {}
