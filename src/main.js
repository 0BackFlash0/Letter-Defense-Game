import { Book } from "./scenes/Book";
import { Boot } from "./scenes/Boot";
import { End } from "./scenes/End";
import { Game } from "./scenes/Game";
import { Pause } from "./scenes/Pause";
import { Preloader } from "./scenes/Preloader";
import { Start } from "./scenes/Start";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    pixelArt: true,
    parent: "game-container",
    physics: {
        debug: true,
        default: "arcade",
    },
    dom: {
        createContainer: true,
    },
    scale: {
        // width: 1280,
        // height: 720,
        // zoom: 0.5,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        Boot,
        Start,
        Preloader,
        Game,
        Pause,
        End,
        Book,
        // GameOver,
    ],
};

export default new Phaser.Game(config);
