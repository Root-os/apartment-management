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
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.totalOccupied || data.totalAvailable || data.totalUnderMaintenance) {
      const dataset = [
        { label: `Occupied: ${data.totalOccupied}`, value: data.totalOccupied, color: "red" },
        { label: `Available: ${data.totalAvailable}`, value: data.totalAvailable, color: "green" },
        { label: data.totalUnderMaintenance > 0 ? `Maintenance: ${data.totalUnderMaintenance}` : '', value: data.totalUnderMaintenance, color: "blue" },
      ];

      const filteredDataset = dataset.filter(d => d.value > 0);

      const width = 200;
      const height = 200;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select("#pie-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      const path = svg.selectAll("path")
        .data(pie(filteredDataset))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => d.data.color);

      const text = svg.selectAll("text")
        .data(pie(filteredDataset))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-size", "12px")
        .text(d => d.data.value);

      // Adding legend
      const legend = d3.select("#legend")
        .attr("width", 100)
        .attr("height", filteredDataset.length * 20)
        .selectAll("g")
        .data(filteredDataset)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => d.color);

      legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .style("fill", "currentColor") // Ensures responsive text color based on theme
        .text(d => d.label.split(":")[0]); // Displaying only the name part
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-slate-900 dark:text-white">
      <div className="flex pb-56 w-full max-w-md space-x-6">
        <svg id="pie-chart"></svg>
        <svg id="legend"></svg>
      </div>
    </div>
  );
};

export default UnitStatusReport;
