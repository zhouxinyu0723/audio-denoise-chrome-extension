import {DenoiseFlow} from "./denoise_flow.js"
class RandomNoiseProcessor extends AudioWorkletProcessor {

  denoiseFlowC1 = new DenoiseFlow();
  denoiseFlowC2 = new DenoiseFlow();

  process(inputs, outputs, parameters) {

    let inputT = inputs[0];
    let outputT = outputs[0];
    let inputC1 = inputT[0];
    let inputC2 = inputT[1];
    let outputC1 = outputT[0];
    let outputC2 = outputT[1];
    // this.denoiseFlowC1.process(inputC1, outputC1, parameters);
   // this.denoiseFlowC2.process(inputC2, outputC2, parameters);
    // report
    outputC1 = inputC1
    outputC2 = inputC2
    this.j = this.j+1;
    if(this.j%2000 ==10){
      console.log("-------- audio process report. ---------")
      console.log(this.j);
      console.log(inputC1)
      console.log("----- audio process report finish. -----")
    }
    return true;
  }
}
  
registerProcessor("audio_processor", RandomNoiseProcessor);