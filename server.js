//Load various modules
require('dotenv').config();

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const request = require('request');

const getItems = require('./getters/getItems');
const filterItems = require('./filterItems');
const organizeItems = require('./organizeItems');
const getValueOfItems = require('./getters/getValueOfItems');
const assignValueToItems = require('./assignValuesToItems');
const getMatchingTradeApiModifiers = require('./getMatchingTradeApiModifiers');

const EnvironmentVariables = require('./classes/EnvironmentVariables');
const CurrencyHandler = require('./classes/CurrencyHandler');
const RequestHandler = require('./classes/RequestHandler');

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

//init the app
let app = express();
app.set('view engine', 'ejs');
//now we can serve static files, like .css
app.use(express.static(path.join(__dirname, 'public')));

const environmentVariables = new EnvironmentVariables().getInstance();
environmentVariables.getLeague();
environmentVariables.getStats();

const requestHandler = new RequestHandler().getInstance();
requestHandler.observeQueue();

const currenyHandler = new CurrencyHandler().getInstance();
currenyHandler.getJsonFromAPI();

//get POE river asap
// getRiver();

//homepage
app.get('/', (req, res) => {
    servePage('/index.html', res);
});

/*
    Expects base64 encoded jewel mods
    Example: /get-jewel/2ddfg81368213618246asdsad/38hndqshd020=
 */
app.get('/get-jewel/:mod1', (req, res) => {
    let mod1 = b64DecodeUnicode(req.params.mod1);

    let mods = [mod1];

    // console.log('1337: ' + mods);

    let jewel = buildJewel(mods);
    getMatchingTradeApiModifiers.prepJewelForTradeApi(jewel)
    .then((listings) => {
        if(listings !== null) {
            console.log('listings 1 MODS');
            jewel.listings = [];
            for (let i = 0; i < listings.length; i++) {
                jewel.listings[i] = listings[i].listing.price;
            }
            jewel.searchURL = listings[0].searchURL;
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(JSON.stringify(jewel));
        }
    })
    .catch((error) => {
        console.log(error);
    })
});

app.get('/get-jewel/:mod1/:mod2', (req, res) => {
    let mod1 = b64DecodeUnicode(req.params.mod1);
    let mod2 = b64DecodeUnicode(req.params.mod2);

    let mods = [mod1, mod2];

    let jewel = buildJewel(mods);
    getMatchingTradeApiModifiers.prepJewelForTradeApi(jewel)
    .then((listings) => {
        if(listings !== null) {
            console.log('listings 2 MODS');
            jewel.listings = [];
            for (let i = 0; i < listings.length; i++) {
                jewel.listings[i] = listings[i].listing.price;
            }
            jewel.searchURL = listings[0].searchURL;
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(JSON.stringify(jewel));
        }
    })
    .catch((error) => {
        console.log(error);
    })
});

app.get('/get-jewel/:mod1/:mod2/:mod3', (req, res) => {
    let mod1 = b64DecodeUnicode(req.params.mod1);
    let mod2 = b64DecodeUnicode(req.params.mod2);
    let mod3 = b64DecodeUnicode(req.params.mod3);

    let mods = [mod1, mod2, mod3];

    let jewel = buildJewel(mods);
    getMatchingTradeApiModifiers.prepJewelForTradeApi(jewel)
    .then((listings) => {
        if(listings !== null) {
            console.log('listings 3 MODS');
            jewel.listings = [];
            for (let i = 0; i < listings.length; i++) {
                jewel.listings[i] = listings[i].listing.price;
            }
            jewel.searchURL = listings[0].searchURL;
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(JSON.stringify(jewel));
        }
    })
    .catch((error) => {
        console.log(error);
    })
});

app.get('/get-jewel/:mod1/:mod2/:mod3/:mod4', (req, res) => {
    let mod1 = b64DecodeUnicode(req.params.mod1);
    let mod2 = b64DecodeUnicode(req.params.mod2);
    let mod3 = b64DecodeUnicode(req.params.mod3);
    let mod4 = b64DecodeUnicode(req.params.mod4);

    let mods = [mod1, mod2, mod3, mod4];

    let jewel = buildJewel(mods);
    getMatchingTradeApiModifiers.prepJewelForTradeApi(jewel)
        .then((listings) => {
            if(listings !== null) {
                console.log('listings 4 MODS');
                jewel.listings = [];
                for (let i = 0; i < listings.length; i++) {
                    jewel.listings[i] = listings[i].listing.price;
                }
                jewel.searchURL = listings[0].searchURL;
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end(JSON.stringify(jewel));
            }
        })
        .catch((error) => {
            console.log(error);
        })

    /*
     Steps:
     - in AssignValueToItems.js, remove the promise around the jewel request function because this function will trigger
     after page load now.
     - After contentHasLoaded event, send ajax call to server to get the jewels
     - In server, setInterval(?) to get value of my jewels by pattern matching river jewels and get their id's
     - Then API call the ID's and get value and assign to my jewel
     - Then send a batch of jewels, like 10, to frontend to render
     - Continue this until all my jewels are done
     */
});

app.post('/', urlencodedParser, (req, res) => {
    let accountName = req.body.accountName.toUpperCase();
    let sessionID = req.body.sessionID;
    /*
     When we receive the POST data, we will fire this function which
     fires a request for each tab the account has.
     When it resolves, we have succesfully obtained an array, containing an array of objects,
     where each object is a stash tab
     */

    getItems(accountName, sessionID)
        .then((allItems) => filterItems(allItems))
        .then((filteredItems) => organizeItems(filteredItems))
        .then((organizedItems) => getValueOfItems(organizedItems))
        .then((data) => assignValueToItems(data[0], data[1]))
        .then((organizedItems) => {
            res.render('result',
               {
                   organizedItems: organizedItems
               },
               function(err, html) {
                    if(err) {
                        res.send(err)
                    }
                    else {
                        res.send(html);
                    }
                })
        })
        .catch(reason => {
            console.log("reason: " + reason);
            res.render('error', { reason: reason } );
        } );
});

// 404
app.use(function(req, res, next) {
    return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});

// 500 - Any server error
app.use(function(err, req, res, next) {
    return res.status(500).send({ error: err });
});

var port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

//general function to serve correct page based on request
var servePage = function(url, response) {
    let page = fs.createReadStream(__dirname + url, 'utf-8');
    page.on('error', () => {
        console.log('Something went wrong with reading the file');
    });
    page.pipe(response);
};

function buildJewel(mods) {
    /*
     build a jewel obj for requesting trade api
     */
    let jewel = {
        'explicitMods' : []
    };

    for (let i = 0; i < mods.length; i++) {
        mods[i] = mods[i].replace(/_/g, ' ');
        jewel.explicitMods.push(mods[i]);
    }

    console.log('buildJewel: ' + JSON.stringify(jewel));
    return jewel;
}

// https://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
function b64DecodeUnicode(str) {
    var b = new Buffer(str, 'base64')
    var s = b.toString();
    return s;
}
