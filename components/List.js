// @flow

import * as React from 'react';
import Chip from 'material-ui/Chip';
import isEqual from 'lodash.isequal';

type Props = {
  userList: Array<Currency>,
  deleteStock: Function,
  colors: Array<string>
};

class List extends React.Component<Props> {
  shouldComponentUpdate(nextProps: { userList: Array<Currency> }) {
    return !isEqual(this.props.userList, nextProps.userList);
  }

  render() {
    const { userList, deleteStock, colors } = this.props;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '32px' }}>
        {userList.map((currency, index) => (
          <Chip
            key={currency.title}
            onRequestDelete={() => deleteStock(currency.title)}
            style={{ margin: 4 }}
            backgroundColor={colors[index]}
          >
            {currency.title}
          </Chip>
        ))}
      </div>
    );
  }
}

export default List;
