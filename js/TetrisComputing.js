/**

    Class for preparing whole stuff like array and work on it.
    @param {Object} screenHandler class, main screen
    @param {Object} nextItemScreen class, screen for "next element"
    @param {Object} scoreHandler class, deal with score
    @param {Object} menuHandler class, deal with menu
*/
var TetrisComputing = function ( screenHandler, nextItemScreen, scoreHandler, menuHandler ) {
    "use strict";
    //size of board
    const [SIZE_X,SIZE_Y] = screenHandler.getDimensions();
    const COLORS = [
        "#fe2712", "#8601af", "#0247fe", "#66b032", "#d0ea2b", "#fb9902"/*, "#19e0ff", "#57ff0f"*/
    ];
    let board = []; //main board
    let nextElemBoard = [];// board to show next elem
    let clearSquare = function () {
            this.bgColor =    "";   // backgorund of block
            this.isLocked =   false;  // if it can moves
            this.isActived =  false;  // if it is moving
        };
    let coordElemX = 0;// where piece is located
    let coordElemY = 0;// where piece is located
    let currentElem;
    let currentElemColor;
    let nextElem;
    let nextElemColor;
    let currentIdInterval;
    let rotateStatus = 0; //0,1,2,3
    let disableMoving = false;
    /*
        4x4 array to represents different elements
    */
    const ELEMENTS = {
        I: [
            [[0,1], [1,1], [2,1], [3,1]],
            [[1,0], [1,1], [1,2], [1,3]],
            //[[0,1], [1,1], [2,1], [3,1]],
            //[[1,0], [1,1], [1,2], [1,3]]
            [[0,2], [1,2], [2,2], [3,2]],
            [[2,0], [2,1], [2,2], [2,3]]
        ],
        J: [
            [[0,1], [1,1], [2,1], [2,0]],
            [[0,0], [1,0], [1,1], [1,2]],
            [[0,2], [0,1], [1,1], [2,1]],
            [[1,0], [1,1], [1,2], [2,2]]
        ],
        L: [
            [[0,1], [1,1], [2,1], [2,2]],
            [[2,0], [1,0], [1,1], [1,2]],
            [[0,0], [0,1], [1,1], [2,1]],
            [[1,0], [1,1], [1,2], [0,2]]
        ],
        O: [
            [[0,0], [1,0], [1,1], [0,1]],
            [[0,0], [1,0], [1,1], [0,1]],
            [[0,0], [1,0], [1,1], [0,1]],
            [[0,0], [1,0], [1,1], [0,1]]
        ],
        S: [
            [[2,0], [2,1], [1,1], [1,2]],
            //[[1,0], [1,1], [0,1], [0,2]],
            [[0,0], [1,0], [1,1], [2,1]],
            [[1,0], [1,1], [0,1], [0,2]],
            //[[0,0], [1,0], [1,1], [2,1]],
            [[0,1], [1,1], [1,2], [2,2]]
        ],
        T: [
            [[0,1], [1,1], [1,2], [1,0]],
            [[0,1], [1,1], [1,2], [2,1]],
            [[1,0], [1,1], [1,2], [2,1]],
            [[1,0], [0,1], [1,1], [2,1]]
        ],
        Z: [
            [[1,0], [1,1], [2,1], [2,2]],
            //[[0,0], [0,1], [1,1], [1,2]],
            [[0,1], [1,1], [1,0], [2,0]],
            [[0,0], [0,1], [1,1], [1,2]],
            //[[0,1], [1,1], [1,0], [2,0]],
            [[0,2], [1,2], [1,1], [2,1]]
        ],
        empty: [
            [[0,0], [0,0], [0,0], [0,0]],
            [[0,0], [0,0], [0,0], [0,0]],
            [[0,0], [0,0], [0,0], [0,0]],
            [[0,0], [0,0], [0,0], [0,0]]
        ]
    }

    let init = () => {
        resetGame();
        window.addEventListener("keydown",workWithKeys,true); //it should be keyup, now is exposed to bugs
        menuHandler.setStartFunction(startGame);

    }
    /**
        create board filled with empty squares
        @param {Array} brd save elements to this element
        @param {Number} rows amount of rows
        @param {Number} cols amount of columns
        @return {Array} array of empty squares
    */
    let createEmptyBoard = ( brd, rows = 0, cols = 0 ) => {
        brd = brd || [];
        for (let y = 0; y < rows ;y++) {
            brd[y] = [];
            for (let x = 0; x < cols ;x++) {
                brd[y][x] = new clearSquare();
            }
        }
        return brd;
    }
    let getCoppyOfArray = ( arr = [] ) => {
        return JSON.parse(JSON.stringify( arr ));
    }
    let drawOnScreen = ( board = [] ) => {
        screenHandler.draw( board );
    }

    let drawElemOnBoard = ( board = [], type = 0, bgColor = "#fff", lockElem = false, coordX = 0, coordY = 0 ) => {


        let activ = true;
        if ( lockElem ) activ = false;
        for (let i = 0; i < 4; i++) {
            let singleSq = board[ coordY + type[i][0] ][ coordX + type[i][1] ];
            singleSq.isActived = activ;
            singleSq.isLocked = lockElem;
            singleSq.bgColor = bgColor;
        }
    }
    let refreshScreen = ( lockElem = false ) => {
        let cpBoard = lockElem ? board : getCoppyOfArray(board);
        drawElemOnBoard( cpBoard, currentElem[rotateStatus], currentElemColor, lockElem, coordElemX, coordElemY );
        drawOnScreen( cpBoard );
    }
    let endGame = () => {
        currentElem = ELEMENTS["empty"];
        currentElemColor = "#134bc6";
        disableMoving = true;
        coordElemX = 0;
        coordElemY = 0;
        scoreHandler.stopTime();
        //animation
        let fillBoard = () => {
            refreshScreen( true );
            coordElemX++;
            if ( coordElemX == SIZE_X ) {
                coordElemY++;
                coordElemX = 0;
            }
            if ( coordElemY < SIZE_Y ) {
                window.requestAnimationFrame( fillBoard );
            } else {
                //TODO show reset button
                screenHandler.drawText( "Game Over", "#00bcd4", "#082462" , 60 );
                setTimeout(()=>{
                    menuHandler.showStatsAfterGame( scoreHandler.getLastStats() );
                }, 1000);
            }
        }
        fillBoard();
    }
    let getRandomElem = () => {
        let e = ["I", "J", "L", "O", "S", "T", "Z"];
        let re = e[ Math.random()*e.length >> 0 ];

        return ELEMENTS[ re ];
    }
    let getRandomColor = () => {
        let color;
        const availColors = COLORS.filter( v => v !== nextElemColor );
        return availColors[ Math.random() * availColors.length >> 0 ];
    }

    let giveNextElem = () => {
        clearInterval( currentIdInterval );
        if ( checkIfPlayerLost() ) {
            endGame();
            return true;//don't execute rest of the code
        }
        resetCoords();
        //change element and get next one
        currentElem = getCoppyOfArray( nextElem );
        currentElemColor = nextElemColor;
        nextElem = getRandomElem();
        nextElemColor = getRandomColor();
        //draw next element
        createEmptyBoard( nextElemBoard, 4,4 );
        drawElemOnBoard( nextElemBoard, nextElem[0], nextElemColor ,true,0,0 );
        nextItemScreen.draw( nextElemBoard );

        refreshScreen();
        checkAndRemoveProperLine();
        if ( !canMoveElem() ) { //checks if new element is covering other element and can't appear
            endGame();
        } else {
            //move piece towards down every second
            currentIdInterval = setInterval(moveElemDown, 1000);
        }
    }

    let checkAndRemoveProperLine = () => {
        let ifRemove = true;
        let newBoard;
        let addedLines = 0;
        newBoard = createEmptyBoard(newBoard, SIZE_Y, SIZE_X);

        for (let y = SIZE_Y-1; y >= 0; y--) {
            ifRemove = true;
            for (let x = 0; x < SIZE_X; x++) {
                if ( !board[y][x].isLocked ) ifRemove = false;
            }
            if ( !ifRemove ) {
                newBoard[ SIZE_Y-1-addedLines ] = board[y];
                addedLines++;
            }
        }
        //SCORE
        if ( (SIZE_Y-addedLines) > 0 ) {
            scoreHandler.computeScore( SIZE_Y-addedLines );
        }

        board = newBoard;
        drawOnScreen( board );
    }
    let checkIfPlayerLost = () => {
        //let x = SIZE_X-1;
        const firstRow = board[0];

        //return !firstRow.every( v => !v.isLocked );
        return firstRow.some( v => v.isLocked );

    }

    let rotateElem = () => {
        rotateStatus++;
        if ( rotateStatus > 3 )
            rotateStatus = 0;
        if( !canMoveElem() ) rotateStatus = (rotateStatus==0?3:rotateStatus-1);
    }

    let moveElemDown = () => {
        //I suppose it can moves if doesn't, back previous value
        coordElemY++;
        //if piece is touching other element give next one
        if ( !canMoveElem() ) {
            coordElemY--;
            //LOCK ELEMENT
            refreshScreen( true );
            giveNextElem();
        }
    }
    let moveElemLeft = () => {
        //I suppose it can moves if doesn't, back previous value
        coordElemX--;
        if ( !canMoveElem() ) coordElemX++;
    }
    let moveElemRight = () => {
        //I suppose it can moves if doesn't, back previous value
        coordElemX++;
        if ( !canMoveElem() ) coordElemX--;
    }
    let canMoveElem = () => {
        let elem = currentElem[rotateStatus];
        let x = 0;
        let y = 0;
        for (let i = 0; i < 4; i++) {
            [ x,y ] = [ elem[i][1]+coordElemX, elem[i][0]+coordElemY ];

            if ( ( x < 0 && x > SIZE_X-1 ) || y>SIZE_Y-1 || board[y][x] == undefined || board[y][x].isLocked ) return false;
        }
        refreshScreen();
        return true;
    }
    let workWithKeys = ( evt ) => {
        if ( disableMoving ) return false;
        let keyCode = evt.keyCode || 0;
        switch ( keyCode ) {
            case 37: //left arrow
                moveElemLeft();
            break;
            case 38: //up arrow
                rotateElem();
            break;
            case 39: //right arrow
                moveElemRight();
            break;
            case 40: //down arrow
                moveElemDown();
            break;
        }
    }
    let resetCoords = () => {
        coordElemX = Math.round(SIZE_X/2) - 2,
        coordElemY = 0,
        rotateStatus = 0;
    }
    let resetGame = () => {
        resetCoords();
        screenHandler.fullResetScreen();
        disableMoving = false;
        nextElem = getRandomElem();
        nextElemColor = getRandomColor();

        createEmptyBoard(board, SIZE_Y, SIZE_X);
        drawOnScreen(board);
    }
    let startGame = () => {
        resetGame();
        scoreHandler.resetScore();
        giveNextElem();
    }
    init();

}
