import React from 'react';
import PropTypes from 'prop-types';

const StockList = ({ stocksPicked }) => {
  const allStocks = stocksPicked.map((stock, index) => <p key={index}>{stock}</p>);
  return <div>{allStocks}</div>;
};

StockList.propTypes = {
  stocksPicked: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default StockList;
