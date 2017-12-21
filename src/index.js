#!/usr/bin/env node

import program from 'commander';
import ora from 'ora';
import colors from 'colors';

import { version } from '../package.json';
import Api from './services/api';
import sleep from './utils/sleep';
import { drawPool, drawTable, drawTotal } from './manager/table';

program
  .version(version)
  .option('-k, --key <apiKey>', 'API Key of miningpoolhub')
  .option('-w, --wallet <wallet>', 'Your BTC wallet')
  .option('-t, --time <timeinseconds>', 'Refresh balance data in seconds')
  .parse(process.argv);

async function main(argv) {
  do {
    // clear stdout
    console.log('\x1Bc');
    if (typeof argv.key !== 'undefined') {
      const miningPoolHubSpiner = ora('Loading data from miningPoolHub').start();
      await Api.getDataMiningPool(argv.key)
        .then(v => drawTable(v))
        .then(v => drawTotal(v))
        .then(() => miningPoolHubSpiner.stop())
        .catch((err) => {
          miningPoolHubSpiner.stop();
          if (err.response.status === 401) {
            console.error('Error: The API Key is not valid'.red);
          } else {
            console.error('Error: A error is occured'.red);
          }
        });
    }

    if (typeof argv.wallet !== 'undefined') {
      const zPoolSpiner = ora('Loading data from zPool').start();
      await Api.getDataZpool(argv.wallet)
        .then(v => drawPool('zPool', v))
        .then(() => zPoolSpiner.stop())
        .catch(() => {
          zPoolSpiner.stop();
          console.error('Error: A error is occured'.red);
        });

      const HashrefinerySpiner = ora('Loading data from Hashrefinery').start();
      await Api.getDataHashrefinery(argv.wallet)
        .then(v => drawPool('Hashrefinery', v))
        .then(() => HashrefinerySpiner.stop())
        .catch(() => {
          HashrefinerySpiner.stop();
          console.error('Error: A error is occured'.red);
        });
    }

    if (typeof argv.time !== 'undefined') {
      await sleep(argv.time);
    }
  } while (typeof argv.time !== 'undefined');
}

main(program);
