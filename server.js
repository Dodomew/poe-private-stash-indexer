//Load various modules
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const getItems = require('./getItems');

let url = 'https://www.pathofexile.com/character-window/get-stash-items?league=LEGION&tabs=%7B0,1%7D&tabIndex=%7B0,N%7D&accountName=Dodomew'

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

//init the app
let app = express();

//homepage
app.get('/', (req, res) => {
    servePage('/index.html', res);
});

app.post('/', urlencodedParser, (req, res) => {
    let league = req.body.league;
    let accountName = req.body.accountName.toUpperCase();
    let sessionID = req.body.sessionID;

    // let url = 'https://www.pathofexile.com/character-window/get-stash-items?league=' + league.toUpperCase() + '&tabs=%7B0,1%7D&tabIndex=%7B0,N%7D&accountName='+ accountName
    getItems(league, accountName, sessionID).then((allItems) => {
        // console.log(allItems);
        servePage('/result.html', res)
        res.write(allItems);
    });
});

app.get('/contact', (req, res) => {
    servePage('/contact.html', res);
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

// // https.get(url, res => {
// //     let json = "";
// //     res.setEncoding("utf8");
// //     res.on("data", data => {
// //         json += data;
// //     });
// //     res.on("end", () => {
// //         jsonObj = JSON.parse(json);
// //         console.log(jsonObj);
// //         // for (let i = 0; i < jsonObj.length; i++) {
// //         //     console.log(jsonObj[i].name);
// //         // }
// //     });
// // });
