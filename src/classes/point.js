import lerp from "../helpers/lerp";
import gui from "../helpers/gui";
import distance from "../helpers/distance";

const params = {
    MOTION_STRENGTH: 1,
    MOTION_STRENGTHMax: 100000,
    REPPEL_STRENGTH: 0.0001,
    REPPEL_STRENGTHMin: -0.001,
    REPPEL_STRENGTHMax: 0.001,
    REPPEL_DISTANCE: 100,
    REPPEL_DISTANCEMax: 500,
    DEBUG_PHYSICS: false,
}

gui.add(params);

class Point {
    constructor(width, height, ctx) {
        this.ctx = ctx;

        this.width = width;
        this.height = height;

        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.px = this.x;
        this.py = this.y;

        this.mvx = 0;
        this.mvy = 0;

        this.vx = Math.random();
        this.vy = Math.random();

        this.all.push(this);

    }

    update(res) {


        const { MOTION_STRENGTH, REPPEL_STRENGTH, REPPEL_DISTANCE, DEBUG_PHYSICS: DEBUG } = params;

        //-------
        // Calculate impact of motion
        //--------

        const xPos = Math.floor(this.x / this.width * 10);
        const yPos = Math.floor(this.y / this.height * 5);

        if (xPos < 10 && yPos < 5) {

            const motionX = xPos * (this.width / 10) + this.width / 20;
            const motionY = yPos * (this.height / 5) + this.height / 10;

            if (DEBUG) {
                this.ctx.strokeStyle = "red";
                this.ctx.beginPath();
                this.ctx.moveTo(motionX, motionY);
                this.ctx.lineTo(this.x, this.y);
                this.ctx.stroke();
            }

            const i = xPos + yPos * 10;
            this.mvx = lerp(res[i * 2 + 0] * MOTION_STRENGTH, this.mvx, 0.92);
            this.mvy = lerp(res[i * 2 + 1] * MOTION_STRENGTH, this.mvy, 0.92);

            this.vx = lerp(this.vx, this.mvx, 0.1);
            this.vy = lerp(this.vy, this.mvy, 0.1);
        } else {
            this.mvx = 0
            this.mvy = 0;
        }



        //--------
        // DONT LET THEM BE TO CLOSE TO EACH OTHER
        //--------

        if (DEBUG) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, REPPEL_DISTANCE, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        const l = Point.prototype.all.length;
        for (let i = 0; i < l; i++) {
            const p = Point.prototype.all[i];
            const dist = distance(this.x, this.y, p.x, p.y);

            if (dist < REPPEL_DISTANCE * 2) {
                const alpha = dist / REPPEL_DISTANCE;

                if (DEBUG) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.x, this.y);
                    this.ctx.closePath();
                    this.ctx.stroke();
                }

                const rx = this.x - p.x;
                const ry = this.y - p.y;

                this.vx = lerp(this.vx, this.vx + rx * alpha, REPPEL_STRENGTH);
                this.vy = lerp(this.vy, this.vy + ry * alpha, REPPEL_STRENGTH);

            }

        }


        //--------
        // CALM THEM DOWN, BUT DONT LET THEM REST
        //--------

        this.vx *= 0.98;
        this.vy *= 0.98;

        if (Math.abs(this.vx) < 0.1) this.vx *= 1.1;
        if (Math.abs(this.vy) < 0.1) this.vy *= 1.1;

        //--------
        // BUT LET THEM COLLIDE
        //--------

        if (this.x + this.vx > this.width || this.x + this.vx < 0) this.vx *= -1;
        if (this.y + this.vy > this.height || this.y + this.vy < 0) this.vy *= -1;

        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }

    draw() {

        this.ctx.strokeStyle = "white";

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.px, this.py);
        this.ctx.stroke();

        this.px = this.x;
        this.py = this.y;
    }
}

Point.prototype.all = [];

export default Point;