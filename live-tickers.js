'use strict';

const ccxt      = require ('ccxt')
const asTable   = require ('as-table')
const log       = require ('ololog').configure ({ locate: false })
const async     = require('async');

require('./cockroach')
const pg        = require('pg');
const db_config = {
    user: 'root',
    host: 'db',
    database: 'cryptowatch',
    port: 26257
}
const pool = new pg.Pool(db_config);
 
const d_interval = 5000

require ('ansicolor').nice;

let loadTickers = async (id) => {
    let exchangeFound = ccxt.exchanges.indexOf (id) > -1
    if (exchangeFound) {
        let exchange = new ccxt[id] ({ enableRateLimit: true })
        let markets = await exchange.loadMarkets ()
        const tickers = await exchange.fetchTickers ()
        log (exchange.id.green, exchange.iso8601 (exchange.milliseconds ()))
        log ('-- Fetched', Object.values (tickers).length.toString ().green, 'tickers')
        for (var ticker in tickers) {
            var db_ticker = []
            db_ticker.push(id)
            db_ticker.push(exchange.iso8601 (exchange.milliseconds ()))
            
            let fields = [
                'symbol',
                'timestamp',
                'datetime',
                'high',
                'low',
                'bid',
                'bidVolume',
                'ask',
                'askVolume',
                'vwap',
                'open',
                'close',
                'first',
                'last',
                'change',
                'percentage',
                'average',
                'baseVolume',
                'quoteVolume'
            ]
            for (let key in fields) {
                let value = (tickers[ticker][fields[key]]) ? tickers[ticker][fields[key]] : '-'
                db_ticker.push(value)
            }
            let sql = 'insert into tickers (exchange, exchange_datetime, symbol, timestamp, datetime, high, low, bid, bidVolume, ask, askVolume, vwap, open, close, first, last, change, percentage, average, baseVolume, quoteVolume) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21);'
            const client = await pool.connect()
            try {
                const res = await pool.query(sql, db_ticker)
            } catch(err) {
                console.log(err.stack)
            } finally {
                client.release()
            }
        }
    } else {
        log('Exchange ' + id.red + ' not found')
    }
}

function main() {
    if (process.env.LT_EXCHANGE) {
        const id = process.env.LT_EXCHANGE
        const interval = process.env.LT_INTERVAL
        loadTickers(id)
        setTimeout(main, (interval) ? interval : d_interval);
    } else {
        console.err('Exchange LT_EXCHANGE not found')
        process.exit()
    }
}
setTimeout(main, d_interval);
