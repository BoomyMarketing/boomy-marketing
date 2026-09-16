const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'starfield.js'), 'utf8');

function runStarfield(base, computedBlocks) {
  const blocks = computedBlocks.map((computed) => ({ computed, style: {} }));
  const body = { style: {} };
  const documentElement = { style: {} };
  const context = {
    arc() {},
    beginPath() {},
    clearRect() {},
    fill() {},
    fillStyle: '',
  };
  const canvas = {
    getContext: () => context,
    height: 0,
    width: 0,
  };
  const document = {
    addEventListener() {},
    body,
    documentElement,
    getElementById: () => canvas,
    hidden: false,
    querySelectorAll: () => blocks,
  };
  const window = {
    addEventListener() {},
    innerHeight: 800,
    innerWidth: 1200,
    matchMedia: () => ({ matches: false }),
  };

  vm.runInNewContext(source, {
    cancelAnimationFrame() {},
    document,
    getComputedStyle(element) {
      if (element === body) return { backgroundColor: base };
      return element.computed;
    },
    Math,
    requestAnimationFrame: () => 1,
    window,
  });

  return blocks;
}

test('preserves dark-page gradient softening on base-colour panels', () => {
  const gradient = 'linear-gradient(rgb(16, 9, 48), rgb(45, 27, 105))';
  const [panel] = runStarfield('rgb(16, 9, 48)', [{
    backgroundColor: 'rgb(16, 9, 48)',
    backgroundImage: gradient,
  }]);

  assert.equal(panel.style.backgroundColor, 'transparent');
  assert.equal(
    panel.style.backgroundImage,
    'linear-gradient(rgba(16,9,48,0.78), rgba(45,27,105,0.78))',
  );
});

test('keeps deliberate dark panels opaque on light pages', () => {
  const darkGradient = 'linear-gradient(rgb(16, 9, 48), rgb(45, 27, 105))';
  const [basePanel, darkPanel] = runStarfield('rgb(250, 250, 247)', [
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
  assert.equal(darkPanel.style.backgroundColor, undefined);
  assert.equal(darkPanel.style.backgroundImage, undefined);
});
