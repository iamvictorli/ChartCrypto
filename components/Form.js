import React from 'react';
import PropTypes from 'prop-types';

const Form = ({ handleChange, handleSubmit, value }) => (
  <form onSubmit={handleSubmit}>
    <label htmlFor="stockName">
      Stock:
      <input type="text" id="stockName" value={value} onChange={handleChange} />
    </label>
    <button>Send</button>
  </form>
);

Form.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default Form;
