const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'starfield.js'), 'utf8');

function runStarfield(base, computedBlocks, { hidden = false } = {}) {
  const blocks = computedBlocks.map((computed) => ({ computed, style: {} }));
  const body = { classList: new Set(), prepend() {} };
  const listeners = new Map();
  const attributes = new Set();
  const field = {
    setAttribute(name) { attributes.add(name); },
    toggleAttribute(name, enabled) {
      if (enabled) attributes.add(name);
      else attributes.delete(name);
    },
  };
  const document = {
    addEventListener(name, callback) { listeners.set(name, callback); },
    body,
    createElement: () => field,
    hidden,
    readyState: 'complete',
    querySelector: () => null,
    querySelectorAll: () => blocks,
  };

  vm.runInNewContext(source, {
    document,
    getComputedStyle(element) {
      if (element === body) return { backgroundColor: base };
      return element.computed;
    },
    window: { requestIdleCallback(callback) { callback(); } },
  });

  return { attributes, blocks, document, listeners };
}

test('preserves dark-page gradient softening on base-colour panels', () => {
  const gradient = 'linear-gradient(rgb(16, 9, 48), rgb(45, 27, 105))';
  const { blocks: [panel] } = runStarfield('rgb(16, 9, 48)', [{
    backgroundColor: 'rgb(16, 9, 48)',
    backgroundImage: gradient,
  }]);

  assert.equal(panel.style.backgroundColor, 'transparent');
  assert.equal(
    panel.style.backgroundImage,
    'linear-gradient(rgba(16, 9, 48, 0.72), rgba(45, 27, 105, 0.72))',
  );
});

test('preserves a stronger tint for dark panels on light pages', () => {
  const darkGradient = 'linear-gradient(rgb(16, 9, 48), rgb(45, 27, 105))';
  const { blocks: [basePanel, darkPanel] } = runStarfield('rgb(250, 250, 247)', [
    {
      backgroundColor: 'rgb(250, 250, 247)',
      backgroundImage: 'none',
    },
    {
      backgroundColor: 'rgb(16, 9, 48)',
      backgroundImage: darkGradient,
    },
  ]);

  assert.equal(basePanel.style.backgroundColor, 'transparent');
  assert.equal(darkPanel.style.backgroundColor, 'rgba(16, 9, 48, 0.86)');
  assert.equal(
    darkPanel.style.backgroundImage,
    'linear-gradient(rgba(16, 9, 48, 0.86), rgba(45, 27, 105, 0.86))',
  );
});

test('marks the decorative layer and follows tab visibility', () => {
  const { attributes, document, listeners } = runStarfield('rgb(16, 9, 48)', [], { hidden: true });
  assert.equal(attributes.has('aria-hidden'), true);
  assert.equal(attributes.has('data-paused'), true);

  document.hidden = false;
  listeners.get('visibilitychange')();
  assert.equal(attributes.has('data-paused'), false);
});
