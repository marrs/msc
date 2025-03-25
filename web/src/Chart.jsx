import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; 
import D3Element from './d3element';

export const BarChart = ({xData, yData, yMax}) => {
    const ref = useRef();
    const datalen = xData.length;
    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr('width', '100vw')
            .attr('height', '600px')
            .attr('viewBox', `0, 0, ${datalen}, ${yMax}`)
            .attr('preserveAspectRatio', 'none')
        svg.selectAll('rect')
            .data(yData)
            .enter()
            .append('rect')
            .attr('x', (val, idx) => idx)
            .attr('y', (val) => yMax - val)
            .attr('width', 1) .attr('height', (val) => val) .attr('fill', 'teal');
    });

    return <D3Element ref={ref} />
}
