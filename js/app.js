(()=>{
    "use strict";
    let screenHandler = document.querySelector("#screen");
    let scoreElem = document.querySelector("#score");
    let addedScore = document.querySelector("#addedScore");
    let nextPieceHandler = document.querySelector("#piece");
    screenHandler.width = 400;
    screenHandler.height = 600;
    nextPieceHandler.width = 160;
    nextPieceHandler.height = 160;
    let mainScreen = new CanvasScreen(screenHandler);
    let nextItemScreen = new CanvasScreen(nextPieceHandler);
    let scoreHandler = new Score(scoreElem, addedScore);
    let game = new TetrisComputing(mainScreen, nextItemScreen, scoreHandler);
    game.start();
})()
