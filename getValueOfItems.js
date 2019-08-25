const request = require('request');

var lookupTable = {
    "prophecies": function() {
        return "Prophecy";
    },
    "divination cards": function() {
        return "DivinationCard";
    },
    "skill gems":  function() {
        return "SkillGem";
    },
    "essences": function() {
        return "Essence";
    },
    "maps": function() {
        return "Map";
    },
    "fragments": function() {
        return "Fragment";
    },
    "fossils":  function() {
        return "Fossil";
    },
    "resonators": function() {
        return "Resonator";
    },
    "scarabs": function() {
        return "Scarab";
    },
    "currency": function() {
        return "Currency";
    }
};

let requestApiForValues = (league, category) => new Promise((resolve, reject) => {
    // convert my category string to poe.ninja string
    let url;
    category = lookupTable[category]();

    if(category === 'Fragment') {
        url = 'https://poe.ninja/api/data/currencyoverview?league=' + league + '&type=' + category;
    }
    else {
        url = 'https://poe.ninja/api/data/itemoverview?league=' + league + '&type=' + category;
    }

    request({
                url: url,
            }, (error, response, body) => {
        if (error) {
            reject(error);
        }
        resolve(JSON.parse(body));
    });
});

module.exports = (organizedItems) => new Promise((resolve, reject) => {
    let items = organizedItems;
    let overviewOfItems = [];
    let categoryArray = Object.keys(items);
    let allRequestPromises = [];

    for (let i = 0; i < categoryArray.length; i++) {
        let type = categoryArray[i];
        type = type.toLowerCase();
        allRequestPromises[i] = requestApiForValues('Legion', type);
    }

    /*
     All requests in this file are promises. So when all promises are positively resolved,
     we can resolve the getItems() and return the data for further use
     */
    Promise.all(allRequestPromises).then(function(values) {
        values.forEach((category) => {
            overviewOfItems.push(category);
        });
        // console.log(overviewOfItems[1]);
        resolve(overviewOfItems);
    });
});

