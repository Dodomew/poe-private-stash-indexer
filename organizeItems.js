module.exports = (filteredItems) => new Promise((resolve, reject) => {
    /*

    filteredItems = object holding object holding array that holds objects

    filteredItems = {
        'currency' : [
           {
             w: 1,
             h: 1,
             typeLine: Chaos orb,
           },
           {
             w: 1,
             h: 1,
             typeLine: Scarab
           },
        ],
        'armour' : [{}]
    }

    so to loop through this, we convert it to an array by Object.values and .keys
    filteredItems = [
        'currency' = [
            {
                w: 1,
                h: 1,
                typeLine: Chaos Orb,
            }
        ]
    ]

    then you can loop through it like so:
    for() items.length {
        for() items.[i].length {
            let item = items[i][j];
            let name = item.typeLine;
        }
     }
     */

    let resonators = {};
    let prophecies = {};
    let incubators = {};

    let items = Object.values(filteredItems);
    let category = Object.keys(filteredItems);

    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < items[i].length; j++) {
            let item = items[i][j];
            let objToFill = {};

            //certain items don't stack, so I ''stack'' them here for better viewing
            switch (item.category) {
                case 'resonators':
                    objToFill = resonators;
                    break;
                case 'prophecies':
                    objToFill = prophecies;
                    break;
                case 'incubators':
                    objToFill = incubators;
                    break;
                default:
                    continue;
            }

            let itemName = item.typeLine;

            //if the item does not exist yet, we create it and set amount to 1
            if(!objToFill.hasOwnProperty(itemName)) {
                objToFill[itemName] = item;
                objToFill[itemName].stackSize = 1;
            }
            else {
                objToFill[itemName].stackSize++;
            }
        }

        // we add a new key called stackSize to the original filtered object's category
        // that way we can still loop through all the objects, e.g. item.stackSize
        if(category[i] === 'resonators') {
            filteredItems[category[i]] = Object.values(resonators);
        }
        else if (category[i] === 'prophecies') {
            filteredItems[category[i]] = Object.values(prophecies);
        }
        else if (category[i] === 'resonators') {
            filteredItems[category[i]] = Object.values(incubators);
        }
    }
    resolve(filteredItems);
});
