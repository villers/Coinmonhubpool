#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _package = require('../package.json');

var _api = require('./services/api');

var _sleep = require('./utils/sleep');

var _sleep2 = _interopRequireDefault(_sleep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-vars
_commander2.default.version(_package.version).option('-k, --key <apiKey>', 'API Key of miningpoolhub').option('-w, --wallet <wallet>', 'Your BTC wallet').option('-t, --time <timeinseconds>', 'Refresh balance data in seconds').parse(process.argv);

async function main(argv) {
  do {
    // clear stdout
    console.log('\x1Bc');
    if (typeof argv.key !== 'undefined') {
      await (0, _api.getMiningPoolHub)(argv.key, 'MininPpoolHub');
    }

    if (typeof argv.wallet !== 'undefined') {
      await (0, _api.getYiiMiningPools)(argv.wallet, 'zPool');
      await (0, _api.getYiiMiningPools)(argv.wallet, 'Hashrefinery');
      await (0, _api.getYiiMiningPools)(argv.wallet, 'Ahashpool');
    }

    if (typeof argv.time !== 'undefined') {
      await (0, _sleep2.default)(argv.time);
    }
  } while (typeof argv.time !== 'undefined');
}

main(_commander2.default);