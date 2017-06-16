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
    /*
        4x4 array to represents different elements
    */
    let elements = {
        I: [
            [[0,1], [1,1], [2,1], [3,1]],
            [[1,0], [1,1], [1,2], [1,3]],
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
            [[0,0], [1,0], [1,1], [2,1]],
            [[1,0], [1,1], [0,1], [0,2]],
            [[0,1], [1,1], [1,2], [2,2]]
        ],
        T: [
            [[1,0], [1,1], [1,2], [2,1]],
            [[1,0], [0,1], [1,1], [2,1]],
            [[0,1], [1,1], [1,2], [0,1]],
            [[0,1], [1,1], [1,2], [2,1]]
        ],
        Z: [
            [[1,0], [1,1], [2,1], [2,2]],
            [[0,1], [1,1], [1,0], [2,0]],
            [[0,0], [0,1], [1,1], [1,2]],
            [[0,2], [1,2], [1,1], [2,1]]
        ]
    }

    let init = () => {

        for (let y = 0; y < SIZE_Y ;y++) {
            board[y] = [];
            for (let x = 0; x < SIZE_X ;x++) {
                board[y][x] = new clearSquare();
            }
        }

        let elem = createElement(elements.S[0],"blue");
        setInterval(()=>{
            let cpBoard = getCoppyOfArray(board);
            scaleElemToBoard(cpBoard,elem);
            drawOnBoard(cpBoard);
            //coordElemY++;
        },1000);
    }
    let createElement = ( aof, bgColor ) => { //arary of points
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
    let getCoppyOfArray = ( arr ) => {
        return JSON.parse(JSON.stringify(arr));
    }
    let scaleElemToBoard = ( board,elem ) => {
        let borderX = 4,
            borderY = 4;

        for (let y = 0; y < borderY; y++) {
            for (let x = 0; x < borderX; x ++) {
                board[ y+coordElemY ][ x+coordElemX ] = elem[y][x];
            }
        }
    }
    let drawOnBoard = (board) => {
        screenHandler.draw(board);
    }
    /*this.start = () => {

    }
    this.score = () => {

    }*/

    return init();

}
