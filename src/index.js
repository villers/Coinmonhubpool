#!/usr/bin/env node

import program from 'commander';

// eslint-disable-next-line no-unused-vars
import colors from 'colors';

import { version } from '../package.json';
import { getMiningPoolHub, getYiiMiningPools } from './services/api';
import sleep from './utils/sleep';

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
      await getMiningPoolHub(argv.key, 'MininPpoolHub');
    }

    if (typeof argv.wallet !== 'undefined') {
      await getYiiMiningPools(argv.wallet, 'zPool');
      await getYiiMiningPools(argv.wallet, 'Hashrefinery');
      await getYiiMiningPools(argv.wallet, 'Ahashpool');
    }

    if (typeof argv.time !== 'undefined') {
      await sleep(argv.time);
    }
  } while (typeof argv.time !== 'undefined');
}

main(program);
