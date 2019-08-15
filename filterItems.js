module.exports = (rawItems) => new Promise((resolve, reject) => {
    let dictionary = {};

    for (let i = 0; i < rawItems.length; i++) {
        for (let j = 0; j < rawItems[i].length; j++) {
            if (!rawItems[i].length) {
                continue;
            }

            let item = rawItems[i][j];
            let categoryOfItem = Object.keys(rawItems[i][j].category)[0];

            if (item.hasOwnProperty('prophecyText')) {
                categoryOfItem = 'prophecy';
            }

            if (item.typeLine.indexOf('Essence') !== -1 || item.typeLine.indexOf('Remnant') !== -1 && categoryOfItem === 'currency') {
                categoryOfItem = 'essence';
            }

            if (item.typeLine.indexOf('Fossil') !== -1) {
                categoryOfItem = 'fossil';
            }

            if (item.typeLine.indexOf('Resonator') !== -1) {
                categoryOfItem = 'resonator';
            }

            if (item.typeLine.indexOf('Scarab') !== -1 && categoryOfItem === 'maps') {
                categoryOfItem = 'scarab';
            }

            if (categoryOfItem === 'accessories' || categoryOfItem === 'weapons' || categoryOfItem === 'armour') {
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
