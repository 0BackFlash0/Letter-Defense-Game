import Phaser from "phaser";
import Enemy from "./Enemy.js";

const BIG = ["Big Demon", "Big Zombie", "Ogre"];
const SMALL = ["Goblin", "Imp", "Tiny Slug"];
const ENEMYXPOS = 1800;
const ENEMYYPOSRANGE = [100, 880];
const REMOVEBOUNDARY = 310;
const WIZARDSLOW = 0.5;
const KNIGHTDAMAGE = 2;
const ENEMYSCORELIST = { small: 60, normal: 90, big: 120 };
const DEFAULTINTERVAL = 8;
const MININTERVAL = 2.5;
const INTERVALREDUCERATIO = 0.97;
const PENALTYINTERVAL = 3;

class EnemyManager {
    constructor(
        scene,
        eventEmitter,
        soundManager,
        wordManager,
        companionManager,
        playerManager
    ) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;
        this.soundManager = soundManager;
        this.wordManager = wordManager;
        this.companionManager = companionManager;
        this.playerManager = playerManager;

        this.image_info = this.scene.cache.json.get("image info");

        this.Timer = DEFAULTINTERVAL;
        this.enemyInterval = DEFAULTINTERVAL;

        this.enemyVelocityRatio = 1;
        this.damage = 1;

        this.enemyList = new Object();
        this.activedEnemy = new Array();

        this.initialize();
    }

    update(time, deltaTime) {
        this.enemyGenerator(deltaTime);

        this.activedEnemy.forEach((enemy_name) => {
            this.enemyList[enemy_name].update();
        });
        this.checkBound();
    }

    initialize() {
        this.createAnims();
        this.initializeEvent();
        const enemy_info = this.image_info.enemy;

        for (let name in enemy_info) {
            const enemy_size = BIG.includes(name)
                ? "big"
                : SMALL.includes(name)
                ? "small"
                : "normal";

            let enemy = new Enemy(
                this.scene,
                name,
                `${name.toLowerCase()} walk`,
                enemy_size
            );

            this.enemyList[name] = enemy;
        }
    }

    createAnims() {
        const enemy_info = this.image_info.enemy;

        for (let name in enemy_info) {
            this.scene.anims.create({
                key: `${name.toLowerCase()} walk`,
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
        }

        this.scene.anims.create({
            key: "enemy heart hurt",
            frames: this.scene.anims.generateFrameNumbers("enemy hurt", {
                start: 0,
                end: 5,
            }),
            frameRate: 6,
            repeat: 0,
        });
    }

    generateEnemy() {
        let available_list = [];
        let texts = [];

        for (let name in this.enemyList) {
            if (!this.activedEnemy.includes(name)) available_list.push(name);
        }

        if (available_list.length == 0) return;

        const enemy_name =
            available_list[Math.floor(Math.random() * available_list.length)];

        const word_num = BIG.includes(enemy_name)
            ? 3
            : SMALL.includes(enemy_name)
            ? 1
            : 2;

        for (let i = 0; i < word_num; i++) {
            texts.push(this.wordManager.getRandomWord());
        }

        const yPos = parseInt(
            Math.random() * (ENEMYYPOSRANGE[1] - ENEMYYPOSRANGE[0]) +
                ENEMYYPOSRANGE[0]
        );

        this.enemyList[enemy_name].generate(
            ENEMYXPOS,
            yPos,
            texts,
            this.enemyVelocityRatio
        );
        this.activedEnemy.push(enemy_name);
    }

    killEnemy(enemy_name, isDamage = false) {
        this.activedEnemy.splice(this.activedEnemy.indexOf(enemy_name), 1);
        this.enemyList[enemy_name].remove();
        if (!isDamage) {
            this.enemyInterval =
                this.enemyInterval <= MININTERVAL
                    ? MININTERVAL
                    : (this.enemyInterval * INTERVALREDUCERATIO).toFixed(4);
            this.soundManager.playEffect("enemy die");
            this.playerManager.gainScore(
                ENEMYSCORELIST[this.enemyList[enemy_name].size]
            );
        } else {
            this.enemyInterval += PENALTYINTERVAL;
            this.playerManager.hurt();
        }
        console.log("enemy" + this.enemyInterval);
    }

    checkBound() {
        this.activedEnemy.forEach((enemy_name) => {
            if (this.enemyList[enemy_name].checkBoundary(REMOVEBOUNDARY)) {
                this.killEnemy(enemy_name, true);
            }
        });
    }

    checkInput(text) {
        let isChecked = false;
        this.activedEnemy.forEach((enemy_name) => {
            const enemy = this.enemyList[enemy_name];
            const isCorrect = enemy.checkText(text);
            if (isCorrect) {
                enemy.damaged(this.damage);
                isChecked = true;
                if (enemy.life == 0) {
                    this.scene.time.addEvent({
                        delay: 1000,
                        callback: this.killEnemy,
                        callbackScope: this,
                        args: [enemy_name],
                        loop: false,
                    });
                }
            }
        });

        return isChecked;
    }

    enemyGenerator(deltaTime) {
        this.Timer += deltaTime / 1000;

        if (this.Timer > this.enemyInterval) {
            this.generateEnemy();
            this.Timer -= this.enemyInterval;
        }
    }

    initializeEvent() {
        this.eventEmitter.on("wizard slow", () => {
            this.enemyVelocityRatio = WIZARDSLOW;
            this.setEnemyVelocity(WIZARDSLOW);
        });
        this.eventEmitter.on("wizard off", () => {
            this.enemyVelocityRatio = 1;
            this.setEnemyVelocity(1 / WIZARDSLOW);
        });
        this.eventEmitter.on("knight damage", () => {
            this.damage = KNIGHTDAMAGE;
        });
        this.eventEmitter.on("knight off", () => {
            this.damage = 1;
        });
        this.eventEmitter.on("elf ult", () => {
            this.soundManager.playEffect("elf skill");
            const allEnemy = this.activedEnemy.slice();
            allEnemy.forEach((enemy_name) => {
                this.killEnemy(enemy_name);
            });
        });
        this.eventEmitter.on("set font", (font) => {
            for (let enemy_name in this.enemyList) {
                this.enemyList[enemy_name].text.setFontFamily(font);
            }
        });
    }

    setEnemyVelocity(velocity_ratio) {
        this.activedEnemy.forEach((enemy_name) => {
            this.enemyList[enemy_name].enemy.body.velocity.x *= velocity_ratio;
        });
    }
}

export default EnemyManager;
