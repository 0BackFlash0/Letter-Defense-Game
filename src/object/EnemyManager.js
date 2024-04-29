import Phaser from "phaser";
import Enemy from "./Enemy.js";

const BOSS = ["Big Demon", "Big Zombie", "Ogre"];
const ENEMYXPOS = 1800;
const ENEMYYPOSRANGE = [100, 980];

class EnemyManager {
    constructor(scene, wordManager) {
        this.scene = scene;
        this.wordManager = wordManager;

        // debugger;

        this.image_info = this.scene.cache.json.get("image info");

        this.Timer = 5;
        this.enemyInterval = 5;
        this.bossPossibility = 0.1;

        this.activedEnemy = new Array();
        this.bossEnemy = new Array();
        this.normalEnemy = new Array();
    }

    update(time, deltaTime) {
        this.enemyGenerator(deltaTime);
        this.activedEnemy.forEach((enemy) => {
            enemy.update();
        });
    }

    initializeEnemy() {
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

            let instance = new Enemy(
                this.scene,
                name,
                `${name.toLowerCase()} walk`
            );

            if (BOSS.includes(name)) {
                this.bossEnemy.push(instance);
            } else {
                this.normalEnemy.push(instance);
            }
        }
    }

    generateEnemy(text, isBoss = false) {
        let enemy = null;
        let i = 0;
        while (i < 100) {
            if (isBoss) {
                enemy =
                    this.bossEnemy[
                        Math.floor(Math.random() * this.bossEnemy.length)
                    ];
            } else {
                enemy =
                    this.normalEnemy[
                        Math.floor(Math.random() * this.normalEnemy.length)
                    ];
            }

            if (!this.activedEnemy.includes(enemy)) {
                break;
            }
            i++;
        }

        const yPos = parseInt(
            Math.random() * (ENEMYYPOSRANGE[1] - ENEMYYPOSRANGE[0]) +
                ENEMYYPOSRANGE[0]
        );

        enemy.generate(ENEMYXPOS, yPos, text);
        this.activedEnemy.push(enemy);
    }

    checkInput(text) {
        let idx = 0;
        let isChecked = false;
        this.activedEnemy.forEach((enemy) => {
            if (enemy.checkText(text)) {
                this.activedEnemy.splice(idx, 1);
                isChecked = true;
            }
            idx++;
        });

        return isChecked;
    }

    enemyGenerator(deltaTime) {
        this.Timer += deltaTime / 1000;

        if (this.Timer > this.enemyInterval) {
            const word = this.wordManager.getRandomWord();
            const isBoss = Math.random() < this.bossPossibility;

            this.generateEnemy(word, isBoss);
            this.Timer -= this.enemyInterval;
        }
    }
}

export default EnemyManager;
