async function play(){
    // get the audio element
    const audioElement = document.querySelector('audio');

    // initiate the audio context
    const audioContext = new AudioContext({});



    // pass it into the audio context
    const track = audioContext.createMediaElementSource(audioElement);

    // create processor
    await audioContext.audioWorklet.addModule("http://127.0.0.1:5500/denoise_lib/test/audio_processor.js");
    const randomNoiseNode = new AudioWorkletNode(
        audioContext,
        "audio_processor"
    );

    //connect
    track.connect(randomNoiseNode);
    randomNoiseNode.connect(audioContext.destination);

    track.connect(audioContext.destination);
    audioElement.play();
}

const playButton = document.querySelector('button');
playButton.addEventListener('click', () => {
    play();
    // // Check if context is in suspended state (autoplay policy)
    // if (audioContext.state === 'suspended') {
    //   audioContext.resume();
    // }
  
    // // Play or pause track depending on state
    // if (playButton.dataset.playing === 'false') {
    //   audioElement.play();
    //   playButton.dataset.playing = 'true';
    // } else if (playButton.dataset.playing === 'true') {
    //   audioElement.pause();
    //   playButton.dataset.playing = 'false';
    // }
  }, false);