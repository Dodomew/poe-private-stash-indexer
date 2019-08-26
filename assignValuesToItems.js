module.exports = (organizedItems, itemsWithValue) => new Promise((resolve, reject) => {
    let poeNinjaArray = itemsWithValue;
    let organizedItemsArray = Object.values(organizedItems);

    //get my item, then find that item in poeNinja
    for (let i = 0; i < organizedItemsArray.length; i++) {
        for (let j = 0; j < organizedItemsArray[i].length; j++) {
            let item = organizedItemsArray[i][j];
            findItemInPoeNinjaArray(item, poeNinjaArray, i);
        }
    }

    // organizedItemsArray.sort((a, b) => (a.chaosValue > b.chaosValue) ? 1 : -1);
    for (let i = 0; i < organizedItemsArray.length; i++) {
        organizedItemsArray[i].sort(compare);
    }
    resolve();
});

function compare(a, b) {
    if(!a.chaosValue || !b.chaosValue) {
        return 1;
    }
    if (a.chaosValue > b.chaosValue) {
        return -1;
    }
    if (a.chaosValue < b.chaosValue) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

/*
    both my array and poeNinja array are implicitly sorted already,
    because in getValueOfItems I request per category, meaning I ask currency, I get currency,
    so the lists are nearly identical.
    That is why you can skip looking in the poeNinjaArray when you finish a loop (startIndex)
 */

function findItemInPoeNinjaArray(item, poeNinjaArray, startIndex) {
    let itemName = item.typeLine;

    for (let i = startIndex; i < poeNinjaArray.length; i++) {
        let obj = poeNinjaArray[i];
        let innerObj = obj.lines;

        for (let j = 0; j < innerObj.length; j++) {
            let poeNinjaItemName;

            //is currency
            if(innerObj[j].currencyTypeName) {
                poeNinjaItemName = innerObj[j].currencyTypeName;
            }
            else {
                poeNinjaItemName = innerObj[j].name;
            }

            let itemIsFound = hasItemBeenFound(itemName, poeNinjaItemName)
            if(itemIsFound) {
                assignChaosValueToItem(item, innerObj[j]);
                return;
            }
        }
    }
}

function hasItemBeenFound(organizedItem, poeNinjaItem) {
    return organizedItem === poeNinjaItem;
}

function assignChaosValueToItem(organizedItem, poeNinjaItem) {
    let value;

    if(poeNinjaItem.hasOwnProperty('receive')) {
        value = poeNinjaItem.receive.value;
    }
    else {
        value = poeNinjaItem.chaosValue;
    }

    organizedItem.chaosValue = Math.round( value * 10 ) / 10;
}
