import { Scene } from "phaser";

const BOOKPOSITION = [500, 270];
const WORDFRAMEPOSITION = [1300, 280];
const BOOKNEXTPOSITION = [1180, 640];
const BOOKPREVPOSITION = [540, 640];
const BOOKQUITPOSITION = [1160, 270];
const BOOKTITLEPOSITION = [584, 303];
const BOOKDESCRIPTIONPOSITION = [937, 303];

export class Book extends Scene {
    constructor() {
        super("Book");

        this.book = null;
        this.bookNextButton = null;
        this.bookPrevButton = null;
        this.bookQuitButton = null;
        this.wordFrame = null;

        this.wordLabelsElement = null;
        this.wordTitleElement = null;
        this.wordDescriptionElement = null;

        this.wordIndex = 0;
        this.wordList = null;
        this.wordDict = null;
    }

    init(data) {
        this.wordList = data.wordList;
        this.wordDict = data.wordDict;
        this.prevScene = data.prevScene;
    }

    create() {
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");
        this.createUI();
        this.createWordList();
        if (this.wordList.length > 0) this.selectWord(0);
    }

    createUI() {
        this.book = this.add.image(...BOOKPOSITION, "word book").setOrigin(0);
        this.bookNextButton = this.add
            .image(...BOOKNEXTPOSITION, "book next")
            .setOrigin(0.5, 0.5)
            .setScale(4)
            .setInteractive();
        this.bookNextButton.on("pointerover", () => {
            this.bookNextButton.setScale(4.4);
        });
        this.bookNextButton.on("pointerout", () => {
            this.bookNextButton.setScale(4);
        });
        this.bookNextButton.on("pointerdown", () => {
            if (this.wordIndex + 1 >= this.wordList.length) this.selectWord(0);
            else this.selectWord(this.wordIndex + 1);
        });

        this.bookPrevButton = this.add
            .image(...BOOKPREVPOSITION, "book prev")
            .setOrigin(0.5, 0.5)
            .setScale(4)
            .setInteractive();

        this.bookPrevButton.on("pointerover", () => {
            this.bookPrevButton.setScale(4.4);
        });
        this.bookPrevButton.on("pointerout", () => {
            this.bookPrevButton.setScale(4);
        });
        this.bookPrevButton.on("pointerdown", () => {
            if (this.wordIndex - 1 < 0)
                this.selectWord(this.wordList.length - 1);
            else this.selectWord(this.wordIndex - 1);
        });

        this.bookQuitButton = this.add
            .image(...BOOKQUITPOSITION, "book quit")
            .setOrigin(0.5, 0.5)
            .setScale(5)
            .setInteractive();

        this.bookQuitButton.on("pointerover", () => {
            this.bookQuitButton.setScale(5.5);
        });
        this.bookQuitButton.on("pointerout", () => {
            this.bookQuitButton.setScale(5);
        });
        this.bookQuitButton.on("pointerdown", () => {
            this.scene.resume(this.prevScene);
            this.scene.stop("Book");
        });

        this.wordFrame = this.add
            .image(...WORDFRAMEPOSITION, "word list frame")
            .setOrigin(0);

        this.wordTitleElement = this.add
            .dom(...BOOKTITLEPOSITION, "div")
            .setOrigin(0);
        this.wordTitleElement.node.classList.add("book_content", "title");

        const titleInner = document.createElement("div");
        this.wordTitleElement.node.appendChild(titleInner);

        this.wordDescriptionElement = this.add
            .dom(...BOOKDESCRIPTIONPOSITION, "div")
            .setOrigin(0);
        this.wordDescriptionElement.node.classList.add(
            "book_content",
            "description"
        );

        const descriptionInner = document.createElement("div");
        this.wordDescriptionElement.node.appendChild(descriptionInner);
    }

    createWordList() {
        this.wordLabelsElement = this.add
            .dom(WORDFRAMEPOSITION[0] + 16, WORDFRAMEPOSITION[1] + 16, "div")
            .setOrigin(0);
        this.wordLabelsElement.node.classList.add("word_list");

        this.wordList.forEach((word, index) => {
            const wordLabel = document.createElement("div");
            wordLabel.innerText = word;
            wordLabel.classList.add("word_label");
            console.log(index);
            wordLabel.addEventListener("click", () => {
                console.log(index);
                this.selectWord(index);
            });
            this.wordLabelsElement.node.appendChild(wordLabel);
        });

        console.log(this.wordLabelsElement.node.childNodes);
    }

    selectWord(selectedIndex) {
        const previousChild =
            this.wordLabelsElement.node.childNodes[this.wordIndex];
        const selectedChild =
            this.wordLabelsElement.node.childNodes[selectedIndex];
        if (previousChild.classList.contains("selected"))
            previousChild.classList.remove("selected");
        selectedChild.classList.add("selected");
        this.wordIndex = selectedIndex;
        this.wordTitleElement.node.firstChild.innerText =
            this.wordList[this.wordIndex];
        this.wordDescriptionElement.node.firstChild.innerText =
            this.wordDict[this.wordList[this.wordIndex]];
        console.log(this.wordDict[this.wordList[this.wordIndex]]);
    }
}
