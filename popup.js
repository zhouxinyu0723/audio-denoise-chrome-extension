document.addEventListener(
	"DOMContentLoaded", async function() {
        console.log('popup.js starts');

        document.getElementById("denoise_switch").addEventListener('change', function(e) {
            console.log('click');
            console.log(e.target.checked);
            if (e.target.checked){
                chrome.runtime.sendMessage({command: "testing", greeting: "hello"}, function(response) {
                        console.log(response.farewell);
                    });
                
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {command: "testing", greeting: "hello"}, function(response) {
                        console.log(response.farewell);
                        });
                  });
            }

            if (!e.target.checked){
                chrome.runtime.sendMessage({command: "testing", greeting: "hello"}, function(response) {
                    console.log(response.farewell);
                });
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {command: "testing", greeting: "hello"}, function(response) {
                        console.log(response.farewell);
                    });

                });
            }
        });
    });

