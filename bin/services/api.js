'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMiningPoolHub = getMiningPoolHub;
exports.getYiiMiningPools = getYiiMiningPools;

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _axios = require('./axios');

var _axios2 = _interopRequireDefault(_axios);

var _symbols = require('../constant/symbols');

var _symbols2 = _interopRequireDefault(_symbols);

var _table = require('../manager/table');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function loadMiningPool(apikey) {
  const url = `https://miningpoolhub.com/index.php?page=api&action=getuserallbalances&api_key=${apikey}`;
  const response = await _axios2.default.get(url);

  return response.data.getuserallbalances.data;
}

async function loadFromPool(url) {
  const response = await _axios2.default.get(url);

  return response.data;
}

async function getCurrency(total, coinName, withSimbol = true) {
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${withSimbol ? _symbols2.default[coinName] : coinName}&tsyms=BTC,USD,EUR`;
  const { data: { USD, EUR } } = await _axios2.default.get(url);

  return { USD: USD * total, EUR: EUR * total };
}

async function getDataMiningPool(apikey) {
  const datas = await loadMiningPool(apikey);

  const formatedDatas = datas.map(async record => {
    const line = [record.confirmed, record.unconfirmed, record.ae_confirmed, record.ae_unconfirmed, record.exchange];
    const total = line.reduce((a, b) => a + b);
    const { USD, EUR } = await getCurrency(total, record.coin);

    line.unshift(record.coin.yellow);
    line.push(USD);
    line.push(EUR);

    return line;
  });

  return Promise.all(formatedDatas);
}

async function getDataPool(url) {
  const tmp = [];
  const datas = await loadFromPool(url);

  if (datas.currency) {
    const balance = datas.unpaid || datas.total_unpaid;
    const { USD, EUR } = await getCurrency(balance, datas.currency, false);

    tmp.push(USD);
    tmp.push(EUR);
    return tmp;
  }

  return tmp;
}

async function getMiningPoolHub(key, title) {
  const miningPoolHubSpiner = (0, _ora2.default)(`Loading data from ${title}`).start();
  await getDataMiningPool(key).then(v => (0, _table.drawTable)(v)).then(v => (0, _table.drawTotal)(v)).then(() => miningPoolHubSpiner.stop()).catch(err => {
    miningPoolHubSpiner.stop();
    if (err.response.status === 401) {
      console.error('Error: The API Key is not valid'.red);
    } else {
      console.error('Error: A error is occured'.red);
    }
  });
}

async function getYiiMiningPools(wallet, title) {
  const urls = {
    zPool: `http://zpool.ca/api/wallet?address=${wallet}`,
    Hashrefinery: `http://pool.hashrefinery.com/api/wallet?address=${wallet}`,
    Ahashpool: `http://www.ahashpool.com/api/wallet/?address=${wallet}`
  };

  const spinner = (0, _ora2.default)(`Loading data from ${title}`).start();
  await getDataPool(urls[title]).then(v => (0, _table.drawPool)(title, v)).then(() => spinner.stop()).catch(() => {
    spinner.stop();
    console.error('Error: A error is occured'.red);
  });
}