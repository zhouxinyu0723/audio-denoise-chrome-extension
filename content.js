let my_obj = {}

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if (request.command === "check_activated"){
            const activated = my_obj.deNoiseNode.parameters.get("cancel_activate");
            sendResponse({value: activated.value});
        }
        if (request.command === "check_denoise_scale"){
            const denoise_scale = my_obj.deNoiseNode.parameters.get("denoise_scale");
            sendResponse({value: denoise_scale.value});
        }

        // if (request.command === "check_canceled_power"){
        //     const canceled_power_l = my_obj.deNoiseNode.parameters.get("canceled_power_l");
        //     const canceled_power_r = my_obj.deNoiseNode.parameters.get("canceled_power_r");
        //     console.log(canceled_power_l)
        //     console.log(canceled_power_r)
        //     sendResponse({value_l: canceled_power_l[0], value_r: canceled_power_r[0]});
        // }

        if (request.command === "check_noise_upper_bound"){
            const noise_upper_bound = my_obj.deNoiseNode.parameters.get("noise_upper_bound");
            sendResponse({value: noise_upper_bound.value});
        }
        if (request.command === "activating"){
            config_audio();
        }
        if (request.command === "deactivating"){
            closeAudio();
        }
        if (request.command === "change_denoise_scale"){
            console.log("denoise_scale changed to" + request.value);
            const denoise_scale = my_obj.deNoiseNode.parameters.get("denoise_scale");
            denoise_scale.setValueAtTime(request.value, my_obj.audioContext.currentTime);
            sendResponse({value: "success"});
        }
        if (request.command === "change_noise_upper_bound"){
            console.log("noise_upper_bound changed to" + request.value);
            const noise_upper_bound = my_obj.deNoiseNode.parameters.get("noise_upper_bound");
            noise_upper_bound.setValueAtTime(request.value, my_obj.audioContext.currentTime);
            sendResponse({value: "success"});
        }
        sendResponse({farewell: "goodbye"});
    }
); 



async function config_audio(){
    if(my_obj.deNoiseNode){
        // my_obj.stream2audioContext.disconnect();
        // my_obj.stream2audioContext.connect(my_obj.deNoiseNode);
        // my_obj.deNoiseNode.connect(my_obj.audioContext.destination);

        const cancel_activate = my_obj.deNoiseNode.parameters.get("cancel_activate");
        cancel_activate.setValueAtTime(true, my_obj.audioContext.currentTime);
    }else{
        my_obj.stream = document.querySelector("video")
        console.log(my_obj.stream)
        if (my_obj.stream){
            console.log("get video element:", my_obj.stream)
            my_obj.audioContext = new AudioContext({
            latencyHint: 'playback',
            sampleRate: 48000,
            });
            my_obj.stream2audioContext = my_obj.audioContext.createMediaElementSource(my_obj.stream);

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
    }
}

const closeAudio = () => {
    if (my_obj.deNoiseNode){
    const cancel_activate = my_obj.deNoiseNode.parameters.get("cancel_activate");
    cancel_activate.setValueAtTime(false, my_obj.audioContext.currentTime);
    }
    // if (my_obj.audioContext) {
    //     my_obj.stream2audioContext.disconnect();
    //     my_obj.deNoiseNode.disconnect();
    //     my_obj.stream2audioContext.connect(my_obj.audioContext.destination);
    // }
};