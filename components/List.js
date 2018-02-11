// @flow

import * as React from 'react';
import type { Stock } from '../utils/custom-types';

type Props = {
  stocks: Array<Stock>,
  deleteStock: Function
};

const List = ({ stocks, deleteStock }: Props) => (
  <ul>
    {stocks.map(stock => (
      <div key={stock.id}>
        <li>{stock.value}</li>
        <button onClick={deleteStock} value={stock.id}>
          Delete
        </button>
      </div>
    ))}
  </ul>
);

export default List;
