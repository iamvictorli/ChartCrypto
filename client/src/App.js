import React from 'react';
import PropTypes from 'prop-types';

import Graph from './components/Graph';
import AddStockForm from './components/AddStockForm';
import StockList from './components/StockList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StockFormValue: '',
      // stocksPicked is the array of stocknames that are picked
      stocksPicked: []
    };

    // set socket info
    const { socket } = this.props;

    socket.on('Show Stock', (stocks) => {
      this.setState({ stocksPicked: stocks });
    });

    socket.on('Add Stock', (stocks) => {
      this.setState({ stocksPicked: stocks, StockFormValue: '' });
    });
  }

  // handleChange and handleSubmit for AddStockForm
  handleChange = (event) => {
    this.setState({ StockFormValue: event.target.value });
  };

  handleSubmit = (event) => {
    const { StockFormValue } = this.state;
    const { socket } = this.props;
    socket.emit('Add Stock', StockFormValue);
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <h1>StockLi</h1>
        <AddStockForm
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          value={this.state.StockFormValue}
        />
        <StockList stocksPicked={this.state.stocksPicked} />
        <Graph />
      </div>
    );
  }
}

App.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func.isRequired
  }).isRequired
};

export default App;
