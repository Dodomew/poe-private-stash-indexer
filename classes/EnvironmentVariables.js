const getCurrentLeague = require('../getCurrentLeague');
const getAllStats = require('../getAllStats');
let instance = null;

class EnvironmentVariables {

    constructor() {
        if (instance) {
            return instance;
        }

        this.league = null;
        this.stats = null;

        instance = this;
        return instance;
    }

    getInstance() {
        return instance || new EnvironmentVariables();
    }

    getLeague() {
        console.log('EnvironmentVariables getLeague')
        if(this.league !== null) {
            console.log('return league')
            return this.league;
        }
        else {
            console.log('await getCurrentLeague');
            // this.league = getCurrentLeague.get();
            getCurrentLeague.get().then((league) => {
                this.league = league;
                return this.league;
            });
        }
    }

    getStats() {
        console.log('EnvironmentVariables getStats')
        if(this.stats !== null) {
            console.log('return stats')
            return this.stats;
        }

        console.log('await getAllStats');
        getAllStats.get().then((statsObj) => {
            this.stats = statsObj;
            return this.stats;
        });
    }
}

module.exports = EnvironmentVariables;
