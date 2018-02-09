// @flow

import * as React from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';

import Header from '../components/Header';
import Form from '../components/Form';
import Graph from '../components/Graph';
import List from '../components/List';

import type { Stock } from '../utils/custom-types';

type Props = {
  stocks: Array<Stock>
};

type State = {
  field: string,
  stocks: Array<Stock>
};

class HomePage extends React.Component<Props, State> {
  static async getInitialProps() {
    const port = process.env.PORT || 3000;
    const response = await fetch(`http://localhost:${port}/stocks`);
    const stocks = await response.json();
    return {
      stocks
    };
  }

  static defaultProps = {
    stocks: []
  };

  state = {
    field: '',
    stocks: this.props.stocks
  };

  componentDidMount() {
    this.socket = io();
    this.socket.on('Add Stock', this.handleStocks);
    this.socket.on('Delete Stock', this.remove);
  }

  componentWillUnmount() {
    // close socket
    this.socket.off('Add Stock', this.handleStocks);
    this.socket.off('Delete Stock', this.remove);
    this.socket.close();
  }

  // when received a broadcast combining state of stocks
  handleStocks = (receivedStock: Stock) => {
    this.setState(state => ({ stocks: state.stocks.concat(receivedStock) }));
  };

  // handle the change in the input field
  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ field: event.currentTarget.value });
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
    this.setState(state => ({
      field: '',
      stocks: state.stocks.concat(newStock)
    }));
  };

  deleteStock = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const stockID = parseInt(event.currentTarget.value, 10);
    this.socket.emit('Delete Stock', stockID);
    this.remove(stockID);
  };

  // when received a broadcast of a stockID to remove
  remove = (stockID: number) => {
    const updatedStocks = this.state.stocks.filter(stock => stock.id !== stockID);
    this.setState({ stocks: updatedStocks });
  };

  render() {
    return (
      <div>
        <Header name="StockLi" />
        <Form
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          value={this.state.field}
        />
        <List stocks={this.state.stocks} deleteStock={this.deleteStock} />
        <Graph />
      </div>
    );
  }
}

export default HomePage;
