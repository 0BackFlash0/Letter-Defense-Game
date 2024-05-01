import Phaser from "phaser";
import Companion from "./Companion.js";
import Elf from "./Elf.js";
import Knight from "./Knight.js";
import Wizard from "./Wizard.js";
import Angel from "./Angel.js";

const COMPANIONYPOS = 50;
const COMPANIONXPOSRANGE = [1520, 1820];
const DAMAGEBOUNDARY = 980;
const COMPANIONHELPXPOS = 180;
const COMPANIONHELPYPOSLIST = { Elf: 600, Knight: 700, Wizard: 800, Angel: 0 };
const COMPANIONHELPTIME = 30;
const WIZARDSLOW = 0.5;
const KNIGHTDAMAGE = 2;
const COMPANIONSCORE = 150;

class CompanionManager {
    constructor(scene, eventEmitter, wordManager, playerManager) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;
        this.wordManager = wordManager;
        this.playerManager = playerManager;

        this.image_info = this.scene.cache.json.get("image info");

        this.Timer = 30;
        this.companionInterval = 30;

        this.companionVelocityRatio = 1;
        this.damage = 1;

        this.companionList = new Object();
        this.activedCompanion = new Array();
        this.isHelping = new Object();

        this.initialize();
    }

    update(time, deltaTime) {
        this.companionGenerator(deltaTime);

        this.activedCompanion.forEach((companion_name) => {
            const companion = this.companionList[companion_name];
            companion.update(time, deltaTime);
        });
        this.checkBound();
    }

    initialize() {
        this.createAnims();
        this.initializeEvent();

        const companion_info = this.image_info.companion;

        for (let name in companion_info) {
            let companion;
            if (name === "Elf") {
                companion = new Elf(
                    this.scene,
                    name,
                    `${name.toLowerCase()} walk`,
                    this.eventEmitter,
                    this.wordManager
                );
            } else if (name === "Knight") {
                companion = new Knight(
                    this.scene,
                    name,
                    `${name.toLowerCase()} walk`,
                    this.eventEmitter
                );
            } else if (name === "Wizard") {
                companion = new Wizard(
                    this.scene,
                    name,
                    `${name.toLowerCase()} walk`,
                    this.eventEmitter
                );
            } else if (name === "Angel") {
                companion = new Angel(
                    this.scene,
                    name,
                    `${name.toLowerCase()} walk`,
                    this.eventEmitter
                );
            }

            this.companionList[name] = companion;
            this.isHelping[name] = false;
        }
    }

    createAnims() {
        const companion_info = this.image_info.companion;

        for (let name in companion_info) {
            this.scene.anims.create({
                key: `${name.toLowerCase()} idle`,
                frames: this.scene.anims.generateFrameNumbers(
                    name.toLowerCase(),
                    {
                        start: 0,
                        end: 3,
                    }
                ),
                frameRate: 8,
                repeat: -1,
            });

            this.scene.anims.create({
                key: `${name.toLowerCase()} walk`,
                frames: this.scene.anims.generateFrameNumbers(
                    name.toLowerCase(),
                    {
                        start: 4,
                        end: 7,
                    }
                ),
                frameRate: 8,
                repeat: -1,
            });
        }

        this.scene.anims.create({
            key: "companion heart heal",
            frames: this.scene.anims.generateFrameNumbers("companion heal", {
                start: 0,
                end: 6,
            }),
            frameRate: 7,
            repeat: 0,
        });
    }

    generateCompanion() {
        let available_list = [];
        let texts = [];

        for (let name in this.companionList) {
            if (!this.activedCompanion.includes(name))
                available_list.push(name);
        }

        if (available_list.length == 0) return;

        const companion_name =
            available_list[Math.floor(Math.random() * available_list.length)];

        const word_num = 4;

        for (let i = 0; i < word_num; i++) {
            texts.push(this.wordManager.getRandomWord());
        }

        const xPos = parseInt(
            Math.random() * (COMPANIONXPOSRANGE[1] - COMPANIONXPOSRANGE[0]) +
                COMPANIONXPOSRANGE[0]
        );

        this.companionList[companion_name].generate(
            xPos,
            COMPANIONYPOS,
            texts,
            this.companionVelocityRatio
        );
        this.activedCompanion.push(companion_name);
    }

    helpCompanion(companion_name) {
        this.isHelping[companion_name] = true;
        this.companionList[companion_name].help(
            COMPANIONHELPXPOS,
            COMPANIONHELPYPOSLIST[companion_name],
            COMPANIONHELPTIME
        );
        this.playerManager.gainScore(COMPANIONSCORE);
    }

    killCompanion(companion_name) {
        this.isHelping[companion_name] = false;
        this.activedCompanion.splice(
            this.activedCompanion.indexOf(companion_name),
            1
        );
        this.companionList[companion_name].remove();
    }

    checkBound() {
        this.activedCompanion.forEach((companion_name) => {
            if (
                this.companionList[companion_name].checkBoundary(DAMAGEBOUNDARY)
            ) {
                this.killCompanion(companion_name);
            }
        });
    }

    checkInput(text) {
        let isChecked = false;
        this.activedCompanion.forEach((companion_name) => {
            const companion = this.companionList[companion_name];
            const isCorrect = companion.checkText(text);
            if (isCorrect) {
                companion.damaged(this.damage);
                isChecked = true;
                if (companion.life == 0) {
                    this.scene.time.addEvent({
                        delay: 1000,
                        callback: this.helpCompanion,
                        callbackScope: this,
                        args: [companion_name],
                        loop: false,
                    });
                }
            }
        });

        return isChecked;
    }

    companionGenerator(deltaTime) {
        this.Timer += deltaTime / 1000;

        if (this.Timer > this.companionInterval) {
            this.generateCompanion();
            this.Timer -= this.companionInterval;
        }
    }

    initializeEvent() {
        this.eventEmitter.on("wizard slow", () => {
            this.companionVelocityRatio = WIZARDSLOW;
            this.setCompanionVelocity(WIZARDSLOW);
        });
        this.eventEmitter.on("wizard off", () => {
            this.companionVelocityRatio = 1;
            this.setCompanionVelocity(1 / WIZARDSLOW);
        });
        this.eventEmitter.on("knight damage", () => {
            this.damage = KNIGHTDAMAGE;
        });
        this.eventEmitter.on("knight off", () => {
            this.damage = 1;
        });
        this.eventEmitter.on("angel heal", () => {
            this.playerManager.heal();
        });
        this.eventEmitter.on("companion timeout", (companion_name) => {
            this.isHelping[companion_name] = false;
            this.killCompanion(companion_name);
        });
    }

    setCompanionVelocity(velocity_ratio) {
        this.activedCompanion.forEach((companion_name) => {
            this.companionList[companion_name].companion.body.velocity.x *=
                velocity_ratio;
        });
    }
}

export default CompanionManager;
