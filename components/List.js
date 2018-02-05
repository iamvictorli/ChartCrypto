// @flow

import * as React from 'react';
import type { Stock } from '../utils/custom-types';

type Props = {
  stocks: Array<Stock>
};

const List = ({ stocks }: Props) => (
  <ul>{stocks.map(stock => <li key={stock.id}>{stock.value}</li>)}</ul>
);

export default List;
