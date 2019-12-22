//Load various modules
require('dotenv').config();

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const getItems = require('./getItems');
const filterItems = require('./filterItems');
const organizeItems = require('./organizeItems');
const getValueOfItems = require('./getValueOfItems');
const assignValueToItems = require('./assignValuesToItems');
const getRiver = require('./getRiver');
const path = require('path');

global.riverArray = [];

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

//init the app
let app = express();
app.set('view engine', 'ejs');
//now we can serve static files, like .css
app.use(express.static(path.join(__dirname, 'public')));

//get POE river asap
getRiver();

//homepage
app.get('/', (req, res) => {
    servePage('/index.html', res);
});

app.get('/get-jewel', (req, res) => {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end('got jewel');

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
            console.log("returning result");
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
