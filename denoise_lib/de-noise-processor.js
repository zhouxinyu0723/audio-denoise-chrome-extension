////////////////////////////////////////////////////////////
class CyclicBuffer{
  constructor(length, item_init_func){
      this.buffer_size = length;
      this.buffer = Array.from({length: this.buffer_size},item_init_func)
      this.buffer_pointer = 0;
  }
  write(new_item){
      this.buffer[this.buffer_pointer] = new_item;
      this.buffer_pointer ++;
      if (this.buffer_pointer == this.buffer_size){
          this.buffer_pointer = 0;
      }
  }
  read(){
      return this.buffer[this.buffer_pointer];
  }
}

////////////////////////////////////////////////////////////
class TrackBuffer 
{
    constructor(length){
        this.buffer_size = length;
        this.buffer = Array.from({length: this.buffer_size},()=>{return 0;})
        this.buffer_write_pointer = 0;
        this.buffer_read_pointer = length;
        this.buffer_write_p_min_read_p = 0;

        this.buffer_clean_pointer = 0;
    }
    set_clean_p_ahead_write_p(ahead){
        this.buffer_clean_pointer = this.buffer_write_pointer + ahead;
        if (this.buffer_clean_pointer >= this.buffer_size){
            this.buffer_clean_pointer -= this.buffer_size;
        }
    }
    clean(size){
        // console.log("not cleaned buffer", this.buffer)
        // console.log("clean from:", this.buffer_clean_pointer)
        if (size <= this.buffer_size - this.buffer_clean_pointer){
            for (let i = 0; i < size; i++) {
                // console.log("zero",i)
                this.buffer[i + this.buffer_clean_pointer] = 0;
                // console.log(this.buffer)
            }
        }else{
            for (let i = 0; i < this.buffer_size - this.buffer_clean_pointer; i++) {
                // console.log("first",i)
                this.buffer[i + this.buffer_clean_pointer] = 0;
                // console.log(this.buffer)
            }
            for (let i = 0; i < size - this.buffer_size + this.buffer_clean_pointer; i++) {
                // console.log("second",i)
                this.buffer[i] = 0;
                // console.log(this.buffer)
            }
        }
        // console.log("cleaned buffer", this.buffer)
    }
    push_item(item){
        this.buffer[this.buffer_write_pointer] = item;
        this.buffer_write_p_min_read_p ++;
        this.buffer_write_pointer ++;
        if (this.buffer_write_pointer == this.buffer_size){
            this.buffer_write_pointer = 0;
        }
    }
    increase_write_pointer(increase){
        this.buffer_write_p_min_read_p += increase;
        this.buffer_write_pointer += increase;
        if (this.buffer_write_pointer >= this.buffer_size){
            this.buffer_write_pointer -= this.buffer_size;
        }
    }
    push_array(array, increase=false){
        if (array.length > this.buffer_size - this.buffer_write_p_min_read_p){
            console.error("input array too large. input array length: ",array.length, " buffer lenght: ", this.buffer_size, " buffer remain space: ",this.buffer_size - this.buffer_write_p_min_read_p);
        }
        if (array.length <= this.buffer_size - this.buffer_write_pointer){
            array.forEach((e,i)=>{
                // console.log("zero",i)
                this.buffer[i + this.buffer_write_pointer] = array[i];
                // console.log(this.buffer)
        })
        }else{
            array.slice(0, this.buffer_size - this.buffer_write_pointer).forEach((e,i)=>{
                // console.log("first",i)
                this.buffer[i + this.buffer_write_pointer] = array[i]
                // console.log(this.buffer)
        })
            array.slice(this.buffer_size - this.buffer_write_pointer, array.size).forEach((e,i)=>{
                // console.log("second",i)
                this.buffer[i] = array[i + this.buffer_size -  this.buffer_write_pointer]
                // console.log(this.buffer)
            })
        }
        if (increase == true){
            this.buffer_write_p_min_read_p += array.length;
            console.log()
            this.buffer_write_pointer += array.length;
            if (this.buffer_write_pointer >= this.buffer_size){
                this.buffer_write_pointer -= this.buffer_size;
            }
        }
    }
    add_array(array, increase=false){
        if (array.length > this.buffer_size - this.buffer_write_p_min_read_p){
            console.error("input array too large. input array length: ",array.length, " buffer lenght: ", this.buffer_size, " buffer remain space: ",this.buffer_size - this.buffer_write_p_min_read_p);
        }
        if (array.length <= this.buffer_size - this.buffer_write_pointer){
            array.forEach((e,i)=>{
                // console.log("zero",i)
                this.buffer[i + this.buffer_write_pointer] = this.buffer[i + this.buffer_write_pointer] + array[i];
                // console.log(this.buffer)
        })
        }else{
            array.slice(0, this.buffer_size - this.buffer_write_pointer).forEach((e,i)=>{
                // console.log("first",i)
                this.buffer[i + this.buffer_write_pointer] = this.buffer[i + this.buffer_write_pointer] + array[i]
                // console.log(this.buffer)
        })
            array.slice(this.buffer_size - this.buffer_write_pointer, array.size).forEach((e,i)=>{
                // console.log("second",i)
                this.buffer[i] = this.buffer[i] + array[i + this.buffer_size -  this.buffer_write_pointer]
                // console.log(this.buffer)
            })
        }
        if (increase == true){
            this.buffer_write_p_min_read_p += array.length;
            this.buffer_write_pointer += array.length;
            if (this.buffer_write_pointer >= this.buffer_size){
                this.buffer_write_pointer -= this.buffer_size;
            }
        }
    }
    increase_read_pointer(increase){
        this.buffer_write_p_min_read_p -= increase;
        this.buffer_read_pointer += increase;
        if (this.buffer_read_pointer >= this.buffer_size){
            this.buffer_read_pointer -= this.buffer_size;
        }
    }
    read_item(update_pointer = false){
        item = this.buffer(this.buffer_read_pointer);
        if(update_pointer){
            this.buffer_write_p_min_read_p ++;
            this.buffer_read_pointer ++;
            if(this.buffer_read_pointer == this.buffer_size){
                this.buffer_read_pointer = 0;
            }
        }
        return item;
    }
    read_array(size,increase = false){
        // if (size > this.buffer_size - this.buffer_write_p_min_read_p){
        //     console.error("No data to read. amount ask to read: ",size, " amound in the trace buffer: ", this.buffer_size - this.buffer_write_p_min_read_p);
        // }
        const result = Array.from({length:size},()=>0);
        // console.log(result)
        if (size <= this.buffer_read_pointer){
            result.forEach((_,i)=>{
                // console.log("first",i)
                result[i] = this.buffer[i + this.buffer_read_pointer - size];
                // console.log(result)
            });
        }else{
            result.slice(size - this.buffer_read_pointer, size).forEach((e,i)=>{
                // console.log("second",i)
                result[i + size - this.buffer_read_pointer] = this.buffer[i];
                // console.log(result)
            });
            result.slice(0, size - this.buffer_read_pointer).forEach((e,i)=>{
                // console.log("third",i)
                result[i] = this.buffer[i + this.buffer_size - size + this.buffer_read_pointer];
                // console.log(result)  
            });
        }
        if (increase == true){
            this.buffer_write_p_min_read_p -= array.length;
            this.buffer_read_pointer += size;
            if (this.buffer_read_pointer >= this.buffer_size){
                this.buffer_read_pointer -= this.buffer_size;
            }
        }
        return result;
    }
}
////////////////////////////////////////////////////////////
export default class baseComplexArray {
  constructor(other, arrayType = Float32Array) {
    if (other instanceof baseComplexArray) {
      // Copy constuctor.
      this.ArrayType = other.ArrayType;
      this.real = new this.ArrayType(other.real);
      this.imag = new this.ArrayType(other.imag);
    } else {
      this.ArrayType = arrayType;
      // other can be either an array or a number.
      this.real = new this.ArrayType(other);
      this.imag = new this.ArrayType(this.real.length);
    }

    this.length = this.real.length;
  }

  toString() {
    const components = [];

    this.forEach((value, i) => {
      components.push(
        `(${value.real.toFixed(2)}, ${value.imag.toFixed(2)})`
      );
    });

    return `[${components.join(', ')}]`;
  }

  forEach(iterator) {
    const n = this.length;
    // For gc efficiency, re-use a single object in the iterator.
    const value = Object.seal(Object.defineProperties({}, {
      real: {writable: true}, imag: {writable: true},
    }));

    for (let i = 0; i < n; i++) {
      value.real = this.real[i];
      value.imag = this.imag[i];
      iterator(value, i, n);
    }
  }

  // In-place mapper.
  map(mapper) {
    this.forEach((value, i, n) => {
      mapper(value, i, n);
      this.real[i] = value.real;
      this.imag[i] = value.imag;
    });

    return this;
  }

  conjugate() {
    return new baseComplexArray(this).map((value) => {
      value.imag *= -1;
    });
  }

  power() {
    const powers = new this.ArrayType(this.length);
    this.forEach((value, i) => {
      powers[i] = value.real*value.real + value.imag*value.imag;
    })

    return powers;
  }

  angle() {
    const angles = new this.ArrayType(this.length);
    this.forEach((value, i) => {
      if (value.real == 0 && value.imag == 0){
        angles[i] = Math.random()*Math.PI*2;
      }else{
        if (value.real > 0){
          angles[i] = Math.atan(value.imag / value.real);
        }else{
          angles[i] = Math.PI + Math.atan(value.imag / value.real);
        }
      }
    })
    return angles;
  }
}
////////////////////////////////////////////////////////////

// Math constants and functions we need.
const PI = Math.PI;
const SQRT1_2 = 1;//Math.SQRT1_2;

export function FFT(input) {
  return ensureComplexArray(input).FFT();
};

export function InvFFT(input) {
  return ensureComplexArray(input).InvFFT();
};

export function frequencyMap(input, filterer) {
  return ensureComplexArray(input).frequencyMap(filterer);
};

export class ComplexArray extends baseComplexArray {
  FFT() {
    return fft(this, false);
  }

  InvFFT() {
    return fft(this, true);
  }

  // Applies a frequency-space filter to input, and returns the real-space
  // filtered input.
  // filterer accepts freq, i, n and modifies freq.real and freq.imag.
  frequencyMap(filterer) {
    return this.FFT().map(filterer).InvFFT();
  }
}

function ensureComplexArray(input) {
  return input instanceof ComplexArray && input || new ComplexArray(input);
}

function fft(input, inverse) {
  const n = input.length;

  if (n & (n - 1)) {
    return FFT_Recursive(input, inverse);
  } else {
    return FFT_2_Iterative(input, inverse);
  }
}

function FFT_Recursive(input, inverse) {
  const n = input.length;

  if (n === 1) {
    return input;
  }

  const output = new ComplexArray(n, input.ArrayType);

  // Use the lowest odd factor, so we are able to use FFT_2_Iterative in the
  // recursive transforms optimally.
  const p = LowestOddFactor(n);
  const m = n / p;
  const normalisation = 1 / Math.sqrt(p);
  let recursive_result = new ComplexArray(m, input.ArrayType);

  // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
  // for a power of a prime, p, this reduces to O(n p log_p n)
  for(let j = 0; j < p; j++) {
    for(let i = 0; i < m; i++) {
      recursive_result.real[i] = input.real[i * p + j];
      recursive_result.imag[i] = input.imag[i * p + j];
    }
    // Don't go deeper unless necessary to save allocs.
    if (m > 1) {
      recursive_result = fft(recursive_result, inverse);
    }

    const del_f_r = Math.cos(2*PI*j/n);
    const del_f_i = (inverse ? -1 : 1) * Math.sin(2*PI*j/n);
    let f_r = 1;
    let f_i = 0;

    for(let i = 0; i < n; i++) {
      const _real = recursive_result.real[i % m];
      const _imag = recursive_result.imag[i % m];

      output.real[i] += f_r * _real - f_i * _imag;
      output.imag[i] += f_r * _imag + f_i * _real;

      [f_r, f_i] = [
        f_r * del_f_r - f_i * del_f_i,
        f_i = f_r * del_f_i + f_i * del_f_r,
      ];
    }
  }

  // Copy back to input to match FFT_2_Iterative in-placeness
  // TODO: faster way of making this in-place?
  for(let i = 0; i < n; i++) {
    input.real[i] = normalisation * output.real[i];
    input.imag[i] = normalisation * output.imag[i];
  }

  return input;
}

function FFT_2_Iterative(input, inverse) {
  const n = input.length;

  const output = BitReverseComplexArray(input);
  const output_r = output.real;
  const output_i = output.imag;
  // Loops go like O(n log n):
  //   width ~ log n; i,j ~ n
  let width = 1;
  while (width < n) {
    const del_f_r = Math.cos(PI/width);
    const del_f_i = (inverse ? -1 : 1) * Math.sin(PI/width);
    for (let i = 0; i < n/(2*width); i++) {
      let f_r = 1;
      let f_i = 0;
      for (let j = 0; j < width; j++) {
        const l_index = 2*i*width + j;
        const r_index = l_index + width;

        const left_r = output_r[l_index];
        const left_i = output_i[l_index];
        const right_r = f_r * output_r[r_index] - f_i * output_i[r_index];
        const right_i = f_i * output_r[r_index] + f_r * output_i[r_index];

        output_r[l_index] = SQRT1_2 * (left_r + right_r);
        output_i[l_index] = SQRT1_2 * (left_i + right_i);
        output_r[r_index] = SQRT1_2 * (left_r - right_r);
        output_i[r_index] = SQRT1_2 * (left_i - right_i);

        [f_r, f_i] = [
          f_r * del_f_r - f_i * del_f_i,
          f_r * del_f_i + f_i * del_f_r,
        ];
      }
    }
    width <<= 1;
  }

  return output;
}

function BitReverseIndex(index, n) {
  let bitreversed_index = 0;

  while (n > 1) {
    bitreversed_index <<= 1;
    bitreversed_index += index & 1;
    index >>= 1;
    n >>= 1;
  }
  return bitreversed_index;
}

function BitReverseComplexArray(array) {
  const n = array.length;
  const flips = new Set();

  for(let i = 0; i < n; i++) {
    const r_i = BitReverseIndex(i, n);

    if (flips.has(i)) continue;

    [array.real[i], array.real[r_i]] = [array.real[r_i], array.real[i]];
    [array.imag[i], array.imag[r_i]] = [array.imag[r_i], array.imag[i]];

    flips.add(r_i);
  }

  return array;
}

function LowestOddFactor(n) {
  const sqrt_n = Math.sqrt(n);
  let factor = 3;

  while(factor <= sqrt_n) {
    if (n % factor === 0) return factor;
    factor += 2;
  }
  return n;
}

////////////////////////////////////////////////////////////

export function hanning_window(window_size){
    let angle_speed = 2 * Math.PI / (window_size - 1);
    return Array.from({length: window_size}, (_, i) => 0.5 * (1 - Math.cos(i * angle_speed)));
}
export function mulVector(a,b){
    return a.map((e,i) => e * b[i]);
}
export function mulVectorScala(a,b){
    return a.map((e) => e * b);
}
export function addVector(a,b){
    return a.map((e,i) => e + b[i]);
}
export function squareVector(a){
    return a.map((e) => e*e);
}
export function sqrtVector(a){
    return a.map((e) => Math.sqrt(e+0.0000001));
}
export function sumVectors(vectors){
    let result = Array.from({length: vectors[0].length}, () => 0);
    for (let i = 0; i < vectors.length; i++) {
        result = addVector(result, vectors[i]);
    }
    return result;
}
export function time2freqP_1frame(input, hanning_window){
    let freq = {}
    if (hanning_window == 0){
        freq = FFT(input);
    }else{
        freq = FFT(mulVector(input, hanning_window));   
    }
    let freqPow = freq.power();
    let freqAng = freq.angle();
    let totaPow = freqPow.slice(300,4096).reduce((partialSum, e) => partialSum + e, 0);
    // console.log(totaPow)
    return {
        freqAng: freqAng,
        freqPow: freqPow,
        totaPow: totaPow
      };
    }
export function freq2time_1frame(freqPow, freqAng, hanning_window){
    let freqAmp = sqrtVector(freqPow);
    const freq = new ComplexArray(freqAmp.length).map((value, i, n) => {
        value.real = freqAmp[i]*Math.cos(freqAng[i]);
        value.imag = freqAmp[i]*Math.sin(freqAng[i]); 
      });
    let time_re =  InvFFT(freq);
    if (hanning_window == 0 ){
        let scale = 1/freqPow.length;
        return time_re.real.map((e)=>{return e*scale});
    }else{
        let scale = 1/freqPow.length;
        return mulVector(time_re.real.map((e)=>{return e*scale}), hanning_window);
    }
}

////////////////////////////////////////////////////////

export class DenoiseFlow{
    constructor(frameSize = 8192, frameShift = 2048, volEstBufferSize = 10, buffer1Size=32, buffer2Size=32, sort_low = 10, sort_high = 16){
        this.frameSize = frameSize
        this.hanning_window_frame = hanning_window(this.frameSize);
        this.frameShift = frameShift
        this.sort_low = sort_low
        this.sort_high = sort_high
        this.inputBuffer = new TrackBuffer(frameSize*3);
        this.outputBuffer = new TrackBuffer(frameSize*3);
        this.volEstBufferSize = volEstBufferSize
        this.volEstBuffer = new CyclicBuffer(volEstBufferSize,()=>0)
        this.volEst = 0;
        this.buffer1 = new CyclicBuffer(buffer1Size,()=>{return time2freqP_1frame(Array.from({length: this.frameSize},()=>{return 0;}), 0)})
        this.buffer2 = new CyclicBuffer(buffer2Size,()=>{return time2freqP_1frame(Array.from({length: this.frameSize},()=>{return 0;}), 0)})
        this.sort_avg_buffer = Array.from({length:buffer2Size},()=>{return time2freqP_1frame(Array.from({length: this.frameSize},()=>{return 0;}), 0)})

        this.noiseEst = 0;
        this.noiseCount = 0;
        this.totalCount = 0;
    }
    process(input, output, param, cancel=true){
        this.inputBuffer.push_array(input, true);
        // process new data
        if (this.inputBuffer.buffer_write_p_min_read_p >= this.frameShift){
            let frame = this.inputBuffer.read_array(this.frameSize);
            this.inputBuffer.increase_read_pointer(this.frameShift);
            let frame_fft_info = time2freqP_1frame(frame, this.hanning_window_frame);
            ///////// maintian noise estimation history
            // volume estimation
            this.volEstBuffer.write(frame_fft_info.totaPow);
            let volEst_update = this.volEstBuffer.buffer.reduce((acc, e)=>acc+e,0)/this.volEstBufferSize;
            // console.log(this.volEstBuffer.buffer.reduce((acc, e)=>acc+e,0))
            this.volEst =Math.max(this.volEst, volEst_update)*0.99;
            // save noise frames
            if (this.volEst/10000 < frame_fft_info.totaPow && frame_fft_info.totaPow < this.volEst/30){
                // console.log("catch a noise")
                this.noiseCount ++;
                let old_frame = this.buffer1.read();
                this.buffer1.write(frame_fft_info);
                this.buffer2.write(old_frame);
            }
            ///////// use noise estimation history to reduce noise
            // estimate noise power for each freq
            this.sort_avg_buffer.forEach((e, i)=>{
                this.sort_avg_buffer[i] = this.buffer2.buffer[i];
            });
            let noisePower = this.sort_avg_buffer.slice(this.sort_low, this.sort_high).reduce((acc, e)=>{
                return {freqPow: addVector(acc.freqPow, e.freqPow)}
            },time2freqP_1frame(Array.from({length: this.frameSize},()=>{return 0;}), 0));
            let scale = -1/(this.sort_high - this.sort_low);
            noisePower = mulVectorScala(noisePower.freqPow, scale);
            this.noiseEst = noisePower.slice(300,4096).reduce((acc, e)=>acc+e,0)
            // cancel noise
            let freqPower;
            if (cancel){
                freqPower = addVector(frame_fft_info.freqPow, noisePower);
                freqPower = freqPower.map((e)=>Math.max(0,e));
            }else{
                freqPower = frame_fft_info.freqPow;
            }
            // rebuild signal
            let freqAngle = frame_fft_info.freqAng;
            let frame_time_rebuild = freq2time_1frame(freqPower, freqAngle, this.hanning_window_frame);
            if(isNaN(frame_time_rebuild[0])){
                debugger;
                frame_time_rebuild = freq2time_1frame(freqPower, freqAngle, this.hanning_window_frame);
            }
            this.frame_time_rebuild = frame_time_rebuild
            // write into output buffer
            this.outputBuffer.set_clean_p_ahead_write_p(this.frameSize);
            this.outputBuffer.clean(this.frameSize);
            this.outputBuffer.add_array(frame_time_rebuild);
            this.outputBuffer.increase_write_pointer(this.frameShift);

            this.totalCount ++;
        }
        // retrieve processed data

        let output_ready = this.outputBuffer.read_array(output.length);
        let scale = this.frameShift/this.frameSize * 2
        output_ready.forEach((e,i)=>{output[i]=e*scale})
        if(this.outputBuffer.buffer_write_p_min_read_p > output.length){
            this.outputBuffer.increase_read_pointer(output.length);
        }
    }
}



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