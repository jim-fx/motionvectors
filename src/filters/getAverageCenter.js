let SAMPLE_SIZE = 1;

/* const canvas = document.createElement("canvas");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.id = "filter-canvas";
canvas.width = width;
canvas.height = height;
canvas.style.zIndex = 99;
const ctx = canvas.getContext("2d");
document.body.append(canvas); 

const cols = Math.floor(window.innerWidth / 60);
const rows = Math.floor(window.innerHeight / 60);*/

/**
 * @description Computes the center in a square of pixels based on brightness
 * @param {ImageData} ImageData the input image
 * @param {number} leftX 
 * @param {number} topY
 * @param {number} squareWidth
 * @param {number} squareHeight
 */

export default function ({ data, width, height }, leftX, topY, colWidth, rowHeight) {

    const ctx = window.ctx;

    //Accumulate all the pixels in the square
    let maxR = 0;
    let totalR = 0;
    const positions = [];

    for (let x = 0; x < colWidth; x++) {
        for (let y = 0; y < rowHeight; y++) {
            const r = data[(x + leftX) + width * (y + topY)];
            maxR = Math.max(maxR, r);
            totalR = totalR + r;
            positions.push(r, x, y);
            ctx.fillStyle = `rgb(${r}, ${r}, ${r})`;
            ctx.fillRect((leftX + x * colWidth), (topY + y * colWidth), colWidth, rowHeight);
        }
    }

    //Calculate the average x,y pos
    let totalX = 0, totalY = 0;
    const l = positions.length / 3;

    for (let i = 0; i < l; i++) {
        const r = positions[i * 3 + 0];
        const x = positions[i * 3 + 1];
        const y = positions[i * 3 + 2];

        const influence = r / totalR;
        totalX += x * influence;
        totalY += y * influence;
    }

    const x = totalX / colWidth * 2 - 1;
    const y = totalY / rowHeight * 2 - 1;

    return [x || 0, y || 0];

}