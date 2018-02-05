// @flow

import * as React from 'react';

type Props = {
  name: string
};

const Header = ({ name }: Props) => <h1>{name}</h1>;

export default Header;
