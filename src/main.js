import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
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
        zoom: 0.5,
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        Boot,
        Preloader,
        // MainMenu,
        Game,
        GameOver,
    ],
};

export default new Phaser.Game(config);
