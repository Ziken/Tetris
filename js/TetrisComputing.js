/**

    Class for preparing whole stuff like array and work on it.
    @param {object} elem handler of canvas
*/
var TetrisComputing = function ( screenHandler ) {
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
    createEmptyBoard = (brd) => {
        brd = brd || [];
        for (let y = 0; y < SIZE_Y ;y++) {
            brd[y] = [];
            for (let x = 0; x < SIZE_X ;x++) {
                brd[y][x] = new clearSquare();
            }
        }
        return brd;
    }
    /*let createElement = ( aof, bgColor ) => { //arary of points
        let elem = [];
        for (let y = 0; y < 4 ;y++) {
            elem[y] = [];
            for(let x = 0;x<4;x++) {
                elem[y][x] = new clearSquare();
            }
        }
        aof.forEach( (v) => {
            elem[v[0]][v[1]].isActived = true;
            elem[v[0]][v[1]].bgColor = bgColor;
        });
        return elem;
    }
    let mergeElemToBoard = ( board,elem ) => {
        let borderX = 4,
            borderY = 4;

        for (let y = 0; y < borderY; y++) {
            for (let x = 0; x < borderX; x ++) {
                board[ y+coordElemY ][ x+coordElemX ] = elem[y][x];
            }
        }
    }*/
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
        coordElemX = 3,
        coordElemY = 0;
        let e = ["I", "J", "L", "O", "S", "T", "Z"];
        //currentElem = ELEMENTS[ e[Math.floor(Math.random()*e.length)] ];
        checkAndRemoveProperLine();
        currentElem = ELEMENTS["I"];
        currentIdInterval = setInterval( () => {
            refreshScreen();
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
            } else {
                //TODO Score here
            }
        }
        board = newBoard;
        drawOnScreen(board);
    }
    let rotateElem = () => {
        rotateStatus++;
        if ( rotateStatus > 3 )
            rotateStatus = 0;
        if( !canMoveElem() ) rotateStatus = (rotateStatus==0?3:rotateStatus-1);
    }
    let moveElemDown = () => {
        /*let nextY = coordElemY+1;
        let highestY = 0;
        let elem = currentElem[rotateStatus];
        //let touchedElem = false;
        for (let i = 0; i < 4; i++) {
            if ( highestY < elem[i][0] ) highestY = elem[i][0];
        }
        highestY+=coordElemY;
        console.log(canMoveElem());
        if ( highestY >= SIZE_Y-1 ) {*/
        //I suppose it can moves if doesn't, back previous value
        coordElemY++;
        if ( !canMoveElem() ) {
        coordElemY--;
            //TODO LOCK ELEMENT
            //setTimeout(()=>{
                refreshScreen(true);
                giveNextElem();
            //},500);
        }
    }
    let moveElemLeft = () => {
        /*let prevX = coordElemX-1;
        let lowestX = SIZE_X;
        let elem = currentElem[rotateStatus];
        for (let i = 0; i < 4; i++) {
            if ( lowestX > elem[i][1] ) lowestX = elem[i][1];
        }
        if ( lowestX == 0 && coordElemX > 0) {
            coordElemX--;
        } else if(lowestX == 1 && coordElemX >= 0) {
            coordElemX--;
        }*/
        //I suppose it can moves if doesn't, back previous value
        coordElemX--;
        if ( !canMoveElem() ) coordElemX++;
    }
    let moveElemRight = () => {
        /*let nextX = coordElemX+1;
        let highestX = 0;
        let elem = currentElem[rotateStatus];
        for (let i = 0; i<4; i++) {
            if( highestX < elem[i][1] ) highestX = elem[i][1];
        }
        highestX +=coordElemX;
        if (highestX < SIZE_X - 1) coordElemX++;*/
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
        return true;
    }
    let workWithKeys = ( evt ) => {
        switch ( evt.keyCode ) {
            case 37: //left arrow
                moveElemLeft();
                refreshScreen();
            break;
            case 38: //up arrow
                rotateElem();
                refreshScreen();
            break;
            case 39: //right arrow
                moveElemRight();
                refreshScreen();
            break;
            case 40: //down arrow
                moveElemDown();
                refreshScreen();
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
