/**
 * Class for using menu, and score
 * @param {Object} menuHandler DOM of menu element
 * @param {Object} statsHandler DOM of stats element after click buttonShowStats
 * @param {Object} lastScoreHandler DOM of elements which shows stats after end game
 * @param {Object} buttonPlay DOM of button which starts game
 * @param {Object} buttonShowStats DOM of button which shows general statistics
*/
var GameMenu = function ( menuHandler, statsHandler, lastScoreHandler, buttonPlay, buttonShowStats ) {
    'use strict';
    let startGameFunc = () => {};
    let generalStats = {};
    const COOKIE_EXPIRE_DAYS = 30,
          SHOW_CLASS = 'show-elem';//class in css which is responsible of animate elements (opacity from 0 to 1)

    const init = () => {
        //set events
        buttonPlay.addEventListener('click', startPlaying , true);
        buttonShowStats.addEventListener('click', showStats , true);
        statsHandler.addEventListener('click', hideStats , true);
        lastScoreHandler.addEventListener('click', hideLastStats , true);
        //get information from cookies
        generalStats.highScore = getCookie('highscore') || 0;
        generalStats.rows = getCookie('rows') || 0;
        generalStats.playingTime = +getCookie('playingtime') || 0;
        generalStats.allPlayedTime = +getCookie('allplayedtime') || 0;
        generalStats.lastPlayed = getCookie('lastplayed') || getFormattedDate(new Date());

    }

    const startPlaying = () => {
        hideMenu();
        startGameFunc();
    }
    const addClass = ( elem , className = '' ) => {
        if ( elem instanceof Element )
            elem.classList.add(className);
    }
    const removeClass = ( elem, className = '' ) => {
        if ( elem instanceof Element )
            elem.classList.remove(className);
    }
    const hideMenu = () => {
        removeClass(menuHandler, SHOW_CLASS);
    }
    const showMenu = () => {
        addClass(menuHandler, SHOW_CLASS);
    }
    const hideStats = () => {
        removeClass(statsHandler, SHOW_CLASS);
    }
    const showStats = () => {
        showGeneralStats();
        addClass(statsHandler, SHOW_CLASS);
    }
    const hideLastStats = () => {
        removeClass(lastScoreHandler, SHOW_CLASS);
    }
    const showLastStats = () => {
        addClass(lastScoreHandler, SHOW_CLASS);
    }
    /**
        get formatted time like '0 h and 0 min. 43 secs'
        @param {Number} time it contains amount of miliseconds
    */
    const getFormattedTime = ( time = 0 ) => {
        const formatToTime = ( t ) => {
            return (t - t % 60) / 60;
        }
        let seconds = Math.round(time/1000);
        let minutes = formatToTime(seconds);
        let hours = formatToTime(minutes);
        seconds-= minutes*60;
        minutes -= hours*60;

        return `${hours} h and ${minutes} min. ${seconds} secs.`;
    }
    /**
        get formatted date like '08.06.2017 20:10:24'
        @param {Object} time it contains infomation about date (object new Date())
    */
    const getFormattedDate = ( date = new Date() ) => {
        const addLeadZero = ( num ) => {
            return (num < 10?'0'+num:num);
        }
        return `${addLeadZero(date.getDate())}.${addLeadZero(date.getMonth())}.${date.getFullYear()}
${addLeadZero(date.getHours())}:${addLeadZero(date.getMinutes())}:${addLeadZero(date.getSeconds())}`
        /*let strDate = addLeadZero(date.getDate()) + '.' + addLeadZero(date.getMonth()) + '.' + date.getFullYear() + ' ';
        strDate += addLeadZero(date.getHours()) + ':' + addLeadZero(date.getMinutes()) + ':' + addLeadZero(date.getSeconds());
        return strDate;*/
    }

    const updateGeneralStats = ( stats = {} ) => {
        // if last score is higher, set new general score
        if ( stats['Score'] && stats['Score'] > generalStats.highScore ) {
            generalStats.highScore = stats['Score'];
            generalStats.rows = stats['Rows'] || 0;
            generalStats.playingTime = +stats['Time'] || 0;
        }
        generalStats.allPlayedTime += +stats['Time'] || 0;
        generalStats.lastPlayed = getFormattedDate(new Date());

        let key;
        let val;
        Object.entries(generalStats).forEach((arr) => {
            [key='',val=''] = arr;
            createCookie(key.toLowerCase(), val, COOKIE_EXPIRE_DAYS);
        });
        /*for (const key of Object.keys(generalStats)) {
            createCookie(key.toLowerCase(), generalStats[key], COOKIE_EXPIRE_DAYS); //save it to cookies
        }*/
    }
    /**
        create row of table
        @param {String} name first cell of row
        @param {String} value second cell of row
        @return {String} row of table with values
    */
    const createRowTable = ( name='', value='' ) => {
        return `
<tr>
    <td>${name}: </td>
    <td class="second-cell-score">${value}</td>
</tr>`;
    }

    const createCookie = ( name='',value='',days= -1 ) => {
        let expires = '';
        if ( days ) {
            let date = new Date();
            date.setTime( date.getTime() + (days*24*60*60*1000) );
            expires = '; expires=' + date.toGMTString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }

    const getCookie = ( name = '' ) => {
        let nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0;i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return false;
    }

    /*let eraseCookie = ( name ) => {
        createCookie(name,'',-1);
    }*/

    /**
        Create table of information which contains general stats and show it in html
    */
    const showGeneralStats = () => {
        let html = '<table class="general-stats">';
        html += createRowTable('High score', generalStats['highScore']);
        html += createRowTable('then you removed rows', generalStats['rows']);
        html += createRowTable('then game last', getFormattedTime(generalStats['playingTime']));
        html += createRowTable('You\'ve already played for', getFormattedTime(generalStats['allPlayedTime']));
        html += createRowTable('Your last game was at', generalStats['lastPlayed']);
        html += '</table>';
        statsHandler.innerHTML = html;
    }
    /**
        @param {Function} func it contains function which starts game
    */
    const setStartFunction = ( func = {} ) => {
        if ( func instanceof Function )
            startGameFunc = func;
    }
    /**
        public function, it presents stats (after lost game) create table and show it in html
        @param {Object} stats it contains statistics
    */
    const showStatsAfterGame = ( stats ) => {
        let html = '<table class="last-stats">';
        let tempMs = stats['Time'] || 0;
        let key;
        let val;
        stats['Time'] = getFormattedTime(stats['Time']);

        /*for (const key of Object.keys(stats)) {
            html += createRowTable(key, stats[key]);
        }*/
        Object.entries(stats).forEach((arr) => {
            [key='',val=''] = arr;
            html += createRowTable(key, val);
        })
        html += '</table>';
        lastScoreHandler.innerHTML = html;

        stats['Time'] = tempMs;
        showMenu();
        showLastStats();
        updateGeneralStats(stats);
    }

    init();

    return {
        setStartFunction,
        showStatsAfterGame
    }
}
