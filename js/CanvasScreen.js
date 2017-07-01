/**
 * Class for drawing elements in canvas
 * @param {object} canvasElem handler of canvas
*/
var CanvasScreen = function ( canvasElem, sizeX, sizeY ) {
    "use strict";
    const SIZE = 40; //size of square
    let ctx = canvasElem.getContext( "2d" ),
        currentX = 0,
        currentY = 0;


    let init = () => {
        let w = sizeX * SIZE,
            h = sizeY * SIZE;
        canvasElem.width = w;
        canvasElem.height = h;
        ctx.fillStyle = "white";
        ctx.fillRect( 0, 0, w, h );
    }
    let drawSingleSquare = ( obj ) => {
        ctx.beginPath();
        ctx.strokeStyle = "#333";
        roundedRect(currentX,currentY);
        setBgSquare( obj );
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "#aaa";
        dashed(currentX,currentY);
        ctx.stroke();
        ctx.closePath();
    }
    let setBgSquare = ( obj ) => {
        let bg;
        if ( obj.isActived || obj.isLocked) {
            bg = obj.bgColor;
            ctx.stroke();
        } else {
            bg = "white";
        }
        ctx.fillStyle = bg;
    }
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
        Public function, draw elements in canvas
        @param {array} array array of objects
    */
    this.draw = function ( array ) {
        currentX = 0,
        currentY = 0;
        ctx.fillStyle = "white";
        ctx.fillRect( 0, 0, canvasElem.width, canvasElem.height );
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
        @param {string} text what write
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
    }
    /**
        public function, it passes dimensions of board
        @return {array} returns dimensions of board
    */
    this.getDimensions = function () {
        return [sizeX,sizeY];
    }



    return init();
}
