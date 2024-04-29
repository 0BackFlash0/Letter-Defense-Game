import Phaser from "phaser";

class WordManager {
    constructor(scene) {
        this.scene = scene;

        this.words = this.scene.cache.json.get("words");
        console.log(this.words);

        this.wordsLength = Object.keys(this.words["어휘"]).length;

        this.currentWords = new Object();
        this.storedWords = new Array();
    }

    getRandomWord() {
        const idx = Math.floor(Math.random() * this.wordsLength);

        const word = this.words["어휘"][idx];
        const description = this.words["합쳐진 뜻풀이"][idx];

        if (!this.currentWords.hasOwnProperty(word)) {
            this.currentWords[word] = description;
        }

        return word;
    }

    storeWord(word) {
        if (this.currentWords.hasOwnProperty(word)) {
            this.storedWords.push(word);
            return;
        }
        console.log("Error : Not Valid Word");
    }

    getDescription(word) {
        if (this.currentWords.hasOwnProperty(word)) {
            return this.currentWords[word];
        }
        console.log("Error : Not Valid Word");
        return "";
    }
}

export default WordManager;
