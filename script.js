import CustomMic from "./customMic.js";
document.addEventListener('DOMContentLoaded', (event) => {
    // Function for button 1 click event
    let mic = null;
    function getChunkSize() {
        const chunkSizeInput = document.getElementById('chunksize');
        const chunkSize = parseInt(chunkSizeInput.value, 10);
        if (isNaN(chunkSize) || chunkSize < 3) {
            return null;
        }
        return chunkSize;
    }

    async function handleButton1Click() {
        const chunkSize = getChunkSize();
        const errorMessage = document.getElementById('error-message');
        if (chunkSize === null) {
            errorMessage.style.display = 'inline';
            return;
        }
        errorMessage.style.display = 'none';
        mic = new CustomMic(chunkSize);
        await mic.startMic();
        mic.on("recordedData", data => {
            console.log(data);
            let audioArray = data[0];
            let endOfStream = data[1];
            const audioFileInWav = new File([audioArray], `filename`, { type: "audio/wav" });
        });
        updateButtonStates();
    }

    // Function for button 2 click event
    function handleButton2Click() {
        if (mic) {
            mic.stopMic();
        }
        mic = null;
        updateButtonStates();
    }

    function updateButtonStates() {
        const startButton = document.getElementById('startbutton');
        const stopButton = document.getElementById('stopbutton');

        if (mic === null) {
            startButton.disabled = false;
            stopButton.disabled = true;
        } else {
            startButton.disabled = true;
            stopButton.disabled = false;
        }
    }

    // Add event listeners to the buttons
    document.getElementById('startbutton').addEventListener('click', handleButton1Click);
    document.getElementById('stopbutton').addEventListener('click', handleButton2Click);
    updateButtonStates();
});