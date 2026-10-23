import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { ConfigSchema, validateConfig } from '../src/vendor/background-removal/schema';

const defaults = validateConfig();
assert.equal(defaults.publicPath, 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/');
assert.equal(defaults.model, 'isnet_fp16');
assert.equal(defaults.device, 'cpu');
assert.equal(defaults.rescale, true);
assert.equal(defaults.proxyToWorker, false);
assert.deepEqual(defaults.output, { format: 'image/png', quality: 0.8 });
for (const [alias, model] of [['small', 'isnet_quint8'], ['medium', 'isnet_fp16'], ['large', 'isnet']]) {
  assert.equal(validateConfig({model: alias}).model, model);
}
assert.equal(validateConfig({output:{quality:1}}).output.format, 'image/png');
assert.equal(validateConfig({output:{format:'image/webp'}}).output.quality, 0.8);
assert.equal(validateConfig({publicPath:'https://example.invalid/${PACKAGE_NAME}/${PACKAGE_VERSION}/'}).publicPath, 'https://example.invalid/@imgly/background-removal/1.7.0/');
let progress: unknown[] = [];
const config = validateConfig({progress:(...args)=>{progress=args}, output:{format:'image/png',quality:1}});
config.progress!('compute:inference', 1, 4);
assert.deepEqual(progress, ['compute:inference', 1, 4]);
assert.throws(()=>config.progress!('compute:inference', 'invalid' as unknown as number, 4));
const invalidReturn=validateConfig({progress: (()=>'invalid') as unknown as typeof config.progress});
assert.throws(()=>invalidReturn.progress!('compute:inference',1,4));
for(const input of [{model:'invalid'},{device:'invalid'},{progress:[]},{output:{format:'text/html'}},{output:{quality:'high'}},{rescale:[]},{publicPath:[]}]) {
  assert.equal(ConfigSchema.safeParse(input).success,false);
}
// The inference implementation remains byte-for-byte the published upstream source.
const provenance=JSON.parse(fs.readFileSync('src/vendor/background-removal/UPSTREAM.json','utf8'));
for(const [file,hash] of Object.entries(provenance.originalSourceSha256)) {
  if(file==='schema.ts')continue;
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(`src/vendor/background-removal/${file}`)).digest('hex'),hash,file);
}
console.log('Background engine: upstream model URLs, defaults, aliases, callback validation and source integrity passed.');
