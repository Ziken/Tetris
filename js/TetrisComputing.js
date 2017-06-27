/**

    Class for preparing whole stuff like array and work on it.
    @param {object} elem handler of canvas
*/
var TetrisComputing = function ( screenHandler, nextItemScreen, scoreHandler ) {
    "use strict";
    const SIZE_X = 10,
          SIZE_Y = 15;
    //TODO correct it
    let board = [];
    let nextElemBoard = [];
    let clearSquare = function () {
        this.bgColor =    "";   // backgorund of block
        this.isLocked =   false;  // if it can moves
        this.isActived =  false;  // if it is moving
    };
    let coordElemX = 3,
        coordElemY = 0;
    let currentElem;
    let nextElem;
    let currentIdInterval;
    let rotateStatus = 0;//0,1,2,3
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
        createEmptyBoard(board, SIZE_Y, SIZE_X);
        drawOnScreen(board);
        nextElem = getRandomElem();
        window.addEventListener("keyup",workWithKeys,true);

    }
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
    let drawOnScreen = (board) => {
        screenHandler.draw(board);
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
    let refreshScreen = (lockElem) => {
        lockElem = lockElem || false;
        let cpBoard = lockElem ? board : getCoppyOfArray(board);
        drawElemOnBoard( cpBoard, currentElem[rotateStatus], "grey", lockElem, coordElemX, coordElemY);
        drawOnScreen(cpBoard);
    }
    let endGame = () => {
        currentElem = ELEMENTS["empty"];
        disableMoving = true;
        coordElemX = 0;
        coordElemY = 0;
        let fillBoard = () => {
            refreshScreen(true);
            coordElemX++;
            if ( coordElemX == SIZE_X ) {
                coordElemY++;
                coordElemX = 0;
            }
            if ( coordElemY < SIZE_Y ) {
                window.requestAnimationFrame(fillBoard);
            } else {
                //TODO show something like text
                screenHandler.drawText("Game Over", "#ffffff", "#FF0000" , 60);
            }
        }
        fillBoard();
    }
    let getRandomElem = () => {
        let e = ["I", "J", "L", "O", "S", "T", "Z"];
        let re = e[Math.floor(Math.random()*e.length)];

        return (ELEMENTS[ re ]);

    }
    let giveNextElem = () => {
        clearInterval(currentIdInterval);
        if ( checkIfPlayerLost() ) {
            endGame();
            return true;//don't execute rest of the code
        }
        coordElemX = 3,
        coordElemY = 0,
        rotateStatus = 0;

        currentElem = getCoppyOfArray(nextElem);
        nextElem = getRandomElem();

        createEmptyBoard(nextElemBoard, 4,4);
        drawElemOnBoard(nextElemBoard, nextElem[0],"red",true,0,0);
        nextItemScreen.draw(nextElemBoard);
        checkAndRemoveProperLine();

        currentIdInterval = setInterval( () => {
            //refreshScreen();
            moveElemDown();
        },1000);

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
                newBoard[SIZE_Y-1-addedLines] = board[y];
                addedLines++;
            }
        }
        //SCORE
        if ( (SIZE_Y-addedLines)>0 ) {
            scoreHandler.computeScore(SIZE_Y-addedLines);
        }

        board = newBoard;
        drawOnScreen(board);
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
        if ( !canMoveElem() ) {
            coordElemY--;
            //LOCK ELEMENT
            refreshScreen(true);
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

    this.start = () => {
        giveNextElem();
    }

    /*this.score = () => {

    }*/

    return init();

}
