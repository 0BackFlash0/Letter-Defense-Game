import { Scene } from "phaser";

const BOARDPOSITION = [360, 240];
const TITLEPOSITION = [733, 82];
const STARTBUTTONPOSITION = [780, 800];
const GUIDETEXTS = [
    "몬스터들이 마을로 다가오고 있습니다!",
    "당신은 마을의 경비병으로 다가오는 몬스터들을 해치워야 합니다.",
    "몬스터 위에 표시된 단어를 올바르게 입력해 몬스터들을 해치우세요!",
    "그리고 가끔 동료가 마을 근처를 지나갈 수 있습니다.",
    "동료가 지나가기 전에 표시된 단어를 입력해 도움을 요청하세요!",
    "몬스터들을 해치우고 동료의 도움을 받으며 최대한 많은 점수를 획득하세요!",
];

export class Start extends Scene {
    constructor() {
        super("Start");

        this.startTitle = null;
        this.guideBoard = null;
        this.startButton = null;

        this.buttonText = null;
        this.titleText = null;
        this.guideElement = null;
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("background", "Background.png");
        this.load.image("title bar", "Title Bar.png");
        this.load.image("guide board", "Guide Board.png");

        const longButtonInfo = this.cache.json.get("image info")["Long Button"];
        //long button
        this.load.spritesheet("long button", `Sprites/Long Button.png`, {
            frameWidth: longButtonInfo.frame_width,
            frameHeight: longButtonInfo.frame_height,
        });
    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0).setAlpha(0.5);
        this.initializeEvent();
        this.createUI();

        this.scene.pause();
        this.scene.launch("Preloader");
    }

    createUI() {
        this.startTitle = this.add
            .image(...TITLEPOSITION, "title bar")
            .setOrigin(0);
        this.titleText = this.add
            .text(
                TITLEPOSITION[0] + this.startTitle.width / 2,
                TITLEPOSITION[1] + this.startTitle.height / 2,
                "단어 디펜스",
                {
                    fontSize: "70px",
                    fill: "#FFFFFF",
                    fontFamily: "Jua",
                }
            )
            .setOrigin(0.5, 0.5);

        this.guideBoard = this.add
            .image(...BOARDPOSITION, "guide board")
            .setOrigin(0);
        this.guideElement = this.add.dom(...BOARDPOSITION, "div").setOrigin(0);
        this.guideElement.node.classList.add("guide_board");

        this.createGuide();

        this.startButton = this.add
            .image(...STARTBUTTONPOSITION, "long button")
            .setOrigin(0)
            .setScale(1.5)
            .setInteractive();

        this.buttonText = this.add
            .text(
                STARTBUTTONPOSITION[0] + (this.startButton.width * 3) / 4,
                STARTBUTTONPOSITION[1] + (this.startButton.height * 3) / 4,
                "로딩중...",
                {
                    fontSize: "54px",
                    fill: "#FFFFFF",
                    fontFamily: "Jua",
                }
            )
            .setOrigin(0.5, 0.5);

        this.startButton.on("pointerover", () => {
            this.buttonText.setStyle({
                fill: "#000",
            });
        });

        this.startButton.on("pointerout", () => {
            this.buttonText.setStyle({
                fill: "#FFFFFF",
            });
        });

        this.startButton.on("pointerdown", () => {
            this.startButton.setFrame(1);
            this.buttonText.y += 15;
        });

        this.startButton.on("pointerup", () => {
            this.startButton.setFrame(0);
            this.buttonText.y -= 15;
            this.scene.start("Game");
        });
    }

    initializeEvent() {
        this.events.on("resume", () => {
            console.log("Resume");
            this.buttonText.setText("게임 시작");
        });
    }

    createGuide() {
        const container = document.createElement("div");
        container.classList.add("guide_container");

        const guide_title = document.createElement("div");
        guide_title.classList.add("guide_title");
        guide_title.innerText = "게임 방법";
        container.appendChild(guide_title);

        for (let i = 0; i < GUIDETEXTS.length; i++) {
            // const line = document.createElement("div");
            // line.classList.add("guide_line");

            const content = document.createElement("label");
            content.innerText = GUIDETEXTS[i];
            // line.appendChild(content);

            container.appendChild(content);
        }
        this.guideElement.node.appendChild(container);
    }
}
