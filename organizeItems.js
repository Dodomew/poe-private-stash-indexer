module.exports = (filteredItems) => new Promise((resolve, reject) => {
    let dictionary = {};

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

    let items = Object.values(filteredItems);
    let category = Object.keys(filteredItems);

    // console.log(items[9][0]);

    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < items[i].length; j++) {
            let item = items[i][j];

            let objToFill = {};
            switch (item.category) {
                case 'resonator':
                    objToFill = resonators;
                    break;
                case 'prophecy':
                    objToFill = prophecies;
                    break;
                default:
                    continue;
            }

            let itemName = item.typeLine;

            if(!objToFill.hasOwnProperty(itemName)) {
                objToFill[itemName] = 1;
            }
            else {
                objToFill[itemName] = objToFill[itemName] + 1;
            }
        }
    }

    console.log(prophecies);

    resolve(dictionary);
});
