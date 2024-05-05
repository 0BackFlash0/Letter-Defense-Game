import Phaser from "phaser";

class SettingManager {
    constructor(scene, eventEmitter) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;

        this.selectedFont = '"Jua"';
        this.showDescription = true;
        this.backgroundVolume = 50;
        this.effectVolume = 50;
    }

    getLocalstorage() {
        console.log(localStorage.getItem("font") || this.selectedFont);
        this.selectedFont = localStorage.getItem("font") || this.selectedFont;
        this.setFont(this.selectedFont);
        this.showDescription = localStorage.getItem("description")
            ? localStorage.getItem("description") === "true"
            : this.showDescription;

        this.setDescription(this.showDescription);
        this.backgroundVolume = localStorage.getItem("bgmvol")
            ? parseInt(localStorage.getItem("bgmvol"))
            : this.backgroundVolume;

        this.setBackgroundVolume(this.backgroundVolume);
        this.effectVolume = localStorage.getItem("effectvol")
            ? parseInt(localStorage.getItem("effectvol"))
            : this.effectVolume;

        this.setEffectVolume(this.effectVolume);
    }

    setFont(font) {
        this.selectedFont = font;
        localStorage.setItem("font", font);
        this.eventEmitter.emit("set font", font);
    }

    setDescription(isShow) {
        this.showDescription = isShow;
        localStorage.setItem("description", isShow);
        this.eventEmitter.emit("set description", isShow);
    }

    setBackgroundVolume(volume) {
        this.backgroundVolume = volume;
        localStorage.setItem("bgmvol", volume);
        this.eventEmitter.emit("set bgmvolume", volume);
    }

    setEffectVolume(volume) {
        this.effectVolume = volume;
        localStorage.setItem("effectvol", volume);
        this.eventEmitter.emit("set effectvolume", volume);
    }
}

export default SettingManager;
