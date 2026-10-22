import assert from 'node:assert/strict';
import { TOOLS_DATA } from '../src/data/toolsData';
import { filterDirectoryTools } from '../src/lib/toolDirectory';
for (const id of ['gst-invoice-generator','learning-licence-mock-test','lofi-maker','age-calculator']) {
  assert.ok(!filterDirectoryTools(TOOLS_DATA, '', 'Password').some(t => t.id === id), `${id} is not a password tool`);
}
for (const [tag, id] of [['Password','random-password-generator'],['QR','qr-generator'],['QR','gst-invoice-generator'],['Security','hash-generator']]) {
  assert.ok(filterDirectoryTools(TOOLS_DATA, '', tag).some(t => t.id === id), `${id} retains ${tag}`);
}
assert.ok(!filterDirectoryTools(TOOLS_DATA, '', 'QR').some(t => t.id === 'learning-licence-mock-test'));
console.log('Unrelated capability tags excluded; real password, QR and security tools remain discoverable.');
