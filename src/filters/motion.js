import getAverageCenter from "./getAverageCenter";
import lerp from "../helpers/lerp";

let lastFrame;
let lastCenters = [];
let lastMotionVectors = [];
let init = false;

/**
 * 
 * @param {ImageData} pixels Pixels to analyze
 * @param {number} rows amount of rows to analyze
 * @param {number} cols amount of cols to analyze
 */

export default function getMotionVectors(pixels, cols, rows) {

    if (!lastFrame) {
        lastFrame = pixels;
        return false;
    }

    const { width, height } = pixels;

    const amount = cols * rows;

    //VECTORS BETWEEN THE CURRENT AND THE LAST CENTERS
    const motionVectors = [];

    const colWidth = Math.floor(width / cols);
    const rowHeight = Math.floor(height / rows);

    window.cw = colWidth;
    window.rh = rowHeight;

    //If we are on the first frame we 
    //need some placeholder data for 
    //the previous frame, because it doesnt exist
    if (!init) {
        for (let i = 0; i < amount; i++) {
            lastMotionVectors.push(0, 0)
            lastCenters.push(0, 0)
        }
    }

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {

            //TOP LEFT CORNER OF SQUARE
            const leftX = x * colWidth;
            const topY = y * rowHeight;

            //COMPUTE CENTER BY BRIGHTNESS
            const [cx, cy] = getAverageCenter(pixels, leftX, topY, colWidth, rowHeight);

            //CONVERT XY TO INDEX
            const i = x + y * cols;

            const index0 = i * 2 + 0;
            const index1 = i * 2 + 1;

            //CALCULATE THE VECTORS BETWEEN 
            //THIS SQUARE AND THE LAST SQUARE
            if (init) {

                motionVectors[index0] = lerp(cx - lastCenters[index0], lastMotionVectors[index0], 0.8);
                motionVectors[index1] = lerp(cy - lastCenters[index1], lastMotionVectors[index1], 0.8);

                lastMotionVectors[index0] = motionVectors[index0];
                lastMotionVectors[index1] = motionVectors[index1];
            }

            lastCenters[index0] = cx;
            lastCenters[index1] = cy;
        }

    }

    if (init) {
        return motionVectors;
    } else {
        init = true;
        return;
    }
}