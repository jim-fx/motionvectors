/**
 * 
 * @param {number} a First Number 
 * @param {number} b Seconds number
 * @param {number} n Alpha value
 */
export default function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}