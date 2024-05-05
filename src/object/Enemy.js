import Phaser from "phaser";

const LIFE = { small: 1, normal: 2, big: 3 };
const VELOCITY = { small: 60, normal: 40, big: 30 };
const HEARTDISTANCE = 50;
const ENEMYDEPTH = 1;
const ENEMYUIDEPTH = 3;

class Enemy {
    constructor(scene, name, anim, size) {
        this.scene = scene;
        this.size = size;

        this.isActived = false;
        this.targetTexts = [];
        this.life = 0;

        this.bar = null;
        this.text = null;
        this.enemy = null;
        this.hearts = new Array();

        this.initialize(name, anim);
    }

    initialize(name, anim) {
        this.bar = this.scene.add
            .image(0, 0, "enemy bar")
            .setOrigin(0.5, 1)
            .setDepth(ENEMYUIDEPTH);

        this.text = this.scene.add
            .text(0, 0, "", {
                fontFamily: "Jua",
                fontSize: "36px",
                fill: "#FFFFFF",
            })
            .setOrigin(0.5, 0.45)
            .setDepth(ENEMYUIDEPTH);

        this.enemy = this.scene.physics.add
            .sprite(0, 0, name)
            .setScale(5)
            .setOrigin(0.5, 0)
            .setFlipX(true)
            .setDepth(ENEMYDEPTH);

        this.enemy.play(anim);

        for (let i = 0; i < LIFE[this.size]; i++) {
            const heart = this.scene.add
                .sprite(0, 0, "enemy hurt")
                .setOrigin(0.5, 1)
                .setDepth(ENEMYUIDEPTH);
            this.hearts.push(heart);
            this.hearts[i].visible = false;
        }

        this.enemy.visible = false;
        this.bar.visible = false;
        this.text.visible = false;
    }

    update() {
        if (this.isActived) {
            this.bar.x = this.enemy.x;
            this.bar.y = this.enemy.y;

            this.text.x = this.enemy.x;
            this.text.y = this.bar.y - this.bar.height / 2;

            for (let i = 0; i < LIFE[this.size]; i++) {
                this.hearts[i].x =
                    this.enemy.x -
                    0.5 * HEARTDISTANCE * (LIFE[this.size] - 1) +
                    HEARTDISTANCE * i;
                this.hearts[i].y = this.bar.y - this.bar.height;
            }
        }
    }

    checkBoundary(boundary) {
        return this.life > 0 && this.enemy.x < boundary;
    }

    checkText(text) {
        if (this.targetTexts[this.life - 1] === text) {
            return true;
        } else {
            return false;
        }
    }

    damaged(damage) {
        for (let i = 0; i < damage && this.life > 0; i++) {
            this.life -= 1;

            this.hearts[this.life].play("enemy heart hurt");
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
        this.enemy.visible = false;

        for (let i = 0; i < LIFE[this.size]; i++) {
            this.hearts[i].visible = false;
            this.hearts[i].setFrame(0);
        }

        this.enemy.body.velocity.x = 0;
    }

    generate(x, y, texts, velocity_ratio) {
        this.isActived = true;

        this.life = LIFE[this.size];
        this.enemy.body.velocity.x = -VELOCITY[this.size] * velocity_ratio;

        this.enemy.x = x;
        this.enemy.y = y;

        this.targetTexts = texts.slice();
        this.text.setText(texts[this.life - 1]);

        this.enemy.visible = true;
        this.bar.visible = true;
        this.text.visible = true;

        for (let i = 0; i < LIFE[this.size]; i++) {
            this.hearts[i].visible = true;
        }
    }
}

export default Enemy;
