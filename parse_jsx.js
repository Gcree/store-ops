const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf-8');

const getTagStream = (text) => {
    const stack = [];
    let i = 0;
    while(i < text.length) {
        if(text.slice(i, i+13) === 'ReactDOM.crea') break;
        if(text.slice(i, i+7) === 'return ' && text.slice(i, i+15).includes('<div')) {
           // just finding where return block starts roughly
        }
        i++;
    }
}
// It's easier to just use babel to parse it
