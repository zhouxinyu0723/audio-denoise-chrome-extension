import {DenoiseFlow} from "./denoise_flow.js"


class DeNoiseProcessor extends AudioWorkletProcessor {

  
  denoiseFlowC1 = new DenoiseFlow();
  denoiseFlowC2 = new DenoiseFlow();
  j = 0;


  static get parameterDescriptors() {
    return [
      {
        name: "noise_upper_bound",
        defaultValue: 0.03,
        minValue: 0,
        maxValue: 1,
      },
      {
        name: "cancel_activate",
        defaultValue: 1,
        minValue: 0,
        maxValue: 1,
      },
      {
        name: "denoise_scale",
        defaultValue: 1.2,
        minValue: 0,
        maxValue: 5,
      },
      // {
      //   name: "canceled_power_l",
      //   defaultValue: 0,
      //   minValue: 0,
      //   maxValue: 1,
      // },
      // {
      //   name: "canceled_power_r",
      //   defaultValue: 0,
      //   minValue: 0,
      //   maxValue: 1,
      // },
    ];
  }

  process(inputs, outputs, parameters) {

    let inputT = inputs[0];
    let outputT = outputs[0];
    let inputC1 = inputT[0];
    let inputC2 = inputT[1];
    let outputC1 = outputT[0];
    let outputC2 = outputT[1];
    // if(this.j<=30000){
    if (parameters["cancel_activate"][0]){
    this.denoiseFlowC1.process(inputC1, outputC1, parameters);
    this.denoiseFlowC2.process(inputC2, outputC2, parameters);
    }else{
      inputC1.forEach((e,i) => {outputC1[i] = e;});
      inputC2.forEach((e,i) => {outputC2[i] = e;});
    }


    // parameters['canceled_power_l'] = -this.denoiseFlowC1.noiseEst / this.denoiseFlowC1.volEst
    // parameters['canceled_power_r'] = -this.denoiseFlowC1.noiseEst / this.denoiseFlowC1.volEst

    // report
    this.j = this.j+1;
    if(this.j%2000 ==1000){
      console.log("-------- audio process report. ---------")
      console.log(this.j);
      this.report(parameters)
      // debugger;
      console.log("----- audio process report finish. -----")
    }
    return true;
  }

  
  report(parameters){
    console.log(this.denoiseFlowC1.noiseEst);
    console.log(this.denoiseFlowC1.volEst);
    console.log(this.denoiseFlowC1.noiseCount);
    console.log(this.denoiseFlowC1.totalCount);
    console.log(this.denoiseFlowC2.noiseEst);
    console.log(this.denoiseFlowC2.volEst);
    console.log(this.denoiseFlowC2.noiseCount);
    console.log(this.denoiseFlowC2.totalCount);
    console.log(parameters['denoise_scale'][0])
  }
}
  
registerProcessor("de_noise_processor", DeNoiseProcessor);