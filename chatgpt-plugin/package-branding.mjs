// Update an exported installed-plugin ZIP, preserving its app mapping and identity.
import {readFile,writeFile} from 'node:fs/promises';
import JSZip from 'jszip';
const [source,destination]=process.argv.slice(2);
if(!source||!destination)throw new Error('Usage: node package-branding.mjs EXPORTED.zip UPDATED.zip');
const zip=await JSZip.loadAsync(await readFile(source));
const entry=zip.file('.codex-plugin/plugin.json');
if(!entry)throw new Error('Missing existing plugin manifest');
const manifest=JSON.parse(await entry.async('string'));
if(manifest.interface?.displayName!=='Zubware')throw new Error('This is not the Zubware plugin');
const version=manifest.version.split('.').map(Number);
if(version.length!==3||version.some(n=>!Number.isInteger(n)))throw new Error('Unexpected version');
version[2]++;manifest.version=version.join('.');
manifest.homepage='https://www.zubware.com/';
manifest.author={...manifest.author,url:'https://www.zubware.com/'};
Object.assign(manifest.interface,{
 websiteURL:'https://www.zubware.com/',
 supportURL:'https://www.zubware.com/contact',
 privacyPolicyURL:'https://www.zubware.com/privacy',
 termsOfServiceURL:'https://www.zubware.com/terms',
 logo:'./assets/zubware-logo.webp',
 composerIcon:'./assets/zubware-logo.webp',
 brandColor:'#4F46E5',
});
zip.file('.codex-plugin/plugin.json',JSON.stringify(manifest,null,2)+'\n');
zip.file('assets/zubware-logo.webp',await readFile(new URL('../public/assets/zubware-original-upscaled.webp',import.meta.url)));
await writeFile(destination,await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
console.log('Prepared Zubware branding version',manifest.version,'with the existing app mapping.');
