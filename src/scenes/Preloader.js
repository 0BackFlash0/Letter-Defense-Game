import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");
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

        this.load.json("words", "./words.json");

        this.load.image("text input", "Text Input.png");
        this.load.image("enemy bar", "Enemy Bar.png");
        this.load.image("description board", "Description Board.png");
        this.load.image("score board", "Score Board.png");
        this.load.image("setting board", "Setting Board.png");
        this.load.image("word book", "Word Book.png");
        this.load.image("book quit", "Book Quit.png");
        this.load.image("book next", "Book Next.png");
        this.load.image("book prev", "Book Prev.png");
        this.load.image("word list frame", "Word List Frame.png");
        this.load.image("result board", "Result Board.png");

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

        //button
        const buttonInfo = imageInfo.button;
        for (let name in buttonInfo) {
            this.load.spritesheet(
                name.toLowerCase(),
                `Sprites/button/${name}.png`,
                {
                    frameWidth: buttonInfo[name].frame_width,
                    frameHeight: buttonInfo[name].frame_height,
                }
            );
        }

        //word panel
        this.load.spritesheet("word panel", `Sprites/Word Panel.png`, {
            frameWidth: imageInfo["Word Panel"].frame_width,
            frameHeight: imageInfo["Word Panel"].frame_height,
        });

        this.load.setPath("assets/sounds");

        this.load.audio(
            "bgm",
            "open-fields-aaron-paul-low-main-version-25198-02-16.mp3"
        );
        this.load.audio("player hit", "8-bit-game-5-188107.mp3");
        this.load.audio(
            "player heal",
            "sound-effect-twinklesparkle-115095.mp3"
        );
        this.load.audio("player die", "8-bit-game-6-188105.mp3");
        this.load.audio(
            "player shoot",
            "bow-release-bow-and-arrow-4-101936.mp3"
        );
        this.load.audio("target hit", "8-bit-game-7-188104.mp3");
        this.load.audio("enemy die", "8-bit-game-4-188106.mp3");
        this.load.audio("companion help", "8-bit-game-2-186976.mp3");
        this.load.audio("companion leave", "8-bit-game-1-186975.mp3");
        this.load.audio("elf skill", "8-bit-game-3-186977.mp3");
    }

    create() {
        console.log("Preload End");
        this.scene.stop("Preloader");
        this.scene.resume("Start");
    }
}
