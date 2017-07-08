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
    const COOKIE_EXPIRE_DAYS = 100,
          SHOW_CLASS = "show-elem";

    let init = () => {
        buttonPlay.addEventListener("click", startPlaying , true);
        buttonShowStats.addEventListener("click", showStats , true);
        statsHandler.addEventListener("click", hideStats , true);
        lastScoreHandler.addEventListener("click", hideLastStats , true);

        generalStats.highScore = getCookie("highscore") || 0;
        generalStats.rows = getCookie("rows") || 0;
        generalStats.playingTime = +getCookie("playingtime") || 0;
        generalStats.allPlayedTime = +getCookie("allplayedtime") || 0;
        generalStats.lastPlayed = getCookie("lastplayed") || getFormattedDate(new Date());

    }

    let startPlaying = () => {
        hideMenu();
        startGameFunc();
    }
    let addClass = ( elem, className ) => {
        elem.classList.add(className);
    }
    let removeClass = ( elem, className ) => {
        elem.classList.remove(className);
    }
    let hideMenu = () => {
        removeClass(menuHandler, SHOW_CLASS);
    }
    let showMenu = () => {
        addClass(menuHandler, SHOW_CLASS);

    }
    let hideStats = () => {
        removeClass(statsHandler, SHOW_CLASS);
    }
    let showStats = () => {
        showGeneralStats();
        addClass(statsHandler, SHOW_CLASS);
    }
    let hideLastStats = () => {
        removeClass(lastScoreHandler, SHOW_CLASS);
    }
    let showLastStats = () => {
        addClass(lastScoreHandler, SHOW_CLASS);
    }
    let getFormattedTime = ( time ) => {
        let formatToTime = ( t ) => {
            return ( (t-(t%60))/60 );
        }
        let seconds = Math.round(time/1000);
        let minutes = formatToTime(seconds);
        let hours = formatToTime(minutes);
        seconds-= minutes*60;
        minutes -= hours*60;

        return `${hours} h and ${minutes} min. ${seconds} secs.`;
    }
    let getFormattedDate = ( date ) => {
        let addLeadZero = ( num ) => {
            return (num < 10?"0"+num:num);
        }
        let strDate = addLeadZero(date.getDate()) + "." + addLeadZero(date.getMonth()) + "." + date.getFullYear() + " ";
        strDate += addLeadZero(date.getHours()) + ":" + addLeadZero(date.getMinutes()) + ":" + addLeadZero(date.getSeconds());
        return strDate;
    }
    let updateGeneralStats = ( stats ) => {
        if ( stats["Score"] > generalStats.highScore ) {
            generalStats.highScore = stats["Score"];
            generalStats.rows = stats["Rows"];
            generalStats.playingTime = +stats["Time"];
        }
        generalStats.allPlayedTime += +stats["Time"];
        generalStats.lastPlayed = getFormattedDate(new Date());

        for (const key of Object.keys(generalStats)) {
            createCookie(key.toLowerCase(), generalStats[key], COOKIE_EXPIRE_DAYS);
        }

    }
    let createRowTable = ( name, value ) => {
        return `
<tr>
    <td>${name}: </td>
    <td class="second-cell-score">${value}</td>
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
    let showGeneralStats = () => {
        let html = "<table class=\"general-stats\">";
        html += createRowTable("High score", generalStats["highScore"]);
        html += createRowTable("then you removed rows", generalStats["rows"]);
        html += createRowTable("then game last", getFormattedTime(generalStats["playingTime"]));
        html += createRowTable("You've already played for", getFormattedTime(generalStats["allPlayedTime"]));
        html += createRowTable("Your last game was at", generalStats["lastPlayed"]);
        html += "</table>";
        statsHandler.innerHTML = html;
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
        let html = "<table class=\"last-stats\">";
        let tempMs = stats["Time"];
        stats["Time"] = getFormattedTime(stats["Time"]);
        for (const key of Object.keys(stats)) {
            html += createRowTable(key, stats[key]);

        }
        html += "</table>";
        lastScoreHandler.innerHTML = html;

        stats["Time"] = tempMs;
        showMenu();
        showLastStats();
        updateGeneralStats(stats);
    }

    return init();
}
