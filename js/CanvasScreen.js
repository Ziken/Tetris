/**
 * Class for drawing elements in canvas
 * @param {object} canvasElem handler of canvas
*/
var CanvasScreen = function ( canvasElem ) {
    "use strict";
    const SIZE = 40; //size of square
    let ctx = canvasElem.getContext( "2d" ),
        currentX = 0,
        currentY = 0;

    let drawSingleSquare = ( obj ) => {
        ctx.beginPath();
        ctx.moveTo( currentX, currentY );
        ctx.rect( currentX,currentY,SIZE,SIZE );

        setBgSquare( obj );
        ctx.fill();
        ctx.stroke();//TODO delete
    }
    let setBgSquare = ( obj ) => {
        let bg;
        if ( obj.isActived || obj.isLocked) {
            bg = obj.bgColor;
        } else {
            bg = "white";
        }
        ctx.fillStyle = bg;
    }
    /**
        Public function, draw elements in canvas
        @param {array} array array of objects
    */
    this.draw = function ( array ) {
        currentX = 0,
        currentY = 0;
        array.forEach( (v) => {

            v.forEach( (sq) => {
                //console.log(sq);
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
        ctx.font = "bold " + fontSize + "px Comic Sans MS";
        ctx.fillStyle = colorFill;
        ctx.strokeStyle = colorStroke;
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        ctx.fillText(text, canvasElem.width/2, canvasElem.height/2);
        ctx.strokeText(text, canvasElem.width/2, canvasElem.height/2);

    }
}
