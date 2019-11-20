import WebCam from "./inputs/WebCam";
import motion from "./filters/motion";

const cam = new WebCam();

const debugCanvas = document.createElement("canvas");
const height = window.innerHeight;
const width = window.innerWidth;
debugCanvas.width = width;
debugCanvas.height = height;
const ctx = debugCanvas.getContext("2d");

const cols = Math.floor(window.innerWidth / 10);
const rows = Math.floor(window.innerHeight / 10);

window._cols = cols;
window._rows = rows;

window.ctx = ctx;
const colWidth = width / cols;
const rowHeight = height / rows;
document.body.append(debugCanvas);

const round = num => Math.floor(num * 100) / 100;

ctx.strokeStyle = "black";
ctx.lineWidth = 1;

let res, pixels, index = 0;

function render() {
    /* 
        if (index < 4) {
            index++;
            setTimeout(render, 1000)
        } */

    requestAnimationFrame(render);

    if (cam.initialized) {

        ctx.clearRect(0, 0, width, height);

        pixels = cam.pixels;
        res = motion(pixels, cols, rows);

        if (!res) return;


        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {

                const _x = colWidth * x + colWidth / 2;
                const _y = rowHeight * y + rowHeight / 2;

                const i = (x + cols * y) * 2;

                const vx = res[i + 0] * colWidth * 5;
                const vy = res[i + 1] * rowHeight * 5;

                /*  ctx.fillStyle = `rgba(${vx * 100}, ${vy * 100}, 100, 0.5)`;
                 ctx.lineWidth = 3;
                 ctx.fillRect(_x - colWidth / 2, _y - rowHeight / 2, colWidth, rowHeight);
                 ctx.strokeRect(_x - colWidth / 2, _y - rowHeight / 2, colWidth, rowHeight);
 
                 ctx.fillStyle = "white";
                 ctx.fillText(round(vx), _x - colWidth / 2, _y - rowHeight / 2 + 10);
                 ctx.fillText(round(vy), _x - colWidth / 2, _y - rowHeight / 2 + 20);
 
 
                 ctx.strokeStyle = "white";
                 ctx.lineWidth = 2;
                 ctx.beginPath();
                 ctx.moveTo(_x, _y);
                 ctx.lineTo(_x + vy, _y + vx);
                 ctx.closePath();
                 ctx.stroke();
  */
            }
        }

    }

}

window.onload = () => {
    render();
}
