#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _package = require('../package.json');

var _api = require('./services/api');

var _api2 = _interopRequireDefault(_api);

var _sleep = require('./utils/sleep');

var _sleep2 = _interopRequireDefault(_sleep);

var _table = require('./manager/table');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package.version).option('-k, --key <apiKey>', 'API Key of miningpoolhub').option('-w, --wallet <wallet>', 'Your BTC wallet').option('-t, --time <timeinseconds>').parse(process.argv);

async function main(argv) {
  do {
    // clear stdout
    console.log('\x1Bc');
    if (typeof argv.key !== 'undefined') {
      const miningPoolHubSpiner = (0, _ora2.default)('Loading data from miningPoolHub').start();
      await _api2.default.getDataMiningPool(argv.key).then(v => (0, _table.drawTable)(v)).then(v => (0, _table.drawTotal)(v)).then(() => miningPoolHubSpiner.stop()).catch(err => {
        miningPoolHubSpiner.stop();
        if (err.response.status === 401) {
          console.error('Error: The API Key is not valid'.red);
        } else {
          console.error('Error: A error is occured'.red);
        }
      });
    }

    if (typeof argv.wallet !== 'undefined') {
      const zPoolSpiner = (0, _ora2.default)('Loading data from zPool').start();
      await _api2.default.getDataZpool(argv.wallet).then(v => (0, _table.drawPool)('zPool', v)).then(() => zPoolSpiner.stop()).catch(() => {
        zPoolSpiner.stop();
        console.error('Error: A error is occured'.red);
      });

      const HashrefinerySpiner = (0, _ora2.default)('Loading data from Hashrefinery').start();
      await _api2.default.getDataHashrefinery(argv.wallet).then(v => (0, _table.drawPool)('Hashrefinery', v)).then(() => HashrefinerySpiner.stop()).catch(() => {
        HashrefinerySpiner.stop();
        console.error('Error: A error is occured'.red);
      });
    }

    if (typeof argv.time !== 'undefined') {
      await (0, _sleep2.default)(argv.time);
    }
  } while (typeof argv.time !== 'undefined');
}

main(_commander2.default);