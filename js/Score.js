
/**
    This connected with score like computing and showing it
    @param {Object} elem DOM element, it shows score
    @param {Object} addedScoreElem DOM element, it shows score what player just got
*/
var Score = function ( elem, addedScoreElem ) {
    "use strict";
    let score = 0,
        removedRows = 0,
        startTimer,// time when player starts game
        endTimer,// time when player ends game
        comboRows = [ 0,0,0,0,0 ],
        fontSizeAddedScore = +window.getComputedStyle(addedScoreElem,null).getPropertyValue("font-size").split(/[a-zA-Z]+/)[0];

    let init = () => {
        this.resetScore();
    }
    let showScore = (addedScore) => {
        animateScore(addedScore);
        addedScoreElem.innerHTML = "+" + addedScore;
        addedScoreElem.style.fontSize = fontSizeAddedScore + 2 * addedScore / 100  + "px";
    }
    /**
        very simply animation of score
        @param {Number} addedScore amount points which player just got
    */
    let animateScore = (addedScore) => {
        addedScoreElem.style.display = "block";//show element which presents amount of points which player got

        let scoreBegin = score,
            increase = addedScore/100;
        score += addedScore;
        //animation
        let anim = () => {
            scoreBegin+=increase;
            let scoreLen = ("" + scoreBegin).length;
            let finalScore = "";
            for (let i = scoreLen; i < 9; i++) finalScore += "0"; //add leading 0
            finalScore += scoreBegin;
            elem.innerHTML = finalScore;
            if ( scoreBegin < score ) {
                window.requestAnimationFrame(anim);
            } else {
                addedScoreElem.style.display = "none"; // hide
            }
        }
        anim();
    }
    /**
        give points to player according to amount of rows
        @param {Number} rows amount of removed rows by player
    */
    let updateScore = ( rows ) => {
        let addedScore = 0;
        comboRows[rows]++;
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
        public function, it resets global variables which contains information about score
    */
    this.resetScore = () => {
        score = 0;
        removedRows = 0;
        comboRows = [ 0,0,0,0,0 ];
        addedScoreElem.innerHTML = "";
        elem.innerHTML = "000000000";
        startTimer = new Date();
        endTimer = startTimer;
    }
    /**
        public function, it computing score based on rows
        @param {int} rows how many rows player removed
    */
    this.computeScore = ( rows ) => {
        updateScore(rows);
    }
    this.stopTime = () => {
        endTimer = new Date();
    }
    /**
        public function, it provides statistics to GameMenu.js
        @return {Object} last statistics, after lost game
    */
    this.getLastStats = () => {
        return {
            "Score":        score,
            "Rows":         removedRows,
            "Combo 1 row":  comboRows[1],
            "Combo 2 rows": comboRows[2],
            "Combo 3 rows": comboRows[3],
            "Combo 4 rows": comboRows[4],
            "Time": endTimer - startTimer
        };
    }

    return init();

}
