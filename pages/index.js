// @flow

import * as React from 'react';
import fetch from 'isomorphic-fetch';
import randomColor from 'randomcolor';
import { withStyles } from '@material-ui/core/styles';

import withRoot from '../helper/withRoot';
import Form from '../components/Form';
import Header from '../components/Header';
import Graph from '../components/Graph';
import List from '../components/List';

type Props = {
  socket: Socket,
  classes: Object
};

type State = {
  fieldValue: string,
  currencyList: Array<string>,
  userList: Array<Currency>,
  subscribe: boolean,
  subscribed: boolean
};

const styles = () => ({
  root: {
    textAlign: 'center'
  }
});

class Homepage extends React.Component<Props, State> {
  state = {
    fieldValue: '',
    subscribe: false,
    subscribed: false,
    currencyList: [],
    userList: []
  };

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  // close socket connection
  componentWillUnmount() {
    const { socket } = this.props;
    socket.off('Add UserList', this.handleStocks);
    socket.off('Delete UserList', this.handleStocks);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.socket && !state.subscribe) {
      return {
        subscribe: true,
        currencyList: props.currencyList.sort(),
        userList: props.userList
      };
    }
    return null;
  }

  static async getInitialProps() {
    const port = process.env.PORT || 3000;
    const response = await fetch(`http://localhost:${port}/currencies`);
    const { currencyList, userList } = await response.json();
    return {
      currencyList,
      userList
    };
  }

  subscribe = () => {
    const { subscribe, subscribed } = this.state;
    const { socket } = this.props;
    if (subscribe && !subscribed) {
      // connect to WS server and listen event
      socket.on('Add UserList', this.handleStocks);
      socket.on('Delete UserList', this.handleStocks);
    }
  }

  // handle the change in the input field
  handleChange = (event: SyntheticMouseEvent<*>) => {
    const inputValue = event.target.value;
    this.setState({
      fieldValue: inputValue
    });
  };

  // on click button
  buttonClick = () => {
    // if the existed field does not exist in user list, then add to user list
    const { fieldValue } = this.state;
    const { socket } = this.props;
    if (!this.searchUserList(fieldValue)) {
      // send to server to broadcast to other clients to add to userList
      socket.emit('Add UserList', fieldValue);
    }
  };

  searchCurrencyList = (value: string): boolean => {
    const { currencyList } = this.state;
    return currencyList.some(currency => currency === value);
  }

  searchUserList = (value: string): boolean => {
    // value is a string when initial state or when Select is None
    // need to be true to disable button
    if (value === '') return true;

    const { userList } = this.state;
    return userList.some(userCurrency => userCurrency.title === value);
  }

  deleteStock = (currencyName: string) => {
    const { socket } = this.props;
    if (this.searchUserList(currencyName)) socket.emit('Delete UserList', currencyName);
  };

  // changes the userList for each broadcast
  handleStocks = (newUserList: Array<Currency>) => {
    this.setState({ userList: newUserList });
  };

  render() {
    const { classes } = this.props;
    const { fieldValue, userList, currencyList } = this.state;
    const colors = randomColor({ count: userList.length });
    const buttonDisable = this.searchUserList(fieldValue);

    return (
      <div className={classes.root}>
        <Header name="Chart CryptoCurrencies" />
        <Form
          handleChange={this.handleChange}
          buttonClick={this.buttonClick}
          fieldValue={fieldValue}
          currencyList={currencyList}
          buttonDisable={buttonDisable}
        />
        <List userList={userList} deleteStock={this.deleteStock} colors={colors} />
        <Graph userList={userList} colors={colors} />
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(Homepage));
