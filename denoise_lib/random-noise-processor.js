import {x} from './to_be_imported.js'

class RandomNoiseProcessor extends AudioWorkletProcessor {

  j = 0;

  process(inputs, outputs, parameters) {
    this.j = this.j+1
    if(this.j%1000 == 10){
      console.log("-------- audio process report. ---------")
      console.log(this.j)
      
      console.log("----- audio process report finish. -----")
    }
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        if (x == 0){
          channel[i] = Math.random() * 2 - 1;
          }else{
            channel[i] = 0;
          }
      }
    });
    return true;
  }
}
  
registerProcessor("random-noise-processor", RandomNoiseProcessor);