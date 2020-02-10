function initGetJewels() {
    /*
        for each jewel in the list, we will ajax request to get its mods and use that to request the poe trade api
     */
    let jewelElems = document.getElementsByClassName('js-is-jewel');
    for (let i = 0; i < jewelElems.length; i++) {

        let modsArray = [];
        let itemMods = jewelElems[i].querySelectorAll('.js-item-mod');

        for (let j = 0; j < itemMods.length; j++) {
            modsArray.push(itemMods[j].textContent.trim());
        }

        requestJewel(jewelElems[i], modsArray);
    }
}

function requestJewel(htmlElem, mods) {
    let xmlhttp = new XMLHttpRequest();
    let string;
    let url = '';

    for (let i = 0; i < mods.length; i++) {
        mods[i] = b64EncodeUnicode(mods[i]);
        url += '/' + mods[i];
    }

    // make ajax request which we will fetch in server.js
    xmlhttp.open("GET","/get-jewel" + url, true);

    // listen for `error` event
    xmlhttp.onerror = () => {
        console.error('Request failed.');
    };

// listen for `progress` event
//     xmlhttp.onprogress = (event) => {
//         // event.loaded returns how many bytes are downloaded
//         // event.total returns the total number of bytes
//         // event.total is only available if server sends `Content-Length` header
//         console.log(`Downloaded ${event.loaded} of ${event.total}`);
//     };

    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
            string = xmlhttp.responseText;
            updateItemValue(htmlElem, string)
        }
    };
    xmlhttp.send();
}

/*
    jewel.listing :
    [
        {
            type: b/o,
            amount: 30,
            currency: chaos
        },
         {
             type: b/o,
             amount: 50,
             currency: chaos
         },
    ]
 */
function updateItemValue(parent, string) {
    let valueElem = parent.querySelector('.js-item-value');
    let linkToTrade = parent.querySelector('a');
    console.log(linkToTrade);

    let jewel = JSON.parse(string);
    console.log('UPDATE ITEM VALUE')
    console.log(jewel)

    if(jewel.listings.length === 0) {
        valueElem.innerHTML = '0';
        parent.dataset.value = '0';
    }

    jewel.chaosValue = 0;
    let totalValidPricings = 0;

    for (let i = 0; i < jewel.listings.length; i++) {
        if(jewel.listings[i] !== null) {
            jewel.chaosValue += jewel.listings[i].amount;
            totalValidPricings++;
        }
    }

    jewel.chaosValue = Math.floor(jewel.chaosValue / totalValidPricings);
    valueElem.innerHTML = jewel.chaosValue;
    parent.dataset.value = jewel.chaosValue;
    linkToTrade.href = jewel.searchURL;
}

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}
