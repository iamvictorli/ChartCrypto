import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';

import libraries from './routes/libraries';

const app = express();

app.use(express.static(path.join(__dirname, '../client/build')));

// routing
app.use('/api/libraries', libraries);

// displaying react files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const server = http.Server(app);
const io = socketIO(server);
const stocks = [];

io.on('connection', (socket) => {
  console.log('a user connected');

  io.emit('Show Stock', stocks);

  socket.on('Add Stock', (stockName) => {
    stocks.push(stockName);
    io.emit('Add Stock', stocks);
  });

  socket.on('disconnect', () => {
    console.log('user disconnect');
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
