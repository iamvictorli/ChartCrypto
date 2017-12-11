import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import App from './App';

const socket = io('http://127.0.0.1:5000');

ReactDOM.render(<App socket={socket} />, document.getElementById('root'));
