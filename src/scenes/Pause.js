import { Scene } from "phaser";

const BOARDPOSITION = [660, 120];
const RESTARTBUTTONPOSITION = [800, 810];
const QUITBUTTONPOSITION = [960, 810];
const CONTINUEBUTTONPOSITION = [1120, 810];
const FONTSELECTED = { '"Jua"': 0, '"Noto Sans KR"': 1 };

export class Pause extends Scene {
    constructor() {
        super("Pause");

        this.settingManager = null;

        this.settingBoard = null;
        this.restartButton = null;
        this.quitButton = null;
        this.continueButton = null;

        this.restartText = null;
        this.quitText = null;
        this.continueText = null;

        this.settingElement = null;
    }

    init(data) {
        this.settingManager = data.settingManager;
    }

    create() {
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");
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

    createUI() {
        this.settingBoard = this.add
            .image(...BOARDPOSITION, "setting board")
            .setOrigin(0);

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

        this.continueButton = this.createButton(
            ...CONTINUEBUTTONPOSITION,
            "continue button",
            4,
            () => {
                this.scene.resume("Game");
                this.scene.stop("Pause");
            }
        );
        this.continueText = this.add
            .text(...CONTINUEBUTTONPOSITION, "이어하기", {
                fontSize: "28px",
                fill: "#FFFFFF",
                fontFamily: "Jua",
            })
            .setOrigin(0.5, 0);

        this.settingElement = this.add
            .dom(...BOARDPOSITION, "div")
            .setOrigin(0);
        this.settingElement.node.classList.add("setting_board");

        this.createSetting();
    }

    createSetting() {
        const container = document.createElement("div");
        container.classList.add("setting_container");

        // 단어 폰트

        const titles = ["단어 폰트", "단어 설명", "배경음", "효과음"];

        const fontEvent = (font) => {
            return () => {
                this.settingManager.setFont(font);
            };
        };

        const descriptionEvent = (isShow) => {
            return () => {
                this.settingManager.setDescription(isShow);
            };
        };

        const bgmEvent = (volume) => {
            this.settingManager.setBackgroundVolume(volume);
        };

        const effectEvent = (volume) => {
            this.settingManager.setEffectVolume(volume);
        };

        console.log(this.settingManager.backgroundVolume);

        const contents = [
            this.makeRadios(
                ["Jua", "Noto Sans"],
                [fontEvent('"Jua"'), fontEvent('"Noto Sans KR"')],
                "폰트",
                FONTSELECTED[this.settingManager.selectedFont]
            ),
            this.makeRadios(
                ["켜기", "끄기"],
                [descriptionEvent(true), descriptionEvent(false)],
                "설명",
                this.settingManager.showDescription ? 0 : 1
            ),
            this.makeRange(
                0,
                100,
                bgmEvent,
                this.settingManager.backgroundVolume
            ),
            this.makeRange(
                0,
                100,
                effectEvent,
                this.settingManager.effectVolume
            ),
        ];

        for (let i = 0; i < titles.length; i++) {
            const line = document.createElement("div");
            line.classList.add("setting_line");

            const title = document.createElement("label");
            title.innerText = titles[i];
            line.appendChild(title);

            line.appendChild(contents[i]);
            container.appendChild(line);
        }
        this.settingElement.node.appendChild(container);
    }

    makeRadios(options, events, name, default_selected) {
        const div = document.createElement("div");
        div.classList.add("setting_content");

        options.forEach((option, idx) => {
            const radio_area = document.createElement("div");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = name;
            radio.value = option;
            radio.id = option;
            radio.addEventListener("input", events[idx]);
            if (idx === default_selected) radio.checked = true;
            radio_area.appendChild(radio);

            const label = document.createElement("label");
            label.innerText = option;
            label.htmlFor = option;
            radio_area.appendChild(label);

            div.appendChild(radio_area);
        });

        return div;
    }

    makeRange(min, max, range_event, default_val) {
        const div = document.createElement("div");
        div.classList.add("setting_content");

        const number = document.createElement("label");
        number.innerText = default_val;
        div.appendChild(number);

        const range = document.createElement("input");
        range.type = "range";
        range.min = min;
        range.max = max;
        range.value = default_val;
        range.addEventListener("input", () => {
            range_event(range.value);
            number.innerText = range.value;
        });
        div.appendChild(range);

        return div;
    }
}
