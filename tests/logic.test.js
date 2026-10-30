const assert = require('node:assert/strict');
const test = require('node:test');

const { demoData } = require('../demo-data.js');
const { calculateMetrics, filterScreens } = require('../app.js');

test('all operational data is explicitly synthetic', () => {
  assert.equal(demoData.meta.synthetic, true);
  assert.equal(demoData.meta.environment, 'portfolio-local');
  assert.ok(demoData.screens.length >= 5);
  assert.ok(demoData.screens.every((screen) => screen.id.startsWith('demo-')));
  assert.ok(demoData.screens.every((screen) => !/[.@]|\d{3}\.\d{3}\.\d{3}-\d{2}/.test(screen.name)));
});

test('metrics summarize fleet status without hidden state', () => {
  const metrics = calculateMetrics(demoData.screens);

  assert.deepEqual(metrics, {
    total: 6,
    online: 5,
    attention: 1,
    playing: 4,
    onlineRate: 83,
  });
});

test('screen filters combine status and human search', () => {
  assert.equal(filterScreens(demoData.screens, 'attention', '').length, 1);
  assert.equal(filterScreens(demoData.screens, 'all', 'vitrine').length, 2);
  assert.equal(filterScreens(demoData.screens, 'online', 'norte espera').length, 1);
  assert.equal(filterScreens(demoData.screens, 'online', 'inexistente').length, 0);
});
