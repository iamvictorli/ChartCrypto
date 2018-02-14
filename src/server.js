import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import next from 'next';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const port = parseInt(process.env.PORT, 10) || 3000;

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const client = redis.createClient();
client.on('connect', () => console.log('Connected to Redis'));
const zAddAsync = promisify(client.zadd).bind(client);
const zRangeAync = promisify(client.zrange).bind(client);
const zRemRangeByScoreAsync = promisify(client.zremrangebyscore).bind(client);

io.on('connection', socket => {
  console.log('a user connected');

  // send to clients except sender about someone's newly added stock
  socket.on('Add Stock', stock => {
    zAddAsync('Stocks', stock.id, stock.value).then(() => {
      zRangeAync('Stocks', 0, -1, 'WITHSCORES').then(stocksWithScores => {
        const s = [];
        for (let i = 0; i < stocksWithScores.length; i += 2) {
          s.push({
            id: Number(stocksWithScores[i + 1]),
            value: stocksWithScores[i]
          });
        }
        console.log(s);
        io.emit('Add Stock', s);
      });
    });
  });

  socket.on('Delete Stock', stockID => {
    zRemRangeByScoreAsync('Stocks', stockID, stockID).then(() => {
      zRangeAync('Stocks', 0, -1, 'WITHSCORES').then(stocksWithScores => {
        const s = [];
        for (let i = 0; i < stocksWithScores.length; i += 2) {
          s.push({
            id: Number(stocksWithScores[i + 1]),
            value: stocksWithScores[i]
          });
        }
        console.log(s);
        io.emit('Delete Stock', s);
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnect');
  });
});

nextApp.prepare().then(() => {
  app.get('/stocks', (req, res) => {
    // lRangeAsync('Stocks', 0, -1).then(stocks => {
    //   stocks.forEach(stock => console.log(stock));
    //   res.json(stocks);
    // });
    zRangeAync('Stocks', 0, -1, 'WITHSCORES').then(stocksWithScores => {
      const stocks = [];
      for (let i = 0; i < stocksWithScores.length; i += 2) {
        stocks.push({
          id: Number(stocksWithScores[i + 1]),
          value: stocksWithScores[i]
        });
      }
      console.log(stocks);

      res.json(stocks);
    });
  });

  app.get('*', (req, res) => nextHandler(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Listening on port ${process.env.PORT}`);
  });
});
