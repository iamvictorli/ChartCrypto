// @flow

import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// redis returns one object with title keys and metadata value
// need to aggregate object into an array of each key value pair as an object
const aggregateUserList = userList => {
  const list = [];
  if (userList === null) return list;
  Object.entries(userList).forEach(([title, metaData]) => {
    list.push({ title, metaData });
  });
  return list;
};

export const populateCurrencyList = (currency: string) => {
  const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
  client.saddAsync('currencyList', currency);
  client.quit();
};

export const updateUserList = async (currencyTitle: string, currencyMetaData: string) => {
  const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
  const [, userList] = await client
    .multi()
    .hset('userList', currencyTitle, currencyMetaData)
    .hgetall('userList')
    .execAsync();
  client.quit();
  return aggregateUserList(userList);
};

export const deleteUserList = async (currencyTitle: string) => {
  const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
  const [, userList] = await client
    .multi()
    .hdel('userList', currencyTitle)
    .hgetall('userList')
    .execAsync();
  return aggregateUserList(userList);
};

export const getAppInfo = async () => {
  const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
  const [currencyList, userL] = await client
    .multi()
    .smembers('currencyList')
    .hgetall('userList')
    .execAsync();

  const userList = aggregateUserList(userL);
  client.quit();
  return {
    currencyList,
    userList
  };
};
