const request = require('request');

let requestStashTab = (league, accountName, index, sessionID) => new Promise((resolve, reject) => {
    request({
                headers: {
                    Referer: 'https://www.pathofexile.com',
                    Cookie: `POESESSID=${sessionID}`
                },
                url: `https://www.pathofexile.com/character-window/get-stash-items?accountName=${accountName}&tabIndex=${index}&league=${league}&tabs=1`,
            }, (error, response, body) => {
        if (error) {
            reject(error);
        }
        resolve(JSON.parse(body).items);
    });
});

module.exports = (league, accountName, sessionID) => new Promise((resolve, reject) => {

    request({
                headers: {
                    Referer: 'https://www.pathofexile.com',
                    Cookie: `POESESSID=${sessionID}`
                },
                url: `https://www.pathofexile.com/character-window/get-stash-items?accountName=${accountName}&tabIndex=0&league=${league}&tabs=1`,
            }, (error, response, body) => {
        if (error) {
            reject(error);
        }

        // console.log(body);

        let json, tabs;
        try {
            json = JSON.parse(body);
            tabs = json.tabs;
            amountOfTotalTabs = json.numTabs;
        } catch (error) {}

        if (json) {
            if (json.error && json.error.code === 1) {
                reject(new Error('League does not exist'));
            }
        }

        if (!tabs) {
            reject(new Error('Bad Session ID/Account name combination'));
            return;
        }

        // for (let i = 0; i < amountOfTotalTabs; i++) {
        //     console.log(tabs[i]);
        // }

        let allItemsArray = [];
        let allRequestPromises = [];

        for (let i = 0; i < amountOfTotalTabs; i++) {
            // console.log(tabs[i]);
            let requestPromise = requestStashTab(league, accountName, i, sessionID);
            allRequestPromises[i] = requestPromise;
        }

        Promise.all(allRequestPromises).then(function(values) {
            values.forEach((tabItems) => {
                allItemsArray.push(tabItems);
            });
            resolve(allItemsArray);
        });

        // let json, tabs;
        // try {
        //     json = JSON.parse(body);
        //     tabs = json.tabs;
        // } catch (error) {}
        //
        // if (json) {
        //     if (json.error && json.error.code === 1) {
        //         reject(new Error('League does not exist'));
        //     }
        // }
        //
        // if (!tabs) {
        //     reject(new Error('Bad Session ID/Account name combination'));
        //     return;
        // }
        //
        // const targetTab = tabs.find(tab => tab.n.toLowerCase() === options.stashTabName.toLowerCase());
        // if (!targetTab) {
        //     reject(new Error(`Tab '${options.stashTabName}' does not exist in league '${options.league}'`));
        //     return;
        // }
        // const id = targetTab.i;
        //
        // request({
        //             headers: {
        //                 Referer: 'https://www.pathofexile.com',
        //                 Cookie: `POESESSID=${options.sessionId}`
        //             },
        //             url: `https://www.pathofexile.com/character-window/get-stash-items?accountName=${options.accountName}&tabIndex=${id}&league=${options.league}&tabs=1`,
        //         }, (error, response, body) => {
        //     if (error) {
        //         reject(error);
        //     }
        //     resolve(JSON.parse(body).items);
        // });
    });
});
