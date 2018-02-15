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
    this.socket.on('Add Stock', this.handleStocks);
    this.socket.on('Delete Stock', this.handleStocks);
  }

  componentWillUnmount() {
    // close socket
    this.socket.off('Add Stock', this.handleStocks);
    this.socket.off('Delete Stock', this.handleStocks);
    this.socket.close();
  }

  // changes the stock array for each broadcast
  handleStocks = (receivedStock: Array<Currency>) => {
    this.setState({ currencies: receivedStock });
  };

  // handle the change in the input field
  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    // return false to enable button
    const disable = !this.searchCurrency(inputValue);
    this.setState({
      field: inputValue,
      buttonDisable: disable
    });
  };

  // submitting form event
  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newStock = {
      id: new Date().getTime(),
      value: this.state.field
    };

    // send to server to broadcast to other clients to add stock
    this.socket.emit('Add Stock', newStock);
    this.setState({
      field: ''
    });
  };

  // see if inputValue has the correct values of one of the currencies
  searchCurrency = (inputValue: String): boolean => {
    const { currencyList } = this.state;

    for (let i = 0; i < currencyList.length; i += 1) {
      const string = `${currencyList[i].code}: ${currencyList[i].name}`;
      if (string === inputValue) return true;
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
