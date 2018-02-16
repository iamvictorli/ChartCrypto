// @flow

import * as React from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';

import Header from '../components/Header';
import Form from '../components/Form';
import Graph from '../components/Graph';
import List from '../components/List';

import type { Currency } from '../utils/custom-types';

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
    this.socket.on('Delete Stock', this.handleStocks);
  }

  componentWillUnmount() {
    // close socket
    this.socket.off('Add UserList', this.handleStocks);
    this.socket.off('Delete Stock', this.handleStocks);
    this.socket.close();
  }

  // changes the stock array for each broadcast
  handleStocks = (userList: Array<Currency>) => {
    this.setState({ userList });
  };

  // handle the change in the input field
  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    // return false to enable button
    const disable = !this.searchCurrency(inputValue, this.state.currencyList);
    this.setState({
      field: inputValue,
      buttonDisable: disable
    });
  };

  // submitting form event
  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    // save currency field
    const currencyField = this.state.field;
    this.setState({
      field: ''
    });
    if (this.searchCurrency(currencyField, this.state.userList)) return;

    const newCurrency = {
      code: currencyField.split(': ')[0],
      name: currencyField.split(': ')[1]
    };

    // send to server to broadcast to other clients to add stock
    this.socket.emit('Add UserList', newCurrency);
  };

  // see if inputValue has the correct values of one of the lists
  searchCurrency = (inputValue: string, list: Array<Currency>): boolean => {
    for (let i = 0; i < list.length; i += 1) {
      const formattedString = `${list[i].code}: ${list[i].name}`;
      if (formattedString === inputValue) return true;
    }
    return false;
  };

  deleteStock = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const stockID = parseInt(event.currentTarget.value, 10);
    this.socket.emit('Delete Stock', stockID);
  };

  render() {
    return (
      <div>
        <Header name="StockLi" />
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
