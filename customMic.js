import EventEmitter from "./eventEmitter.js";
export class CustomMic extends EventEmitter{
    constructor(chunkSize=500) {
        super();
        this.context = new AudioContext();
        this.microphone = null;
        this.recorder = null;
        this.source = null;
        this.chunkSize = chunkSize
    }
    
    async startMic() {
        // const context = this.context;
        this.microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.source = this.context.createMediaStreamSource(this.microphone);
        await this.context.audioWorklet.addModule("recorder.worklet.js")
        
        this.recorder = new AudioWorkletNode(this.context, "recorder.worklet", {
            processorOptions: {
                bufferApproxSize: (this.context.sampleRate/1000)*this.chunkSize,
                sampleRate: this.context.sampleRate
            },
        });
        // const recorder = new AudioWorkletNode(context, "recorder.worklet");
        this.source.connect(this.recorder).connect(this.context.destination)
        this.recorder.port.onmessage = (e) => {
            // console.log(e.data);
            this.emit('recordedData',e.data)
        }
    }

    stopMic() {
        this.recorder.port.postMessage('Stop');
        if (this.recorder) {
            this.recorder.disconnect();
        }

        if (this.microphone) {
            const tracks = this.microphone.getTracks();
            tracks.forEach(track => track.stop());
        }
        if (this.source) {
            this.source.disconnect();
        }
    }
}
export default CustomMic;