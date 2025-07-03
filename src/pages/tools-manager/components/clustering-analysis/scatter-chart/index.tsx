
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ScatterData {
  x: number;
  y: number;
  color: string;
}

interface ScatterChartProps {
  width?: number;
  height?: number;
  data: ScatterData[];
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  width = 800,
  height = 500,
  data
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 设置比例尺
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x) || 4])
      .range([50, width - 50]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) || 4])
      .range([height - 50, 50]);

    // 绘制坐标轴
    svg.append("g")
      .attr("transform", `translate(0, ${height - 50})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", "translate(50, 0)")
      .call(d3.axisLeft(yScale));

    // 绘制散点
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 8)
      .attr("fill", d => d.color)
      .attr("stroke", "#333")
      .attr("stroke-width", 1);

  }, [data, width, height]);

  return (
    <svg 
      ref={svgRef}
      width={width}
      height={height}
      className="scatter-chart"
    />
  );
};

// 示例数据
export const sampleData: ScatterData[] = [
  { x: 0.5, y: 1.0, color: "#ff7f0e" },
  { x: 1.0, y: 1.5, color: "#1f77b4" },
  { x: 1.5, y: 2.0, color: "#2ca02c" },
  { x: 2.0, y: 2.5, color: "#d62728" },
  { x: 2.5, y: 3.0, color: "#9467bd" },
  { x: 3.0, y: 3.5, color: "#8c564b" },
  { x: 0.8, y: 3.2, color: "#e377c2" },
  { x: 1.2, y: 2.8, color: "#7f7f7f" },
  { x: 2.3, y: 1.7, color: "#bcbd22" },
  { x: 1.7, y: 1.2, color: "#17becf" }
];

export default ScatterChart;
