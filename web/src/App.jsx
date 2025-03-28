import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'; 
import './App.css';
import { BarChart, LineChart } from './Chart';

const region_labels = {
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

function match(pattern, options) {
  return options[pattern] || options._;
}

function timestamp_from_date(date) {
  let [dt, mth, yr] = date.split('/');
  return Date.parse([mth, dt, yr].join('/'));
}

function init_frequency_data(rawData, region='all') {
  const frequency = {};
  let maxFrequency = 0;
  const dateForTimestamp = {};
  const len = rawData.date.length;
  for (var idx = 0; idx < len; ++idx) {
    const timestamp = timestamp_from_date(rawData.date[idx]);

    dateForTimestamp[timestamp] = rawData.date[idx];
    frequency[timestamp] = frequency[timestamp] || 0

    if (region === 'all') {
      frequency[timestamp] = frequency[timestamp] + 1;
      if (frequency[timestamp] > maxFrequency) {
        maxFrequency = frequency[timestamp];
      }
    } else if (rawData.region[idx] === region) {
      frequency[timestamp] = frequency[timestamp] + 1;
      if (frequency[timestamp] > maxFrequency) {
        maxFrequency = frequency[timestamp];
      }
    }
  }

  const sortedTimestamp = Object.keys(dateForTimestamp).sort();
  const sortedDates = sortedTimestamp.map(x => dateForTimestamp[x]);
  const sortedLen = sortedDates.length;
  const sortedFrequency = new Array(sortedLen);
  for (var idx = 0; idx < sortedLen; ++idx) {
    sortedFrequency[idx] = frequency[sortedTimestamp[idx]];
  }

  return {
    frequency: sortedFrequency,
    maxFrequency,
    date: sortedDates,
  };
}

const App = () => {
  const [stateData, set_state_data] = useState({
    byRegion: {
      all: {
        date: [],
        frequency: [],
        maxFrequency: 0,
      },
    },
  });
  const [stateRawData, set_state_raw_data] = useState();

  const [uiStateChartType, set_ui_state_chart_type] = useState("bar");
  const [uiStateRegion, set_ui_state_region] = useState("all");

  useEffect(() => {
    async function fetch_data() {
      const rsp = await fetch('http://localhost:8000/sales-data')
      const json = await rsp.json();
      return json;
    }
    fetch_data().then(json => {
      const frequency = {};
      const dateForTimestamp = {};
      json.region.forEach(region => {
        if (!region_labels[region]) {
          console.warn("Region option not defined for", region);
          region_labels[region] = region;
        }
      });
      set_state_raw_data(json);
      set_state_data({
        byRegion: {
          all: init_frequency_data(json),
        },
      });
    });

  }, []);

  function handle_select_chart(el) {
    set_ui_state_chart_type(el.target.value);
  }

  function handle_select_region(el) {
    const selected_region = el.target.value;
    if (!stateData.byRegion[selected_region]) {
      const new_data = Object.assign({}, stateData);
      new_data.byRegion[selected_region] =
        init_frequency_data(stateRawData, selected_region);
      set_state_data(new_data);
    }
    set_ui_state_region(selected_region);
  }

  const regionalData = stateData.byRegion[uiStateRegion];
  return (
    <>
      <div className="controls">
        <select value={uiStateChartType} onChange={handle_select_chart}>
          <option value="bar">Bar chart</option>
          <option value="line">Line chart</option>
        </select>
        <select value={uiStateRegion} onChange={handle_select_region}>
          {Object.keys(region_labels).map(ky => {
            return <option key={ky} value={ky}>{region_labels[ky]}</option>
          })}
        </select>
      </div>
      <div className="content">
        <h1>{region_labels[uiStateRegion]}</h1>
        {match(uiStateChartType, {
          line: <LineChart className="center"
                           xData={regionalData.date}
                           yData={regionalData.frequency}
                           yMax={stateData.byRegion.all.maxFrequency} />,
          bar: <BarChart className="center"
                         xData={regionalData.date}
                         yData={regionalData.frequency}
                         yMax={stateData.byRegion.all.maxFrequency} />,
          _: <BarChart className="center"
                         xData={regionalData.date}
                         yData={regionalData.frequency}
                         yMax={stateData.byRegion.all.maxFrequency} />,
        })}
      </div>
    </>
  );
};

export default App;
