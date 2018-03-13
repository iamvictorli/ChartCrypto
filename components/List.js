// @flow

import * as React from 'react';
import type { Currency } from '../utils/custom-types';

type Props = {
  userList: Array<Currency>,
  deleteStock: Function
};

const List = ({ userList, deleteStock }: Props) => (
  <ul>
    {userList.map(currency => (
      <div key={currency.title}>
        <li>{currency.title}</li>
        <button onClick={deleteStock} value={currency.title}>
          Delete
        </button>
      </div>
    ))}
  </ul>
);

export default List;
