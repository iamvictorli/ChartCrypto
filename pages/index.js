// @flow

import * as React from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';

import type { Socket } from 'socket.io-client';
import type { Currency } from '../utils/custom-types';

import Header from '../components/Header';
import Form from '../components/Form';
import Graph from '../components/Graph';
import List from '../components/List';

type Props = {
  currencyList: Array<string>,
  userList: Array<Currency>
};

type State = {
  field: string,
  currencyList: Array<string>,
  userList: Array<Currency>,
  buttonDisable: boolean
};

class HomePage extends React.Component<Props, State> {
  static async getInitialProps() {
    const port = process.env.PORT || 3000;
    const response = await fetch(`http://localhost:${port}/currencies`);
    const { currencyList, userList } = await response.json();
    return {
      currencyList,
      userList
    };
  }

  static defaultProps = {
    currencyList: [],
    userList: []
  };

  state = {
    field: '',
    currencyList: this.props.currencyList,
    userList: this.props.userList,
    buttonDisable: true
  };

  componentDidMount() {
    this.socket = io();
    this.socket.on('Add UserList', this.handleStocks);
    this.socket.on('Delete UserList', this.handleStocks);
  }

  componentWillUnmount() {
    // close socket
    this.socket.off('Add UserList', this.handleStocks);
    this.socket.off('Delete UserList', this.handleStocks);
    this.socket.close();
  }

  socket: Socket;

  // changes the stock array for each broadcast
  handleStocks = (userList: Array<Currency>) => {
    this.setState({ userList });
  };

  // handle the change in the input field
  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    // return false to enable button
    const disable = !this.searchCurrencyList(inputValue, this.state.currencyList);
    this.setState({
      field: inputValue,
      buttonDisable: disable
    });
  };

  // submitting form event
  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if the existed field does not exist in user list, then add to user list
    const currencyField = this.state.field;
    if (!this.searchUserList(currencyField, this.state.userList)) {
      // send to server to broadcast to other clients to add to userList
      this.socket.emit('Add UserList', currencyField);
    }

    this.setState({
      field: '',
      buttonDisable: true
    });
  };

  searchCurrencyList = (value: string, currencyList: Array<string>): boolean =>
    currencyList.some(currency => currency === value);

  searchUserList = (value: string, userList: Array<Currency>): boolean =>
    userList.some(userCurrency => userCurrency.title === value);

  deleteStock = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const currencyCode = event.currentTarget.value;
    if (!this.searchUserList(currencyCode, this.state.userList)) return;
    this.socket.emit('Delete UserList', currencyCode);
  };

  render() {
    return (
      <div>
        <Header name="CryptoCurrency Chart" />
        <Form
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          value={this.state.field}
          currencyList={this.state.currencyList}
          buttonDisable={this.state.buttonDisable}
        />
        <List userList={this.state.userList} deleteStock={this.deleteStock} />
        <Graph userList={this.state.userList} />
      </div>
    );
  }
}

export default HomePage;
