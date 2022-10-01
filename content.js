chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        console.log()
        if (request.command === "background2content_streamId"){
            console.log("background2content streamId success: ", request.streamId);

            streamId = request.streamId;

            const stream = document.querySelector("video")
              //
            const audioContext = new AudioContext({
            latencyHint: 'interactive',
            sampleRate: 48000,
            });
            audioContext.latencyHint = "playback";
            const stream2audioContext = audioContext.createMediaElementSource(stream);
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(
                0.1,
                audioContext.currentTime
            );
            const processorURL = chrome.runtime.getURL('random-noise-processor.js');
            await audioContext.audioWorklet.addModule(processorURL);
            const randomNoiseNode = new AudioWorkletNode(
                audioContext,
                "random-noise-processor"
            );
            stream2audioContext.connect(gainNode);
            //gainNode.connect(randomNoiseNode);

            gainNode.connect(audioContext.destination);

            const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const results = nums.map(n => {
              const tensors = [];
              const start = performance.now();
              for (let i = 0; i < 100; i++) {
                const real = tf.ones([10, n * 10]);
                const imag = tf.ones([10, n * 10]);
                const input = tf.complex(real, imag);
                const res = tf.spectral.fft(input);
                res.dataSync();
              }
              return performance.now() - start;
            });
            console.log(results);
              
        }
        sendResponse({farewell: "goodbye"});
    }
); 