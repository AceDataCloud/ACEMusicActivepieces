const pkg = require('../package.json');

// A fresh metadata read uses the registry's canonical key for a scoped package.
async function registryState({ name, version, integrity, fetchImpl = fetch }) {
  const response = await fetchImpl(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
    headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(20000),
  });
  if (response.status === 404) return 'absent';
  if (!response.ok) throw new Error(`npm registry returned HTTP ${response.status}`);
  const pack = await response.json();
  if (pack.name !== name || !pack.versions) throw new Error('npm registry returned unexpected package metadata');
  const published = pack.versions[version];
  if (!published) return 'absent';
  if (published.name !== name || published.version !== version || published.dist?.integrity !== integrity) {
    throw new Error('The immutable npm version has different content');
  }
  return 'present';
}

module.exports = { registryState };
if (require.main === module) {
  registryState({ name: pkg.name, version: pkg.version, integrity: process.argv[2] })
    .then(state => console.log(state))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
