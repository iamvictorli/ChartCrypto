// @flow

import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import next from 'next';
import csv from 'fast-csv';
import fetch from 'isomorphic-fetch';

import {
  deleteUserList, getAppInfo, populateCurrencyList, updateUserList
} from './redis';

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const port = parseInt(process.env.PORT, 10) || 3000;

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

io.on('connection', socket => {
  // send to all clients the user list
  socket.on('Add UserList', async currency => {
    const code = currency.split(':')[0];
    let response = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${code}&market=USD&apikey=
      ${process.env.ALPHA_VANTAGE_API_KEY}`);
    response = await response.json();
    const userList = await updateUserList(currency, JSON.stringify(response));
    io.emit('Add UserList', userList);
  });

  socket.on('Delete UserList', async currency => {
    const userList = await deleteUserList(currency);
    io.emit('Delete UserList', userList);
  });
});

// start application after adding all the values from the digital_currency_list
const csvStream = csv
  .fromPath('./digital_currency_list.csv', { headers: true })
  .on('data', async data => {
    csvStream.pause();
    await populateCurrencyList(`${data['currency code']}: ${data['currency name']}`);
    csvStream.resume();
  })
  .on('end', () => {
    nextApp.prepare().then(() => {
      app.get('/currencies', async (req, res) => {
        res.json(await getAppInfo());
      });

      app.get('*', (req, res) => nextHandler(req, res));

      server.listen(port, err => {
        if (err) throw err;
        console.log(`Listening on port ${port}`);
      });
    });
  });
