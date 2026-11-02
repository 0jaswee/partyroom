import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('public');
http.createServer(async(req,res)=>{try{const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+path.sep))throw Error();const file=p===root?path.join(root,'index.html'):p;const body=await readFile(file);res.setHeader('Content-Type',({'html':'text/html','js':'text/javascript','css':'text/css','json':'application/json'})[file.split('.').pop()]||'application/octet-stream');res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(8080,()=>console.log('PartyRoom: http://localhost:8080'));
