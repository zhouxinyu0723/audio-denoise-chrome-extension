import {TrackBuffer} from './track_buffer.js'
import {CyclicBuffer} from './cyclic_buffer.js'
import {hanning_window, time2freqP_1frame, sumVectors, addVector} from './denoise_algorithm.js'

export class DenoiseFlow{
    constructor(frameSize = 8192, frameShift = 2048, volEstBufferSize = 10, buffer1Size=32, buffer2Size=32, sort_low = 5, sort_high = 16){
        this.frameSize = frameSize
        this.hanning_window_frame = hanning_window(this.frameSize);
        this.frameShift = frameShift
        this.sort_low = sort_low
        this.sort_high = sort_high
        this.inputBuffer = new TrackBuffer(frameSize*3);
        this.outputBuffer = new TrackBuffer(frameSize*3);
        this.volEstBuffer = new CyclicBuffer(volEstBufferSize,()=>{return time2freqP_1frame(Array.from({length: this.frameSize},()=>{return 0;}))})
        this.volEst = 0;
        this.buffer1 = new CyclicBuffer(buffer1Size,()=>{return time2freqP_1frame(Array.from({length: this.frameSize},()=>{return 0;}))})
        this.buffer2 = new CyclicBuffer(buffer2Size,()=>{return time2freqP_1frame(Array.from({length: this.frameSize},()=>{return 0;}))})
        this.sort_avg_buffer = Array.frome({length:buffer2Size},()=>{return time2freqP_1frame(Array.from({length: this.frameSize},()=>{return 0;}))})
    }
    process(input, output, param){
        this.inputBuffer.push_array(input);
        // process new data
        if (this.inputBuffer.buffer_write_p_min_read_p >= this.frameShift){
            frame = this.inputBuffer.read_array(this.frameSize);
            frame_fft_info = time2freqP_1frame(frame, this.hanning_window_frame);
            ///////// maintian noise estimation history
            // volume estimation
            this.volEsrBuffer.swap(frame_fft_info);
            this.volEst = this.volEstBuffer.buffer.reduce((acc, e)=>{acc+e.totaPow},0)/this.volEstBufferSize;
            // save noise frames
            if (frame_fft_info.totaPow < this.volEst/50){
                old_frame = this.buffer1.swap(frame_fft_info);
                this.buffer2.swap(old_frame);
            }
            ///////// use noise estimation history to reduce noise
            // estimate noise power for each freq
            this.sort_avg_buffer.forEach((e, i)=>{
                this.sort_avg_buffer[i] = this.buffer2[i];
            });
            this.sort_avg_buffer.sort((a, b)=>{
                if (a.totaPow < b.totaPow){
                    return -1;
                }else{
                    return 1;
                }
            });
            noisePower = this.sort_avg_buffer.slice(this.sort_low, this.sort_high).reduce((acc, e)=>{
                acc+e.freqPow 
            },0)/(this.sort_high - this.sort_low);
            console.log(noisePower)
            // cancel noise
            freqPower = frame_fft_info.freqPow - noisePower;
            // rebuild signal
            freqAngle = frame_fft_info.freqAng;
            frame_time_rebuild = freq2time_1frame(freqPower, freqAngle, this.hanning_window_frame);
            
            // write into output buffer

        }
        // retrieve processed data
        if (this.outputBuffer.buffer_write_p_min_read_p >= this.frameShift){

        }
    }
}