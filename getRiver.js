const helper = require('./helper');
const request = require('request');
const rp = require('request-promise');
const fs = require('fs');
var nextChangeId = null;

var LastPublicIdOptions = {
    uri: 'http://poe.ninja/api/Data/GetStats',
    json: true // Automatically parses the JSON string in the response
};

//create new file with date as base. Fill this with jewels of that date
const appendFile = (path, data) => {
    let AppendCount = 0;
    let dateOfToday = helper.getDateOfToday();

    for (let i = 0; i < data.stashes.length; i++) {
        let league = data.stashes[i].league;

        if(league === null || league.toLowerCase() !== process.env.LEAGUE.toLowerCase()) {
            //console.log('is not current league, skip')
            continue;
        }

        if(data.stashes[i].accountName === null || data.stashes[i].stash === null || !data.stashes[i].items.length) {
            //console.log('accountName or stashName is null');
            continue;
        }

        let stashItems = data.stashes[i].items;

        for (let j = 0; j < stashItems.length; j++) {
            let item = stashItems[j];
            if(item.extended.category === 'jewels') {
                let itemObj = {
                    id: item.id,
                    mods: item.explicitMods
                };
                AppendCount++;
                fs.appendFileSync(path + dateOfToday + '.json', JSON.stringify(itemObj, null, 0), (err) => {
                    if(err) {
                        return console.error(err);
                    }
                });
            }
        }
    }
    console.log('appended ' + AppendCount +' jewels');
};

let getLastPublicId = () => rp(LastPublicIdOptions)
    .then((parsedBody) => {
        nextChangeId = parsedBody.next_change_id;

        let riverOptions = {
            uri: `http://www.pathofexile.com/api/public-stash-tabs?id=${nextChangeId}`,
            json: true // Automatically parses the JSON string in the response
        };

        console.log('poeNinja nextId: ' + nextChangeId);
        console.log(riverOptions.uri);

        requestRiver(riverOptions);
    })
    .catch(() => {
        console.log('error getLastPublicId')
});

let requestRiver = (riverOptions) => rp(riverOptions)
    .then((parsedBody) => {
        console.log('requestRiver before: ' + nextChangeId);
        nextChangeId = parsedBody.next_change_id;
        appendFile('jewels_', parsedBody);
        console.log('requestRiver nextId: ' + nextChangeId)
        setTimeout(() => {
            let riverOptions = {
                uri: `http://www.pathofexile.com/api/public-stash-tabs?id=${nextChangeId}`,
                json: true // Automatically parses the JSON string in the response
            };

            requestRiver(riverOptions);
        }, 10000)
    })
    .catch((err) => {
        console.log(err);
        console.log('error requestRiver')
});

module.exports = () => new Promise((resolve, reject) => {
    getLastPublicId();
});
