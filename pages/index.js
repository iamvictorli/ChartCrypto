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
  currencyList: Array<Currency>,
  userList: Array<Currency>
};

type State = {
  field: string,
  currencyList: Array<Currency>,
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
    // $FlowFixMe
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
    const disable = !this.searchCurrency(inputValue, this.state.currencyList, true);
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
    if (!this.searchCurrency(currencyField, this.state.userList, true)) {
      const newCurrency = {
        code: currencyField.split(': ')[0],
        name: currencyField.split(': ')[1]
      };

      // send to server to broadcast to other clients to add to userList
      this.socket.emit('Add UserList', newCurrency);
    }

    this.setState({
      field: '',
      buttonDisable: true
    });
  };

  // see if value is in the list.
  // Full Format true compares the code and name. false, does not
  searchCurrency = (value: string, list: Array<Currency>, fullFormat: boolean): boolean => {
    for (let i = 0; i < list.length; i += 1) {
      const formattedString = fullFormat ? `${list[i].code}: ${list[i].name}` : list[i].code;
      if (formattedString === value) return true;
    }
    return false;
  };

  deleteStock = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const currencyCode = event.currentTarget.value;
    if (!this.searchCurrency(currencyCode, this.state.userList, false)) return;
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
        <Graph />
      </div>
    );
  }
}

export default HomePage;
