import React from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';

import Header from '../components/Header';
import Form from '../components/Form';
import Graph from '../components/Graph';
import List from '../components/List';

class HomePage extends React.Component {
  static async getInitialProps() {
    const response = await fetch(`http://localhost:${process.env.PORT}/stocks`);
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
  }

  componentWillUnmount() {
    // close socket
    this.socket.off('Add Stock', this.handleStocks);
    this.socket.close();
  }

  // when received a broadcast combining state of stocks
  handleStocks = receivedStock => {
    this.setState(state => ({ stocks: state.stocks.concat(receivedStock) }));
  };

  // handle the change in the input field
  handleChange = event => {
    this.setState({ field: event.target.value });
  };

  // submitting form event
  handleSubmit = event => {
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

  render() {
    return (
      <div>
        <Header name="StockLi" />
        <Form
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          value={this.state.field}
        />
        <List stocks={this.state.stocks} />
        <Graph />
      </div>
    );
  }
}

export default HomePage;
