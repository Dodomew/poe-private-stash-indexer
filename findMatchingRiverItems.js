const helper = require('./helper');
const fs = require('fs');

module.exports = (organizedItems) => new Promise((resolve, reject) => {
    let items = organizedItems;
    let dateOfToday = helper.getDateOfToday();
    let riverOfToday;

    fs.readFile('jewels_' + dateOfToday + '.json', 'utf8', function(err, contents) {
        console.log('loaded: jewels_' + dateOfToday);
        riverOfToday = contents;
    });

    helper.getDateOfYesterday();
});
