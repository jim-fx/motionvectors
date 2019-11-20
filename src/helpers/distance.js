/**
 * 
 * @param {Number} x1 X coordinate of the first point
 * @param {Number} y1 Y coordinate of the first point
 * @param {Number} x2 X coordinate of the second point
 * @param {Number} y2 Y coordinate of the second point
 */
export default function (x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}