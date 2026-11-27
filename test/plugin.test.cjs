const assert = require('node:assert/strict');
const test = require('node:test');
const { acemusic } = require('../dist/src/index.js');
const { buildRequest } = require('../dist/src/client.js');
const cases = require('./requests.json');

test('all nine native actions and their wire contracts are available', () => {
  const actions = acemusic.actions();
  assert.equal(Object.keys(actions).length, 9);
  for (const [name, [values, [endpoint, body]]] of Object.entries(cases)) {
    assert.ok(actions[name], name);
    assert.deepEqual(buildRequest(name, values), { endpoint, body });
  }
});

test('native action queries only the original task and preserves partial results', async () => {
  const response = { id: 'saved', response: { status: 'partial_failed', data: [{ audio_url: 'https://example.com/song.mp3' }] } };
  const original = global.fetch;
  const calls = [];
  try {
    global.fetch = async (url, args) => { calls.push([url, JSON.parse(args.body)]); return Response.json(response); };
    const actual = await acemusic.actions().retrieve.run({ auth: { secret_text: 'fixture' }, propsValue: { task_id: 'saved' } });
    assert.deepEqual(actual, response);
    assert.deepEqual(calls, [['https://api.acedata.cloud/acemusic/tasks', { action: 'retrieve', id: 'saved' }]]);
  } finally { global.fetch = original; }
});

test('the bundled quickstart uses this release and keeps the original task ID', () => {
  const pkg = require('../package.json');
  const quickstart = require('../examples/acemusic-quickstart.json');
  const create = quickstart.flows[0].trigger.nextAction;
  const lookup = create.nextAction;
  for (const step of [create, lookup]) {
    assert.equal(step.settings.pieceName, pkg.name);
    assert.equal(step.settings.pieceVersion, pkg.version);
    assert.ok(acemusic.actions()[step.settings.actionName]);
    assert.equal(step.settings.input.auth, '');
  }
  assert.equal(create.settings.actionName, 'generate');
  assert.equal(create.settings.errorHandlingOptions.retryOnFailure.value, false);
  assert.equal(lookup.settings.actionName, 'retrieve');
  assert.equal(lookup.settings.input.task_id, `{{${create.name}['output']['task_id']}}`);
});
