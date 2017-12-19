'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _symbols = require('../constant/symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Api {
    static async getDataMiningPool(apikey) {
        const datas = await Api.loadMiningPool(apikey);

        const formatedDatas = datas.map(async record => {
            const line = [record.confirmed, record.unconfirmed, record.ae_confirmed, record.ae_unconfirmed, record.exchange];
            const total = line.reduce((a, b) => a + b);
            const { USD, EUR } = await Api.getCurrency(total, record.coin);

            line.unshift(record.coin.yellow);
            line.push(total * USD);
            line.push(total * EUR);

            return line;
        });

        return Promise.all(formatedDatas);
    }

    static async getDataZpool(wallet) {
        const datas = await Api.loadZpool(wallet);
        if (datas.currency) {
            return ({ USD, EUR } = await Api.getCurrency(datas.unpaid, datas.currency));
        }

        return null;
    }

    static async getDataHashrefinery(wallet) {
        const datas = await Api.loadHashrefinery(wallet);
        if (datas.currency) {
            return ({ USD, EUR } = await Api.getCurrency(datas.unpaid, datas.currency));
        }

        return null;
    }

    static async loadMiningPool(apikey) {
        const url = `https://miningpoolhub.com/index.php?page=api&action=getuserallbalances&api_key=${apikey}`;
        const response = await _axios2.default.get(url);

        return response.data.getuserallbalances.data;
    }

    static async loadZpool(wallet) {
        const url = `http://zpool.ca/api/wallet?address=${wallet}`;
        const response = await _axios2.default.get(url);

        return response.data;
    }

    static async loadHashrefinery(wallet) {
        const url = `http://pool.hashrefinery.com/api/wallet?address=${wallet}`;
        const response = await _axios2.default.get(url);

        return response.data;
    }

    static async getCurrency(total, coinName, withSimbol = true) {
        const url = `https://min-api.cryptocompare.com/data/price?fsym=${withSimbol ? _symbols2.default[coinName] : coinName}&tsyms=BTC,USD,EUR`;
        const response = await _axios2.default.get(url);

        return response.data;
    }
}

exports.default = Api;