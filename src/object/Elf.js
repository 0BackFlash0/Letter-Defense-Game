import Phaser from "phaser";
import Companion from "./Companion";

const LIFE = 4;
const VELOCITY = 25;
const HEARTDISTANCE = 50;
const TIME = 30;
const BARWIDTH = 80;

class Elf extends Companion {
    constructor(scene, name, anim, eventEmitter, wordManager) {
        super(scene, name, anim, eventEmitter);
        this.wordManager = wordManager;
    }

    update(time, deltaTime) {
        if (this.isActived) {
            if (this.isHelping) {
                this.time -= deltaTime;

                this.helpRemain.x = this.companion.x;
                this.helpRemain.y = this.companion.y + 30;
                this.helpRemain.width = BARWIDTH * (this.time / TIME / 1000);

                if (this.time <= 0) {
                    this.isHelping = false;
                    this.time = 0;
                    this.timeout();
                }
            }
            this.bar.x = this.companion.x;
            this.bar.y = this.companion.y + 10;

            this.text.x = this.companion.x;
            this.text.y = this.bar.y - this.bar.height / 2;

            for (let i = 0; i < LIFE; i++) {
                this.hearts[i].x =
                    this.companion.x +
                    0.5 * HEARTDISTANCE * (LIFE - 1) -
                    HEARTDISTANCE * i;
                this.hearts[i].y = this.bar.y - this.bar.height;
            }
        }
    }

    help(x, y, time) {
        if (this.isHelping) {
            this.eventEmitter.emit("elf ult");
            this.eventEmitter.emit("companion timeout", this.name);
            this.isHelping = false;
            this.time = 0;
            return;
        }

        const texts = new Array();
        const word_num = 5;

        for (let i = 0; i < word_num; i++) {
            texts.push(this.wordManager.getRandomWord());
        }

        this.companion.play(`${this.name.toLowerCase()} idle`);
        this.companion.setFlipX(false);
        this.isHelping = true;
        this.time = time * 1000;

        this.companion.x = x;
        this.companion.y = y;
        this.companion.body.velocity.y = 0;

        this.life = 5;
        this.targetTexts = texts;
        this.text.setText(this.targetTexts[this.life - 1]);
        this.helpRemain.visible = true;
        for (let i = 0; i < LIFE; i++) {
            this.hearts[i].visible = false;
        }
    }

    timeout() {
        this.eventEmitter.emit("companion timeout", this.name);
    }
}

export default Elf;
