document.addEventListener(
	"DOMContentLoaded", async function() {
        console.log('popup.js starts');
            
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "check_activated", value: 0}, function(response) {
            console.log(response.value? "activated" : "not_activated");
            document.getElementById("activated").checked = response.value;
            });
        });

        document.getElementById("denoise_scale").addEventListener('change', function(e) {
            console.log("denoise_scale changed to" + document.getElementById("denoise_scale").value)
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: "change_denoise_scale", value: document.getElementById("denoise_scale").value}, function(response) {
                console.log(response.value);
                });
            });
        });

        document.getElementById("activated").addEventListener('change', function(e) {
            console.log('click');
            console.log(e.target.checked);
            if (e.target.checked){
                // chrome.runtime.sendMessage({command: "testing", greeting: "hello"}, function(response) {
                //         console.log(response.farewell);
                //     });
                
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {command: "activating", greeting: "hello"}, function(response) {
                        console.log(response.farewell);
                        });
                  });
            }

            if (!e.target.checked){
                // chrome.runtime.sendMessage({command: "testing", greeting: "hello"}, function(response) {
                //     console.log(response.farewell);
                // });
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {command: "testing", greeting: "hello"}, function(response) {
                        console.log(response.farewell);
                    });

                });
            }
        });
    });

