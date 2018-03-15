// @flow

import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
client.on('connect', () => console.log('Connected to Redis'));

export const setUserList = (currencyTitle: string, currencyMetaData: string) =>
  client.hsetAsync('userList', currencyTitle, currencyMetaData);

export const getUserList = async () => {
  // returns a huge object with key and values
  // need to make array of objects
  const list = [];
  const currencyObject = await client.hgetallAsync('userList');
  if (currencyObject === null) return list;
  Object.entries(currencyObject).forEach(([title, metaData]) => {
    list.push({ title, metaData });
  });
  return list;
};

export const deleteUserList = (currencyTitle: string) => {
  client.hdelAsync('userList', currencyTitle);
};

export const populateCurrencyList = (currency: string) => client.saddAsync('currencyList', currency);
export const getCurrencyList = () => client.smembersAsync('currencyList');
