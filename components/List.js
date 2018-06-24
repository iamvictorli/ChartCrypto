// @flow

import * as React from 'react';
import isEqual from 'lodash.isequal';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2
  },
  chip: {
    margin: theme.spacing.unit / 2
  }
});

type Props = {
  userList: Array<Currency>,
  deleteStock: Function,
  colors: Array<string>,
  classes: Object
};

class List extends React.Component<Props> {
  shouldComponentUpdate(nextProps: { userList: Array<Currency> }) {
    const { userList } = this.props;
    return !isEqual(userList, nextProps.userList);
  }

  render() {
    const {
      classes, userList, colors, deleteStock
    } = this.props;

    if (userList.length === 0) return null;
    return (
      <Paper className={classes.root}>
        {userList.map((currency, index) => (
          <Chip
            key={currency.title}
            label={currency.title}
            onDelete={() => deleteStock(currency.title)}
            className={classes.chip}
            style={{
              backgroundColor: colors[index]
            }}
          />
        ))}
      </Paper>
    );
  }
}

export default withStyles(styles)(List);
