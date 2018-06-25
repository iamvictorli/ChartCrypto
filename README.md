# CryptoChart

CryptoChart is a web application in which users can see recent price trend lines of different cryptocurrencies and compare them with a chart. Additionally, live updates occur when other users adds or removes a cryptocurrency.

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org)
* [Redis](https://redis.io/)

### Steps

* Run `npm install` or `yarn`.
* In the root directory, create a .env file (or rename the env-sample file to .env) and place the following:
  * PORT=*PORT NUMBER FOR EXPRESS*
  * REDIS_HOST=*LOCAL REDIS HOST IS: 127.0.0.1*
  * REDIS_PORT=*LOCAL REDIS PORT IS: 6379*
  * REDIS_PASSWORD=*LOCAL REDIS PASSWORD IS: PASSWORD*
  * ALPHA_VANTAGE_API_KEY=*SIGN UP TO GET API KEY AT https://www.alphavantage.co/*
* Run `redis-server` to start Redis.
* In another terminal, run `npm build` or `yarn build`.
* Then run `npm dev` or `yarn dev`.
* Navigate to `localhost:PORT NUMBER IN ENV` in your browser.

## User Stories
- [x] I can view a graph displaying the recent trend lines for each added cryptocurrency.
- [x] I can add new cryptocurrencies by their symbol name.
- [x] I can remove cryptocurrencies.
- [x] I can see changes in real-time when any other user adds or removes a cryptocurrency.

## Libraries

* Express.js
* React
* Next.js
* Flow
* Redis
* Socket.IO
* Recharts
* Alpha Vantage API
* Material UI
* Moment
