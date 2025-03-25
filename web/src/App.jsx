import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; 
import './App.css';
import D3Element from './d3element';

const App = () => {
  const ref = useRef();
  useEffect(() => {
    async function fetch_data() {
      const rsp = await fetch('http://localhost:8000/sales-data')
      const json = await rsp.json();
      return json;
    }
    fetch_data().then(json => {
      console.log('json', json);
      const data = {};
      const timestamp_for_date = {};
      const len = json.date.length;
      for (var idx = 0; idx < len; ++idx) {
        let date = json.date[idx];
        let [dt, mth, yr] = date.split('/');
        data[date] = data[date] + 1 || 0

        timestamp_for_date[date] = Date.parse([mth, dt, yr].join('/'));
      }
      console.log('data', data);
      console.log('timestamps', Object.values(timestamp_for_date).sort());
      console.log('sorted dates', Object.values(timestamp_for_date).sort().map(x => timestamp_for_date[x]))
    });

    const data = [12, 5, 6, 6, 9, 10];
    const svg = d3.select(ref.current) .attr('width', 500) .attr('height', 100);
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, idx) => idx * 30)
      .attr('y', (val) => 100 - val * 10)
      .attr('width', 25) .attr('height', (x) => x * 10) .attr('fill', 'teal');
  }, []);
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <D3Element ref={ref} />
    </div>
  );
};

export default App;
