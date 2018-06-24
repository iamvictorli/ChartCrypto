// @flow

declare type Currency = {
  title: string,
  metaData: string
};

declare type CurrencyJsonMetaData = {
  'Meta Data': {
    '2. Digital Currency Code': string
  },
  'Time Series (Digital Currency Daily)': {
    [date: string]: {
      '1a. open (USD)': string
    }
  }
};
