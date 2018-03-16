// @flow

import * as React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Brush,
  AreaChart,
  Area
  // $FlowFixMe
} from 'recharts';
import isEqual from 'lodash.isequal';
import toPairs from 'lodash.topairs';
import get from 'lodash.get';
import moment from 'moment';

type Props = {
  userList: Array<Currency>,
  colors: Array<string>
};

class Graph extends React.Component<Props> {
  shouldComponentUpdate(nextProps: { userList: Array<Currency> }) {
    return !isEqual(this.props.userList, nextProps.userList);
  }

  render() {
    // Nothing on the list
    if (this.props.userList.length === 0) {
      return (
        <h1 style={{ marginLeft: '24px' }}>
          Add a CryptoCurrency from the list and see an awesome graph!
        </h1>
      );
    }

    // have to aggregate data in the form of {date: date, c1: c1price, c2: c2price}
    let data = {};
    const cNamelist = [];
    this.props.userList.forEach(cEntry => {
      const cData: CurrencyJsonMetaData = JSON.parse(cEntry.metaData);
      const cName = cData['Meta Data']['2. Digital Currency Code'];
      cNamelist.push(cName);
      toPairs(cData['Time Series (Digital Currency Daily)']).forEach(entry => {
        const date = new Date(entry[0]).valueOf();
        const price = Number(get(entry[1], '1a. open (USD)'));

        if (Object.prototype.hasOwnProperty.call(data, date)) {
          const cObj = get(data, date.toString());
          cObj[cName] = price;
        } else {
          data[date] = { [cName]: price };
        }
      });
    });

    data = Object.entries(data)
      .map(dateInfo => ({
        date: Number(dateInfo[0]),
        ...dateInfo[1]
      }))
      .reverse();

    return (
      <div className="line-charts" style={{ marginLeft: '24px' }}>
        <div className="line-chart-wrapper">
          <LineChart
            width={800}
            height={500}
            data={data}
            margin={{
              top: 40,
              right: 40,
              bottom: 20,
              left: 40
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              type="number"
              dataKey="date"
              domain={['dataMin', 'dataMax']}
              tickFormatter={date => moment(date).format('MM[/]DD[/]YY')}
              interval={0}
              tickCount={8}
            />
            <YAxis
              domain={['auto', 'auto']}
              label={{
                value: 'USD',
                angle: 0,
                position: 'left'
              }}
            />
            <Tooltip labelFormatter={date => moment(date).format('MM[/]DD[/]YY')} />
            <Legend />
            {cNamelist.map((cCode, index) => (
              <Line
                key={cCode}
                dataKey={cCode}
                type="monotone"
                dot={false}
                connectNulls
                stroke={this.props.colors[index]}
              />
            ))}
            <Brush
              dataKey="date"
              startIndex={data.length - 90}
              tickFormatter={date => moment(date).format('MM[/]DD[/]YY')}
            >
              <AreaChart>
                {cNamelist.map((cCode, index) => (
                  <Area
                    key={cCode}
                    dataKey={cCode}
                    stroke={this.props.colors[index]}
                    fill={this.props.colors[index]}
                    dot={false}
                  />
                ))}
              </AreaChart>
            </Brush>
          </LineChart>
        </div>
      </div>
    );
  }
}

export default Graph;
