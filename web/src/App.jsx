import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'; 
import './App.css';
import { BarChart, LineChart } from './Chart';

const App = () => {
  const [state_data, set_state_data] = useState({
    date: [],
    frequency: [],
    max_frequency: 0,
  });

  const [state_chart_type, set_state_chart_type] = useState("bar");
  const [state_selected_region, set_state_selected_region] = useState("all");

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
      console.log('json', json);
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

      set_state_data({
        frequency: sorted_frequency,
        max_frequency,
        date: sorted_dates,
      });
    });

  }, []);

  function handle_select_chart(el) {
    set_state_chart_type(el.target.value);
  }

  function handle_select_region(el) {
    set_state_selected_region(el.target.value);
  }

  function select_chart_component(chart_type, data) {
    switch (chart_type) {
      case 'line':
        return <LineChart xData={data.date}
                          yData={data.frequency}
                          yMax={data.max_frequency} />;
      case 'bar':
      default:
        return <BarChart xData={data.date}
                         yData={data.frequency}
                         yMax={data.max_frequency} />;
    }
  }

  return (
    <>
      <div className="controls">
        <select value={state_chart_type} onChange={handle_select_chart}>
          <option value="bar">Bar chart</option>
          <option value="line">Line chart</option>
        </select>
        <select value={state_selected_region} onChange={handle_select_region}>
          <option value="all">All regions</option>
          {}
        </select>
      </div>
      <div className="content">
        <h1>Chart</h1>
        {select_chart_component(state_chart_type, state_data)}
      </div>
    </>
  );
};

export default App;
