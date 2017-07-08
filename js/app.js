(()=>{
    "use strict";

    let screenHandler = document.querySelector("#screen"),
        scoreElem = document.querySelector("#score"),
        addedScore = document.querySelector("#addedScore"),
        nextPieceHandler = document.querySelector("#piece"),
        buttonPlay = document.querySelector("#startPlay"),
        buttonShowStats = document.querySelector("#showStats"),
        menuHandler = document.querySelector("#menu"),
        statsHandler = document.querySelector("#stats"),
        lastStatsHandler = document.querySelector("#lastStats");
    //Start whole app
    let mainScreen = new CanvasScreen(screenHandler, 10,15);
    let nextItemScreen = new CanvasScreen(nextPieceHandler,4,4);
    let scoreHandler = new Score(scoreElem, addedScore, buttonShowStats,statsHandler);
    let workingMenu = new GameMenu(menuHandler, statsHandler, lastStatsHandler, buttonPlay, buttonShowStats);
    let game = new TetrisComputing(mainScreen, nextItemScreen, scoreHandler, workingMenu);
})()
