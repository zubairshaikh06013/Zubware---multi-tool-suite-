import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import catalog from './generated/catalog.json' with {type:'json'};
import { createZubwareServer } from './mcp.mjs';
const dir = resolve(fileURLToPath(new URL('dist/',import.meta.url)));
const html = await readFile(resolve(dir,'index.html'),'utf8');
const port = Number(process.env.PORT || 8787);
const assetOrigin = process.env.PUBLIC_ORIGIN || `http://localhost:${port}`;
const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,GET,DELETE,OPTIONS','Access-Control-Allow-Headers':'content-type,mcp-session-id,mcp-protocol-version','Access-Control-Expose-Headers':'Mcp-Session-Id'};
const mime = {'.mjs':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.wasm':'application/wasm','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
createServer(async (req,res) => {
  try {
    const url = new URL(req.url || '/',assetOrigin);
    if(req.method==='OPTIONS'){res.writeHead(204,cors).end();return;}
    if(url.pathname==='/health'){res.writeHead(200,{'content-type':'application/json'}).end(JSON.stringify({status:'ok',plugin:'zubware',tools:catalog.length}));return;}
    if(url.pathname==='/mcp' && ['POST','GET','DELETE'].includes(req.method)){
      for(const [key,value] of Object.entries(cors))res.setHeader(key,value);
      const server=createZubwareServer({html,assetOrigin});
      const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
      res.on('close',()=>{void transport.close();void server.close();});
      await server.connect(transport);await transport.handleRequest(req,res);return;
    }
    if(req.method!=='GET' && req.method!=='HEAD'){res.writeHead(405).end();return;}
    const path = resolve(dir, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname.replace(/^\/chatgpt-plugin(?=\/)/, '')));
    if(!path.startsWith(dir + sep)){res.writeHead(404).end();return;}
    try{
      const bytes=await readFile(path);
      res.writeHead(200,{'content-type':mime[extname(path)]||'application/octet-stream','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'});
      res.end(req.method==='HEAD'?undefined:bytes);
    }catch{res.writeHead(404).end('Not found');}
  }catch(error){console.error(error);if(!res.headersSent)res.writeHead(500);res.end('Internal error');}
}).listen(port,()=>console.log(`Zubware MCP: ${assetOrigin}/mcp`));
