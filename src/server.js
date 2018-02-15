import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import next from 'next';
import csv from 'fast-csv';

import {
  addStock,
  deleteStock,
  getAllStocks,
  getCurrencyList,
  setupCurrencyList
} from '../utils/redis';

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const port = parseInt(process.env.PORT, 10) || 3000;

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

io.on('connection', socket => {
  console.log('a user connected');

  // send to clients except sender about someone's newly added stock
  socket.on('Add Stock', async stock => {
    await addStock(stock.id, stock.value);
    const stocks = await getAllStocks();
    io.emit('Add Stock', stocks);
  });

  socket.on('Delete Stock', async stockID => {
    await deleteStock(stockID);
    const stocks = await getAllStocks();
    io.emit('Delete Stock', stocks);
  });

  socket.on('disconnect', () => {
    console.log('user disconnect');
  });
});

// start application after adding all the values from the digital_currency_list
const csvStream = csv
  .fromPath('./digital_currency_list.csv', { headers: true })
  .on('data', async data => {
    csvStream.pause();
    await setupCurrencyList(data['currency code'], data['currency name']);
    csvStream.resume();
  })
  .on('end', () => {
    nextApp.prepare().then(() => {
      app.get('/currencies', async (req, res) => {
        const currencyList = await getCurrencyList();
        res.json(currencyList);
      });

      app.get('*', (req, res) => nextHandler(req, res));

      server.listen(port, err => {
        if (err) throw err;
        console.log(`Listening on port ${process.env.PORT}`);
      });
    });
  });
