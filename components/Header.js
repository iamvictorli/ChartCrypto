// @flow

import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import GithubIcon from './GithubIcon';

type Props = {
  name: string
};

const Header = ({ name }: Props) => (
  <AppBar
    title={name}
    titleStyle={{ textAlign: 'center' }}
    style={{ position: 'fixed', top: 0 }}
    showMenuIconButton={false}
    iconElementRight={
      <IconButton tooltip="Github" href="https://github.com/Li-Victor/CryptoChart">
        <GithubIcon />
      </IconButton>
    }
  />
);

export default Header;
