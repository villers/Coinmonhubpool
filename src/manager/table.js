import Table from 'cli-table2';
import chars from '../constant/chars';

export function drawTable(lines) {
    const table = new Table({
        chars,
        head: ['Coin', 'Confirmed', 'Unconfirmed', 'Ae_confirmed', 'Ae_unconfirmed', 'Exchange', 'USD', 'EURO'].map(text => text.yellow),
        colWidths: [10, 20, 20, 20, 20, 20, 15, 15],
    });

    table.push(...lines);
    console.log(`Data source from miningpoolhub.com and cryptocompare.com at ${new Date().toLocaleTimeString()}`);
    console.log(table.toString());
    return lines;
}

export function drawTotal(lines) {
    const table = new Table({
        chars,
        head: ['USD', 'EUR'].map(title => title.yellow),
        colWidths: [20, 20]
    });

    const totals = {
        USD: 0,
        EUR: 0,
    };

    lines.forEach((a) => [
        totals.USD += a[6],
        totals.EUR += a[7],
    ]);

    table.push(Object.values(totals));

    console.log(`Total:`);
    console.log(table.toString());
    return lines;
}

export function drawPool(poolName, data) {
    const table = new Table({
        chars,
        head: ['USD', 'EUR'].map(title => title.yellow),
        colWidths: [20, 20],
    });

    table.push(data);

    console.log(`Total from ${poolName}:`);
    console.log(table.toString());
    return data;
}