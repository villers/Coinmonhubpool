#!/usr/bin/env node

import program from 'commander';
import ora from 'ora';
import colors from 'colors';

import {version} from '../package';
import Api from './services/api';
import { drawPool, drawTable, drawTotal } from './manager/table';

program
    .version(version)
    .option('-k, --key <apiKey>', 'API Key of miningpoolhub')
    .option('-w, --wallet <wallet>', 'Your BTC wallet')
    .parse(process.argv);

async function main (program) {
    if (typeof program.key !== 'undefined') {
        const miningPoolHubSpiner = ora('Loading data from miningPoolHub').start();
        await Api.getDataMiningPool(program.key)
            .then(v => drawTable(v))
            .then(v => drawTotal(v))
            .then(() => miningPoolHubSpiner.stop())
            .catch(err => {
                miningPoolHubSpiner.stop();
                if (err.response.status === 401) {
                    console.error('Error: The API Key is not valid'.red);
                } else {
                    console.error('Error: A error is occured'.red);
                }
            });
    }

    if (typeof program.wallet !== 'undefined') {
        const zPoolSpiner = ora('Loading data from zPool').start();
        await Api.getDataZpool(program.wallet)
            .then(v => drawPool('zPool', v))
            .then(() => zPoolSpiner.stop())
            .catch(err => {
                zPoolSpiner.stop();
                console.error('Error: A error is occured'.red);
            });

        const HashrefinerySpiner = ora('Loading data from Hashrefinery').start();
        await Api.getDataHashrefinery(program.wallet)
            .then(v => drawPool('Hashrefinery', v))
            .then(() => HashrefinerySpiner.stop())
            .catch(err => {
                HashrefinerySpiner.stop();
                console.error('Error: A error is occured'.red);
            });
    }
}

main(program);