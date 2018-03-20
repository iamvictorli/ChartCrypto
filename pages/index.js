// @flow

import * as React from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Head from 'next/head';
import randomColor from 'randomcolor';

import Header from '../components/Header';
import Form from '../components/Form';
import Graph from '../components/Graph';
import List from '../components/List';

type Props = {
  currencyList: Array<string>,
  userList: Array<Currency>,
  userAgent: string
};

type State = {
  fieldValue: string,
  currencyList: Array<string>,
  userList: Array<Currency>
};

class HomePage extends React.Component<Props, State> {
  static async getInitialProps({ req }: any) {
    const port = process.env.PORT || 3000;
    const response = await fetch(`http://localhost:${port}/currencies`);
    const { currencyList, userList } = await response.json();
    return {
      currencyList,
      userList,
      userAgent: process.browser ? navigator.userAgent : req.headers['user-agent']
    };
  }

  static defaultProps = {
    currencyList: [],
    userList: []
  };

  state = {
    fieldValue: 'BTC: Bitcoin',
    currencyList: this.props.currencyList.sort(),
    userList: this.props.userList
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
  handleChange = (event: SyntheticMouseEvent<*>, index: number, fieldValue: string) => {
    this.setState({
      fieldValue
    });
  };

  // on click button
  buttonClick = () => {
    // if the existed field does not exist in user list, then add to user list
    const currencyField = this.state.fieldValue;
    if (!this.searchUserList(currencyField)) {
      // send to server to broadcast to other clients to add to userList
      this.socket.emit('Add UserList', currencyField);
    }
  };

  searchCurrencyList = (value: string): boolean =>
    this.state.currencyList.some(currency => currency === value);

  searchUserList = (value: string): boolean =>
    this.state.userList.some(userCurrency => userCurrency.title === value);

  deleteStock = (currencyName: string) => {
    if (!this.searchUserList(currencyName)) return;
    this.socket.emit('Delete UserList', currencyName);
  };

  render() {
    const { userAgent } = this.props;
    const buttonDisable = this.searchUserList(this.state.fieldValue);
    const colors = randomColor({ count: this.state.userList.length });

    return (
      <div>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            {`body {
              margin: 0;
              font-family: Roboto, sans-serif;
            }`}
          </style>
        </Head>

        <MuiThemeProvider muiTheme={getMuiTheme({ userAgent })}>
          <div>
            <Header name="Chart CryptoCurrencies" />
            <Form
              handleChange={this.handleChange}
              buttonClick={this.buttonClick}
              fieldValue={this.state.fieldValue}
              currencyList={this.state.currencyList}
              buttonDisable={buttonDisable}
            />
            <List userList={this.state.userList} deleteStock={this.deleteStock} colors={colors} />
            <Graph userList={this.state.userList} colors={colors} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default HomePage;
