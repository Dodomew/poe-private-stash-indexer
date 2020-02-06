const request = require('request');
const getLeague = require('./getCurrentLeague');
const getStats = require('./getAllStats');

let league = getLeague.get();
let stats = getStats.get();

module.exports = {
    league,
    stats
};
