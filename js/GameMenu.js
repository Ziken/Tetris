/**
 * Class for using menu, and score
 * @param {object} menuHandler DOM element of menu element
 * @param {object} statsHandler DOM element of stats element after click buttonShowStats
 * @param {object} lastScoreHandler DOM element of elements which shows stats after end game
 * @param {object} buttonPlay DOM element which starts game
 * @param {object} buttonShowStats DOM element which shows general statistics
*/
var GameMenu = function ( menuHandler, statsHandler, lastScoreHandler, buttonPlay, buttonShowStats ) {

    let startGameFunc = ()=>{};
    let generalStats = {};
    const COOKIE_EXPIRE_DAYS = 100;

    let init = () => {
        buttonPlay.addEventListener("click", startPlaying , true);
        buttonShowStats.addEventListener("click", showStats , true);
        statsHandler.addEventListener("click", hideStats , true);
        lastScoreHandler.addEventListener("click", hideLastStats , true);

        generalStats.highScore = getCookie("highscore") || 0;
        generalStats.rows = getCookie("rows") || 0;
        generalStats.playingTime = getCookie("playingtime") || 0;
        generalStats.allPlayedTime = getCookie("allplayedtime") || 0;
        generalStats.lastPlayed = getCookie("lastplayed") || new Date();
        generalStats.lastPlayed = new Date(+generalStats.lastPlayed);

    }

    let startPlaying = () => {
        hideMenu();
        startGameFunc();
    }
    let addClass = ( className, elem ) => {
        //TODO add animations by css
    }
    let hideMenu = () => {
        menuHandler.style.display = "none";
    }
    let showMenu = () => {
        menuHandler.style.display = "block";
    }
    let hideStats = () => {
        statsHandler.style.display = "none";
    }
    let showStats = () => {
        showGeneralStats();
        statsHandler.style.display = "block";
    }
    let hideLastStats = () => {
        lastScoreHandler.style.display = "none";
    }
    let showLastStats = () => {
        lastScoreHandler.style.display = "block";
    }
    let getFormattedDate = ( date ) => {
        let addZero = ( num ) => {
            return (num < 10?"0"+num:num);
        }
        let strDate = addZero(date.getDate()) + "." + addZero(date.getMonth()) + "." + date.getFullYear() + " ";
        strDate += addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
        return strDate;
    }
    let showGeneralStats = () => {
        let html = "<table class=''>";
        html += createRowTable("High score", generalStats["highScore"]);
        html += createRowTable("then you removed rows", generalStats["rows"]);
        html += createRowTable("then game last", generalStats["playingTime"]);
        html += createRowTable("You've already played for", generalStats["allPlayedTime"]);
        html += createRowTable("Your last game was at", getFormattedDate(generalStats["lastPlayed"]));
        html += "</table>";
        statsHandler.innerHTML = html;
    }
    let updateGeneralStats = ( stats ) => {
        if ( stats["Score"] > generalStats.highScore ) {
            generalStats.highScore = stats["Score"];
            generalStats.rows = stats["Rows"];
            generalStats.playingTime = stats["Time"];
        }
        generalStats.allPlayedTime += stats["Time"];
        generalStats.lastPlayed = new Date();

        for (const key of Object.keys(generalStats)) {
            createCookie(key.toLowerCase(), generalStats["key"]);
        }

    }
    let createRowTable = ( name, value ) => {
        return `
<tr>
    <td>${name}: </td>
    <td>${value}</td>
</tr>`;
    }
    let createCookie = ( name,value,days ) => {
        let expires = "";
        if ( days ) {
            let date = new Date();
            date.setTime( date.getTime() + (days*24*60*60*1000) );
            expires = "; expires=" + date.toGMTString();
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    }

    let getCookie = ( name ) => {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0;i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return false;
    }

    let eraseCookie = ( name ) => {
        createCookie(name,"",-1);
    }
    /**
        @param {function} func it contains function which starts game
    */
    this.setStartFunction = (func) => {
        startGameFunc = func;
    }
    /**
        public function, it presents stats (after lost game)
        @param {object} stats it contains statistics
    */
    this.showLastStats = ( stats ) => {
        let html = "<table class=''>";
        for (const key of Object.keys(stats)) {
            html += createRowTable(key, stats[key]);

        }
        html += "</table>";
        lastScoreHandler.innerHTML = html;
        showMenu();
        showLastStats();
        updateGeneralStats(stats);
    }

    return init();
}
