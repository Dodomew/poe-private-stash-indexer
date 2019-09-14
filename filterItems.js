const fs = require('fs');

module.exports = (rawItems) => new Promise((resolve, reject) => {
    // let data = JSON.stringify(rawItems);
    // fs.writeFileSync('student-2.json', data);

    let dictionary = {};
    let restrictedItemsArray = ['rings', 'belts', 'amulets', 'quivers', 'armours', 'weapons', 'flask', 'jewels', 'gems'];
    let pleaseBreakOutOfLoop = false;

    for (let i = 0; i < rawItems.length; i++) {
        for (let j = 0; j < rawItems[i].length; j++) {
            if (!rawItems[i].length) {
                continue;
            }

            pleaseBreakOutOfLoop = false;

            // dictionary will be filled with categories -> items
            let item = rawItems[i][j];

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
                break;
            }

            if(!item.hasOwnProperty('category')) {
                item.category = null;
            }

            // let categoryOfItem = Object.keys(rawItems[i][j].category)[0];
            let categoryOfItem;

            // if('prophecyText' in item){
            //     console.log(item)
            //     categoryOfItem = 'prophecies';
            // }

            // prophecies have the currency category; i create prophecy category
            if (item.hasOwnProperty('prophecyText')) {
                console.log(item)
                categoryOfItem = 'prophecies';
            }

            // if(item.icon.toLowerCase().indexOf('prophecy') !== -1) {
            //     categoryOfItem = 'prophecies';
            // }

            if(item.icon.toLowerCase().indexOf('divination') !== -1) {
                categoryOfItem = 'divination cards';
            }

            if(item.icon.toLowerCase().indexOf('maps') !== -1) {
                categoryOfItem = 'fragments';
            }

            //breach splinter
            // if(item.icon.toLowerCase().indexOf('breach') !== -1 && item.typeLine.toLowerCase().indexOf('splinter') !== -1) {
            //     console.log(item.typeLine.toLowerCase());
            //     categoryOfItem = 'fragments';
            // }

            if(isBreachSplinter(item)) {
                categoryOfItem = 'fragments';
            }

            if (item.typeLine.indexOf('Essence') !== -1 || item.typeLine.indexOf('Remnant') !== -1 && item.icon.toLowerCase().indexOf('essence') !== -1) {
                // console.log(item)
                categoryOfItem = 'essences';
            }

            // fossils also are currency; now fossil category
            if (item.typeLine.indexOf('Fossil') !== -1 && item.icon.toLowerCase().indexOf('delve') !== -1) {
                categoryOfItem = 'fossils';
            }

            // resonators also are currency; now resonator category
            if (item.typeLine.indexOf('Resonator') !== -1 && item.icon.toLowerCase().indexOf('delve') !== -1) {
                // console.log(item)
                categoryOfItem = 'resonators';
            }
            //
            if (item.typeLine.indexOf('Scarab') !== -1 && item.icon.toLowerCase().indexOf('currency') !== -1) {
                categoryOfItem = 'scarabs';
            }
            //
            // if (item.typeLine.indexOf('Incubator') !== -1) {
            //     categoryOfItem = 'incubators';
            // }

            // if(categoryOfItem === 'gems') {
            //     categoryOfItem = 'skill gems';
            // }

            // if(categoryOfItem === 'maps') {
            //     if(rawItems[i][j].category.maps.length > 0) {
            //         categoryOfItem = 'fragments';
            //     }
            //     else {
            //         continue;
            //     }
            // }

            //we skip these for now
            // if (categoryOfItem === 'accessories' || categoryOfItem === 'weapons' || categoryOfItem === 'armour' || categoryOfItem === 'flasks' || categoryOfItem === 'jewels' || categoryOfItem === 'gems') {
            //     continue;
            // }

            if(item.icon.toLowerCase().indexOf('currency') !== -1 && categoryOfItem === undefined) {
                categoryOfItem = 'currency';
                // console.log(item);
            }

            if(categoryOfItem === undefined) {
                // console.log(item);
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
    let nameOfItem = item.typeLine.toLowerCase();
    let iconUrl = item.icon.toLowerCase();

    if(iconUrl.indexOf('breach') !== -1 && nameOfItem.indexOf('splinter') !== -1) {
        return true;
    }
}
