//////////// test
import baseComplexArray from '../jsfft-master/lib/complex_array.js';
import * as fft from '../jsfft-master/lib/fft.js';
import {hanning_window, time2freqP_1frame, sumVectors, freq2time_1frame} from './denoise_algorithm.js'
import {TrackBuffer} from './track_buffer.js'
import {CyclicBuffer} from './cyclic_buffer.js'
import {DenoiseFlow} from './denoise_flow.js'
let frame_size = 8092
// test hanning window
console.log("test hanning window: ", 0)
// test time2freqP_1frame on short frame
console.log("test short time2freqP_1frame")
let data1 =  Array.from({length: 16}, (e,i) => Math.cos(i/2)/(i+1));
let time = new fft.ComplexArray(16);
time.map((e,i)=>{
    e.real = data1[i]; 
    e.imag = 0; 
    return e;})
console.log('origin data: ', time)
let freq_info = time2freqP_1frame(data1, 0);
console.log('freq data: ',freq_info)
let time_re = freq2time_1frame(freq_info.freqPow, freq_info.freqAng, 0);
console.log('rebuild data: ',time_re);
// test time2freqP_1frame on long frame
console.log("test long time2freqP_1frame")
let data2 = Array.from({length: 8192}, () => Math.random() -1/2);
let hanning_window_8192 = hanning_window(8192)
var startTime = performance.now()
time2freqP_1frame(data2, hanning_window_8192)
var endTime = performance.now()
console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
// test avgVectors
console.log("test avgVectors")
var arr1 = ["106","142","112","77","115","127","87","127","156","118","91","93","107","151","110","79","40","186"]
var arr2 = ["117","139","127","108","172","113","79","128","121","104","105","117","139","109","137","109","82","137"]
var arr3 = ["111","85","110","112","108","109","107","89","104","108","123","93","125","174","129","113","162","159"]
console.log(sumVectors([arr1, arr2, arr3]));
// test track buffer
console.log("test track buffer")
const trackBuffer = new TrackBuffer(8);
console.log(trackBuffer.buffer);
trackBuffer.push_item(1);
console.log(trackBuffer.buffer);
trackBuffer.push_array([1,2,3,4]);
console.log(trackBuffer.buffer);
trackBuffer.push_array([5,6,7,8,9]);
console.log(trackBuffer.buffer);
trackBuffer.push_array([10,11,12,13,14,15]);
console.log(trackBuffer.buffer);
console.log(trackBuffer.read_array(1),trackBuffer.read_array(2),trackBuffer.read_array(3),trackBuffer.read_array(4),trackBuffer.read_array(5));
trackBuffer.increase_read_pointer(3);
console.log(trackBuffer.read_array(1),trackBuffer.read_array(2),trackBuffer.read_array(3),trackBuffer.read_array(4),trackBuffer.read_array(5));
//test cyclic buffer
console.log("test cyclic buffer");
const cyclicBuffer = new CyclicBuffer(4,()=>{0});
cyclicBuffer.swap(1);
cyclicBuffer.swap(2);
cyclicBuffer.swap(3);
cyclicBuffer.swap(4);
cyclicBuffer.swap(5);
console.log(cyclicBuffer.buffer);
console.log(cyclicBuffer.read());
// test denoise flow
console.log("======== test denoise flow ========")
let denoiseFlow1 = new DenoiseFlow(4, 2, 3, 3, 3, 0, 3)
for (let i = 0; i < 1; i++) {
    denoiseFlow1.process([1],[0],0)
}
console.log(denoiseFlow1)
//
let denoiseFlow2 = new DenoiseFlow(4, 2, 3, 3, 3, 0, 3)
for (let i = 0; i < 8; i++) {
    denoiseFlow2.process([1],[0],0)
}
console.log(denoiseFlow2)
//
let denoiseFlow3 = new DenoiseFlow(4, 2, 3, 3, 3, 0, 3)
for (let i = 0; i < 32; i++) {
    if (i==10)
    denoiseFlow3.process([0],[0],0)
    else
    denoiseFlow3.process([10],[0],0)
}
console.log(denoiseFlow3)
console.log("==== test denoise flow finish ====")
// test finished
console.log("test finished")
//////////// end 

