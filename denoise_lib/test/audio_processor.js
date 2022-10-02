import {hanning_window, time2freqP_1frame, sumVectors} from './denoise_algorithm.js'

// import baseComplexArray from '../jsfft-master/lib/complex_array.js';
// import {ComplexArray} from '../jsfft-master/lib/fft.js';


class RandomNoiseProcessor extends AudioWorkletProcessor {


  process(inputs, outputs, parameters) {




    // report
    this.j = this.j+1;
    if(this.j%2000 ==10){
      console.log("-------- audio process report. ---------")
      console.log(this.j);
      console.log(output[0]);
      console.log(inputs[0].length);
      console.log("----- audio process report finish. -----")
    }
    return true;
  }
}
  
registerProcessor("audio_processor", RandomNoiseProcessor);