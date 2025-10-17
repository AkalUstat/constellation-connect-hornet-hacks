// app/components/LineChart.client.tsx
// @ts-nocheck
import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

const staticData = [
  { date: new Date("2025-01-01"), value: 10 },
  { date: new Date("2025-01-02"), value: 25 },
  { date: new Date("2025-01-03"), value: 30 },
  { date: new Date("2025-01-04"), value: 40 },
  { date: new Date("2025-01-05"), value: 25 },
  { date: new Date("2025-01-06"), value: 60 },
];

export default function LineChart() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 500;
    const height = 300;
    const margin = { top: 12, right: 16, bottom: 28, left: 40 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().domain(d3.extent(staticData, d => d.date) as [Date, Date]).range([0, chartW]);
    const y = d3.scaleLinear().domain([0, d3.max(staticData, d => d.value) as number]).nice().range([chartH, 0]);

    const line = d3.line<{date: Date; value: number}>()
      .x(d => x(d.date)!)
      .y(d => y(d.value)!);

    g.append("path")
      .datum(staticData)
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .attr("d", line as any);

    g.append("g").attr("transform", `translate(0,${chartH})`).call(d3.axisBottom(x).ticks(6));
    g.append("g").call(d3.axisLeft(y).ticks(5));
  }, []);

  return <svg ref={svgRef} className="w-full h-auto text-blue-600" />;
}
