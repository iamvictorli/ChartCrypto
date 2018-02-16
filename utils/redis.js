import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
client.on('connect', () => console.log('Connected to Redis'));
const hSetAsync = promisify(client.hset).bind(client);
const hGetAllAsync = promisify(client.hgetall).bind(client);
const hDelAsync = promisify(client.hdel).bind(client);

export const setToList = (list, currencyCode, currencyName) =>
  hSetAsync(list, currencyCode, currencyName);
export const getList = async listName => {
  // hGetAll returns a huge object with key and values
  // need to make array of objects
  const list = [];
  const currencyObject = await hGetAllAsync(listName);
  if (currencyObject === null) return list;
  Object.entries(currencyObject).forEach(([key, value]) => {
    list.push({ code: key, name: value });
  });
  return list;
};

export const deleteFromList = (list, currencyCode) => {
  hDelAsync(list, currencyCode);
};
