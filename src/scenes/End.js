import { Scene } from "phaser";

const BOARDPOSITION = [685, 260];
const TITLEPOSITION = [733, 82];
const BOOKBUTTONPOSITION = [800, 810];
const RESTARTBUTTONPOSITION = [960, 810];
const QUITBUTTONPOSITION = [1120, 810];

export class End extends Scene {
    constructor() {
        super("End");

        this.resultScore = 0;
        this.resultCombo = 0;
        this.resultTime = 0;
        this.resultWord = 0;

        this.resultTitle = null;
        this.resultBoard = null;
        this.restartButton = null;
        this.quitButton = null;
        this.bookButton = null;

        this.titleText = null;
        this.restartText = null;
        this.quitText = null;
        this.bookText = null;

        this.resultElement = null;
    }

    init(data) {
        this.wordList = data.wordList;
        this.wordDict = data.wordDict;
        this.resultScore = data.score;
        this.resultCombo = data.maxCombo;
        this.resultTime = data.gameTime;
        this.resultWord = this.wordList.length;
    }

    create() {
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");
        this.initializeEvent();
        this.createUI();
    }

    createButton(x, y, image, scale, downEvent, args = []) {
        const button = this.add
            .image(x, y, image)
            .setOrigin(0.5, 1)
            .setInteractive()
            .setScale(scale);

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

    initializeEvent() {
        this.events.on("resume", () => {
            debugger;
            this.resultElement.node.style.visibility = "visible";
        });
    }

    createUI() {
        this.bookButton = this.createButton(
            ...BOOKBUTTONPOSITION,
            "book button",
            5,
            () => {
                this.scene.pause();
                this.resultElement.node.style.visibility = "hidden";
                this.scene.launch("Book", {
                    prevScene: "End",
                    wordList: this.wordList,
                    wordDict: this.wordDict,
                });
            }
        );
        this.bookText = this.add
            .text(...BOOKBUTTONPOSITION, "단어장", {
                fontSize: "28px",
                fill: "#FFFFFF",
                fontFamily: "Jua",
            })
            .setOrigin(0.5, 0);

        this.restartButton = this.createButton(
            ...RESTARTBUTTONPOSITION,
            "restart button",
            4,
            () => {
                this.scene.stop("Game");
                this.scene.stop("Pause");
                this.scene.start("Game");
            }
        );
        this.restartText = this.add
            .text(...RESTARTBUTTONPOSITION, "다시하기", {
                fontSize: "28px",
                fill: "#FFFFFF",
                fontFamily: "Jua",
            })
            .setOrigin(0.5, 0);

        this.quitButton = this.createButton(
            ...QUITBUTTONPOSITION,
            "quit button",
            4,
            () => {
                this.game.destroy(true);
            }
        );
        this.quitText = this.add
            .text(...QUITBUTTONPOSITION, "종료", {
                fontSize: "28px",
                fill: "#FFFFFF",
                fontFamily: "Jua",
            })
            .setOrigin(0.5, 0);

        this.resultTitle = this.add
            .image(...TITLEPOSITION, "title bar")
            .setOrigin(0);
        this.titleText = this.add
            .text(
                TITLEPOSITION[0] + this.resultTitle.width / 2,
                TITLEPOSITION[1] + this.resultTitle.height / 2,
                "게임 종료!",
                {
                    fontSize: "70px",
                    fill: "#FFFFFF",
                    fontFamily: "Jua",
                }
            )
            .setOrigin(0.5, 0.5);

        this.resultBoard = this.add
            .image(...BOARDPOSITION, "result board")
            .setOrigin(0);
        this.resultElement = this.add.dom(...BOARDPOSITION, "div").setOrigin(0);
        this.resultElement.node.classList.add("result_board");

        this.createResult();
    }

    createResult() {
        const container = document.createElement("div");
        container.classList.add("result_container");

        const titles = ["점수", "최대 콤보", "시간", "맞춘 단어"];
        const contents = [
            `${this.resultScore} 점`,
            `${this.resultCombo} 콤보`,
            `${Math.floor(this.resultTime / 60)
                .toString()
                .padStart(2, "0")}:${Math.floor(this.resultTime % 60)
                .toString()
                .padStart(2, "0")}`,
            `${this.resultWord} 개`,
        ];

        for (let i = 0; i < 4; i++) {
            const line = document.createElement("div");
            line.classList.add("result_line");

            const title = document.createElement("label");
            title.innerText = titles[i];
            line.appendChild(title);

            const content = document.createElement("label");
            content.innerText = contents[i];
            line.appendChild(content);

            container.appendChild(line);
        }
        this.resultElement.node.appendChild(container);
    }
}
