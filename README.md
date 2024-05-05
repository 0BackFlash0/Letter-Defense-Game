# Letter-Defense

단어를 입력해 적의 공격을 방어하는 웹 게임

## 게임 링크

### [Letter Defense](https://0backflash0.github.io/Letter-Defense-Game/)

## 게임 설명

### 게임 목표

-   마을로 다가오는 적들을 단어를 입력하여 해치운다.
-   콤보를 높여 최대한 높은 점수를 얻는다.

### 적

-   적들은 크기에 따라 다른 HP와 속도를 가진다.
-   적들이 마을의 울타리에 닿으면 플레이어의 HP가 닳는다.
-   플레이어의 HP가 0이 되면 패배한다

### 동료

-   가끔씩 마을 근처를 지나는 동료가 등장한다
-   동료의 단어를 입력하여 도움을 요청할 수 있다.
-   동료는 플레이어에게 이로운 효과를 부여한다.
    -   천사 : 플레이어의 HP를 1 회복한다.
    -   전사 : 일정 시간동안 플레이어의 피해를 2배로 한다
    -   마법사 : 일정 시간동안 적들의 이동속도를 감소시킨다
    -   엘프 : 일정 시간 내에 5개의 단어를 입력하면 화면의 모든 적을 해치운다

## 게임 흐름도

![game_flow_chart](<./Flow Chart.png>)

## Reference

### 기술

-   Phaser 3

### Template

-   [template-webpack](https://github.com/phaserjs/template-webpack)

### 단어

-   단어 목록 : [우리말 샘 - 사전 내려받기](https://opendict.korean.go.kr/main)

### 이미지

-   배경 : [Kenny - Tiny Town](https://www.kenney.nl/assets/tiny-town), [Tiny Dungeon](https://www.kenney.nl/assets/tiny-dungeon)
-   UI : [Sr.Toasty - UI assets pack 2 :)]()
-   UI : [Butter Milk - Tiny Wonder GUI Pack](https://butterymilk.itch.io/tiny-wonder-gui-pack)
-   UI : [MakerTech - Additional art for Godot 4 tutorial](https://makertech.itch.io/additional-art-for-godot-4-tutorial)
-   UI : [Pixel UI Button Icon Platformer - BDragon1727](https://bdragon1727.itch.io/pixel-ui-button-icon-platformer)
-   UI(체력) : [Humble Pixel - Health Progress Series #2 : Hearts](https://humblepixel.itch.io/health-progress-series-2-hearts)
-   적, 동료 : [0x72 - Dungeon Tileset II](https://0x72.itch.io/dungeontileset-ii)
-   플레이어 : [oisougabo - Gabo's Adventurers Pack I](https://oisougabo.itch.io/gap-i)

### 사운드

-   BGM : [Aaron Paul Low - Open Fields](https://uppbeat.io/track/aaron-paul-low/open-fields)
-   Effect : [floraphonic - 8 bit game 1~6](https://pixabay.com/users/floraphonic-38928062/), [ShidenBeatsMusic - Sound Effect: Twinkle/Sparkle](https://pixabay.com/sound-effects/sound-effect-twinklesparkle-115095/), [Pixabay - Bow Release (Bow and Arrow) 4](https://pixabay.com/sound-effects/bow-release-bow-and-arrow-4-101936/)
