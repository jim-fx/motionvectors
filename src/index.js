import WebCam from "./inputs/WebCam";
import motion from "./filter/motion";
import Point from "./classes/point";
const cam = new WebCam();

const debugCanvas = document.createElement("canvas");
const height = window.innerHeight;
const width = window.innerWidth;
debugCanvas.width = width;
debugCanvas.height = height;
const ctx = debugCanvas.getContext("2d");

const cols = 10;
const rows = 5;

const colWidth = width / cols;
const rowHeight = height / rows;
document.body.append(debugCanvas);

ctx.strokeStyle = "black";
ctx.lineWidth = 1;

let res, pixels;

const points = [];

function render() {

    if (!localStorage.smooth) {
        setTimeout(render, 2000)
    } else {
        requestAnimationFrame(render);
    }


    if (cam.initialized) {

        ctx.clearRect(0, 0, width, height);

        pixels = cam.pixels;
        res = motion(pixels, cols, rows);

        if (!res || !res[0]) return;

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {

                const _x = colWidth * x + colWidth / 2;
                const _y = rowHeight * y + rowHeight / 2;

                const i = (x + cols * y) * 2;

                const vx = res[i + 0] * 10000;
                const vy = res[i + 1] * 10000;

                /*                 ctx.fillStyle = `rgba(${(vx + 1) * 100}, ${(vy + 1) * 100}, 100, 0.2)`;
                                    ctx.lineWidth = 1;
                                    ctx.fillRect(_x - colWidth / 2, _y - rowHeight / 2, colWidth, rowHeight);
                                    ctx.strokeRect(_x - colWidth / 2, _y - rowHeight / 2, colWidth, rowHeight);
                     */

                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(_x, _y);
                ctx.lineTo(_x - vy, _y - vx);
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(_x - vy, _y - vx, 5, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

    }

}

window.onload = () => {

    for (let i = 0; i < 20; i++) {
        points.push(new Point(width * Math.random(), height * Math.random()))
    }

    render();
}
