import React from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";

export default function Charts() {
  const dataProcess = useSelector(state => state.inputObj?.gantt.data);

  const mappedData = [
    [
      { type: "string", id: "Process" },
      { type: "string", id: "Task ID" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    
    ],
    ...dataProcess.map((entry) => [
     
      entry.process.name,
      entry.process.name,
      new Date(entry.start*1000),
      new Date(entry.end*1000),
     
    ])
  ];

  const options = {
    allowHtml: true,
    timeline: {
      rowLabelStyle: {
        fontName: "Arial",
        fontSize: 14,
        color: "#999"
      },
      barLabelStyle: {
        fontName: "Arial",
        fontSize: 12,
        color: "#999"
      },
      
    }
  };

  return (
    <Chart
      chartType="Timeline"
      options={options}
      data={mappedData}
      width="100%"
      height="400px"
    />
  );
}
