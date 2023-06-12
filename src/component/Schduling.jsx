import React from 'react';
import { useSelector } from 'react-redux';
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer';

function ProcessFlowChart() {
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
      new Date(entry.start * 1000),
      new Date(entry.end * 1000),
    ])
  ];

  const elements = mappedData.map((entry) => ({
    id: entry[1],
    data: {
      label: entry[0],
      start: entry[2],
      end: entry[3],
    },
    position: { x: 0, y: 0 },
  }));

  return (
    <div style={{ height: '500px' }}>
      <ReactFlowProvider>
        <ReactFlow elements={elements} />
      </ReactFlowProvider>
    </div>
  );
}

export default ProcessFlowChart;
