// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit / 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 256
  },
  button: {
    margin: theme.spacing.unit / 2,
    padding: 0
  }
});

type Props = {
  handleChange: Function,
  buttonClick: Function,
  currencyList: Array<string>,
  buttonDisable: boolean,
  classes: Object,
  fieldValue: String
};

const Form = ({
  currencyList,
  handleChange,
  buttonClick,
  buttonDisable,
  classes,
  fieldValue
}: Props) => (
  <div className={classes.root}>
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="currency-auto-width">
Add Currency
      </InputLabel>
      <Select
        value={fieldValue}
        onChange={handleChange}
        input={<Input name="currency" id="currency-auto-width" />}
      >
        <MenuItem value="">
          <em>
None
          </em>
        </MenuItem>
        {currencyList.map(currency => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Button
      variant="fab"
      color="secondary"
      aria-label="add"
      disabled={buttonDisable}
      className={classes.button}
      onClick={buttonClick}
    >
      <AddIcon />
    </Button>
  </div>
);

export default withStyles(styles)(Form);
