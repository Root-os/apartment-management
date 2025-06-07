import React, { useEffect, useState } from "react";
import axios from "axios";
import * as d3 from "d3";

const UnitStatusReport = () => {
  const [data, setData] = useState({
    totalOccupied: 0,
    totalAvailable: 0,
    totalUnderMaintenance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}unit/status/data/report`);
        if (response.data?.unitsReport) {
          const { occupiedUnits, availableUnits, underMaintenanceUnits } =
            response.data.unitsReport;
          setData({
            totalOccupied: occupiedUnits,
            totalAvailable: availableUnits,
            totalUnderMaintenance: underMaintenanceUnits,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    d3.select("#pie-chart").selectAll("*").remove();
    d3.select("#legend").selectAll("*").remove();

    const dataset = [
      {
        label: `Occupied: ${data.totalOccupied}`,
        value: data.totalOccupied > 0 ? data.totalOccupied : 0.001,
        color: "red",
      },
      {
        label: `Available: ${data.totalAvailable}`,
        value: data.totalAvailable > 0 ? data.totalAvailable : 0.001,
        color: "green",
      },
      {
        label: `Maintenance: ${data.totalUnderMaintenance}`,
        value:
          data.totalUnderMaintenance > 0 ? data.totalUnderMaintenance : 0.001,
        color: "blue",
      },
    ];

    const width = 450;
    const height = 450;
    const padding = 30;
    const radius = (Math.min(width, height) - padding * 2) / 2;

    const svg = d3
      .select("#pie-chart")
      .attr("width", width)
      .attr("height", height)
      .attr(
        "viewBox",
        `-${padding} -${padding} ${width + padding * 2} ${height + padding * 2}`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc()
      .innerRadius(radius * 0.3)
      .outerRadius(radius * 0.8);

    svg
      .selectAll("path")
      .data(pie(dataset))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))");

    svg
      .selectAll("text")
      .data(pie(dataset))
      .enter()
      .append("text")
      .attr("transform", (d) => {
        const centroid = arc.centroid(d);
        const angle = Math.atan2(centroid[1], centroid[0]);
        const x = Math.cos(angle) * (radius * 0.65);
        const y = Math.sin(angle) * (radius * 0.65);
        return `translate(${x}, ${y})`;
      })
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text((d) => {
        const originalValue = d.data.value === 0.001 ? 0 : d.data.value;
        return originalValue === 0 ? "" : originalValue;
      });

    const legend = d3
      .select("#legend")
      .attr("width", 180)
      .attr("height", dataset.length * 50)
      .attr("viewBox", `0 0 180 ${dataset.length * 50}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const legendItems = legend
      .selectAll("g")
      .data(dataset)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(10, ${i * 50 + 20})`);

    legendItems
      .append("rect")
      .attr("width", 24)
      .attr("height", 24)
      .style("fill", (d) => d.color);

    legendItems
      .append("text")
      .attr("x", 34)
      .attr("y", 12)
      .attr("dy", "0.35em")
      .style("text-anchor", "start")
      .style("font-size", "18px")
      .style("fill", "currentColor")
      .style("font-weight", "bold")
      .text((d) => {
        const value = d.value === 0.001 ? 0 : d.value;
        return `${d.label.split(":")[0]}: ${value}`;
      });
  }, [data]);

  return (
    <div className="w-full">
      <h3 className="text-center text-base sm:text-xl md:text-2xl font-semibold text-gray-700 break-words whitespace-normal w-full">
        Unit Status
      </h3>
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10 py-10 px-6 mx-auto">
        <svg
          id="pie-chart"
          className="w-full md:w-2/3 h-auto max-h-[500px] aspect-square"
        ></svg>
        <svg id="legend" className="w-full md:w-1/3 h-auto max-h-[500px]"></svg>
      </div>
    </div>
  );
};

export default UnitStatusReport;
