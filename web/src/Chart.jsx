import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; 

const Chart = () => {
    const ref = useRef();
    useEffect(() => {
        const data = [12, 5, 6, 6, 9, 10];
        const svg = d3.select(ref.current) .attr('width', 500) .attr('height', 100);
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * 70)
            .attr('y', (d) => 100 - d * 10)
            .attr('width', 65) .attr('height', (d) => d * 10) .attr('fill', 'green');
    }, []);
    return <svg ref={ref}></svg> };

export default Chart; 
