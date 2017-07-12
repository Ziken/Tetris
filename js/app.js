(()=>{
    'use strict';
    // rule one let for one variable
    const screenHandler = document.querySelector('#screen');
    const scoreElem = document.querySelector('#score');
    const addedScore = document.querySelector('#addedScore');
    const nextPieceHandler = document.querySelector('#piece');
    const buttonPlay = document.querySelector('#startPlay');
    const buttonShowStats = document.querySelector('#showStats');
    const menuHandler = document.querySelector('#menu');
    const statsHandler = document.querySelector('#stats');
    const lastStatsHandler = document.querySelector('#lastStats');

    //Start whole app
    const mainScreen = new CanvasScreen(screenHandler, 10,15);
    const nextItemScreen = new CanvasScreen(nextPieceHandler,4,4);

    const scoreHandler = new Score(scoreElem, addedScore, buttonShowStats,statsHandler);
    const workingMenu = new GameMenu(menuHandler, statsHandler, lastStatsHandler, buttonPlay, buttonShowStats);
    const game = new TetrisComputing(mainScreen, nextItemScreen, scoreHandler, workingMenu);
})()
