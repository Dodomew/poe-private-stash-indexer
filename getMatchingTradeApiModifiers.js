const request = require('request');
const EnvironmentVariables = require('./classes/EnvironmentVariables');
let environmentVariables = new EnvironmentVariables().getInstance();

async function get (query) {
    let { body, response } = await getMatchingTradeApiModifiers(query);

    if (response.statusCode !== 200) {
        return {response, body};
    }

    let tradeApiResponse = body;

    console.log('getMatchingTradeApiModifiers');
    console.log(tradeApiResponse)
    return tradeApiResponse;
}

async function getMatchingTradeApiModifiers (query) {
    const league = environmentVariables.getLeague();
    const tradeApiURL = 'https://www.pathofexile.com/api/trade/search/' + league;
    console.log(tradeApiURL);
    console.log(tradeApiURL + '?source=' + JSON.stringify(query));
    return new Promise((resolve, reject) => {
        request({
                    url: tradeApiURL,
                    method: 'POST',
                    json: true,
                    body: query
                },
                (error, response, body) => {
                    if (error) {
                        return reject(error);
                    }
                    console.log('done with request')
                    console.log(body)
            return resolve({ body, response })
        })
    })
}

function buildJsonObjectForTradeApiSearch(myJewel) {
    console.log('buildJsonObjectForTradeApiSearch')
    let jsonObj = {
        "query": {
            "status": {
                "option": "online"
            },
            "stats": [
                {
                    "type": "and",
                    "filters": []
                }
            ],
            "filters": {
                "type_filters": {
                    "filters": {
                        "category": {
                            "option": "jewel"
                        }
                    }
                }
            }
        }
    };

    for (let i = 0; i < myJewel.tradeModsIDs.length; i++) {
        jsonObj.query.stats[0].filters[i] = {
            "id" : myJewel.tradeModsIDs[i]
        };
    }
    return jsonObj;
}

function findMatchingModID(myJewel) {
    console.log('findMatchingModID')
    let tradeApiMods = environmentVariables.getStats();
    myJewel.tradeModsIDs = [];

    for (let i = 0; i < myJewel.tradeMods.length; i++) {
        let myJewelTradeMod = myJewel.tradeMods[i];
        myJewel.tradeModsIDs[i] = null;
        for (let j = 0; j < tradeApiMods.length; j++) {
            for (let k = 0; k < tradeApiMods[j].entries.length; k++) {
                let tradeApiMod = tradeApiMods[j].entries[k];
                if(tradeApiMod.text === myJewelTradeMod) {
                    myJewel.tradeModsIDs[i] = tradeApiMod.id;
                    break;
                }
            }
            if(myJewel.tradeModsIDs[i] !== null) {
                break;
            }
        }
    }
    return myJewel;
}

function sanitizeJewel(myJewel) {
    console.log('sanitizeJewel')
    let selectAllNumbersRegex = /[0-9]+/g;
    myJewel.tradeMods = [];

    for(let i = 0;i < myJewel.explicitMods.length;i++) {
        let mod = myJewel.explicitMods[i];
        mod = mod.replace(selectAllNumbersRegex, '#');

        if(mod.charAt(0) === '+') {
            mod = mod.substr(1);
        }

        myJewel.tradeMods[i] = mod;
    }

    console.log(myJewel)

    return myJewel;
}

function prepJewelForTradeApi(myJewel) {
    let sanitizedJewel = sanitizeJewel(myJewel);
    console.log('sanitized jewel')
    let myJewelWithTradeModIds = findMatchingModID(sanitizedJewel);
    console.log('jewel now has trade api mods')
    let myJewelQuery = buildJsonObjectForTradeApiSearch(myJewelWithTradeModIds);
    console.log('jewel query ready')
    console.log(myJewelQuery);
    get(myJewelQuery).then((result) => {
        console.log('done with prepJewelForTradeApi')
        // console.log(result)
    });
}

module.exports = {
    prepJewelForTradeApi
};
