import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; 
import D3Element from './d3element';

const Chart = ({xData, yData}) => {
    console.log('xdata', xData);
    console.log('ydata', yData);
    const ref = useRef();
    useEffect(() => {
        const svg = d3.select(ref.current) .attr('width', 500) .attr('height', 100);
        svg.selectAll('rect')
            .data(yData)
            .enter()
            .append('rect')
            .attr('x', (val, idx) => idx * 70)
            .attr('y', (val) => 100 - val * 10)
            .attr('width', 65) .attr('height', (val) => val * 10) .attr('fill', 'teal');
    });

    return <D3Element ref={ref} />
}

export default Chart; 
