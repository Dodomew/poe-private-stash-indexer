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

            if (item.typeLine.indexOf('Essence') !== -1) {
                categoryOfItem = 'essence';
            }

            if (!dictionary.hasOwnProperty(categoryOfItem)) {
                dictionary[categoryOfItem] = [];
            }

            dictionary[categoryOfItem].push(rawItems[i][j]);
        }
    }

    resolve(dictionary);
});
