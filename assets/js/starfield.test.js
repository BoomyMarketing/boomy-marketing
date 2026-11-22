const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'starfield.js'), 'utf8');

function runStarfield(base, computedBlocks, { width = 1200, hidden = false } = {}) {
  const blocks = computedBlocks.map((computed) => ({ computed, style: {} }));
  const body = { classList: new Set(), prepend() {} };
  const listeners = new Map();
  const attributes = new Set();
  let dots = 0;
  const field = {
    append() {},
    clientHeight: 800,
    clientWidth: width,
    setAttribute(name) { attributes.add(name); },
    style: { setProperty() {} },
    toggleAttribute(name, enabled) {
      if (enabled) attributes.add(name);
      else attributes.delete(name);
    },
  };
  const context = {
    arc() { dots += 1; },
    beginPath() {},
    fill() {},
    moveTo() {},
  };
  const canvas = {
    getContext: () => context,
    height: 0,
    width: 0,
  };
  const document = {
    addEventListener(name, callback) { listeners.set(name, callback); },
    body,
    createElement: (tag) => tag === 'canvas' ? canvas : field,
    hidden,
    querySelector: () => null,
    querySelectorAll: () => blocks,
  };

  vm.runInNewContext(source, {
    document,
    getComputedStyle(element) {
      if (element === body) return { backgroundColor: base };
      return element.computed;
    },
    ResizeObserver: class { observe() {} },
  });

  return { attributes, blocks, canvas, document, dots, listeners };
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

test('paints 55 mobile particles twice to repeat the tile and follows tab visibility', () => {
  const { attributes, canvas, document, dots, listeners } = runStarfield('rgb(16, 9, 48)', [], {
    width: 375,
    hidden: true,
  });

  assert.equal(canvas.height, 1600);
  assert.equal(dots, 110);
  assert.equal(attributes.has('data-paused'), true);

  document.hidden = false;
  listeners.get('visibilitychange')();
  assert.equal(attributes.has('data-paused'), false);
});
