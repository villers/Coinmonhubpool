#!/usr/bin/env node

import program from 'commander';
import ora from 'ora';
import colors from 'colors';

import Api from './services/api';
import { drawTable, drawTotal } from './manager/table';

program
    .version('0.0.1')
    .option('-k, --key <apiKey>', 'Convert to your fiat currency')
    .parse(process.argv);

if (typeof program.key === 'undefined') {
    console.error('Error: program required argument -k <apiKey>'.red);
    process.exit(1);
}

const spinner = ora('Loading data').start();
Api.getData(program.key)
    .then(v => drawTable(v))
    .then(v => drawTotal(v))
    .then(() => spinner.stop())
    .catch(err => {
        spinner.stop();
        if (err.response.status === 401) {
            console.error('Error: The API Key is not valid'.red);
        } else {
            console.error('Error: A error is occured'.red);
        }
    });