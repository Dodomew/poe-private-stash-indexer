const helper = require('./helper');
const request = require('request');
const rp = require('request-promise');
const fs = require('fs');
var nextChangeId = null;

const moreThanEightHoursAgo = (itemDate) => {
    const eightHours = 1000 * 60 * 60 * 8;
    const eightHoursAgo = Date.now() - eightHours;
    return itemDate < eightHoursAgo;
};

var LastPublicIdOptions = {
    uri: 'http://poe.ninja/api/Data/GetStats',
    json: true // Automatically parses the JSON string in the response
};

const removeOldItemFromArray = () => {
    for (let i = 0; i < global.riverArray.length; i++) {
        let dateOfItem = global.riverArray[i].date;

        if(moreThanEightHoursAgo(dateOfItem)) {
            console.log('item is too old');
            global.riverArray.splice(i, 1);
        }
        else {
            break;
        }
    }
};

const pushItemToArray = (path, data) => {
    let AppendCount = 0;

    for (let i = 0; i < data.stashes.length; i++) {
        let league = data.stashes[i].league;

        if(league === null || league.toLowerCase() !== process.env.LEAGUE.toLowerCase()) {
            continue;
        }

        if(data.stashes[i].accountName === null || data.stashes[i].stash === null || !data.stashes[i].items.length) {
            continue;
        }

        let stashItems = data.stashes[i].items;

        for (let j = 0; j < stashItems.length; j++) {
            let item = stashItems[j];
            if(item.extended.category === 'jewels') {
                let itemObj = {
                    id: item.id,
                    explicitMods: item.explicitMods,
                    date: Date.now()
                };
                AppendCount++;
                riverArray.push(itemObj);
            }
        }
    }
    console.log('appended ' + AppendCount +' jewels');
    console.log(global.riverArray.length);
    removeOldItemFromArray();
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
        pushItemToArray('jewels_', parsedBody);
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
