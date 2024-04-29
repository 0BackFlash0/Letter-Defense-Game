import { Scene } from "phaser";
import EnemyManager from "../object/EnemyManager.js";
import WordManager from "../object/WordManager.js";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.inputBox = null;
        this.inputText = null;
        this.descriptionBoard = null;
        this.descriptionTitle = null;
        this.descriptionText = null;

        this.imageInfo = null;

        this.enemyManager = null;
        this.wordManager = null;
    }

    preload() {}

    create() {
        this.add.image(0, 0, "background").setOrigin(0);
        this.createUI();

        this.wordManager = new WordManager(this);

        this.enemyManager = new EnemyManager(this, this.wordManager);
        this.enemyManager.initializeEnemy();

        console.log(this);
    }

    update(time, deltaTime) {
        if (this.enemyManager) this.enemyManager.update(time, deltaTime);
        // console.log(this.inputElement.node.value);
    }

    createUI() {
        this.descriptionBoard = this.add
            .image(430, 850, "description board")
            .setOrigin(0);

        this.descriptionTitle = this.add
            .text(430, 860, "", {
                fontSize: "40px",
                fill: "#000",
                fontFamily: "Jua",
                fixedWidth: 330,
                fixedHeight: 40,
                align: "center",
            })
            .setOrigin(0);

        this.descriptionText = this.add
            .text(440, 900, "", {
                fontSize: "26px",
                fill: "#000",
                fontFamily: "Jua",
                fixedWidth: 310,
                fixedHeight: 150,
                lineSpacing: 1,
                align: "left",
                wordWrap: { width: 310, useAdvancedWrap: true },
            })
            .setOrigin(0);

        this.inputBox = this.add.image(800, 960, "text input").setOrigin(0);
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
                const inputWord = this.inputElement.node.value;
                const isCorrect = this.enemyManager.checkInput(inputWord);

                this.inputElement.node.value = "";

                console.log(isCorrect);

                if (isCorrect) {
                    this.wordManager.storeWord(inputWord);
                    this.descriptionTitle.setText(inputWord);
                    this.descriptionText.setText(
                        this.wordManager.getDescription(inputWord)
                    );
                }
            }
        });
    }
}
