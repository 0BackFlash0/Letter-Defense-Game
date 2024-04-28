import Phaser from "phaser";

class Enemy {
    constructor(scene, name, anim) {
        this.scene = scene;

        this.isActived = false;
        this.targetText = "";

        this.bar = this.scene.add.image(0, 0, "enemy bar").setOrigin(0.5, 1);
        this.text = this.scene.add
            .text(0, 0, "", {
                fontSize: "28px",
                fill: "#FFFFFF",
                fontFamily: "Jua",
            })
            .setOrigin(0.5, 0.45);

        this.enemy = this.scene.physics.add
            .sprite(0, 0, name)
            .setScale(4)
            .setOrigin(0.5, 0)
            .setFlipX(true);

        this.enemy.play(anim);

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
        }
    }

    checkText(text) {
        if (this.targetText === text) {
            this.disappear();
            return true;
        } else {
            return false;
        }
    }

    disappear() {
        this.isActived = false;

        this.targetText = "";
        this.text.setText("");
        this.enemy.visible = false;
        this.bar.visible = false;
        this.text.visible = false;

        this.enemy.body.velocity.x = 0;
    }

    generate(x, y, text) {
        this.isActived = true;

        this.enemy.x = x;
        this.enemy.y = y;

        this.targetText = text;
        this.text.setText(text);
        this.enemy.visible = true;
        this.bar.visible = true;
        this.text.visible = true;

        this.enemy.body.velocity.x = -10;
    }
}

export default Enemy;
