import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'; 
import './App.css';
import Chart from './Chart';

const App = () => {
  const [data, setData] = useState({
    date: [],
    frequency: [],
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
      for (var idx = 0; idx < len; ++idx) {
        let date = json.date[idx];
        let [dt, mth, yr] = date.split('/');
        let timestamp = Date.parse([mth, dt, yr].join('/'));
        frequency[timestamp] = frequency[timestamp] + 1 || 0

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
        date: sorted_dates,
      });
    });

  }, []);

  return (
    <div className="content">
      <h1>Chart</h1>
      <Chart xData={data.date} yData={data.frequency} />
    </div>
  );
};

export default App;
