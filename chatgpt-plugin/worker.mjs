import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createZubwareServer } from './mcp.mjs';
import catalog from './generated/catalog.json' with {type:'json'};
const WEBSITE='https://www.zubware.com';
const HOST='zubware-chatgpt.zubairshaikh06013.workers.dev';
const cors={
 'Access-Control-Allow-Origin':'*',
 'Access-Control-Allow-Methods':'POST, OPTIONS',
 'Access-Control-Allow-Headers':'content-type, mcp-session-id, mcp-protocol-version',
 'Access-Control-Expose-Headers':'Mcp-Session-Id',
};
async function boundedBody(request){
 const reader=request.body?.getReader();if(!reader)return '';
 const chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>32768){await reader.cancel();throw new Error('body_too_large');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 return new TextDecoder().decode(bytes);
}
async function currentWidgetHtml(){
 const response=await fetch(WEBSITE+'/chatgpt-plugin/',{headers:{Accept:'text/html'},cache:'no-store'});
 if(!response.ok)throw new Error('widget_unavailable');
 const html=await boundedBody(response);
 if(!html.includes('<title>Zubware tools</title>') || !html.includes('/chatgpt-plugin/assets/'))throw new Error('invalid_widget_document');
 return html;
}
export function createWorker({loadWidgetHtml=currentWidgetHtml}={}){return {
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(![HOST,'localhost','127.0.0.1'].includes(url.hostname))return new Response('Unknown host',{status:403});
  if(url.pathname==='/health')return Response.json({status:'ok',name:'Zubware',version:'0.1.0',tools:catalog.length,categories:new Set(catalog.map(t=>t.category)).size,interface:WEBSITE+'/chatgpt-plugin/',chatgptCompatibility:'pending_per_tool_testing'});
  if(url.pathname==='/')return Response.redirect(WEBSITE+'/chatgpt-plugin/',302);
  if(url.pathname!=='/mcp')return new Response('Not found',{status:404});
  const origin=request.headers.get('Origin');
  if(origin){try{const o=new URL(origin);if(!['https://chatgpt.com','https://chat.openai.com',WEBSITE,'https://'+HOST].includes(o.origin)&&!o.hostname.endsWith('.web-sandbox.oaiusercontent.com'))return new Response('Origin not allowed',{status:403});}catch{return new Response('Origin not allowed',{status:403});}}
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(request.method!=='POST')return new Response('Use POST for stateless MCP',{status:405,headers:{...cors,Allow:'POST, OPTIONS'}});
  let body;
  try{body=await boundedBody(request);}catch{return new Response('Request too large',{status:413,headers:cors});}
  const server=createZubwareServer({html:loadWidgetHtml,assetOrigin:WEBSITE});
  const transport=new WebStandardStreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
  try{
   await server.connect(transport);
   const response=await transport.handleRequest(new Request(request.url,{method:'POST',headers:request.headers,body}));
   const headers=new Headers(response.headers);for(const[k,v]of Object.entries(cors))headers.set(k,v);
   return new Response(response.body,{status:response.status,headers});
  }catch(error){console.error(JSON.stringify({event:'mcp_request_failed',message:error instanceof Error?error.message:'unknown'}));return Response.json({error:'MCP request failed'},{status:500,headers:cors});}
  finally{await transport.close();await server.close();}
 }
};}
export default createWorker();
