import React from 'react';

const List = ({ stocks }) => <ul>{stocks.map(stock => <li key={stock.id}>{stock.value}</li>)}</ul>;

export default List;
