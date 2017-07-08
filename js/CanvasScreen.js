/**
 * Class for drawing elements in canvas
 * @param {object} canvasElem DOM element, canvas
 * @param {integer} sizeX how many columns in board
 * @param {integer} sizeY how many rows in board
*/
var CanvasScreen = function ( canvasElem, sizeX, sizeY ) {
    "use strict";
    const SIZE = 40; //size of square
    let ctx = canvasElem.getContext( "2d" ),
        currentX = 0,
        currentY = 0;


    let init = () => {
        //set size of canvas, according to rows and columns
        let w = sizeX * SIZE,
            h = sizeY * SIZE;
        canvasElem.width = w;
        canvasElem.height = h;

        resetScreen();
    }
    /**
        draw single square in canvas
        @param {object} obj it contains informations about square
    */
    let drawSingleSquare = ( obj ) => {
        ctx.beginPath();
        ctx.strokeStyle = "#333";
        roundedRect(currentX,currentY);
        setBgSquare( obj );
        ctx.fill();
        ctx.closePath();

        //draw "border"
        ctx.beginPath();
        ctx.strokeStyle = "#aaa";
        dashed(currentX,currentY);
        ctx.stroke();
        ctx.closePath();
    }
    /**
        Set background of square
        @param {object} obj it contains informations about square
    */
    let setBgSquare = ( obj ) => {
        let bg;
        if ( obj.isActived || obj.isLocked) { // conditions when square can be colored
            bg = obj.bgColor;
            ctx.stroke(); // stress colored squares
        } else {
            bg = "white"; //default color
        }
        ctx.fillStyle = bg;
    }
    /**
        Draw rounded square
        @param {number} x coordinate x
        @param {number} y coordinate y
    */
    let roundedRect = ( x, y ) => {

        ctx.moveTo( x + 10, y );
        ctx.lineTo( x + 30, y );
        ctx.quadraticCurveTo( x + 40, y, x + 40, y + 10 );
        ctx.lineTo( x + 40, y + 30 );
        ctx.quadraticCurveTo( x + 40, y + 40, x + 30, y + 40 );
        ctx.lineTo( x + 10, y + 40 );
        ctx.quadraticCurveTo( x, y + 40, x, y + 30 );
        ctx.lineTo( x + 0, y + 10 );
        ctx.quadraticCurveTo( x ,y ,x + 10, y );
    }
    /**
        Draw "dashed" border
        @param {number} x coordinate x
        @param {number} y coordinate y
    */
    function dashed( x, y ){
        ctx.moveTo( x + 10, y);
        ctx.lineTo( x + 30, y);
        ctx.moveTo( x + 40, y + 10 );
        ctx.lineTo( x + 40, y + 30 );
        ctx.moveTo( x + 30, y + 40 );
        ctx.lineTo( x + 10, y + 40 );
        ctx.moveTo( x, y + 30 );
        ctx.lineTo( x, y + 10 );
        ctx.moveTo( x + 10, y );

    }
    /**
        draw big white rect to reset screen
    */
    let resetScreen = () => {
        ctx.fillStyle = "white";
        ctx.fillRect( 0, 0, canvasElem.width, canvasElem.height );
    }
    /**
        Public function, draw elements on canvas
        @param {array} array array of objects (squares)
    */
    this.draw = function ( array ) {
        currentX = 0,
        currentY = 0;

        //every time clean screen
        resetScreen();

        array.forEach( (v) => {

            v.forEach( (sq) => {
                drawSingleSquare(sq);
                currentX += SIZE;
            });

            currentX = 0;
            currentY += SIZE;
        });
    }
    /**
        public function, draw text on screen, at center.
        @param {string} text what text write
        @param {string} colorFill hex color of filled text
        @param {string} colorStroke hex color of border of text
        @param {integer} fontSize size of font in px
    */
    this.drawText = function ( text, colorFill, colorStroke, fontSize ) {
        ctx.beginPath();
        ctx.font = "bold " + fontSize + "px Impact, Charcoal";
        ctx.fillStyle = colorFill;
        ctx.strokeStyle = colorStroke;
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        ctx.fillText(text, canvasElem.width/2, canvasElem.height/2);
        ctx.strokeText(text, canvasElem.width/2, canvasElem.height/2);
        ctx.closePath();
    }
    /**
        public function, it passes dimensions of board
        @return {array} returns dimensions of board
    */
    this.getDimensions = function () {
        return [sizeX,sizeY];//in this format because [x,y] = [sizeX,sizeY] (es6)
    }
    /*
        public function, Reset screen very strict
    */
    this.fullResetScreen = function () {
        let a = canvasElem.width;
        canvasElem.width = 0;
        canvasElem.width = a;
        resetScreen();
    }

    return init();
}
