/**

    Class for preparing whole stuff like array and work on it.
    @param {object} screenHandler class, main screen
    @param {object} nextItemScreen class, screen for "next element"
    @param {object} scoreHandler class, deal with score
    @param {object} menuHandler class, deal with menu
*/
var TetrisComputing = function ( screenHandler, nextItemScreen, scoreHandler, menuHandler ) {
    "use strict";
    //size of board
    const [SIZE_X,SIZE_Y] = screenHandler.getDimensions();
    const COLORS = [
        "#fe2712", "#8601af", "#0247fe", "#66b032", "#d0ea2b", "#fb9902"/*, "#19e0ff", "#57ff0f"*/
    ];
    let board = [], //main board
        nextElemBoard = [],// board to show next elem
        clearSquare = function () {
            this.bgColor =    "";   // backgorund of block
            this.isLocked =   false;  // if it can moves
            this.isActived =  false;  // if it is moving
        },
        coordElemX = 0,// where piece is located
        coordElemY = 0,// where piece is located
        currentElem,
        currentElemColor,
        nextElem,
        nextElemColor,
        currentIdInterval,
        rotateStatus = 0, //0,1,2,3
        disableMoving = false;
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
        menuHandler.setStartFunction(this.start);

    }
    /**
        create board filled with empty squares
        @param {array} brd save elements to this element
        @param {number} rows amount of rows
        @param {number} cols amount of columns
        @return {arrray} array of empty squares
    */
    let createEmptyBoard = ( brd, rows, cols ) => {
        brd = brd || [];
        for (let y = 0; y < rows ;y++) {
            brd[y] = [];
            for (let x = 0; x < cols ;x++) {
                brd[y][x] = new clearSquare();
            }
        }
        return brd;
    }
    let getCoppyOfArray = ( arr ) => {
        return JSON.parse(JSON.stringify( arr ));
    }
    let drawOnScreen = ( board ) => {
        screenHandler.draw( board );
    }

    let drawElemOnBoard = ( board, type, bgColor, lockElem, coordX, coordY ) => {
        lockElem = lockElem || false;

        let activ = true;
        if ( lockElem ) activ = false;
        for (let i = 0; i < 4; i++) {
            let singleSq = board[ coordY + type[i][0] ][ coordX + type[i][1] ];
            singleSq.isActived = activ;
            singleSq.isLocked = lockElem;
            singleSq.bgColor = bgColor;
        }
    }
    let refreshScreen = ( lockElem ) => {
        lockElem = lockElem || false;
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
                    menuHandler.showLastStats( scoreHandler.getLastStats() );
                }, 1000);
            }
        }
        fillBoard();
    }
    let getRandomElem = () => {
        let e = ["I", "J", "L", "O", "S", "T", "Z"];
        let re = e[ Math.floor(Math.random()*e.length) ];

        return ELEMENTS[ re ];
    }
    let getRandomColor = () => {
        let color;
        do {
            color = COLORS[ Math.floor( Math.random()*COLORS.length ) ];
        } while(color == nextElemColor);

        return color;
    }

    let giveNextElem = () => {
        clearInterval( currentIdInterval );
        if ( checkIfPlayerLost() ) {
            endGame();
            return true;//don't execute rest of the code
        }
        resetCoords();
        currentElem = getCoppyOfArray( nextElem );
        currentElemColor = nextElemColor;
        nextElem = getRandomElem();
        nextElemColor = getRandomColor();

        createEmptyBoard( nextElemBoard, 4,4 );
        drawElemOnBoard( nextElemBoard, nextElem[0], nextElemColor ,true,0,0 );
        nextItemScreen.draw( nextElemBoard );

        refreshScreen();
        checkAndRemoveProperLine();
        if ( !canMoveElem() ) { //checks if new element is covering other element and can't appear
            endGame();
        } else {
            //move piece towards down every second
            currentIdInterval = setInterval( () => {
                moveElemDown();
            },1000);
        }
    }

    let checkAndRemoveProperLine = () => {
        let ifRemove = true,
            newBoard,
            addedLines = 0;
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
        let y = 0,
            x = SIZE_X-1;
        while ( x >= 0 ) {
            if ( board[y][x].isLocked ) return true;
            x--;
        }
        return false;
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
        let elem = currentElem[rotateStatus],
            x=0,
            y=0;
        for (let i = 0; i < 4; i++) {
            [ x,y ] = [ elem[i][1]+coordElemX, elem[i][0]+coordElemY ];

            if ( ( x < 0 && x > SIZE_X-1 ) || y>SIZE_Y-1 || board[y][x] == undefined || board[y][x].isLocked ) return false;
        }
        refreshScreen();
        return true;
    }
    let workWithKeys = ( evt ) => {
        if ( disableMoving ) return false;
        switch ( evt.keyCode ) {
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
    this.start = () => {
        resetGame();
        scoreHandler.resetScore();
        giveNextElem();
    }
    return init();

}
