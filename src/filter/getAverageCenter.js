import gui from "../helpers/gui";

const params = {
    scale: 5,
    THRESH: 0.8,
    USE_THRESHOLD: true,
    DEBUG: false

}
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
document.body.append(canvas);
canvas.id = "filter-canvas";

gui.add(params);

export default function ({ data, width, height }, origX, origY, colWidth, rowHeight) {

    const { scale, THRESH, USE_THRESHOLD, DEBUG } = params;

    ctx.clearRect(origX * scale, origY * scale, colWidth * scale, rowHeight * scale)

    const amount = colWidth * rowHeight;

    const positions = [];
    let totalR = 0;
    let maxR = 0;

    for (let i = 0; i < amount; i++) {

        const rx = i % colWidth;
        const ry = Math.floor(i / colWidth);

        const ax = origX + rx;
        const ay = origY + ry;

        const r = data[(ax + ay * width) * 4];

        totalR += r;
        maxR = Math.max(r, maxR);

        positions.push(r, rx, ry);

        if (DEBUG) {
            ctx.fillStyle = `rgb(${r}, ${r}, ${r})`;
            ctx.fillRect(ax * scale, ay * scale, 1, 1)
        }

    }

    const posAmount = positions.length / 3;
    let totalAmount = 1;
    let totalX = 0, totalY = 0;

    const thresh = THRESH * maxR;

    for (let i = 0; i < posAmount; i++) {
        const r = positions[i * 3 + 0];
        const rx = positions[i * 3 + 1];
        const ry = positions[i * 3 + 2];

        if (USE_THRESHOLD) {
            if (r > thresh) {
                totalAmount++;
                totalX += rx;
                totalY += ry;
                DEBUG && (ctx.fillStyle = `rgb(${r / 2}, ${r / 2}, ${r / 2})`);
            } else {
                DEBUG && (ctx.fillStyle = `rgb(${r}, ${r / 2}, ${r / 2})`);
            }
        } else {
            const influence = r / totalR;
            totalX += rx * influence;
            totalY += ry * influence;
        }

        DEBUG && ctx.fillRect(rx + origX * scale, ry + origY * scale, scale, scale);

    }

    const cx = (USE_THRESHOLD ? totalX / totalAmount : totalX) / colWidth * 2 - 1;
    const cy = (USE_THRESHOLD ? totalY / totalAmount : totalY) / rowHeight * 2 - 1;

    if (DEBUG) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        //ctx.strokeRect(origX * scale, origY * scale, colWidth * scale, rowHeight * scale);

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc((origX + colWidth / 2) * scale + cx * colWidth, (origY + rowHeight / 2) * scale + cy * rowHeight, 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    return [cx, cy];
}