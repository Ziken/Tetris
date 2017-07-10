(()=>{
    "use strict";
    // rule one let for one variable
    let screenHandler = document.querySelector("#screen");
    let scoreElem = document.querySelector("#score");
    let addedScore = document.querySelector("#addedScore");
    let nextPieceHandler = document.querySelector("#piece");
    let buttonPlay = document.querySelector("#startPlay");
    let buttonShowStats = document.querySelector("#showStats");
    let menuHandler = document.querySelector("#menu");
    let statsHandler = document.querySelector("#stats");
    let lastStatsHandler = document.querySelector("#lastStats");

    //Start whole app
    let mainScreen = new CanvasScreen(screenHandler, 10,15);
    let nextItemScreen = new CanvasScreen(nextPieceHandler,4,4);

    let scoreHandler = new Score(scoreElem, addedScore, buttonShowStats,statsHandler);
    let workingMenu = new GameMenu(menuHandler, statsHandler, lastStatsHandler, buttonPlay, buttonShowStats);
    let game = new TetrisComputing(mainScreen, nextItemScreen, scoreHandler, workingMenu);
})()
