import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; 
import { useD3 } from './hooks';
import D3Element from './d3element';

const theme = {
    fill: 'teal',
    anim_rate: 1000,
};

function init_svg(svg, { width, height }) {
  svg
    .attr('width', width)
    .attr('height', height)
  return svg;
}

export const BarChart = (props) => {
  const ref = useD3(svg => {

    const { yMax, xData, yData } = props;
    const width = 1000;
    const height = 800;
    const margin = 20;

    svg = init_svg(svg, {
      width: width + margin * 2,
      height: height + margin * 2
    })

    const widthUnit = (width - 2 * margin) / xData.length
    const heightUnit = (height - 2 * margin) / yMax

    function x_unit(x) {
      return x * widthUnit;
    }

    function y_unit(x) {
      return x * heightUnit;
    }

    console.log('widthUnit', widthUnit, 'heightUnit', heightUnit)

      /*
    svg.append('g')
      .selectAll('rect')
      .data(yData)
      .join(
        enter => enter
          .append('rect')
          .attr('x', (val, idx) => margin + x_unit(idx))
          .attr('y', (val) => height - margin - y_unit(val))
          .attr('width', widthUnit)
          .attr('height', (val) => y_unit(val))
          .attr('fill', theme.fill),
        update => update
          .transition(svg.transition().duration(theme.anim_rate))
          .attr('x', (val, idx) => margin + x_unit(idx))
          .attr('y', (val) => height - margin - y_unit(val))
          .attr('width', widthUnit)
          .attr('height', (val) => y_unit(val)),
        exit => exit
          .transition().duration(theme.anim_rate)
          .attr('y', y_unit(yMax))
          .attr('height', 0)
      )
      */

    const update = svg.selectAll('rect').data(yData);

    const enter = update.enter()
      .append('rect')
      .attr('x', (val, idx) => margin + x_unit(idx))
      .attr('y', (val) => height - margin - y_unit(val))
      .attr('width', widthUnit)
      .attr('height', (val) => y_unit(val))
      .attr('fill', theme.fill)

    update.merge(enter).transition().duration(theme.anim_rate)
      .attr('x', (val, idx) => margin + x_unit(idx))
      .attr('y', (val) => height - margin - y_unit(val))
      .attr('width', widthUnit)
      .attr('height', (val) => y_unit(val)),

    update.exit().transition().duration(theme.anim_rate)
      .attr('y', y_unit(yMax))
      .attr('height', 0)


    /*
    const xScale = d3.scaleLinear()
      //.domain([new Date("2023-01-01"), new Date("2024-01-01")])
      .domain([0, 20])
      .range([0, 1000])


    svg
      .append("g")
        .attr("transform", `translate(${margin}, ${height - margin})`)
        .call(d3.axisBottom(xScale).tickSizeOuter(0));
        */

  });

  return <D3Element ref={ref} />
}

export const LineChart = (props) => {
  const { yMax, xData, yData } = props;

  const ref = useD3(svg => {
    const datalen = xData.length;
    const line = d3.line().x((val, idx) => idx).y((val) => yMax - val)

    init_svg(svg, props);
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
