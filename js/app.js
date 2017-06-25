(()=>{
    let screenHandler = document.querySelector("#screen");
    screenHandler.width = 400;
    screenHandler.height = 600;
    let mainScreen = new CanvasScreen(screenHandler);
    let game = new TetrisComputing(mainScreen);
    game.start();
})()
