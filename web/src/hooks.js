import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const useD3 = (render, dependencies) => {
  const ref = useRef();
  useEffect(() => { render(d3.select(ref.current)); }, dependencies);
  return ref;
}
