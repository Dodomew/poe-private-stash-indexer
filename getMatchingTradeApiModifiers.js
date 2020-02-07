const request = require('request');
const leagueURL = 'https://www.pathofexile.com/api/trade/data/leagues';
const EnvironmentVariables = require('./classes/EnvironmentVariables');
let environmentVariables = new EnvironmentVariables().getInstance();

async function get () {
    let league;

    let { body, response } = await getMatchingTradeApiModifiers();

    if (response.statusCode !== 200) {
        return {response, body};
    }

    let leagues = JSON.parse(body);
    league = leagues.result[0].id;

    console.log('getters retrieveLeague');
    console.log(league)
    return league;
}

async function getMatchingTradeApiModifiers () {
    return new Promise((resolve, reject) => {
        request({ url: leagueURL, method: 'GET' }, (error, response, body) => {
            if (error) {
                return reject(error);
            }

            return resolve({ body, response })
        })
    })
}

function findMatchingModID(jewel) {
    console.log('findMatchingModID')
    let tradeApiMods = environmentVariables.getStats();
    jewel.tradeModsIDs = [];

    for (let i = 0; i < jewel.tradeMods.length; i++) {
        let myJewelTradeMod = jewel.tradeMods[i];
        jewel.tradeModsIDs[i] = null;
        for (let j = 0; j < tradeApiMods.length; j++) {
            for (let k = 0; k < tradeApiMods[j].entries.length; k++) {
                let tradeApiMod = tradeApiMods[j].entries[k];
                if(tradeApiMod.text === myJewelTradeMod) {
                    jewel.tradeModsIDs[i] = tradeApiMod.id;
                    break;
                }
            }
            if(jewel.tradeModsIDs[i] !== null) {
                break;
            }
        }
    }
    return jewel;
}

function sanitizeJewel(jewel) {
    console.log('sanitizeJewel')
    let selectAllNumbersRegex = /[0-9]+/g;
    jewel.tradeMods = [];

    for(let i = 0;i < jewel.explicitMods.length;i++) {
        let mod = jewel.explicitMods[i];
        mod = mod.replace(selectAllNumbersRegex, '#');

        if(mod.charAt(0) === '+') {
            mod = mod.substr(1);
        }

        jewel.tradeMods[i] = mod;
    }

    console.log(jewel)
    let myJewel = findMatchingModID(jewel);
    console.log('jewel with ids');
    console.log(myJewel);
}

module.exports = {
    sanitizeJewel
};
