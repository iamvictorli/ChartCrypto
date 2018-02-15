// @flow

import * as React from 'react';
import type { Currency } from '../utils/custom-types';

type Props = {
  currencies: Array<Currency>,
  deleteStock: Function
};

const List = ({ currencies, deleteStock }: Props) => (
  <ul>
    {currencies.map(stock => (
      <div key={stock.code}>
        <li>
          {stock.code}: {stock.name}
        </li>
        <button onClick={deleteStock} value={stock.code}>
          Delete
        </button>
      </div>
    ))}
  </ul>
);

export default List;
