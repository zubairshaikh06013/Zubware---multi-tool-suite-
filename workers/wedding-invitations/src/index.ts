/// <reference path="../worker-configuration.d.ts" />
import { normalizeWedding, validateWedding, renderWedding, type WeddingInvitation } from '../../../src/lib/weddingInvitation';
const ORIGINS = new Set(['https://zubware.com', 'https://www.zubware.com', 'http://localhost:3000', 'http://terminal.local:4173']);
const MAX_BYTES = 200000;
interface StoredInvite { data: WeddingInvitation; ownerHash: string; expiresAt: number; updatedAt: number; revoked?: boolean }
async function digest(token: string) { return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))); }
const hex = (bytes: Uint8Array) => Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
async function authorized(request: Request, hash: string) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /,'') || '';
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  const candidate = hex(await digest(token)); let mismatch = 0;
  for (let i=0;i<64;i++) mismatch |= candidate.charCodeAt(i)^hash.charCodeAt(i);
  return mismatch === 0;
}
async function readLimited(request: Request) {
  if (Number(request.headers.get('Content-Length')) > MAX_BYTES) throw new Error('TOO_LARGE');
  if (!request.body) throw new Error('BAD_JSON');
  const reader = request.body.getReader(); let length = 0; const parts: Uint8Array[] = [];
  while (true) { const {value,done}=await reader.read(); if(done)break; length+=value.byteLength; if(length>MAX_BYTES){await reader.cancel();throw new Error('TOO_LARGE')} parts.push(value); }
  const bytes=new Uint8Array(length); let offset=0; for(const part of parts){bytes.set(part,offset);offset+=part.length}
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new Error('BAD_JSON'); }
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin=request.headers.get('Origin')||''; const url=new URL(request.url);
    const headers: Record<string,string>={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Vary':'Origin'};
    if(ORIGINS.has(origin))headers['Access-Control-Allow-Origin']=origin;
    const json=(data: unknown,status=200)=>Response.json(data,{status,headers});
    if(request.method==='OPTIONS')return new Response(null,{status:ORIGINS.has(origin)?204:403,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Max-Age':'86400'}});
    if(url.pathname==='/health')return json({ok:true,service:'Zubware Invitations'});
    const match=url.pathname.match(/^\/(api\/invitations|i)(?:\/([a-f0-9]{32}))?$/);
    if(!match)return json({error:'Not found'},404);
    const id=match[2],isPage=match[1]==='i';
    const ip=request.headers.get('CF-Connecting-IP')||'unknown';
    if(request.method==='GET'&&id){
      if(!(await env.READ_LIMIT.limit({key:ip})).success)return json({error:'Too many requests. Please try again shortly.'},429);
      try {
        const saved=await env.INVITATIONS.get<StoredInvite>('invite:'+id,{type:'json',cacheTtl:30});
        if(!saved||saved.revoked||saved.expiresAt<=Date.now())return isPage?new Response('<!doctype html><meta name="viewport" content="width=device-width"><title>Invitation unavailable</title><h1>Invitation unavailable</h1><p>This invitation has expired or was unpublished.</p><a href="https://zubware.com/wedding-invitation-maker">Create an invitation on Zubware</a>',{status:404,headers:{...headers,'Content-Type':'text/html; charset=utf-8'}}):json({error:'Invitation expired, unpublished or not found.'},404);
        if(isPage)return new Response(renderWedding(saved.data),{headers:{...headers,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors https://zubware.com https://www.zubware.com http://terminal.local:4173; form-action 'none'"}});
        return json({data:saved.data,expiresAt:saved.expiresAt});
      }catch{return json({error:'Invitation service is temporarily unavailable. Try again later.'},503)}
    }
    if(isPage)return json({error:'Method not allowed'},405);
    if(!ORIGINS.has(origin))return json({error:'Open the invitation maker on Zubware to publish.'},403);
    if(!['POST','PUT','DELETE'].includes(request.method)||request.method==='POST'&&id||request.method!=='POST'&&!id)return json({error:'Method not allowed'},405);
    if(!(await env.WRITE_LIMIT.limit({key:ip})).success)return json({error:'Please wait a minute before publishing again.'},429);
    try {
      let saved: StoredInvite|null=null;
      if(id){saved=await env.INVITATIONS.get<StoredInvite>('invite:'+id,{type:'json',cacheTtl:30});if(!saved||saved.expiresAt<=Date.now()||saved.revoked)return json({error:'Invitation is no longer available. Publish a new one.'},404);if(!await authorized(request,saved.ownerHash))return json({error:'Edit key is invalid. Restore your private backup.'},403);}
      if(request.method==='DELETE'){
        await env.INVITATIONS.put('invite:'+id,JSON.stringify({...saved,revoked:true,data:null}),{expirationTtl:300});
        return json({ok:true});
      }
      if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'JSON is required.'},415);
      const raw=await readLimited(request),data=normalizeWedding(raw); const error=validateWedding(data); if(error)return json({error},400);
      const dates=data.events.map(e=>Date.parse(e.date+'T23:59:59Z')).filter(Number.isFinite);
      const expiry=Math.min(Date.now()+366*86400000, Math.max(Date.now()+86400000,Math.max(...dates)+90*86400000));
      const newId=id||crypto.randomUUID().replaceAll('-','');
      const token=id?'':hex(crypto.getRandomValues(new Uint8Array(32)));
      const record: StoredInvite={data,ownerHash:saved?.ownerHash||hex(await digest(token)),expiresAt:expiry,updatedAt:Date.now()};
      await env.INVITATIONS.put('invite:'+newId,JSON.stringify(record),{expiration:Math.floor(expiry/1000)});
      return json({id:newId,...(token?{token}:{}),expiresAt:expiry},id?200:201);
    }catch(err){
      const message=err instanceof Error?err.message:'';
      if(message==='TOO_LARGE')return json({error:'Invitation is too large. Use a smaller photo.'},413);
      if(message==='BAD_JSON')return json({error:'Invitation data could not be read.'},400);
      return json({error:'Publishing is temporarily unavailable. Your draft and downloads still work. Please try later.'},503);
    }
  },
};
