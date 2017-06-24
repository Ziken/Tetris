/**

    Class for preparing whole stuff like array and work on it.
    @param {object} elem handler of canvas
*/
var TetrisComputing = function ( screenHandler, scoreCallback ) {
    "use strict";
    const SIZE_X = 10,
          SIZE_Y = 15;
    //TODO correct it
    let board = [];
    let clearSquare = function(){
        this.bgColor =      "";   // backgorund of block
        this.isLocked =   false;  // if it can moves
        this.isActived =  false;  // if it is moving
    };
    let coordElemX = 3,
        coordElemY = 0;
    let currentElem;
    let currentIdInterval;
    let rotateStatus = 0;//0,1,2,3
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
        ]
    }

    let init = () => {
        createEmptyBoard(board);
        drawOnScreen(board);
        window.addEventListener("keyup",workWithKeys,true);
    }
    let createEmptyBoard = (brd) => {
        brd = brd || [];
        for (let y = 0; y < SIZE_Y ;y++) {
            brd[y] = [];
            for (let x = 0; x < SIZE_X ;x++) {
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
    let drawElemOnBoard = ( board, type, bgColor, lockElem ) => {
        lockElem = lockElem || false;

        let activ = true;
        if ( lockElem ) activ = false;
        for (let i = 0; i < 4; i++) {
            let singleSq = board[ coordElemY + type[i][0] ][ coordElemX + type[i][1] ];

            singleSq.isActived = activ;
            singleSq.isLocked = lockElem;
            singleSq.bgColor = bgColor;
        }
    }
    let refreshScreen = (lockElem) => {
        lockElem = lockElem || false;
        let cpBoard = lockElem ? board : getCoppyOfArray(board);
        drawElemOnBoard( cpBoard, currentElem[rotateStatus], "grey", lockElem);
        drawOnScreen(cpBoard);
    }
    let giveNextElem = () => {
        clearInterval(currentIdInterval);
        if ( checkIfPlayerLost() ) {
            //TODO do sth if player lost game!
        }
        coordElemX = 3,
        coordElemY = 0,
        rotateStatus = 0;

        let e = ["I", "J", "L", "O", "S", "T", "Z"];
        //currentElem = ELEMENTS[ e[Math.floor(Math.random()*e.length)] ];
        currentElem = ELEMENTS["J"];
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
        newBoard = createEmptyBoard(newBoard);

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
        //score
        //scoreCallback(SIZE_Y)

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
        if ( !canMoveElem() )coordElemX--;
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
