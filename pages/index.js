import React from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';

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
        <h1>StockLi</h1>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} type="text" value={this.state.field} />
          <button>Send</button>
        </form>
        <ul>{this.state.stocks.map(stock => <li key={stock.id}>{stock.value}</li>)}</ul>
      </div>
    );
  }
}

export default HomePage;
