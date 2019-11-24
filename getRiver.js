const request = require('request');
const rp = require('request-promise');
const fs = require('fs');
var nextChangeId = null;

var options = {
    uri: 'http://www.pathofexile.com/api/public-stash-tabs',
    json: true // Automatically parses the JSON string in the response
};

// let requestRiver = () => new Promise((resolve, reject) => {
//     console.log('requestRiver')
//     request({
//             headers: {
//                 Referer: 'https://www.pathofexile.com',
//             },
//             url: `http://www.pathofexile.com/api/public-stash-tabs`,
//         },
//         (error, response, body) => {
//             if (error) {
//                 reject(error);
//             }
//
//             let parsedBody = JSON.parse(body);
//
//             nextChangeId = parsedBody.next_change_id;
//             console.log('requestRiver ' + nextChangeId);
//
//             resolve();
//             // fs.writeFileSync('stashes.json', body);
//
//             // return new Promise(function(resolve, reject) {
//             //     fs.writeFile('stashes.json', body, function(err) {
//             //         if (err) {
//             //             reject(err);
//             //         }
//             //         else {
//             //             console.log('resolve RequestRiver')
//             //             resolve(body);
//             //         }
//             //     });
//             // });
//             //
//             // (async () => {
//             //     await fs.writeFile('stashes.json', body);
//             // })();
//         });
// });

let requestRiver = () => rp(options)
    .then((parsedBody) => {
        nextChangeId = parsedBody.next_change_id;
        console.log(nextChangeId)
    })
    .catch(() => {
        console.log('error')
    })

let updateRiver = () => new Promise((resolve, reject) => {
    console.log('updateRiver ' + nextChangeId)
    let uri = `http://www.pathofexile.com/api/public-stash-tabs?id=${nextChangeId}`;
    console.log(uri);
    request({
                headers: {
                    Referer: 'https://www.pathofexile.com',
                },
                url: uri,
            }, (error, response, body) => {
        if (error) {
            reject(error);
        }

        let parsedBody = JSON.parse(body);

        nextChangeId = parsedBody.next_change_id;
        console.log('updateRiver ' + nextChangeId);
        fs.writeFile('updated_stashes.json', body, (err) => {
            // If an error occurred, show it and return
            if(err) {
                return console.error(err);
            }
            // Successfully wrote binary contents to the file!
        });
    });
});

module.exports = () => new Promise((resolve, reject) => {
    requestRiver();
    setTimeout(function() {
        updateRiver();
    }, 5000)
    //  requestRiver().then(updateRiver());
});
