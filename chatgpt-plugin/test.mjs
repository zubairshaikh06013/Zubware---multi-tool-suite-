import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createZubwareServer, searchCatalog, categories, RESOURCE_URI } from './mcp.mjs';
import catalog from './generated/catalog.json' with { type:'json' };
test('all tools have components and safe canonical links; pagination covers the whole catalogue',()=>{
  assert.ok(catalog.length >= 310, 'catalogue must retain the existing tool suite');assert.equal(new Set(catalog.map(t=>t.id)).size,catalog.length);
  assert.equal(categories.length,16);
  assert.ok(catalog.some(t=>t.id==='wedding-invitation-maker' && t.embedded));
  for(const tool of catalog){assert.ok(tool.embedded);assert.equal(new URL(tool.url).origin,'https://www.zubware.com');assert.equal(tool.chatgptVerified,false);}
  const paged=[];for(let offset=0;offset<catalog.length;offset+=50)paged.push(...searchCatalog({offset,limit:50}).tools);
  assert.deepEqual(paged,catalog);
  assert.equal(catalog.find(t=>t.id==='image-color-picker').path,'/color-picker');
  assert.ok(searchCatalog({query:'pdf'}).total>0);
  assert.equal(searchCatalog({query:'zznomatchingtoolzz'}).total,0);
});
test('MCP handshake, discovery, schema validation, UI and truthful execution status',async()=>{
 const server=createZubwareServer({html:'<script src="/assets/app.js"></script>',assetOrigin:'https://plugin.example.com'});
 const client=new Client({name:'test',version:'1'});
 const [a,b]=InMemoryTransport.createLinkedPair();
 await server.connect(a);await client.connect(b);
 try{
  const {tools}=await client.listTools();assert.equal(tools.length,3);
  const found=await client.callTool({name:'search_tools',arguments:{query:'pdf'}});assert.ok(found.structuredContent.total>0);
  const opened=await client.callTool({name:'open_tool',arguments:{toolId:'image-resizer'}});
  assert.equal(opened.structuredContent.status,'awaiting_user_input');
  assert.equal(opened.structuredContent.tool.chatgptVerified,false);
  const bad=await client.callTool({name:'open_tool',arguments:{toolId:'../../secret'}});assert.equal(bad.isError,true);
  const invalid=await client.callTool({name:'search_tools',arguments:{limit:1000000}});assert.equal(invalid.isError,true);
  const resource=await client.readResource({uri:RESOURCE_URI});assert.ok(resource.contents[0].text.includes('https://plugin.example.com/assets/app.js'));
 }finally{await client.close();await server.close();}
});
test('HTTP server serves the actual widget and MCP; blocks file traversal',async()=>{
 const {spawn}=await import('node:child_process');
 const {once}=await import('node:events');
 const {StreamableHTTPClientTransport}=await import('@modelcontextprotocol/sdk/client/streamableHttp.js');
 const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('.',import.meta.url),env:{...process.env,PORT:'18787'},stdio:['ignore','pipe','pipe']});
 const client=new Client({name:'http-test',version:'1'});
 try{
  await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw new Error('Server exited before listening');})]);
  const base='http://127.0.0.1:18787';
  const response=await fetch(base+'/');assert.equal(response.status,200);
  const html=await response.text();const asset=html.match(/src="([^"]+\.js)"/)[1];
  assert.equal((await fetch(base+asset)).status,200);
  assert.equal((await fetch(base+'/%2e%2e%2fpackage.json')).status,404);
  assert.equal((await fetch(base+'/.well-known/oauth-authorization-server')).status,404);
  await client.connect(new StreamableHTTPClientTransport(new URL(base+'/mcp')));
  assert.equal((await client.listTools()).tools.length,3);
 }finally{await client.close();child.kill();}
});
