import Phaser from "phaser";

const HEARTINTERVAL = 100;
const HEARTPOSITION = [854, 870];
const PLAYERPOSITION = [50, 200];
const SCOREBOARDPOSITION = [170, 30];
const COMBOPOSITION = [170, 30];
const OVERHEALSCORE = 500;

class PlayerManager {
    constructor(scene, eventEmitter) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;

        this.player = null;

        this.life = 3;
        this.score = 0;
        this.combo = 0;

        this.scoreBoard = null;
        this.scoreText = null;
        this.comboText = null;

        this.heart = new Array();

        this.initialize();
    }

    initialize() {
        this.createAnims();

        this.player = this.scene.add
            .sprite(...PLAYERPOSITION, "player")
            .setScale(5)
            .setOrigin(0);

        this.player.play("player idle");

        for (let i = 0; i < 3; i++) {
            const heart = this.scene.add
                .sprite(
                    HEARTPOSITION[0] + HEARTINTERVAL * i,
                    HEARTPOSITION[1],
                    "player hurt"
                )
                .setScale(4)
                .setOrigin(0);
            this.heart.push(heart);
        }

        this.scoreBoard = this.scene.add
            .image(...SCOREBOARDPOSITION, "score board")
            .setOrigin(0);

        this.scoreText = this.scene.add
            .text(
                SCOREBOARDPOSITION[0] + this.scoreBoard.width / 15,
                SCOREBOARDPOSITION[1] + this.scoreBoard.height / 2,
                "0",
                {
                    fontSize: "52px",
                    fill: "#FFFFFF",
                    fontFamily: "Jua",
                }
            )
            .setOrigin(0, 0.5);

        const jumText = this.scene.add
            .text(
                SCOREBOARDPOSITION[0] + (this.scoreBoard.width * 14) / 15,
                SCOREBOARDPOSITION[1] + this.scoreBoard.height / 2,
                "점",
                {
                    fontSize: "52px",
                    fill: "#FFFFFF",
                    fontFamily: "Jua",
                }
            )
            .setOrigin(1, 0.5);

        this.comboText = this.scene.add
            .text(
                SCOREBOARDPOSITION[0] + (this.scoreBoard.width * 14) / 15,
                SCOREBOARDPOSITION[1] + (this.scoreBoard.height * 5) / 4,
                "0 Combo",
                {
                    fontSize: "32px",
                    fill: "#FFFFFF",
                    fontFamily: "Jua",
                }
            )
            .setOrigin(1, 0.5);
    }

    createAnims() {
        this.scene.anims.create({
            key: "player idle",
            frames: this.scene.anims.generateFrameNumbers("player", {
                start: 4,
                end: 7,
            }),
            frameRate: 6,
            repeat: -1,
        });

        this.scene.anims.create({
            key: "player attack",
            frames: this.scene.anims.generateFrameNumbers("player", {
                start: 8,
                end: 24,
            }),
            frameRate: 16,
            repeat: 0,
        });

        this.scene.anims.create({
            key: "player heart hurt",
            frames: this.scene.anims.generateFrameNumbers("player hurt", {
                start: 0,
                end: 5,
            }),
            frameRate: 6,
            repeat: 0,
        });

        this.scene.anims.create({
            key: "player heart heal",
            frames: this.scene.anims.generateFrameNumbers("player heal", {
                start: 0,
                end: 6,
            }),
            frameRate: 7,
            repeat: 0,
        });
    }

    attack() {
        this.player.play("player attack");
        this.player.once("animationcomplete", () => {
            this.player.play("player idle");
        });
    }

    hurt() {
        this.life -= 1;
        this.resetCombo();

        console.log(this.heart[this.life]);
        this.heart[this.life].play("player heart hurt");
        this.heart[this.life].once("animationcomplete", () => {
            if (this.life <= 0) {
                this.die();
            }
        });
    }

    heal() {
        if (this.life < 3) {
            this.life += 1;
            this.heart[this.life - 1].play("player heart heal");
        } else {
            this.gainScore(OVERHEALSCORE);
        }
    }

    die() {}

    gainScore(gain) {
        this.score += Math.floor(gain * (1 + this.combo / 20));
        this.scoreText.setText(`${this.score}`);
    }

    gainCombo(gain) {
        this.combo += gain;
        this.comboText.setText(`${this.combo} Combo`);
    }

    resetCombo() {
        this.combo = 0;
        this.comboText.setText(`${this.combo} Combo`);
    }

    update(time, deltaTime) {}
}

export default PlayerManager;
