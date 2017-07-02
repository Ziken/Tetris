
/**
This connected with score like computing and showing it
@param {object} elem DOM element contains whole score
@param {object} addedScore DOM element, contains score what player just got
*/
var Score = function ( elem, addedScoreElem ) {
    "use strict";
    let score = 0,
        removedRows = 0,
        fontSizeAddedScore = +window.getComputedStyle(addedScoreElem,null).getPropertyValue("font-size").split(/[a-zA-Z]+/)[0];

    let showScore = (addedScore) => {
        animateScore(addedScore);
        addedScoreElem.innerHTML = "+" + addedScore;
        addedScoreElem.style.fontSize = fontSizeAddedScore + 2 * addedScore / 100  + "px";
    }
    let animateScore = (addedScore) => {
        let scoreBegin = score,
            increase = addedScore/100;
        score += addedScore;
        let anim = () => {
            scoreBegin+=increase;
            let scoreLen = ("" + scoreBegin).length;
            let finalScore = "";
            for(let i = scoreLen; i < 9; i++) finalScore += "0";
            finalScore += scoreBegin;
            elem.innerHTML = finalScore;
            if ( scoreBegin < score ) window.requestAnimationFrame(anim);
        }
        anim();
    }
    let updateScore = ( rows ) => {
        let addedScore = 0;
        switch (rows) {
            case 1:
                addedScore+=100;
                break;
            case 2:
                addedScore+=200;
                break;
            case 3:
                addedScore+=400;
                break;
            case 4:
                addedScore+=800;
                break;
            default:
                return false;
        }
        removedRows += rows;
        showScore(addedScore);
    }
    /**
    public function, it computing score based on rows
    @param {int} rows how many rows player removed
    */
    this.computeScore = ( rows ) => {
        updateScore(rows);
    }

}
