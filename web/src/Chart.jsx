import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; 
import { useD3 } from './hooks';
import D3Element from './d3element';

const theme = {
    fill: 'teal',
    anim_rate: 1000,
};

const width = 1000;
const height = 800;
const margin = 40;

const xOffset = margin;
const yOffset = height - margin;

function offset_x(x) {
  return xOffset + x;
}

function offset_y(x) {
  return yOffset - x;
}

function Date_from_date(date) {
  let [dt, mth, yr] = date.split('/');
  return new Date(+yr, +mth, +dt);
}

function init_svg(svg, { width, height }) {
  svg
    .attr('width', width)
    .attr('height', height)
  return svg;
}

function paint_axes(svg, xData, yData, yMax) {
    if (xData.length) {
      const xScale = d3.scaleTime()
        .domain([Date_from_date(xData.at(0)), Date_from_date(xData.at(-1))])
        .range([0, width])

      svg
        .append("g")
          .attr("transform", `translate(${xOffset}, ${yOffset})`)
          .call(d3.axisBottom(xScale).ticks(
            d3.timeMonth.every(3)).tickSizeOuter(0)
          );
    }

    if (yData.length) {
      const yScale = d3.scaleLinear()
        .domain([yMax, 0])
        .range([0, yOffset])

      svg
        .append("g")
          .attr("transform", `translate(${xOffset}, ${0})`)
          .call(d3.axisLeft(yScale));
    }
}

export const BarChart = (props) => {
  const { className } = props;

  const ref = useD3(svg => {

    const { yMax, xData, yData } = props;

    function x_unit(x) {
      return x * (width - 2 * margin) / xData.length
    }

    function y_unit(x) {
      return x * (height - 2 * margin) / yMax;
    }


    svg = init_svg(svg, {
      width: width + margin * 2,
      height: height + margin * 2
    })


      /*
    svg.append('g')
      .selectAll('rect')
      .data(yData)
      .join(
        enter => enter
          .append('rect')
          .attr('x', (val, idx) => offset_x(x_unit(idx)))
          .attr('y', (val) => offset_y(y_unit(val)))
          .attr('width', widthUnit)
          .attr('height', (val) => y_unit(val))
          .attr('fill', theme.fill),
        update => update
          .transition(svg.transition().duration(theme.anim_rate))
          .attr('x', (val, idx) => offset_x(x_unit(idx)))
          .attr('y', (val) => offset_y(y_unit(val)))
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
      .attr('x', (val, idx) => offset_x(x_unit(idx)))
      .attr('y', (val) => offset_y(y_unit(val)))
      .attr('width', x_unit(1))
      .attr('height', (val) => y_unit(val))
      .attr('fill', theme.fill)

    update.merge(enter).transition().duration(theme.anim_rate)
      .attr('x', (val, idx) => offset_x(x_unit(idx)))
      .attr('y', (val) => offset_y(y_unit(val)))
      .attr('width', x_unit(1))
      .attr('height', (val) => y_unit(val)),

    update.exit().transition().duration(theme.anim_rate)
      .attr('y', y_unit(yMax))
      .attr('height', 0)

    paint_axes(svg, xData, yData, yMax);

  });

  return <D3Element ref={ref} className={className} />
}

export const LineChart = (props) => {
  const { yMax, xData, yData, className } = props;

  function x_unit(x) {
    return x * (width - 2 * margin) / xData.length
  }

  function y_unit(x) {
    return x * (height - 2 * margin) / yMax;
  }

  const ref = useD3(svg => {
    const datalen = xData.length;
    const line = d3.line()
      .x((val, idx) => offset_x(x_unit(idx)))
      .y((val) => offset_y(y_unit(val)))

    svg = init_svg(svg, {
      width: width + margin * 2,
      height: height + margin * 2
    })

    svg.append('g').append('path')
      .attr('fill', 'none')
      .attr('stroke', theme.fill)
      .attr('stroke-width', 1)
      .attr('d', line(yData))

    paint_axes(svg, xData, yData, yMax);
  }, []);

  useEffect(() => {
    const line = d3.line()
      .x((val, idx) => offset_x(x_unit(idx)))
      .y((val) => offset_y(y_unit(val)))
    d3.select(ref.current).select('path')
      .transition().duration(theme.anim_rate)
      .attr('d', line(yData))
  })

  return <D3Element ref={ref} className={className}/>
}
