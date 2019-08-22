const performance = require('perf_hooks').performance;

module.exports = (organizedItems, itemsWithValue) => new Promise((resolve, reject) => {
    let poeNinjaArray = itemsWithValue;
    let organizedItemsArray = Object.values(organizedItems);

    var t0 = performance.now();

    //get my item, then find that item in poeNinja
    for (let i = 0; i < organizedItemsArray.length; i++) {
        for (let j = 0; j < organizedItemsArray[i].length; j++) {
            let item = organizedItemsArray[i][j];
            findItemInPoeNinjaArray(item, poeNinjaArray, i);
        }
    }

    var t1 = performance.now();
    console.log("Call to findItemInPoeNinjaArray took " + (t1 - t0) + " milliseconds.");
});

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
                // console.log(item + ': ' + poeNinjaItemName);
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
    organizedItem.chaosValue = poeNinjaItem.chaosValue;
    // console.log(organizedItem.typeLine + ' : ' + organizedItem.chaosValue);
}
