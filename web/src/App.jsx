import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'; 
import './App.css';
import { BarChart, LineChart } from './Chart';

const App = () => {
  const [data, setData] = useState({
    date: [],
    frequency: [],
    max_frequency: 0,
  });

  useEffect(() => {
    async function fetch_data() {
      const rsp = await fetch('http://localhost:8000/sales-data')
      const json = await rsp.json();
      return json;
    }
    fetch_data().then(json => {
      const frequency = {};
      const date_for_timestamp = {};
      const len = json.date.length;
      let max_frequency = 0;
      for (var idx = 0; idx < len; ++idx) {
        let date = json.date[idx];
        let [dt, mth, yr] = date.split('/');
        let timestamp = Date.parse([mth, dt, yr].join('/'));
        frequency[timestamp] = frequency[timestamp] + 1 || 0
        if (frequency[timestamp] > max_frequency) {
          max_frequency = frequency[timestamp];
        }

        date_for_timestamp[timestamp] = date;
      }
      const sorted_timestamp = Object.keys(date_for_timestamp).sort();
      const sorted_dates = sorted_timestamp.map(x => date_for_timestamp[x]);
      const sorted_len = sorted_dates.length;
      const sorted_frequency = new Array(sorted_len);
      for (var idx = 0; idx < sorted_len; ++idx) {
        sorted_frequency[idx] = frequency[sorted_timestamp[idx]];
      }

      setData({
        frequency: sorted_frequency,
        max_frequency,
        date: sorted_dates,
      });
    });

  }, []);

  return (
    <div className="content">
      <h1>Chart</h1>
      <LineChart xData={data.date} yData={data.frequency} yMax={data.max_frequency} />
    </div>
  );
};

export default App;
