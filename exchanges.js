'use strict';

const ccxt      = require ('ccxt')
const asTable   = require ('as-table')
const log       = require ('ololog').configure ({ locate: false })

// console.log (ccxt.exchanges) // print all available exchanges

let exchanges = ccxt.exchanges.map(function(name){
    // console.log(exchange)

    let exchange = new ccxt[name] ()

    if (name == 'binance')
    console.log(exchange.urls.fees)

    // { trading:
    //     { tierBased: false,
    //       percentage: true,
    //       maker: 0.001,
    //       taker: 0.0019 },
    //    funding:
    //     { tierBased: false,
    //       percentage: false,
    //       withdraw: { BTC: 0.001 },
    //       deposit: { BTC: 0 } } }

    let fees_trading_maker = '-'
    let fees_trading_taker = '-'
    let fees_funding_withdraw = '-'
    let fees_funding_deposit = '-'
    let fees_doc = '-'

    if (exchange.fees) {
        if (exchange.fees.trading) {
            fees_trading_maker = (exchange.fees.trading.maker) ? exchange.fees.trading.maker : ''
            fees_trading_taker = (exchange.fees.trading.taker) ? exchange.fees.trading.taker : ''    
        }

        if (exchange.fees.funding ) {
            fees_funding_withdraw = (exchange.fees.funding.withdraw) ? Object.keys(exchange.fees.funding.withdraw).length : ''
            fees_funding_deposit = (exchange.fees.funding.deposit) ? Object.keys(exchange.fees.funding.deposit).length : ''    
        }
    }

    return {
        name: name, 
        fees_trading_maker: fees_trading_maker,
        fees_trading_taker: fees_trading_taker,
        withdraw_count_pairs: fees_funding_withdraw,
        deposit_count_pairs: fees_funding_deposit,
    }
})

log(asTable.configure ({ delimiter: ' | ' }) (exchanges));
