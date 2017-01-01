'use strict';
const common = require('../common');
const assert = require('assert');
const spawnSync = require('child_process').spawnSync;
const noop = function() {};

function pass(option, value) {
  // Run the command with the specified option. Since it's not a real command,
  // spawnSync() should run successfully but return an ENOENT error.
  const child = spawnSync('not_a_real_command', { [option]: value });

  assert.strictEqual(child.error.code, 'ENOENT');
}

function fail(option, value, message) {
  assert.throws(() => {
    spawnSync('not_a_real_command', { [option]: value });
  }, message);
}

{
  // Validate the cwd option
  const err = /^TypeError: "cwd" must be a string$/;

  pass('cwd', undefined);
  pass('cwd', null);
  pass('cwd', __dirname);
  fail('cwd', 0, err);
  fail('cwd', 1, err);
  fail('cwd', true, err);
  fail('cwd', false, err);
  fail('cwd', [], err);
  fail('cwd', {}, err);
  fail('cwd', noop, err);
}

{
  // Validate the detached option
  const err = /^TypeError: "detached" must be a boolean$/;

  pass('detached', undefined);
  pass('detached', null);
  pass('detached', true);
  pass('detached', false);
  fail('detached', 0, err);
  fail('detached', 1, err);
  fail('detached', __dirname, err);
  fail('detached', [], err);
  fail('detached', {}, err);
  fail('detached', noop, err);
}

if (!common.isWindows) {
  {
    // Validate the uid option
    if (process.getuid() !== 0) {
      const err = /^TypeError: "uid" must be an integer$/;

      pass('uid', undefined);
      pass('uid', null);
      pass('uid', process.getuid());
      fail('uid', __dirname, err);
      fail('uid', true, err);
      fail('uid', false, err);
      fail('uid', [], err);
      fail('uid', {}, err);
      fail('uid', noop, err);
      fail('uid', NaN, err);
      fail('uid', Infinity, err);
      fail('uid', 3.1, err);
      fail('uid', -3.1, err);
    }
  }

  {
    // Validate the gid option
    if (process.getgid() !== 0) {
      const err = /^TypeError: "gid" must be an integer$/;

      pass('gid', undefined);
      pass('gid', null);
      pass('gid', process.getgid());
      fail('gid', __dirname, err);
      fail('gid', true, err);
      fail('gid', false, err);
      fail('gid', [], err);
      fail('gid', {}, err);
      fail('gid', noop, err);
      fail('gid', NaN, err);
      fail('gid', Infinity, err);
      fail('gid', 3.1, err);
      fail('gid', -3.1, err);
    }
  }
}

{
  // Validate the shell option
  const err = /^TypeError: "shell" must be a boolean or string$/;

  pass('shell', undefined);
  pass('shell', null);
  pass('shell', false);
  fail('shell', 0, err);
  fail('shell', 1, err);
  fail('shell', [], err);
  fail('shell', {}, err);
  fail('shell', noop, err);
}

{
  // Validate the argv0 option
  const err = /^TypeError: "argv0" must be a string$/;

  pass('argv0', undefined);
  pass('argv0', null);
  pass('argv0', 'myArgv0');
  fail('argv0', 0, err);
  fail('argv0', 1, err);
  fail('argv0', true, err);
  fail('argv0', false, err);
  fail('argv0', [], err);
  fail('argv0', {}, err);
  fail('argv0', noop, err);
}

{
  // Validate the windowsVerbatimArguments option
  const err = /^TypeError: "windowsVerbatimArguments" must be a boolean$/;

  pass('windowsVerbatimArguments', undefined);
  pass('windowsVerbatimArguments', null);
  pass('windowsVerbatimArguments', true);
  pass('windowsVerbatimArguments', false);
  fail('windowsVerbatimArguments', 0, err);
  fail('windowsVerbatimArguments', 1, err);
  fail('windowsVerbatimArguments', __dirname, err);
  fail('windowsVerbatimArguments', [], err);
  fail('windowsVerbatimArguments', {}, err);
  fail('windowsVerbatimArguments', noop, err);
}

{
  // Validate the timeout option
  const err = /^TypeError: "timeout" must be an unsigned integer$/;

  pass('timeout', undefined);
  pass('timeout', null);
  pass('timeout', 1);
  pass('timeout', 0);
  fail('timeout', -1, err);
  fail('timeout', true, err);
  fail('timeout', false, err);
  fail('timeout', __dirname, err);
  fail('timeout', [], err);
  fail('timeout', {}, err);
  fail('timeout', noop, err);
  fail('timeout', NaN, err);
  fail('timeout', Infinity, err);
  fail('timeout', 3.1, err);
  fail('timeout', -3.1, err);
}

{
  // Validate the maxBuffer option
  const err = /^TypeError: "maxBuffer" must be an unsigned integer$/;

  pass('maxBuffer', undefined);
  pass('maxBuffer', null);
  pass('maxBuffer', 1);
  pass('maxBuffer', 0);
  fail('maxBuffer', 3.14, err);
  fail('maxBuffer', -1, err);
  fail('maxBuffer', NaN, err);
  fail('maxBuffer', Infinity, err);
  fail('maxBuffer', true, err);
  fail('maxBuffer', false, err);
  fail('maxBuffer', __dirname, err);
  fail('maxBuffer', [], err);
  fail('maxBuffer', {}, err);
  fail('maxBuffer', noop, err);
}

{
  // Validate the killSignal option
  const typeErr = /^TypeError: "killSignal" must be a string or number$/;
  const rangeErr = /^RangeError: "killSignal" cannot be 0$/;
  const unknownSignalErr = /^Error: Unknown signal:/;

  pass('killSignal', undefined);
  pass('killSignal', null);
  pass('killSignal', 'SIGKILL');
  pass('killSignal', 500);
  fail('killSignal', 0, rangeErr);
  fail('killSignal', 'SIGNOTAVALIDSIGNALNAME', unknownSignalErr);
  fail('killSignal', true, typeErr);
  fail('killSignal', false, typeErr);
  fail('killSignal', [], typeErr);
  fail('killSignal', {}, typeErr);
  fail('killSignal', noop, typeErr);
}
