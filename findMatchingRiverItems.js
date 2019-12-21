const helper = require('./helper');
const fs = require('fs');
const request = require('request');

function hasNumber(myString) {
    return /\d/.test(myString);
}

function scoreJewel(myJewel, riverJewel) {
    let jewelMods = myJewel.explicitMods;
    let riverJewelMods = riverJewel.explicitMods;

    if(!jewelMods || !riverJewelMods) {
        return 0;
    }

    let matchingScore = 0;
    let differentScore = 0;

    // if our jewel has less mods than river jewel, we add penalty,
    // because we want exactly equal. So if 3 of the 4 mods are a match, thats good but not 100% equal
    if(jewelMods.length < riverJewelMods.length) {
        differentScore += 5 * (riverJewelMods.length - jewelMods.length);

        /*
            jewelMods.length = 1;
            riverJewelmods.length = 4;

            if(1 < 4) {
                5 * (4 -1) = 15;
            }

            differentScore = 15
         */
    }

    // split mod string into seperate words. if myJewel mods length !== river mods length,
    // then it is not worth checking them out as they are already not equal
    for (let j = 0; j < jewelMods.length; j++) {
        let splitJewelMods = jewelMods[j].split(' ');
        let modMatchFound = false;
        let penaltyScore = splitJewelMods.length;

        for (let k = 0; k < splitJewelMods.length; k++) {
            if(riverJewelMods[k] === undefined) {
                continue;
            }

            let splitRiverMods = riverJewelMods[k].split(' ');

            if(splitJewelMods.length !== splitRiverMods.length) {
                continue;
            }

            // we don't want to do double penalty, so we track if we are able to do a penalty
            modMatchFound = true;

            // now check if every word in mod is equal between both jewels
            for (let i = 0; i < splitJewelMods.length; i++) {
                if(splitJewelMods[i] === splitRiverMods[i]) {
                    matchingScore++;
                }

                //if there is no number in string , it means a word is not the same,
                // therefor mod is incorrect, so skip it
                // e.g. "+10 to Intelligence" vs + "12 to Intelligence" = good, slight penalty
                // "+10 to Intelligence" vs "+10 to Strength" = bad, add greater penalty and skip
                else {
                    if(!hasNumber(splitRiverMods[i])) {
                        differentScore += penaltyScore
                        break;
                    }
                    else {
                        differentScore += 0.5;
                    }
                }
            }
        }

        if(modMatchFound === false) {
            differentScore += penaltyScore;
        }
    }

    let totalScore = {
        "matchingScore" : matchingScore,
        "differentScore" : differentScore,
        "percentage": matchingScore / (matchingScore + 0.01 + differentScore) //no divide by 0 plz
    };

    return totalScore;
}

let getMatchingRiverJewelInfo = (riverJewel) => new Promise((resolve, reject) => {
    let url = "https://www.pathofexile.com/api/trade/fetch/";
    let id = riverJewel.id;

    url = url + '' + id;

    console.log(url)

    request({
        url: url,
    },
    (error, response, body) => {
        if (error) {
            reject(error);
        }

        resolve(JSON.parse(body));
    });
});

module.exports = (item) => new Promise((resolve, reject) => {
    let jewel = item;
    let riverJewelsArray = [];
    let riverJewelApiCalls = [];

    for (let i = 0; i < global.riverArray.length; i++) {
        let riverJewel = global.riverArray[i];

        if(!riverJewel.hasOwnProperty('score')) {
            let score = scoreJewel(jewel, riverJewel);

            if(score.percentage > 0.8) {
                riverJewel.score = score;

                // console.log(JSON.stringify(riverJewel) + ',');
                // console.log(JSON.stringify(item) + ',');

                if(riverJewelsArray.length > 10) {
                    continue;
                }
                else {
                    riverJewelsArray.push(riverJewel);
                }
            }
        }
    }

    for (let i = 0; i < riverJewelsArray.length; i++) {
        riverJewelApiCalls[i] = getMatchingRiverJewelInfo(riverJewelsArray[i]);
    }

    Promise.all(riverJewelApiCalls).then(function(requestedRiverItems) {
        let priceArray = [];
        let medianPrice = 0;

        requestedRiverItems.forEach((requestedRiverItem) => {
            if(requestedRiverItem.result[0].listing.price !== null) {
                let requestedRiverInfo = requestedRiverItem.result[0].listing.price;
                let currency = requestedRiverInfo.currency;

                if(currency === 'chaos') {
                    let amount = requestedRiverInfo.amount;
                    jewel.currencyType = currency;
                    jewel.currencyAmount = amount;

                    priceArray.push(amount);
                }
            }
        });

        console.log(priceArray.length)

        for (let i = 0; i < priceArray.length; i++) {
            medianPrice += priceArray[i];
        }

        // console.log(medianPrice);
        resolve(requestedRiverItems);
    });
});
