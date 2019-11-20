export default function ({ data, width }, origX, origY, colWidth, rowHeight) {

    const amount = colWidth * rowHeight;
    const positions = [];
    let totalR = 0;

    //Accumulate all the pixels in the array;
    for (let i = 0; i < amount; i++) {

        //Relative position in the square
        const rx = i % colWidth;
        const ry = Math.floor(i / colWidth);

        //Get the red value of the pixel
        const r = data[(origX + rx + (origY + ry) * width) * 4];
        totalR += r;
        positions.push(r, rx, ry);
    }

    const posAmount = positions.length / 3;
    let totalX = 0, totalY = 0;

    //Calculate the average of all the points
    for (let i = 0; i < posAmount; i++) {
        const influence = positions[i * 3 + 0] / totalR;
        totalX += positions[i * 3 + 1] * influence;
        totalY += positions[i * 3 + 2] * influence;
    }

    return [totalX / colWidth * 2 - 1, totalY / rowHeight * 2 - 1];
}