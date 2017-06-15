/**
 * Class for drawing elements in canvas
 * @param {object} canvasElem handler of canvas
*/
var CanvasScreen = function ( canvasElem ) {
    const SIZE = 40; //size of square
    let ctx = canvasElem.getContext( "2d" ),
        currentX = 0,
        currentY = 0;

    let = drawSingleSquare = ( obj ) => {
        ctx.beginPath();
        ctx.moveTo( currentX, currentY );
        ctx.rect( currentX,currentY,SIZE,SIZE );

        setBgSquare( obj );
        ctx.fill();
        ctx.stroke();//TODO delete
    }
    let setBgSquare = ( obj ) => {
        let bg;
        if ( obj.isFilled ) {
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
                drawSingleSquare(sq);
                currentX += SIZE;
            });

            currentX = 0;
            currentY += SIZE;

        });
    }
}
