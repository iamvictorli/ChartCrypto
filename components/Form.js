/* @flow */

import React from 'react';

type Props = {
  handleChange: Function,
  handleSubmit: Function,
  value: string
};

const Form = ({ handleChange, handleSubmit, value }: Props) => (
  <form onSubmit={handleSubmit}>
    <label htmlFor="stockName">
      Stock:
      <input type="text" id="stockName" value={value} onChange={handleChange} />
    </label>
    <button>Send</button>
  </form>
);

export default Form;
