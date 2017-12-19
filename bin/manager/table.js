'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.drawTable = drawTable;
exports.drawTotal = drawTotal;
exports.drawPool = drawPool;

var _cliTable = require('cli-table2');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _chars = require('../constant/chars');

var _chars2 = _interopRequireDefault(_chars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drawTable(lines) {
    const table = new _cliTable2.default({
        chars: _chars2.default,
        head: ['Coin', 'Confirmed', 'Unconfirmed', 'Ae_confirmed', 'Ae_unconfirmed', 'Exchange', 'USD', 'EURO'].map(text => text.yellow),
        colWidths: [10, 20, 20, 20, 20, 20, 15, 15]
    });

    table.push(...lines);
    console.log(`Data source from miningpoolhub.com and cryptocompare.com at ${new Date().toLocaleTimeString()}`);
    console.log(table.toString());
    return lines;
}

function drawTotal(lines) {
    const table = new _cliTable2.default({
        chars: _chars2.default,
        head: ['USD', 'EUR'].map(title => title.yellow),
        colWidths: [20, 20]
    });

    const totals = {
        USD: 0,
        EUR: 0
    };

    lines.forEach(a => [totals.USD += a[6], totals.EUR += a[7]]);

    table.push(Object.values(totals));

    console.log(`Total:`);
    console.log(table.toString());
    return lines;
}

function drawPool(poolName, totals) {
    const table = new _cliTable2.default({
        chars: _chars2.default,
        head: ['USD', 'EUR'].map(title => title.yellow),
        colWidths: [20, 20]
    });

    table.push(Object.values(totals));

    console.log(`Total from ${poolName}:`);
    console.log(table.toString());
    return totals;
}