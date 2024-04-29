import Phaser from "phaser";

const HEARTINTERVAL = 100;
const HEARTPOSITION = [854, 870];
const PLAYERPOSITION = [50, 200];

class PlayerManager {
    constructor(scene) {
        this.scene = scene;

        this.player = null;

        this.life = 3;

        this.heart = new Array();
    }

    initializePlayer() {
        this.player = this.scene.add
            .sprite(...PLAYERPOSITION, "player")
            .setScale(5)
            .setOrigin(0);

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
        }
    }

    attack() {
        this.player.play("player attack");
        this.player.once("animationcomplete", () => {
            this.player.play("player idle");
        });
    }

    hurt() {}

    heal() {}

    update(time, deltaTime) {}
}

export default PlayerManager;
