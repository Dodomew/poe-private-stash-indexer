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
    },
    "incubators": function () {
        return "Incubator";
    },
    "oils": function () {
        return "Oil";
    },
    "gems": function() {
        return "SkillGem";
    }
};

let requestApiForValues = (league, category, gemQuality) => new Promise((resolve, reject) => {
    // convert my category string to poe.ninja string
    let url;
    category = lookupTable[category]();

    if(category === 'SkillGem') {
        url = 'https://poe.ninja/api/data/itemoverview?league=' + league + '&type=' + category + '?' + 'quality=' + gemQuality;
    }

    if(category === 'Fragment') {
        url = 'https://poe.ninja/api/data/currencyoverview?league=' + league + '&type=' + category;
    }
    else {
        url = 'https://poe.ninja/api/data/itemoverview?league=' + league + '&type=' + category;
    }

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

module.exports = (organizedItems) => new Promise((resolve, reject) => {
    let items = organizedItems;
    let overviewOfItems = [];
    let categoryArray = Object.keys(items);
    let allRequestPromises = [];

    for (let i = 0; i < categoryArray.length; i++) {
        let type = categoryArray[i];
        type = type.toLowerCase();

        // if(type === 'gems') {
        //     let itemsInArray = items['gems'];
        //     for (let j = 0; j < itemsInArray.length; j++) {
        //         let quality = itemsInArray[j].quality.match(/\d+/)[0]
        //         allRequestPromises[i] = requestApiForValues('Blight', type, quality);
        //     }
        // }
        // else {
        //     allRequestPromises[i] = requestApiForValues('Blight', type);
        // }

        allRequestPromises[i] = requestApiForValues('Blight', type);
    }

    /*
     All requests in this file are promises. So when all promises are positively resolved,
     we can resolve the getItems() and return the data for further use
     */
    Promise.all(allRequestPromises).then(function(values) {
        values.forEach((category) => {
            overviewOfItems.push(category);
        });
        resolve([organizedItems, overviewOfItems]);
    });
});
