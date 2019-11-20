navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

const isUnsaveContext = window.location.protocol !== "https:" && !(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

const createVideoFromWebCam = () => new Promise((resolve, reject) => {
    if (isUnsaveContext) {
        alert("Webcam only works on https:// enabled sites");
        return;
    }

    if (!navigator.getUserMedia) {
        alert("navigator.getUserMedia not supported by your Browser");
        return;
    }

    const video = document.createElement("video");
    video.setAttribute("autoplay", true);

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            const { width, height } = stream.getVideoTracks()[0].getSettings();
            video.width = width;
            video.height = height;
            video.srcObject = stream;

            resolve({ video, width, height });
        })
        .catch(function (err0r) {
            console.log("CAM: Something went wrong!");
            console.error(err0r);
            reject(err0r);
        });

});


class WebCam {
    constructor(width = 100, height = 50) {

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("id", "webcam-canvas");
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        document.body.appendChild(this.canvas);

        // this.initialized = false;

        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;

        // createVideoFromWebCam()
        //     .then(({ video }) => {
        //         this.video = video;
        //         this.video.width = this.width;
        //         this.video.height = this.height;
        //         this.video.style.transform = "scale(-1,1)"
        //         this.initialized = true;
        //     })
        //     .catch(console.error);

        this.video = document.createElement("video");
        this.video.src = "/assets/people-walking.mp4";
        this.video.autoplay = true;
        this.video.loop = true;
        this.initialized = true;

    }

    get pixels() {

        if (!this.initialized) return;
        this.ctx.save();
        this.ctx.translate(this.width, 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
        this.ctx.restore();
        return this.ctx.getImageData(0, 0, this.width, this.height);

    }
}

export default WebCam