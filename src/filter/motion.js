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
    const colWidth = width / cols;
    const rowHeight = height / rows;
    const amount = cols * rows;

    //VECTORS BETWEEN THE CURRENT AND THE LAST CENTERS
    const motionVectors = [];

    //If we are on the first frame we 
    //need some placeholder data for 
    //the previous frame, because it doesnt exist
    if (!init) {
        for (let i = 0; i < amount; i++) {
            lastMotionVectors.push(0, 0)
            lastCenters.push(0, 0)
        }
    }

    //Loop through all the squares
    for (let i = 0; i < amount; i++) {

        const x = (i % cols) * colWidth;
        const y = Math.floor(i / cols) * rowHeight;

        const [cx, cy] = getAverageCenter(pixels, x, y, colWidth, rowHeight);

        const index0 = i * 2 + 0;
        const index1 = i * 2 + 1;

        //CALCULATE THE VECTORS BETWEEN 
        //THIS SQUARE AND THE LAST SQUARE
        if (init) {

            motionVectors[index0] = lerp(cx - lastCenters[index0] || 0, lastMotionVectors[index0] || 0, 0.98) || 0;
            motionVectors[index1] = lerp(cy - lastCenters[index1] || 0, lastMotionVectors[index1] || 0, 0.98) || 0;

            lastMotionVectors[index0] = motionVectors[index0] || 0;
            lastMotionVectors[index1] = motionVectors[index1] || 0;
        }

        lastCenters[index0] = cx;
        lastCenters[index1] = cy;

    }

    if (init) {
        return motionVectors;
    } else {
        init = true;
        return;
    }
}