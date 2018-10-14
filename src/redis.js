// @flow

import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || 'password'
});

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
  client.saddAsync('currencyList', currency);
};

export const updateUserList = async (currencyTitle: string, currencyMetaData: string) => {
  const [, userList] = await client
    .multi()
    .hset('userList', currencyTitle, currencyMetaData)
    .hgetall('userList')
    .execAsync();
  return aggregateUserList(userList);
};

export const deleteUserList = async (currencyTitle: string) => {
  const [, userList] = await client
    .multi()
    .hdel('userList', currencyTitle)
    .hgetall('userList')
    .execAsync();
  return aggregateUserList(userList);
};

export const getAppInfo = async () => {
  const [currencyList, userL] = await client
    .multi()
    .smembers('currencyList')
    .hgetall('userList')
    .execAsync();

  const userList = aggregateUserList(userL);
  return {
    currencyList: currencyList.sort(),
    userList
  };
};

export const getUserList = async () => {
  const userList = await client.hgetallAsync('userList');
  return aggregateUserList(userList);
};

export const deleteCurrencyList = async (currency: string) => client.sremAsync('currencyList', currency);
