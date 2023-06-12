class Input {
    constructor() {
      this.processId = [];
      this.priority = [];
      this.arrivalTime = [];
      this.processTime = [];
      this.processTimeLength = [];
      this.totalBurstTime = [];
      this.algorithm = "srtf";
      this.algorithmType = "preemptive";
      this.timeQuantum = 0;
      this.contextSwitch = 0;
    }
  }
  
  export default Input;
  