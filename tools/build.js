// Setzt tools/levels.json in index.html ein (Konstante LEVELS).
const fs=require('fs'),path=require('path');
const f=path.join(__dirname,'..','index.html');
const levels=fs.readFileSync(path.join(__dirname,'levels.json'),'utf8').trim();
const html=fs.readFileSync(f,'utf8');
const out=html.replace(/const LEVELS=\[.*?\];\n/s,()=>`const LEVELS=${levels};\n`);
if(out===html&&!html.includes(levels))throw new Error('LEVELS nicht gefunden');
fs.writeFileSync(f,out);console.log('index.html aktualisiert');
