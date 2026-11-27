const assert = require('node:assert/strict');
const test = require('node:test');
const { registryState } = require('../scripts/registry-state.cjs');

const name = '@acedatacloud/piece-acemusic', version = '0.1.0', integrity = 'sha512-test';
async function state(status, metadata) {
  return registryState({name, version, integrity, fetchImpl: async (url) => {
    assert.equal(url, 'https://registry.npmjs.org/%40acedatacloud%2Fpiece-acemusic');
    return new Response(JSON.stringify(metadata), {status});
  }});
}
test('finds the exact immutable release independently of the latest tag', async () => {
  const published = {name, version, dist: {integrity}};
  assert.equal(await state(200, {name, 'dist-tags':{latest:'0.2.0'}, versions:{[version]:published}}), 'present');
  assert.equal(await state(404, {error:'Not found'}), 'absent');
  assert.equal(await state(200, {name, versions:{}}), 'absent');
  await assert.rejects(state(200, {name, versions:{[version]:{...published, dist:{integrity:'different'}}}}));
  await assert.rejects(state(503, {error:'Retry later'}));
});
