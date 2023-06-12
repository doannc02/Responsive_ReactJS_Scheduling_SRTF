import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ganttChartsRender } from './Redux/inputSlice';
import Charts from './component/Chart';
import "./App.css"
import ProcessFlowChart from './component/Schduling';

function App() {
  const [processes, setProcesses] = useState([]);
  const [processName, setProcessName] = useState('');
  const [burstTime, setBurstTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [ganttChart, setGanttChart] = useState([]);
  const [averageWaitTime, setAverageWaitTime] = useState(0);
  const [waitTimes, setWaitTimes] = useState([]);
  const [turnaroundTimes, setTurnaroundTimes] = useState([]);

  const dispatch = useDispatch();

  const addProcess = () => {
    if (processName.trim() !== '' && !isNaN(parseInt(burstTime)) && !isNaN(parseInt(arrivalTime))) {
      const newProcess = {
        name: processName,
        burstTime: parseInt(burstTime),
        arrivalTime: parseInt(arrivalTime),
        remainingTime: parseInt(burstTime),
        turnaroundTime: 0,
        responseTime: 0,
      };
      
      setProcesses([...processes, newProcess]);
      setProcessName('');
      setBurstTime('');
      setArrivalTime('');
    }
  };

  const deleteProcess = (index) => {
    const updatedProcesses = [...processes];
    updatedProcesses.splice(index, 1);
    setProcesses(updatedProcesses);
  };

  const resetProcesses = () => {
    setProcesses([]);
    setGanttChart([]);
    setAverageWaitTime(0);
    setWaitTimes([]);
    setTurnaroundTimes([]);
  };

  const calculateSRTRF = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    let waitTimeSum = 0;

    const ganttChartEntries = [];

    while (sortedProcesses.length > 0) {
      let shortestProcessIndex = -1;
      let shortestRemainingTime = Infinity;

      for (let i = 0; i < sortedProcesses.length; i++) {
        if (sortedProcesses[i].arrivalTime <= currentTime && sortedProcesses[i].remainingTime < shortestRemainingTime) {
          shortestProcessIndex = i;
          shortestRemainingTime = sortedProcesses[i].remainingTime;
        }
      }

      if (shortestProcessIndex === -1) {
        currentTime++;
        continue;
      }

      const currentProcess = sortedProcesses[shortestProcessIndex];
      sortedProcesses.splice(shortestProcessIndex, 1);

      ganttChartEntries.push({
        process: currentProcess,
        start: currentTime,
        end: currentTime + 1,
      });

      currentProcess.remainingTime--;

      if (currentProcess.remainingTime > 0) {
        sortedProcesses.push(currentProcess);
      } else {
        const turnaroundTime = currentTime + 1 - currentProcess.arrivalTime;
        const responseTime = currentTime + 1 - currentProcess.burstTime - currentProcess.arrivalTime;
        currentProcess.turnaroundTime = turnaroundTime;
        currentProcess.responseTime = responseTime;
        waitTimeSum += currentTime - currentProcess.burstTime - currentProcess.arrivalTime + 1;
      }

      currentTime++;
    }

    setGanttChart(ganttChartEntries);
    setAverageWaitTime(waitTimeSum / processes.length);
    setWaitTimes([]);
    setTurnaroundTimes([]);

    dispatch(ganttChartsRender(ganttChartEntries));
  };

  return (
    <div className='container'>
      <div className='item1'><h1>SRTRF Algorithm</h1>
      <h2>Design By Nguyễn Công Đoàn  - MSV: 2000707</h2></div>
      <div className='item2'>
        <h2>Processes</h2>
        <table className=''>
          <thead>
            <tr>
              <th>Name</th>
              <th>Burst Time</th>
              <th>Arrival Time</th>
              <th>Turnaround Time</th>
              <th>Response Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={index}>
                <td>{process.name}</td>
                <td>{process.burstTime}</td>
                <td>{process.arrivalTime}</td>
                <td>{process.turnaroundTime}</td>
                <td>{process.responseTime}</td>
                <td>
                  <button onClick={() => deleteProcess(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='div-input'>
        <div className='ip'>
        <input
          className="input-field"
            type="text"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            placeholder="Enter process name"
          />
          <input
           className="input-field"
            type="text"
            value={burstTime}
            onChange={(e) => setBurstTime(e.target.value)}
            placeholder="Enter burst time"
          />
          <input
           className="input-field"
            type="text"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            placeholder="Enter arrival time"
          />
        </div>
          <div className='btn-cn'>
          <button className='btn' onClick={addProcess}>Add Process</button>
          <button className='btn' onClick={resetProcesses}>Reset</button>
          </div>
        </div>
      </div>
      <div className='item3'>
        <h2>Gantt Chart</h2>
        <div>
          {ganttChart.map((entry, index) => (
            <div className='txt' key={index}>
              {entry.process.name} [{entry.start} - {entry.end}]
            </div>
          ))}
        </div>
      </div>
     <div className='item4' >
     
      <div className='charts'>
      <div className='title'>Biểu đồ theo thời gian</div>
         <Charts/></div>
     </div>
      {averageWaitTime >= 0 && (
        <div className='item5'>
          <h2>Average Wait Time</h2>
          <div className='dp'>{averageWaitTime.toFixed(2)}</div>
          <div className='detail'>Thuật toán SRTF ưu tiên tiến trình có thời gian thực hiện còn lại là ngắn nhất.</div>
        </div>
      )}
      {waitTimes.length > 0 && (
        <div>
          <h2>Wait Times</h2>
          <table>
            <thead>
              <tr>
                <th>Process</th>
                <th>Wait Time</th>
              </tr>
            </thead>
            <tbody>
              {waitTimes.map((waitTime, index) => (
                <tr key={index}>
                  <td>{processes[index].name}</td>
                  <td>{waitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {turnaroundTimes.length > 0 && (
        <div>
          <h2>Turnaround Times</h2>
          <table>
            <thead>
              <tr>
                <th>Process</th>
                <th>Turnaround Time</th>
              </tr>
            </thead>
            <tbody>
              {turnaroundTimes.map((turnaroundTime, index) => (
                <tr key={index}>
                  <td>{processes[index].name}</td>
                  <td>{turnaroundTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {processes.length > 0 && (
        <div className='item6'>
          <button className='btn' onClick={calculateSRTRF}>Calculate SRTRF</button>
        </div>
      )}
     
    </div>
  );
}

export default App;
