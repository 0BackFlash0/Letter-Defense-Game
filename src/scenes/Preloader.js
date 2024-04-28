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
        this.load.setPath("assets");

        this.load.image("background", "Background.png");
        this.load.image("text input", "Text Input.png");
        this.load.image("enemy bar", "Enemy Bar.png");

        this.image_info = this.cache.json.get("image info");

        //enemy
        console.log(this.image_info["enemy"]);

        let enemy_info = this.image_info.enemy;
        for (let name in enemy_info) {
            this.load.spritesheet(
                name.toLowerCase(),
                `Sprites/enemy/${name}.png`,
                {
                    frameWidth: enemy_info[name].frame_width,
                    frameHeight: enemy_info[name].frame_height,
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
