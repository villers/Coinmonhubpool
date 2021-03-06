import Table from 'cli-table3';
import chars from '../constant/chars';

export function drawTable(lines) {
  const table = new Table({
    chars,
    head: ['Coin', 'Confirmed', 'Unconfirmed', 'Ae_confirmed', 'Ae_unconfirmed', 'Exchange', 'USD', 'EURO'].map(text => text.yellow),
    colWidths: [20, 15, 15, 15, 15, 15, 15, 15],
  });

  table.push(...lines);
  console.log(`\nData source from miningpoolhub.com and cryptocompare.com at ${new Date().toLocaleTimeString()}`);
  console.log(table.toString());
  return lines;
}

export function drawTotal(lines) {
  const table = new Table({
    chars,
    head: ['USD', 'EUR'].map(title => title.yellow),
    colWidths: [20, 20],
  });

  const totals = {
    USD: 0,
    EUR: 0,
  };

  lines.forEach((a) => {
    totals.USD += a[6];
    totals.EUR += a[7];
  });

  table.push(Object.values(totals));

  console.log('Total:');
  console.log(table.toString());
  return lines;
}

export function drawPool(poolName, lines) {
  const table = new Table({
    chars,
    head: ['USD', 'EUR'].map(title => title.yellow),
    colWidths: [20, 20],
  });

  table.push(lines);

  console.log(`\nTotal from ${poolName} and cryptocompare.com at ${new Date().toLocaleTimeString()}`);
  console.log(table.toString());
  return lines;
}
