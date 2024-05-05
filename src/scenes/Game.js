import { Scene } from "phaser";
import EnemyManager from "../object/EnemyManager.js";
import WordManager from "../object/WordManager.js";
import PlayerManager from "../object/PlayerManager.js";
import CompanionManager from "../object/CompanionManager.js";
import SettingManager from "../object/SettingManager.js";
import SoundManager from "../object/SoundManager.js";

const WORDSCORE = 30;
const UIDEPTH = 6;

export class Game extends Scene {
    constructor() {
        super("Game");

        this.isPause = false;
        this.gameTime = 0;

        this.inputBox = null;
        this.inputText = null;
        this.descriptionBoard = null;
        this.descriptionTitle = null;
        this.descriptionText = null;

        this.pauseButton = null;
        this.bookButton = null;

        this.imageInfo = null;

        this.eventEmitter = null;
        this.soundManager = null;
        this.settingManager = null;
        this.enemyManager = null;
        this.companionManager = null;
        this.wordManager = null;
        this.playerManager = null;
    }

    preload() {}

    create() {
        this.add.image(0, 0, "background").setOrigin(0);
        this.gameTime = 0;

        this.eventEmitter = new Phaser.Events.EventEmitter();

        this.soundManager = new SoundManager(this, this.eventEmitter);

        this.settingManager = new SettingManager(this, this.eventEmitter);

        this.wordManager = new WordManager(this);

        this.playerManager = new PlayerManager(
            this,
            this.eventEmitter,
            this.soundManager
        );

        this.companionManager = new CompanionManager(
            this,
            this.eventEmitter,
            this.soundManager,
            this.wordManager,
            this.playerManager
        );

        this.enemyManager = new EnemyManager(
            this,
            this.eventEmitter,
            this.soundManager,
            this.wordManager,
            this.companionManager,
            this.playerManager
        );
        this.createUI();

        this.initializeEvent();
        this.settingManager.getLocalstorage();
        this.soundManager.startBGM();
    }

    update(time, deltaTime) {
        if (this.enemyManager) this.enemyManager.update(time, deltaTime);
        if (this.companionManager)
            this.companionManager.update(time, deltaTime);
        // console.log(this.inputElement.node.value);
        this.gameTime += deltaTime / 1000;
    }

    createButton(x, y, image, scale, downEvent, args = []) {
        const button = this.add
            .image(x, y, image)
            .setOrigin(0)
            .setInteractive()
            .setScale(scale)
            .setDepth(UIDEPTH);

        button.setFrame(0);

        button.on("pointerover", () => {
            button.setFrame(1);
        });

        button.on("pointerout", () => {
            button.setFrame(0);
        });

        button.on("pointerdown", () => {
            button.setFrame(2);
        });

        button.on("pointerup", () => {
            button.setFrame(1);
            downEvent(...args);
        });

        return button;
    }

    createUI() {
        this.descriptionBoard = this.add
            .image(430, 850, "description board")
            .setOrigin(0)
            .setDepth(UIDEPTH);

        this.descriptionTitle = this.add
            .text(430, 860, "", {
                fontSize: "40px",
                fill: "#000",
                fontFamily: "Jua",
                fixedWidth: 330,
                fixedHeight: 40,
                align: "center",
            })
            .setOrigin(0)
            .setDepth(UIDEPTH);

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
            .setOrigin(0)
            .setDepth(UIDEPTH);

        this.inputBox = this.add
            .image(800, 960, "text input")
            .setOrigin(0)
            .setDepth(UIDEPTH);

        this.inputElement = this.add
            .dom(800, 960, "input")
            .setOrigin(0)
            .setDepth(UIDEPTH);

        this.inputElement.node.classList.add("word_input", "input_jua");
        this.inputElement.node.type = "text";

        this.inputElement.node.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.inputCheck();
            }
        });

        this.pauseButton = this.createButton(20, 20, "pause button", 4, () => {
            this.isPaused = true;
            this.inputElement.node.disabled = true;
            this.scene.pause();
            this.scene.launch("Pause", {
                settingManager: this.settingManager,
            });
        });

        this.bookButton = this.createButton(20, 980, "book button", 5, () => {
            this.isPaused = true;
            this.inputElement.node.disabled = true;
            this.scene.pause();
            this.scene.launch("Book", {
                prevScene: "Game",
                wordList: this.wordManager.storedWords,
                wordDict: this.wordManager.currentWords,
            });
        });
    }

    initializeEvent() {
        this.events.on("shutdown", () => {
            this.soundManager.bgm.destroy();
        });
        this.events.on("resume", () => {
            this.isPaused = false;
            this.inputElement.node.disabled = false;
        });

        this.eventEmitter.on("player die", () => {
            this.isPaused = true;
            this.inputElement.node.disabled = true;
            this.scene.pause();
            this.scene.launch("End", {
                score: this.playerManager.score,
                maxCombo: this.playerManager.maxCombo,
                gameTime: Math.floor(this.gameTime),
                wordList: this.wordManager.storedWords,
                wordDict: this.wordManager.currentWords,
            });
        });

        this.eventEmitter.on("set description", (isShow) => {
            this.descriptionBoard.visible = isShow;
            this.descriptionTitle.visible = isShow;
            this.descriptionText.visible = isShow;
        });

        this.eventEmitter.on("set font", (font, size) => {
            if (font === '"Jua"') {
                if (this.inputElement.node.classList.contains("input_notosans"))
                    this.inputElement.node.classList.remove("input_notosans");
                this.inputElement.node.classList.add("input_jua");
            } else if (font === '"Noto Sans KR"') {
                if (this.inputElement.node.classList.contains("input_jua"))
                    this.inputElement.node.classList.remove("input_jua");
                this.inputElement.node.classList.add("input_notosans");
            }
        });
    }

    inputCheck() {
        const inputWord = this.inputElement.node.value;
        if (inputWord !== "") {
            const isCorrect =
                this.enemyManager.checkInput(inputWord) ||
                this.companionManager.checkInput(inputWord);

            this.inputElement.node.value = "";

            console.log(isCorrect);

            if (isCorrect) {
                this.soundManager.playEffect("target hit");
                this.playerManager.gainScore(WORDSCORE);
                this.playerManager.gainCombo(1);
                this.playerManager.attack();
                this.wordManager.storeWord(inputWord);
                this.descriptionTitle.setText(inputWord);
                this.descriptionText.setText(
                    this.wordManager.getDescription(inputWord)
                );
            } else {
                this.playerManager.resetCombo();
            }
        }
    }
}
