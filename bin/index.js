#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _api = require('./services/api');

var _api2 = _interopRequireDefault(_api);

var _table = require('./manager/table');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.0.1').option('-k, --key <apiKey>', 'Convert to your fiat currency').parse(process.argv);

if (typeof _commander2.default.key === 'undefined') {
    console.error('Error: program required argument -k <apiKey>'.red);
    process.exit(1);
}

const spinner = (0, _ora2.default)('Loading data').start();
_api2.default.getData(_commander2.default.key).then(v => (0, _table.drawTable)(v)).then(v => (0, _table.drawTotal)(v)).then(() => spinner.stop()).catch(err => {
    spinner.stop();
    if (err.response.status === 401) {
        console.error('Error: The API Key is not valid'.red);
    } else {
        console.error('Error: A error is occured'.red);
    }
});