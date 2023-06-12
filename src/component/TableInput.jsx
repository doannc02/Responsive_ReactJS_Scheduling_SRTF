import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { inputUpdate, outUpdate, utiUpadte } from "../Redux/inputSlice";
import Input from "../Obj/Input";
import Utility from "../Obj/Utility";
import Output from "../Obj/OutPut";
import TimeLog from "../Obj/TimeLog";

export default function TableInput() {
  const dispatch = useDispatch();

  const inputState = useSelector((state) => state.input);
  const utilityState = useSelector((state) => state.utility);
  const outputState = useSelector((state) => state.output);

  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    const input = new Input();
    const uti = new Utility();
    const out = new Output();
// Trong useEffect:
const inputData = {
    processId: processes.map((process) => process.id - 1),
    processTime: processes.map((process) => process.processTime),
    processTimeLength: processes.length,
    totalBurstTime: processes.reduce((total, process) => total + process.processTime, 0),
    // Other necessary properties
  };
  
  uti.remainingProcessTime = input.processTime.slice();
  uti.remainingBurstTime = input.totalBurstTime;
  uti.remainingTimeRunning = new Array(input.processId.length).fill(0);
  uti.currentProcessIndex = new Array(input.processId.length).fill(0);
  uti.start = new Array(input.processId.length).fill(false);
  uti.done = new Array(input.processId.length).fill(false);
  uti.returnTime = new Array(input.processId.length).fill(0);
  // Other necessary properties
  
  dispatch(inputUpdate(inputData));
  dispatch(utiUpadte(uti));
  dispatch(outUpdate(out));
  
  }, [processes]);

  useEffect(() => {
    const executeSRTF = () => {
      const currentTimeLog = new TimeLog();
      // SRTF algorithm implementation
      // ...
      dispatch(outUpdate((prevOutput) => ({ ...prevOutput, timeLog: currentTimeLog })));
    };

    executeSRTF();
  }, [inputState, utilityState]);

  const handleArrivalTimeChange = (id, value) => {
    const updatedProcesses = processes.map((process) =>
      process.id === id ? { ...process, arrivalTime: value } : process
    );
    setProcesses(updatedProcesses);
  };

  const handleProcessTimeChange = (id, value) => {
    const updatedProcesses = processes.map((process) =>
      process.id === id ? { ...process, processTime: value } : process
    );
    setProcesses(updatedProcesses);
  };

  const addProcess = () => {
    const newProcessId = processes.length + 1;
    const newProcess = {
      id: newProcessId,
      arrivalTime: 0,
      processTime: 0,
    };
    const updatedProcesses = [...processes, newProcess];
    setProcesses(updatedProcesses);
  };

  const deleteProcess = (id) => {
    const updatedProcesses = processes.filter((process) => process.id !== id);
    setProcesses(updatedProcesses);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>Process Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>{process.id}</td>
              <td>
                <input
                  type="number"
                  value={process.arrivalTime}
                  onChange={(e) => handleArrivalTimeChange(process.id, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={process.processTime}
                  onChange={(e) => handleProcessTimeChange(process.id, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => deleteProcess(process.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addProcess}>Add Process</button>
      {/* Other JSX components to display the results */}
    </div>
  );
}
