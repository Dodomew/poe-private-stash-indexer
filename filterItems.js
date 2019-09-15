const fs = require('fs');

module.exports = (rawItems) => new Promise((resolve, reject) => {
    // let data = JSON.stringify(rawItems[7]);
    // fs.writeFileSync('allItems1.json', data);

    let dictionary = {};
    let restrictedItemsArray = ['rings', 'belts', 'amulets', 'quivers', 'armours', 'weapons', 'jewels', 'gems'];
    let pleaseBreakOutOfLoop = false;

    for (let i = 0; i < rawItems.length; i++) {
        for (let j = 0; j < rawItems[i].length; j++) {
            pleaseBreakOutOfLoop = false;

            // dictionary will be filled with categories -> items
            let item = rawItems[i][j];
            let categoryOfItem;

            //skip these items
            for (let k = 0; k < restrictedItemsArray.length; k++) {
                if(item.icon.toLowerCase().indexOf(restrictedItemsArray[k]) !== -1) {
                    pleaseBreakOutOfLoop = true;
                    break;
                }

                if(item.typeLine.toLowerCase().indexOf('flask') !== -1) {
                    pleaseBreakOutOfLoop = true;
                    break;
                }
            }

            if(pleaseBreakOutOfLoop === true) {
                continue;
            }

            if(!item.hasOwnProperty('category')) {
                item.category = null;
            }

            // prophecies have the currency category; i create prophecy category
            if (item.hasOwnProperty('prophecyText')) {
                categoryOfItem = 'prophecies';
            }

            //breach splinter is no longer a fragment, but currency (poeninja)
            if(isBreachSplinter(item)) {
                categoryOfItem = 'currency';
            }

            if(item.icon.toLowerCase().indexOf('divination') !== -1) {
                categoryOfItem = 'divination cards';
            }

            if(item.icon.toLowerCase().indexOf('maps') !== -1) {
                categoryOfItem = 'fragments';
            }

            if(item.icon.toLowerCase().indexOf('oils') !== -1) {
                categoryOfItem = 'oils';
            }

            if (item.typeLine.indexOf('Essence') !== -1 || item.typeLine.indexOf('Remnant') !== -1 && item.icon.toLowerCase().indexOf('essence') !== -1) {
                categoryOfItem = 'essences';
            }

            if (item.typeLine.indexOf('Fossil') !== -1 && item.icon.toLowerCase().indexOf('delve') !== -1) {
                categoryOfItem = 'fossils';
            }

            // resonators also are currency; now resonator category
            if (item.typeLine.indexOf('Resonator') !== -1 && item.icon.toLowerCase().indexOf('delve') !== -1) {
                categoryOfItem = 'resonators';
            }
            //
            if (item.typeLine.indexOf('Scarab') !== -1 && item.icon.toLowerCase().indexOf('currency') !== -1) {
                categoryOfItem = 'scarabs';
            }

            if (item.typeLine.indexOf('Incubator') !== -1) {
                categoryOfItem = 'incubators';
            }

            // if(categoryOfItem === 'gems') {
            //     categoryOfItem = 'skill gems';
            // }

            if(item.icon.toLowerCase().indexOf('currency') !== -1 && categoryOfItem === undefined) {
                categoryOfItem = 'currency';
            }

            if(categoryOfItem === undefined) {
                console.log(item.icon.toLowerCase());
            }
            if (!dictionary.hasOwnProperty(categoryOfItem)) {
                dictionary[categoryOfItem] = [];
            }

            item.category = categoryOfItem;
            dictionary[categoryOfItem].push(rawItems[i][j]);
        }
    }

    resolve(dictionary);
});

function isBreachSplinter(item) {
    let splinterArray = [
        'splinter of esh',
        'splinter of uul-netol',
        'splinter of tul',
        'splinter of chayula',
        'splinter of zoph'
    ];

    let nameOfItem = item.typeLine.toLowerCase();

    for (let i = 0; i < splinterArray.length; i++) {
        if(nameOfItem.indexOf(splinterArray[i]) !== -1) {
            return true;
        }
    }
}
