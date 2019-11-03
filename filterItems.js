const fs = require('fs');

module.exports = (rawItems) => new Promise((resolve, reject) => {
    if(!rawItems) {
        reject('rawItems is undefined');
    }

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

            // if(isGem(item)) {
            //     categoryOfItem = 'gems';
            // }

            // prophecies have the currency category; i create prophecy category
            if(isProphecy(item)) {
                categoryOfItem = 'prophecies';
            }

            //breach splinter is no longer a fragment, but currency (poeninja)
            if(isBreachSplinter(item)) {
                categoryOfItem = 'currency';
            }

            if(isDivCard(item)) {
                categoryOfItem = 'divination cards';
            }

            if(isFragment(item)) {
                categoryOfItem = 'fragments';
            }

            if(isOil(item)) {
                categoryOfItem = 'oils';
            }

            if(isEssence(item)) {
                categoryOfItem = 'essences';
            }

            if(isFossil(item)) {
                categoryOfItem = 'fossils';
            }

            if(isResonator(item)) {
                categoryOfItem = 'resonators';
            }

            if(isScarab(item)) {
                categoryOfItem = 'scarabs';
            }

            if(isIncubator(item)) {
                categoryOfItem = 'incubator';
            }

            if(isCurrency(item, categoryOfItem)) {
                categoryOfItem = 'currency';
            }

            if(categoryOfItem === undefined) {
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

function isProphecy(item) {
    if (item.hasOwnProperty('prophecyText')) {
        return true;
    }
}

function isDivCard(item) {
    if(item.icon.toLowerCase().indexOf('divination') !== -1) {
        return true;
    }
}

function isFragment(item) {
    if(item.icon.toLowerCase().indexOf('maps') !== -1) {
        return true;
    }
}

function isOil(item) {
    if(item.icon.toLowerCase().indexOf('oils') !== -1) {
        return true;
    }
}

function isEssence(item) {
    if (item.typeLine.indexOf('Essence') !== -1 || item.typeLine.indexOf('Remnant') !== -1 && item.icon.toLowerCase().indexOf('essence') !== -1) {
        return true;
    }
}

function isFossil(item) {
    if (item.typeLine.indexOf('Fossil') !== -1 && item.icon.toLowerCase().indexOf('delve') !== -1) {
        return true;
    }
}

function isResonator(item) {
    if (item.typeLine.indexOf('Resonator') !== -1 && item.icon.toLowerCase().indexOf('delve') !== -1) {
        return true;
    }
}

function isScarab(item) {
    if (item.typeLine.indexOf('Scarab') !== -1 && item.icon.toLowerCase().indexOf('currency') !== -1) {
        return true;
    }
}

function isIncubator(item) {
    if (item.typeLine.indexOf('Incubator') !== -1) {
        return true;
    }
}

function isCurrency(item, categoryOfItem) {
    if(item.icon.toLowerCase().indexOf('currency') !== -1 && categoryOfItem === undefined) {
        return true;
    }
}

function isGem(item) {
    if(item.icon.toLowerCase().indexOf('gems') !== -1 && item.hasOwnProperty('support')) {
        for (let i = 0; i < item.properties.length; i++) {
            if(item.properties[i].name === 'Quality') {
                item.quality = item.properties[i].values[0][0];
                return true;
            }
        }
    }
}
