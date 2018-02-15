// @flow

import * as React from 'react';
import type { Currency } from '../utils/custom-types';

type Props = {
  userList: Array<Currency>,
  deleteStock: Function
};

const List = ({ userList, deleteStock }: Props) => (
  <ul>
    {userList.map(stock => (
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
