const assert = require('assert');
const { updateJumper, resolveCollision } = require('../enemyLogic');

function test(name, fn) {
  try {
    fn();
    console.log('✓', name);
  } catch (err) {
    console.error('✗', name);
    console.error(err);
    process.exitCode = 1;
  }
}

test('jumps only when player is near', () => {
  const enemy = {
    x: 0,
    body: { onFloor: () => true, velocity: { x: 0, y: 0 } },
    setVelocityX(v) { this.body.velocity.x = v; },
    setVelocityY(v) { this.body.velocity.y = v; },
    setFrame(f) { this.frame = f; }
  };
  updateJumper(enemy, { x: 500 }, 0);
  assert.equal(enemy.state, 'idle');
  updateJumper(enemy, { x: 100 }, 0);
  assert.equal(enemy.state, 'charge');
  updateJumper(enemy, { x: 100 }, 600);
  assert.equal(enemy.state, 'jump');
});

test('drops key on defeat', () => {
  let dropped = false;
  const enemy = { body: { touching: { up: true } }, onDefeat: () => { dropped = true; } };
  const player = { body: { touching: { down: true } }, takeDamage: () => {} };
  const result = resolveCollision(player, enemy);
  assert.equal(result, 'defeat');
  assert.ok(dropped);
});

test('damages player on side collision', () => {
  let damaged = false;
  const enemy = { body: { touching: { up: false } } };
  const player = { body: { touching: { down: false } }, takeDamage: () => { damaged = true; } };
  const result = resolveCollision(player, enemy);
  assert.equal(result, 'damage');
  assert.ok(damaged);
});
