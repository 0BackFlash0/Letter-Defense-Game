import Phaser from "phaser";
import Enemy from "./Enemy.js";

const BOSS = ["Big Demon", "Big Zombie", "Ogre"];
const ENEMYXPOS = 1800;
const ENEMYYPOSRANGE = [100, 980];

class EnemyManager {
    constructor(scene) {
        this.scene = scene;

        // debugger;

        this.image_info = this.scene.cache.json.get("image info");

        this.activedEnemy = new Array();
        this.bossEnemy = new Array();
        this.normalEnemy = new Array();
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
        this.activedEnemy.forEach((enemy) => {
            if (enemy.checkText(text)) {
                this.activedEnemy.splice(idx, 1);
                return true;
            }
            idx++;
        });

        return false;
    }

    update() {
        this.activedEnemy.forEach((enemy) => {
            enemy.update();
        });
    }
}

export default EnemyManager;
