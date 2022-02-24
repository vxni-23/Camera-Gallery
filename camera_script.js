let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let constraints = {
    video : true,
    audio : true
}
let recorder;
let chunks = [];
let recordFlag = false;
let transparentColor = "transparent";

//navigator -> global, browser info
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) =>{
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", (e) => {
        chunks = [];
    })
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop", (e) => {
        let blob = new Blob(chunks, {type: "video/mp4"});

        if(db){
            let videoID = shortid();
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id : `vid-${videoID}`,
                blobData : blob
            }
            videoStore.add(videoEntry);
        }
        // let videoURL = URL.createObjectURL(blob);

        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "stream.mp4"
        // a.click();
    })
})


recordBtnCont.addEventListener("click", function(e){
    if(!recorder) return;
    recordFlag = !recordFlag;
    if(recordFlag){
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{
        recorder.stop()
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
})

let timerID;
let counter = 0; //represents total seconds
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;
        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        if(hours < 10) hours = `0${hours}`; else hours = hours;
        if(minutes < 10) minutes = `0${minutes}`; else minutes = minutes;
        if(seconds < 10) seconds = `0${seconds}`; else seconds = seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID = setInterval(displayTimer, 1000);
}

function stopTimer(){
    clearInterval(timerID);
    timer.style.display = "none";
    timer.innerText = "00:00:00";
}

captureBtnCont.addEventListener("click", (e) => {
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();
    if(db){
        let imageID = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id : `img-${imageID}`,
            url : imageURL
        }
        imageStore.add(imageEntry);
    }
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 1000);

    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();
})

let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", function(e){
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})
