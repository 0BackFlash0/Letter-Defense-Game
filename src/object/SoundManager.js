import Phaser from "phaser";

class SoundManager {
    constructor(scene, eventEmitter) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;

        this.bgmVolume = 50;
        this.effectVolume = 50;

        this.bgm = null;
        this.effectList = new Object();

        this.initialize();
    }

    initialize() {
        this.bgm = this.scene.sound.add("bgm", {
            loop: true,
            volume: this.bgmVolume / 100,
        });
        this.effectList["player hit"] = this.scene.sound.add("player hit", {
            loop: false,
            volume: this.effectVolume / 100,
        });
        this.effectList["player heal"] = this.scene.sound.add("player heal", {
            loop: false,
            volume: this.effectVolume / 100,
        });
        this.effectList["player die"] = this.scene.sound.add("player die", {
            loop: false,
            volume: this.effectVolume / 100,
        });
        this.effectList["player shoot"] = this.scene.sound.add("player shoot", {
            loop: false,
            volume: this.effectVolume / 100,
        });
        this.effectList["target hit"] = this.scene.sound.add("target hit", {
            loop: false,
            volume: this.effectVolume / 100,
        });
        this.effectList["enemy die"] = this.scene.sound.add("enemy die", {
            loop: false,
            volume: this.effectVolume / 100,
        });
        this.effectList["companion help"] = this.scene.sound.add(
            "companion help",
            {
                loop: false,
                volume: this.effectVolume / 100,
            }
        );
        this.effectList["companion leave"] = this.scene.sound.add(
            "companion leave",
            {
                loop: false,
                volume: this.effectVolume / 100,
            }
        );
        this.effectList["elf skill"] = this.scene.sound.add("elf skill", {
            loop: false,
            volume: this.effectVolume / 100,
        });

        this.initializeEvent();
    }

    startBGM() {
        this.bgm.play();
    }

    playEffect(effect_name) {
        this.effectList[effect_name].play();
    }

    setBGMVolume(volume) {
        this.bgmVolume = volume;
        this.bgm.setVolume(this.bgmVolume / 100);
    }

    setEffectVolume(volume) {
        this.effectVolume = volume;
        for (let effect_name in this.effectList) {
            this.effectList[effect_name].setVolume(this.effectVolume / 100);
        }
    }

    initializeEvent() {
        this.eventEmitter.on("set bgmvolume", (volume) => {
            this.setBGMVolume(volume);
        });
        this.eventEmitter.on("set effectvolume", (volume) => {
            this.setEffectVolume(volume);
        });
    }
}

export default SoundManager;
