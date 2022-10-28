import {DenoiseFlow} from "./denoise_flow.js"


class DeNoiseProcessor extends AudioWorkletProcessor {

  denoiseFlowC1 = new DenoiseFlow();
  denoiseFlowC2 = new DenoiseFlow();
  j = 0;

  process(inputs, outputs, parameters) {

    let inputT = inputs[0];
    let outputT = outputs[0];
    let inputC1 = inputT[0];
    let inputC2 = inputT[1];
    let outputC1 = outputT[0];
    let outputC2 = outputT[1];
    // if(this.j<=30000){

    this.denoiseFlowC1.process(inputC1, outputC1, parameters, 1);
    this.denoiseFlowC2.process(inputC2, outputC2, parameters, 1);
    // }else{    
    //   this.denoiseFlowC1.process(inputC1, outputC1, parameters, 0);
    //   this.denoiseFlowC2.process(inputC2, outputC2, parameters, 0);
    // }

    // report
    this.j = this.j+1;
    if(this.j%2000 ==1000){
      console.log("-------- audio process report. ---------")
      console.log(this.j);
      this.report()
      // debugger;
      console.log("----- audio process report finish. -----")
    }
    return true;
  }

  report(){
    console.log(this.denoiseFlowC1.noiseEst);
    console.log(this.denoiseFlowC1.volEst);
    console.log(this.denoiseFlowC1.noiseCount);
    console.log(this.denoiseFlowC1.totalCount);
    console.log(this.denoiseFlowC2.noiseEst);
    console.log(this.denoiseFlowC2.volEst);
    console.log(this.denoiseFlowC2.noiseCount);
    console.log(this.denoiseFlowC2.totalCount);
  }
}
  
registerProcessor("de_noise_processor", DeNoiseProcessor);