import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; 
import { useD3 } from './hooks';
import D3Element from './d3element';

const theme = {
    fill: 'teal',
    anim_rate: 1000,
};

export const BarChart = ({xData, yData, yMax}) => {
  const ref = useD3(svg => {
    const datalen = xData.length;

    svg.attr('width', '100vw')
      .attr('height', '600px')
      .attr('viewBox', `0, 0, ${datalen}, ${yMax}`)
      .attr('preserveAspectRatio', 'none')

    const update = svg.selectAll('rect').data(yData);

    const enter = update.enter()
      .append('rect')
      .attr('x', (val, idx) => idx)
      .attr('y', (val) => yMax - val)
      .attr('width', 1)
      .attr('height', (val) => val)
      .attr('fill', theme.fill)

    update.merge(enter).transition().duration(theme.anim_rate)
      .attr('x', (val, idx) => idx)
      .attr('y', (val) => yMax - val)
      .attr('width', 1)
      .attr('height', (val) => val)

    update.exit().transition().duration(theme.anim_rate)
      .attr('y', yMax)
      .attr('height', 0)
  });

  return <D3Element ref={ref} />
}

export const LineChart = ({xData, yData, yMax}) => {
  const ref = useD3(svg => {
    const datalen = xData.length;
    const line = d3.line().x((val, idx) => idx).y((val) => yMax - val)
    svg.attr('width', '100vw')
      .attr('height', '600px')
      .attr('viewBox', `0, 0, ${datalen}, ${yMax}`)
      .attr('preserveAspectRatio', 'none')
    svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', theme.fill)
      .attr('stroke-width', 0.2)
      .attr('d', line(yData))
  }, []);

  useEffect(() => {
    const line = d3.line().x((val, idx) => idx).y((val) => yMax - val)
    d3.select(ref.current).selectAll('path')
      .transition().duration(theme.anim_rate)
      .attr('d', line(yData))
  })

  return <D3Element ref={ref} />
}
