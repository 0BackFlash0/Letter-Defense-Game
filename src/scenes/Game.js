import { Scene } from "phaser";

const ENEMYS = ["Big Demon", "Big Zombie", "Chort", "Goblin", "Ice Zombie", 
                "Imp", "Lizard", "Mask Orc", "Muddy", "Ogre", "Orc Shaman",
                "Orc Warrior", "Pumpkin Dude", "Skeleton", "Slug", "Swampy", "Tiny Slug"];

const COMPANIONS = ["Angle", "Elf", "Knight", "Wizard"];


export class Game extends Scene {
    constructor() {
        super("Game");

        this.input_box = null;
        this.input_Element = null;
    }

    preload() {
        this.load.image("background", "./assets/Background.png");
        this.load.image("text_input", "./assets/Text Input.png");
    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0);
        this.createUI();
    }

    update() {
        // console.log(this.inputElement.node.value);
    }

    loadEnemys(){
        ENEMYS.forEach(enemy => {
            this.load.spritesheet(enemy, `./assets/${enemy}.png`, {
    
            })

        })
    }

    createAnims(){
        this.anims.create({
            key: "enemy_imp",

        })
    }

    createUI() {
        this.input_box = this.add.image(800, 960, "text_input").setOrigin(0);
        this.inputElement = this.add
            .dom(
                800,
                960,
                "input",
                'width: 393px; height: 96px; background: transparent; border: 0px; outline-width: 0;\
                font-size: 40px; line-height: 96px; padding: 0px 20px; font-family: "Jua", sans-serif;\
                font-weight: 400; font-style: normal; color:#FFFFFF; ',
                "Phaser"
            )
            .setOrigin(0);
        this.inputElement.node.type = "text";
    }
}
