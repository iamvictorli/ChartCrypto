// @flow

import React from 'react';

import type { Currency } from '../utils/custom-types';

type Props = {
  handleChange: Function,
  handleSubmit: Function,
  value: string,
  currencyList: Array<Currency>
};

const Form = ({ currencyList, handleChange, handleSubmit, value }: Props) => (
  <form onSubmit={handleSubmit}>
    <label htmlFor="stockName">
      Stock:
      <input type="text" id="stockName" value={value} onChange={handleChange} />
    </label>
    <button>Send</button>
  </form>
);

export default Form;
