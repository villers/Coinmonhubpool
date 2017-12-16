import axios from 'axios';
import symbols from '../constant/symbols';

class Api {
    static async getData (apikey) {
        const datas = await Api.loadMiningPool(apikey);

        const formatedDatas = datas.map(async record => {
            const line = [
                record.confirmed,
                record.unconfirmed,
                record.ae_confirmed,
                record.ae_unconfirmed,
                record.exchange
            ];
            const total = line.reduce((a, b) => a + b);
            const {USD, EUR} = await Api.getCurrency(total, record.coin);

            line.unshift(record.coin.yellow);
            line.push(total * USD);
            line.push(total * EUR);

            return line;
        });

        return Promise.all(formatedDatas);
    }

    static async loadMiningPool(apikey) {
        const url = `https://miningpoolhub.com/index.php?page=api&action=getuserallbalances&api_key=${apikey}`;
        const response = await axios.get(url);

        return response.data.getuserallbalances.data;
    }

    static async getCurrency(total, coinName) {
        const url = `https://min-api.cryptocompare.com/data/price?fsym=${symbols[coinName]}&tsyms=BTC,USD,EUR`;
        const response = await axios.get(url);

        return response.data;
    }
}

export default Api;