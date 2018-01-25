Install

```
npm install
```

Tickers per exchange:
```
docker-compose up --build
cockroach sql --execute "use cryptowatch;show tables;show create table tickers;select * from tickers limit 1" --insecure
```

List of available exchanges:
```
node exchanges-cli.js
```

Spreads:

```
node index-cli.js binance kraken cex [...]
```
