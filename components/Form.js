// @flow

import React from 'react';

import type { Currency } from '../utils/custom-types';

type Props = {
  handleChange: Function,
  handleSubmit: Function,
  value: string,
  currencyList: Array<Currency>,
  buttonDisable: boolean
};

const Form = ({ currencyList, handleChange, handleSubmit, value, buttonDisable }: Props) => (
  <form onSubmit={handleSubmit}>
    <label htmlFor="currencyList">
      Choose a CryptoCurrency from this list:
      <input
        list="cryptocurrencies"
        id="currencyList"
        name="currencyList"
        value={value}
        onChange={handleChange}
      />
    </label>
    <datalist id="cryptocurrencies">
      {currencyList.map(currency => (
        <option key={currency.code} value={`${currency.code}: ${currency.name}`} />
      ))}
    </datalist>

    <button disabled={buttonDisable}>Send</button>
  </form>
);

export default Form;
