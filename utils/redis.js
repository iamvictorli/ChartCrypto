// @flow

import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
client.on('connect', () => console.log('Connected to Redis'));
const hSetAsync = promisify(client.hset).bind(client);
const hGetAllAsync = promisify(client.hgetall).bind(client);
const hDelAsync = promisify(client.hdel).bind(client);

const sAddAsync = promisify(client.sadd).bind(client);
const sMembersAsync = promisify(client.smembers).bind(client);

export const setUserList = (currencyTitle: string, currencyMetaData: string) =>
  hSetAsync('userList', currencyTitle, currencyMetaData);

export const getUserList = async () => {
  // hGetAll returns a huge object with key and values
  // need to make array of objects
  const list = [];
  const currencyObject = await hGetAllAsync('userList');
  if (currencyObject === null) return list;
  Object.entries(currencyObject).forEach(([title, metaData]) => {
    list.push({ title, metaData });
  });
  return list;
};

export const deleteUserList = (currencyTitle: string) => {
  hDelAsync('userList', currencyTitle);
};

export const populateCurrencyList = (currency: string) => sAddAsync('currencyList', currency);
export const getCurrencyList = () => sMembersAsync('currencyList');
