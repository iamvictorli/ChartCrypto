// @flow

import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

type Props = {
  handleChange: Function,
  buttonClick: Function,
  fieldValue: string,
  currencyList: Array<string>,
  buttonDisable: boolean
};

const Form = ({ currencyList, handleChange, buttonClick, fieldValue, buttonDisable }: Props) => (
  <div style={{ marginTop: '80px', marginLeft: '32px', display: 'flex' }}>
    <SelectField
      id="currencyList"
      name="currencyList"
      maxHeight={300}
      onChange={handleChange}
      value={fieldValue}
    >
      {currencyList.map(currency => (
        <MenuItem key={currency} value={currency} primaryText={currency} />
      ))}
    </SelectField>

    <FlatButton
      label="Add"
      hoverColor={buttonDisable ? '#E5E5E5' : '#FD8FB4'}
      backgroundColor={buttonDisable ? '#E5E5E5' : '#FC4482'}
      secondary
      style={buttonDisable ? { color: '#A0A0A0' } : { color: 'white' }}
      disabled={buttonDisable}
      onClick={buttonClick}
    />
  </div>
);

export default Form;
