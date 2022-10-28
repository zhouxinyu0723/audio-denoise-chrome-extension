let my_obj = {}

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        console.log()
        if (request.command === "check_activated"){
            sendResponse({value: ("audioContext" in my_obj)});
        }
        if (request.command === "activating"){
            config_audio();
        }
        if (request.command === "change_denoise_scale"){

            console.log("denoise_scale changed to" + request.value);
            const denoise_scale = my_obj.deNoiseNode.parameters.get("denoise_scale");
            denoise_scale.setValueAtTime(request.value, my_obj.audioContext.currentTime);
            sendResponse({value: "success"});
        }
        sendResponse({farewell: "goodbye"});
    }
); 



async function config_audio(){
    my_obj.stream = document.querySelector("video")
    console.log("get video element:", my_obj.stream)
    //
    my_obj.audioContext = new AudioContext({
    latencyHint: 'playback',
    sampleRate: 48000,
    });
    my_obj.stream2audioContext = my_obj.audioContext.createMediaElementSource(my_obj.stream);
    // const gainNode = audioContext.createGain();
    // gainNode.gain.setValueAtTime(
    //     1,
    //     audioContext.currentTime
    // );
    const processorURL = chrome.runtime.getURL('denoise_lib/de-noise-processor.js');
    console.log(processorURL)
    await my_obj.audioContext.audioWorklet.addModule(processorURL);
    my_obj.deNoiseNode = new AudioWorkletNode(
        my_obj.audioContext,
        "de_noise_processor"
    );
    my_obj.stream2audioContext.connect(my_obj.deNoiseNode);
    my_obj.deNoiseNode.connect(my_obj.audioContext.destination);
}