import axios from './axios';
import symbols from '../constant/symbols';

class Api {
  static async getDataMiningPool(apikey) {
    const datas = await Api.loadMiningPool(apikey);

    const formatedDatas = datas.map(async (record) => {
      const line = [
        record.confirmed,
        record.unconfirmed,
        record.ae_confirmed,
        record.ae_unconfirmed,
        record.exchange,
      ];
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
    const tmp = [];
    const datas = await Api.loadZpool(wallet);
    if (datas.currency) {
      const { USD, EUR } = await Api.getCurrency(datas.unpaid, datas.currency, false);

      tmp.push(datas.unpaid * USD);
      tmp.push(datas.unpaid * EUR);
      return tmp;
    }

    return tmp;
  }

  static async getDataHashrefinery(wallet) {
    const tmp = [];
    const datas = await Api.loadHashrefinery(wallet);
    if (datas.currency) {
      const { USD, EUR } = await Api.getCurrency(datas.unpaid, datas.currency, false);

      tmp.push(datas.unpaid * USD);
      tmp.push(datas.unpaid * EUR);
      return tmp;
    }

    return tmp;
  }

  static async loadMiningPool(apikey) {
    const url = `https://miningpoolhub.com/index.php?page=api&action=getuserallbalances&api_key=${apikey}`;
    const response = await axios.get(url);

    return response.data.getuserallbalances.data;
  }

  static async loadZpool(wallet) {
    const url = `http://zpool.ca/api/wallet?address=${wallet}`;
    const response = await axios.get(url);

    return response.data;
  }

  static async loadHashrefinery(wallet) {
    const url = `http://pool.hashrefinery.com/api/wallet?address=${wallet}`;
    const response = await axios.get(url);

    return response.data;
  }

  static async getCurrency(total, coinName, withSimbol = true) {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${withSimbol ? symbols[coinName] : coinName}&tsyms=BTC,USD,EUR`;
    const response = await axios.get(url);

    return response.data;
  }
}

export default Api;
