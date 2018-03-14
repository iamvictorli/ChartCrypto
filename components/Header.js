// @flow

import * as React from 'react';
import AppBar from 'material-ui/AppBar';

type Props = {
  name: string
};

const Header = ({ name }: Props) => (
  <AppBar
    title={name}
    titleStyle={{ textAlign: 'center' }}
    style={{ position: 'fixed', top: 0 }}
    showMenuIconButton={false}
  />
);

export default Header;
