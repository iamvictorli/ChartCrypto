// @flow

import * as React from 'react';
import type { Currency } from '../utils/custom-types';
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
} from 'recharts';
import randomColor from 'randomcolor';

type Props = {
  userList: Array<Currency>
};

const Graph = ({ userList }: Props) => {
  const list = userList.map(currency => JSON.parse(currency.metaData));

  let data = {};
  list.forEach(currency => {
    const currencyName = currency['Meta Data']['2. Digital Currency Code'];
    Object.entries(currency['Time Series (Digital Currency Daily)']).forEach(entry => {
      const date = entry[0];
      const price = Number(entry[1]['1a. open (USD)']);
      if (Object.prototype.hasOwnProperty.call(data, date)) {
        data[date].push({ [currencyName]: price });
      } else {
        data[date] = [{ [currencyName]: price }];
      }
    });
  });

  data = Object.entries(data)
    .map(entry => {
      const obj = {
        date: entry[0]
      };
      entry[1].forEach(currency => {
        Object.entries(currency).forEach(entry => {
          obj[entry[0]] = entry[1];
        });
      });
      return obj;
    })
    .reverse();

  const colors = randomColor({ count: list.length });

  return (
    <div className="line-charts">
      <p>LineChart with panoramic brush</p>
      <div className="line-chart-wrapper">
        <LineChart
          width={1000}
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
          <XAxis dataKey="date" />
          <YAxis
            domain={['auto', 'auto']}
            label={{
              value: 'USD',
              angle: 0,
              position: 'left'
            }}
          />
          <Tooltip />
          <Legend />
          {list.map((currency, index) => (
            <Line
              key={currency['Meta Data']['2. Digital Currency Code']}
              dataKey={currency['Meta Data']['2. Digital Currency Code']}
              type="monotone"
              dot={false}
              stroke={colors[index]}
            />
          ))}
          <Brush dataKey="date" startIndex={data.length - 40}>
            <AreaChart>
              <CartesianGrid />
              <YAxis hide domain={['auto', 'auto']} />
              {list.map((currency, index) => (
                <Area
                  key={currency['Meta Data']['2. Digital Currency Code']}
                  dataKey={currency['Meta Data']['2. Digital Currency Code']}
                  stroke={colors[index]}
                  fill={colors[index]}
                  dot={false}
                />
              ))}
            </AreaChart>
          </Brush>
        </LineChart>
      </div>
    </div>
  );
};

export default Graph;
