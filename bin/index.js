#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _package = require('../package');

var _api = require('./services/api');

var _api2 = _interopRequireDefault(_api);

var _table = require('./manager/table');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package.version).option('-k, --key <apiKey>', 'API Key of miningpoolhub').option('-w, --wallet <wallet>', 'Your BTC wallet').parse(process.argv);

async function main(program) {
    if (typeof program.key !== 'undefined') {
        const miningPoolHubSpiner = (0, _ora2.default)('Loading data from miningPoolHub').start();
        await _api2.default.getDataMiningPool(program.key).then(v => (0, _table.drawTable)(v)).then(v => (0, _table.drawTotal)(v)).then(() => miningPoolHubSpiner.stop()).catch(err => {
            miningPoolHubSpiner.stop();
            if (err.response.status === 401) {
                console.error('Error: The API Key is not valid'.red);
            } else {
                console.error('Error: A error is occured'.red);
            }
        });
    }

    if (typeof program.wallet !== 'undefined') {
        const zPoolSpiner = (0, _ora2.default)('Loading data from zPool').start();
        await _api2.default.getDataZpool(program.wallet).then(v => (0, _table.drawPool)('zPool', v)).then(() => zPoolSpiner.stop()).catch(err => {
            zPoolSpiner.stop();
            console.error('Error: A error is occured'.red);
        });

        const HashrefinerySpiner = (0, _ora2.default)('Loading data from Hashrefinery').start();
        await _api2.default.getDataHashrefinery(program.wallet).then(v => (0, _table.drawPool)('Hashrefinery', v)).then(() => HashrefinerySpiner.stop()).catch(err => {
            HashrefinerySpiner.stop();
            console.error('Error: A error is occured'.red);
        });
    }
}

main(_commander2.default);