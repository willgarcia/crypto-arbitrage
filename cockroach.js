var async = require('async')
var pg = require('pg')

const init = (r) => {

  var config = {
    user: 'root',
    host: 'db',
    database: 'cryptowatch',
    port: 26257
  }

  // Create a pool.
  var pool = new pg.Pool(config)

  pool.connect(function (err, client, done) {
    // Closes communication with the database and exits.
    var finish = function () {
      done()
    }

    if (err) {
      console.error('could not connect to cockroachdb', err)
      finish()
    }
    async.waterfall([
      function (next) {
        client.query('CREATE DATABASE IF NOT EXISTS cryptowatch')
        client.query(`
        CREATE TABLE IF NOT EXISTS tickers 
        ( exchange VARCHAR(30),
          exchange_datetime VARCHAR(30),
          symbol VARCHAR(30), 
          timestamp  VARCHAR(30),
          datetime VARCHAR(30),
          high VARCHAR(30),
          low VARCHAR(30),
          bid VARCHAR(30),
          bidVolume VARCHAR(30),
          ask VARCHAR(30),
          askVolume VARCHAR(30),
          vwap VARCHAR(30),
          open VARCHAR(30),
          close VARCHAR(30),
          first VARCHAR(30),
          last VARCHAR(30),
          change VARCHAR(30),
          percentage VARCHAR(30),
          average VARCHAR(30),
          baseVolume VARCHAR(30),
          quoteVolume VARCHAR(30)
        )`, next)
      },
    ],
    function (err, results) {
      if (err) {
        console.error(err)
        finish()
      }
      finish()
    })
  })
}

exports.cockroach = init()