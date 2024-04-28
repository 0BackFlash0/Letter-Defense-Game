import { Scene } from "phaser";
import EnemyManager from "../object/EnemyManager.js";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.input_box = null;
        this.input_Element = null;

        this.image_info = null;

        this.enemyManager = null;
    }

    preload() {}

    create() {
        this.add.image(0, 0, "background").setOrigin(0);
        this.createUI();

        this.enemyManager = new EnemyManager(this);
        this.enemyManager.initializeEnemy();

        this.enemyManager.generateEnemy("안녕하세요");

        console.log(this);
    }

    update() {
        if (this.enemyManager) this.enemyManager.update();
        // console.log(this.inputElement.node.value);
    }

    createUI() {
        this.input_box = this.add.image(800, 960, "text input").setOrigin(0);
        this.inputElement = this.add
            .dom(
                800,
                960,
                "input",
                'width: 393px; height: 96px; background: transparent; border: 0px; outline-width: 0;\
                font-size: 40px; line-height: 96px; padding: 0px 20px; font-family: "Jua", sans-serif;\
                font-weight: 400; font-style: normal; color:#FFFFFF; ',
                "Phaser"
            )
            .setOrigin(0);
        this.inputElement.node.type = "text";

        this.inputElement.node.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.enemyManager.checkInput(this.inputElement.node.value);
                this.inputElement.node.value = "";
            }
        });
    }
}
