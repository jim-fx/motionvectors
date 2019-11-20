import WebCam from "./inputs/WebCam";
import motion from "./filter/motion";
import Point from "./classes/point";
import gui from "./helpers/gui";
const cam = new WebCam();

const params = {
    DEBUG_MOTION: false,
    BG_ALPHA: 0,
    BG_ALPHAMax: 1
}

gui.add(params);

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

let res;
const points = [];

function render() {

    requestAnimationFrame(render);

    if (cam.initialized) {

        const { DEBUG_MOTION, BG_ALPHA } = params;

        ctx.fillStyle = `rgba(0, 0, 0, ${BG_ALPHA})`
        ctx.fillRect(0, 0, width, height);

        res = motion(cam.pixels, cols, rows);

        if (!res || !res[0]) return;

        if (DEBUG_MOTION) {
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {

                    const _x = colWidth * x + colWidth / 2;
                    const _y = rowHeight * y + rowHeight / 2;

                    const i = (x + cols * y) * 2;

                    const vx = res[i + 0] * 10000;
                    const vy = res[i + 1] * 10000;

                    ctx.strokeStyle = "white";
                    ctx.beginPath();
                    ctx.moveTo(_x, _y);
                    ctx.lineTo(_x - vy, _y - vx);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.fillStyle = "red";
                    ctx.beginPath();
                    ctx.arc(_x - vy, _y - vx, 5, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }

        points.forEach(p => p.update(res));
        points.forEach(p => p.draw());

    }

}

window.onload = () => {

    for (let i = 0; i < 100; i++) {
        points.push(new Point(width, height, ctx))
    }

    render();
}
