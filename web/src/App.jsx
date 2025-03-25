import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'; 
import './App.css';
import { BarChart, LineChart } from './Chart';

const region_options = {
  all: 'All regions',
  IT: 'Italy',
  FR: 'France',
  ES: 'Spain',
  UK: 'United Kingdom',
  NL: 'Netherlands',
  BE: 'Belgium',
  DE: 'Germany',
  NO: 'Norway',
  UNSURE: 'Unknown',
  SE: 'Sweden',
}

function init_state_data() {
  const data = { by_region: {}};
}

const App = () => {
  const [state_data, set_state_data] = useState({
    by_region: {
      all: {
        date: [],
        frequency: [],
        max_frequency: 0,
      },
    },
  });
  const [state_raw_data, set_state_raw_data] = useState();

  const [ui_state_chart_type, set_ui_state_chart_type] = useState("bar");
  const [ui_state_region, set_ui_state_region] = useState("all");

  function timestamp_from_date(date) {
    let [dt, mth, yr] = date.split('/');
    return Date.parse([mth, dt, yr].join('/'));
  }

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
        let timestamp = timestamp_from_date(json.date[idx]);

        if (!region_options[json.region[idx]]) {
          console.warn("Region option not defined for", json.region[idx]);
          region_options[json.region[idx]] = json.region[idx];
        }
        frequency[timestamp] = frequency[timestamp] + 1 || 0
        if (frequency[timestamp] > max_frequency) {
          max_frequency = frequency[timestamp];
        }

        date_for_timestamp[timestamp] = json.date[idx];
      }
      const sorted_timestamp = Object.keys(date_for_timestamp).sort();
      const sorted_dates = sorted_timestamp.map(x => date_for_timestamp[x]);
      const sorted_len = sorted_dates.length;
      const sorted_frequency = new Array(sorted_len);
      for (var idx = 0; idx < sorted_len; ++idx) {
        sorted_frequency[idx] = frequency[sorted_timestamp[idx]];
      }

      set_state_raw_data(json);
      set_state_data({
        by_region: {
          all: {
            frequency: sorted_frequency,
            max_frequency,
            date: sorted_dates,
          }
        },
      });
    });

  }, []);

  function init_frequency_data(raw_data, region) {
    const frequency = [];
    let max_frequency = 0;
    const date_for_timestamp = {};
    const len = raw_data.date.length;
    for (var idx = 0; idx < len; ++idx) {
      const timestamp = timestamp_from_date(raw_data.date[idx]);
      if (region && raw_data.region[idx] === region) {
        frequency[timestamp] = frequency[timestamp] + 1 || 0
        if (frequency[timestamp] > max_frequency) {
          max_frequency = frequency[timestamp];
        }
      } else {
        frequency[timestamp] = frequency[timestamp] + 1 || 0
        if (frequency[timestamp] > max_frequency) {
          max_frequency = frequency[timestamp];

          date_for_timestamp[timestamp] = raw_data.date[idx];
        }
      }
    }

    const sorted_timestamp = Object.keys(date_for_timestamp).sort();
    const sorted_dates = sorted_timestamp.map(x => date_for_timestamp[x]);
    const sorted_len = sorted_dates.length;
    const sorted_frequency = new Array(sorted_len);
    for (var idx = 0; idx < sorted_len; ++idx) {
      sorted_frequency[idx] = frequency[sorted_timestamp[idx]];
    }

    return {
      frequency,
      max_frequency,
      date: sorted_dates,
    };
  }

  function handle_select_chart(el) {
    set_ui_state_chart_type(el.target.value);
  }

  function handle_select_region(el) {
    const selected_region = el.target.value;
    if (!state_data.by_region[selected_region]) {
      const new_data = Object.assign({}, state_data);
      new_data.by_region[selected_region] =
        init_frequency_data(state_raw_data, selected_region);
      set_state_data(new_data);
    }
    set_ui_state_region(selected_region);
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
        <select value={ui_state_chart_type} onChange={handle_select_chart}>
          <option value="bar">Bar chart</option>
          <option value="line">Line chart</option>
        </select>
        <select value={ui_state_region} onChange={handle_select_region}>
          {Object.keys(region_options).map(ky => {
            return <option value={ky}>{region_options[ky]}</option>
          })}
        </select>
      </div>
      <div className="content">
        <h1>Chart</h1>
        {select_chart_component(ui_state_chart_type, state_data.by_region[ui_state_region])}
      </div>
    </>
  );
};

export default App;
