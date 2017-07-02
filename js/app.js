(()=>{
    "use strict";
    let screenHandler = document.querySelector("#screen");
    let scoreElem = document.querySelector("#score");
    let addedScore = document.querySelector("#addedScore");
    let nextPieceHandler = document.querySelector("#piece");
    let startPlay = document.querySelector("#startPlay");

    let mainScreen = new CanvasScreen(screenHandler, 10,15);
    let nextItemScreen = new CanvasScreen(nextPieceHandler,4,4);
    let scoreHandler = new Score(scoreElem, addedScore);
    let game = new TetrisComputing(mainScreen, nextItemScreen, scoreHandler);


    startPlay.addEventListener("click",()=>{
        startPlay.style.display = "none";
        game.start();
    }, true);
})()
