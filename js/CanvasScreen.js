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
    let init = () => {
        ctx.fillStyle = "white";
        ctx.fillRect( 0, 0, canvasElem.width, canvasElem.height );
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
        dashed(currentX/40,currentY/40,40);
        ctx.stroke();
        ctx.closePath();
        //ctx.stroke();//TODO delete
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

    let roundedRect = (x,y) => {

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
    function dashed(x,y,size){

        ctx.moveTo(x*size+10,y*size+0);
        ctx.lineTo(x*size+30,y*size+0);
        ctx.moveTo(x*size+40,y*size+10);
        ctx.lineTo(x*size+40,y*size+30);
        ctx.moveTo(x*size+30,y*size+40);
        ctx.lineTo(x*size+10,y*size+40);
        ctx.moveTo(x*size+0,y*size+30);
        ctx.lineTo(x*size+0,y*size+10);
        ctx.moveTo(x*size+10,y*size+0);

    }
    return init();
}
