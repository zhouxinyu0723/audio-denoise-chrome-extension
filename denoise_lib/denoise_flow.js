import {TrackBuffer} from './track_buffer.js'
import {CyclicBuffer} from './cyclic_buffer.js'
import {hanning_window, time2freqP_1frame, freq2time_1frame, sumVectors, addVector, mulVectorScala, squareVector} from './denoise_algorithm.js'

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
            if (frame_fft_info.totaPow < this.volEst/140){
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
            let scale = -0.7/(this.sort_high - this.sort_low);
            noisePower = mulVectorScala(noisePower.freqPow, scale);
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
        output_ready.forEach((e,i)=>{output[i]=e})
        if(this.outputBuffer.buffer_write_p_min_read_p > output.length){
            this.outputBuffer.increase_read_pointer(output.length);
        }
    }
}