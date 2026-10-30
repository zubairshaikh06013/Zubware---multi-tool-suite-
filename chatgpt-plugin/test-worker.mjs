import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorker} from './worker-dist/index.mjs';
const worker=createWorker({loadWidgetHtml:async()=>'<title>Zubware tools</title><script src="/chatgpt-plugin/assets/test.js"></script>'});
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const host='https://zubware-chatgpt.zubairshaikh06013.workers.dev';
const run=req=>worker.fetch(req,{},{});
test('Worker MCP protocol works and resources use deployed website asset paths',async()=>{
 const client=new Client({name:'worker-check',version:'1'});
 await client.connect(new StreamableHTTPClientTransport(new URL(host+'/mcp'),{fetch:(url,init)=>run(new Request(url,init))}));
 try{
  assert.equal((await client.listTools()).tools.length,3);
  assert.equal((await client.callTool({name:'list_categories',arguments:{}})).structuredContent.total,310);
  const opened=await client.callTool({name:'open_tool',arguments:{toolId:'image-resizer'}});assert.equal(opened.structuredContent.status,'awaiting_user_input');
  const resource=await client.readResource({uri:'ui://zubware/tools-v1.html'});
  assert.match(resource.contents[0].text,/https:\/\/www\.zubware\.com\/chatgpt-plugin\/assets\//);
 }finally{await client.close();}
});
test('Worker rejects oversized requests, untrusted origins and unsupported routes',async()=>{
 assert.equal((await run(new Request(host+'/mcp',{method:'POST',body:'x'.repeat(40000)}))).status,413);
 assert.equal((await run(new Request(host+'/mcp',{method:'POST',headers:{Origin:'https://evil.example'},body:'{}'}))).status,403);
 assert.equal((await run(new Request(host+'/.well-known/oauth-authorization-server'))).status,404);
 assert.equal((await run(new Request(host+'/mcp'))).status,405);
 const health=await run(new Request(host+'/health'));assert.equal((await health.json()).tools,310);
});
