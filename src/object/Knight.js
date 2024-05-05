import Phaser from "phaser";
import Companion from "./Companion";

const LIFE = 4;
const VELOCITY = 25;
const HEARTDISTANCE = 50;
const TIME = 30;
const BARWIDTH = 80;

class Knight extends Companion {
    constructor(scene, name, anim, eventEmitter) {
        super(scene, name, anim, eventEmitter);
    }

    help(x, y, time) {
        super.help(x, y, time);
        this.eventEmitter.emit("knight damage");
    }

    timeout() {
        this.eventEmitter.emit("companion timeout", this.name);
        this.eventEmitter.emit("knight off");
    }
}

export default Knight;
