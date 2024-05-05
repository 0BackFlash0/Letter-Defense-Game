import Phaser from "phaser";

const LIFE = 4;
const VELOCITY = 25;
const HEARTDISTANCE = 50;
const TIME = 30;
const BARWIDTH = 80;
const COMPANIONDEPTH = 2;
const COMPANIONUIDEPTH = 4;

class Companion {
    constructor(scene, name, anim, eventEmitter) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;

        this.isActived = false;
        this.isHelping = false;
        this.targetTexts = [];
        this.life = 0;
        this.time = 0;
        this.name = name;

        this.bar = null;
        this.text = null;
        this.companion = null;
        this.hearts = new Array();
        this.helpRemain = null;

        this.initialize(name, anim);
    }

    initialize(name, anim) {
        this.bar = this.scene.add
            .image(0, 0, "enemy bar")
            .setOrigin(0.5, 1)
            .setDepth(COMPANIONUIDEPTH);
        this.text = this.scene.add
            .text(0, 0, "", {
                fontFamily: "Jua",
                fontSize: "36px",
                fill: "#FFFFFF",
            })
            .setOrigin(0.5, 0.45)
            .setDepth(COMPANIONUIDEPTH);

        this.companion = this.scene.physics.add
            .sprite(0, 0, name)
            .setScale(5)
            .setOrigin(0.5, 0)
            .setFlipX(true);

        this.companion.play(anim).setDepth(COMPANIONDEPTH);

        for (let i = 0; i < LIFE; i++) {
            const heart = this.scene.add
                .sprite(0, 0, "companion heal")
                .setOrigin(0.5, 1)
                .setDepth(COMPANIONUIDEPTH);
            this.hearts.push(heart);
            this.hearts[i].visible = false;
        }

        this.helpRemain = this.scene.add
            .rectangle(0, 0, BARWIDTH, 10, 0xfff70d)
            .setOrigin(0.5, 1)
            .setDepth(COMPANIONUIDEPTH);

        this.companion.visible = false;
        this.bar.visible = false;
        this.text.visible = false;
        this.helpRemain.visible = false;
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
            } else {
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
    }

    checkBoundary(boundary) {
        return this.companion.y > boundary;
    }

    checkText(text) {
        if (
            this.targetTexts.length > 0 &&
            this.targetTexts[this.life - 1] === text
        ) {
            return true;
        } else {
            return false;
        }
    }

    damaged(damage) {
        for (let i = 0; i < damage && this.life > 0; i++) {
            this.life -= 1;
            if (!this.isHelping) {
                this.hearts[this.life].play("companion heart heal");
            }

            if (this.life >= 1) {
                this.text.setText(this.targetTexts[this.life - 1]);
            } else {
                this.text.setText("");
            }
        }
    }

    remove() {
        this.isActived = false;

        this.targetTexts = [];
        this.text.setText("");
        this.bar.visible = false;
        this.text.visible = false;
        this.helpRemain.visible = false;

        this.companion.visible = false;

        for (let i = 0; i < LIFE; i++) {
            this.hearts[i].visible = false;
            this.hearts[i].setFrame(0);
        }

        this.companion.body.velocity.x = 0;
    }

    generate(x, y, texts, velocity_ratio) {
        this.isActived = true;
        this.companion.play(`${this.name.toLowerCase()} walk`);
        this.companion.setFlipX(true);

        this.life = LIFE;
        this.companion.body.velocity.y = VELOCITY * velocity_ratio;

        this.companion.x = x;
        this.companion.y = y;

        this.targetTexts = texts.slice();
        this.text.setText(texts[this.life - 1]);

        this.companion.visible = true;
        this.bar.visible = true;
        this.text.visible = true;

        for (let i = 0; i < LIFE; i++) {
            this.hearts[i].visible = true;
        }
    }

    help(x, y, time) {
        this.isHelping = true;
        this.time = time * 1000;
        this.companion.play(`${this.name.toLowerCase()} idle`);
        this.companion.setFlipX(false);

        this.companion.x = x;
        this.companion.y = y;
        this.companion.body.velocity.y = 0;

        this.bar.visible = false;
        this.text.visible = false;
        this.helpRemain.visible = true;
        for (let i = 0; i < LIFE; i++) {
            this.hearts[i].visible = false;
        }
    }

    timeout() {}
}

export default Companion;
