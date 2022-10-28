import baseComplexArray from './jsfft-master/lib/complex_array.js';
import * as fft from './jsfft-master/lib/fft.js';

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
        freq = fft.FFT(input);
    }else{
        freq = fft.FFT(mulVector(input, hanning_window));   
    }
    let freqPow = freq.power();
    let freqAng = freq.angle();
    let totaPow = freqPow.reduce((partialSum, e) => partialSum + e, 0);
    return {
        freqAng: freqAng,
        freqPow: freqPow,
        totaPow: totaPow
      };
    }
export function freq2time_1frame(freqPow, freqAng, hanning_window){
    let freqAmp = sqrtVector(freqPow);
    const freq = new fft.ComplexArray(freqAmp.length).map((value, i, n) => {
        value.real = freqAmp[i]*Math.cos(freqAng[i]);
        value.imag = freqAmp[i]*Math.sin(freqAng[i]); 
      });
    let time_re = fft.InvFFT(freq);
    if (hanning_window == 0 ){
        let scale = 1/freqPow.length;
        return time_re.real.map((e)=>{return e*scale});
    }else{
        let scale = 1/freqPow.length;
        return mulVector(time_re.real.map((e)=>{return e*scale}), hanning_window);
    }
}