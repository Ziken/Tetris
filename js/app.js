(()=>{
    "use strict";
    let screenHandler = document.querySelector("#screen");
    let scoreElem = document.querySelector("#score");
    let addedScore = document.querySelector("#addedScore");
    screenHandler.width = 400;
    screenHandler.height = 600;
    let mainScreen = new CanvasScreen(screenHandler);
    let scoreHandler = new Score(scoreElem, addedScore);
    let game = new TetrisComputing(mainScreen, scoreHandler);
    game.start();
})()
