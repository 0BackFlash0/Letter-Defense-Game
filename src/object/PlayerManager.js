import Phaser from "phaser";

class PlayerManager {
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
}

export default PlayerManager;
