import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        // const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        // //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        // this.load.on("progress", (progress) => {
        //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        //     bar.width = 4 + 460 * progress;
        // });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.json("words", "./words.json");

        this.load.setPath("assets");

        this.load.image("background", "Background.png");
        this.load.image("text input", "Text Input.png");
        this.load.image("enemy bar", "Enemy Bar.png");
        this.load.image("description board", "Description Board.png");
        this.load.image("score board", "Score Board.png");

        const imageInfo = this.cache.json.get("image info");

        //player
        this.load.spritesheet("player", `Sprites/Player.png`, {
            frameWidth: imageInfo["Player"].frame_width,
            frameHeight: imageInfo["Player"].frame_height,
        });

        //enemy
        const enemyInfo = imageInfo.enemy;
        for (let name in enemyInfo) {
            this.load.spritesheet(
                name.toLowerCase(),
                `Sprites/enemy/${name}.png`,
                {
                    frameWidth: enemyInfo[name].frame_width,
                    frameHeight: enemyInfo[name].frame_height,
                }
            );
        }

        //companion
        const companionInfo = imageInfo.companion;
        for (let name in companionInfo) {
            this.load.spritesheet(
                name.toLowerCase(),
                `Sprites/companion/${name}.png`,
                {
                    frameWidth: companionInfo[name].frame_width,
                    frameHeight: companionInfo[name].frame_height,
                }
            );
        }

        //heart
        const heartInfo = imageInfo.heart;
        for (let name in heartInfo) {
            this.load.spritesheet(
                name.toLowerCase(),
                `Sprites/heart/${name}.png`,
                {
                    frameWidth: heartInfo[name].frame_width,
                    frameHeight: heartInfo[name].frame_height,
                }
            );
        }
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("Game");
    }
}
