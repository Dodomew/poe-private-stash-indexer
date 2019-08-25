module.exports = (rawItems) => new Promise((resolve, reject) => {
    let dictionary = {};

    for (let i = 0; i < rawItems.length; i++) {
        for (let j = 0; j < rawItems[i].length; j++) {
            if (!rawItems[i].length) {
                continue;
            }

            // dictionary will be filled with categories -> items
            let item = rawItems[i][j];
            let categoryOfItem = Object.keys(rawItems[i][j].category)[0];

            // prophecies have the currency category; i create prophecy category
            if (item.hasOwnProperty('prophecyText')) {
                categoryOfItem = 'prophecies';
            }

            if (item.typeLine.indexOf('Essence') !== -1 || item.typeLine.indexOf('Remnant') !== -1 && categoryOfItem === 'currency') {
                categoryOfItem = 'essences';
            }

            // fossils also are currency; now fossil category
            if (item.typeLine.indexOf('Fossil') !== -1) {
                categoryOfItem = 'fossils';
            }

            // resonators also are currency; now resonator category
            if (item.typeLine.indexOf('Resonator') !== -1) {
                categoryOfItem = 'resonators';
            }

            if (item.typeLine.indexOf('Scarab') !== -1 && categoryOfItem === 'maps') {
                categoryOfItem = 'scarabs';
            }

            // if(categoryOfItem === 'gems') {
            //     categoryOfItem = 'skill gems';
            // }

            if(categoryOfItem === 'maps') {
                if(rawItems[i][j].category.maps.length > 0) {
                    categoryOfItem = 'fragments';
                }
                else {
                    continue;
                }
            }

            if(categoryOfItem === 'cards') {
                categoryOfItem = 'divination cards'
            }

            //we skip these for now
            if (categoryOfItem === 'accessories' || categoryOfItem === 'weapons' || categoryOfItem === 'armour' || categoryOfItem === 'flasks' || categoryOfItem === 'jewels' || categoryOfItem === 'gems') {
                continue;
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
