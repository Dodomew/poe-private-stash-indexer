const request = require('request');

const leagueURL = 'https://www.pathofexile.com/api/trade/data/leagues';

let league;

let getCurrentLeague = () => new Promise((resolve, reject) => {
    request({
                url: leagueURL,
            }, (error, response, body) => {
        if (error) {
            reject(error);
        }
        let leagues = JSON.parse(body);
        league = leagues.result[0].id;
        resolve(league);
    });
});

module.exports = () => new Promise((resolve, reject) => {
    resolve(getCurrentLeague());
});
