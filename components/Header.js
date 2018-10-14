// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Github from '@material-ui/docs/svgIcons/GitHub';

type Props = {
  name: string,
  classes: Object
};

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1,
    textAlign: 'center'
  }
};

const Header = ({ name, classes }: Props) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="headline" color="inherit" className={classes.flex}>
          {name}
        </Typography>
        <Tooltip id="appbar-github" title="GitHub" enterDelay={100}>
          <IconButton
            component="a"
            color="inherit"
            href="https://github.com/Li-Victor/CryptoChart"
            aria-labelledby="appbar-github"
          >
            <Github />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  </div>
);

export default withStyles(styles)(Header);
