const audioUrl='audio.mp3';
const audioContext = new AudioContext()
const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 256;
const bufferLength = analyzer.frequencyBinCount;
console.log(bufferLength)
const dataArray = new Uint8Array(bufferLength);
analyzer.connect(audioContext.destination);

let isPlaying = false;
let selectedFile;
let currentBuffer;


const selectFile=(arrayBuffer)=>{
    selectedFile=arrayBuffer;
}

const fetchSample=(path)=>{
    fetch(path).then(data=>data.arrayBuffer()).then(arrayBuffer=>audioContext.decodeAudioData(arrayBuffer)).then(playAudio)
}

const playAudio=(audioBuffer)=>{
    if(!isPlaying){
    isPlaying = true;
    const source = audioContext.createBufferSource();
    source.connect(analyzer);
    source.buffer = audioBuffer;
    currentBuffer = source;
    source.start();
    }
}

const stopAudio=()=>{
    if(isPlaying)
    {
        currentBuffer.stop();
        isPlaying=false;
        currentBuffer=null;
    }
}


window.onload=()=>{
    document.addEventListener('click',()=>{
        audioContext.resume().then(()=>console.log('resume'))
    },{
        once:true
    });

    document.querySelector('#play').addEventListener('click',()=>{
        // fetchSample(audioUrl);
        if(selectedFile){
            const audioBuffer = audioContext.decodeAudioData(selectedFile).then(playAudio)
        }
    }
    );

    document.querySelector('#stop').addEventListener('click',()=>{
        stopAudio()
    }
    );


    document.querySelector('#audio-file').onchange = function(){
        var fileReader  = new FileReader;
        fileReader.onload = function(){
           selectFile(this.result);
           }
        fileReader.readAsArrayBuffer(this.files[0]);
      };
}



