//Load various modules
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const getItems = require('./getItems');
const filterItems = require('./filterItems');
const organizeItems = require('./organizeItems');
const path = require('path');

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

//init the app
let app = express();
app.set('view engine', 'ejs');
//now we can serve static files, like .css
app.use(express.static(path.join(__dirname, 'public')));

//homepage
app.get('/', (req, res) => {
    servePage('/index.html', res);
});

app.post('/', urlencodedParser, (req, res) => {
    let league = req.body.league;
    let accountName = req.body.accountName.toUpperCase();
    let sessionID = req.body.sessionID;

    /*
        When we receive the POST data, we will fire this function which
        fires a request for each tab the account has.
        When it resolves, we have succesfully obtained an array, containing an array of objects,
        where each object is a stash tab
     */
    getItems(league, accountName, sessionID).then((allItems) => {
        filterItems(allItems).then((filteredItems) => {
            organizeItems(filteredItems);
            let test = Object.keys(filteredItems)[0];
            // console.log(test);
            // console.log(Object.values(filteredItems)[3][0]);
            // console.log(Object.values(filteredItems)[9][0]); //sale tab
            res.render('result', {
                filteredItems: filteredItems
            });
        });
    });
});

// 404
app.use(function(req, res, next) {
    return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});

// 500 - Any server error
app.use(function(err, req, res, next) {
    return res.status(500).send({ error: err });
});

app.listen(3000);

//general function to serve correct page based on request
var servePage = function(url, response) {
    let page = fs.createReadStream(__dirname + url, 'utf-8');
    page.on('error', () => {
        console.log('Something went wrong with reading the file');
    });
    page.pipe(response);
};
