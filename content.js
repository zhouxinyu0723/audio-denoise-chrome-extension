chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        console.log()
        if (request.greeting === "hello"){

            config_audio();
              
        }
        sendResponse({farewell: "goodbye"});
    }
); 

async function config_audio(){
    const stream = document.querySelector("video")
    console.log("get video element:", stream)
    //
    const audioContext = new AudioContext({
    latencyHint: 'playback',
    sampleRate: 48000,
    });
    const stream2audioContext = audioContext.createMediaElementSource(stream);
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(
        0.1,
        audioContext.currentTime
    );
    const processorURL = chrome.runtime.getURL('denoise_lib/random-noise-processor.js');
    await audioContext.audioWorklet.addModule(processorURL);
    const randomNoiseNode = new AudioWorkletNode(
        audioContext,
        "random-noise-processor"
    );
    stream2audioContext.connect(gainNode);
    gainNode.connect(randomNoiseNode);
    randomNoiseNode.connect(audioContext.destination);
}