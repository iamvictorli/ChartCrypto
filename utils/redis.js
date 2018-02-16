// @flow

import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
client.on('connect', () => console.log('Connected to Redis'));
const hSetAsync = promisify(client.hset).bind(client);
const hGetAllAsync = promisify(client.hgetall).bind(client);
const hDelAsync = promisify(client.hdel).bind(client);

export const setToList = (list: string, currencyCode: string, currencyName: string) =>
  hSetAsync(list, currencyCode, currencyName);
export const getList = async (listName: string) => {
  // hGetAll returns a huge object with key and values
  // need to make array of objects
  const list = [];
  const currencyObject = await hGetAllAsync((listName: string));
  if (currencyObject === null) return list;
  Object.entries(currencyObject).forEach(([key, value]) => {
    list.push({ code: key, name: value });
  });
  return list;
};

export const deleteFromList = (list: string, currencyCode: string) => {
  hDelAsync(list, currencyCode);
};
