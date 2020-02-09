const request = require('request');
let instance = null;

const QueueHandler = require('./QueueHandler');
let queueHandler = new QueueHandler().getInstance();

class RequestHandler {

    constructor() {
        if (instance) {
            return instance;
        }

        this.amountOfGETRequestsMade = 0;
        this.amountOfPOSTRequestsMade = 0;
        this.amountOfRequestsMade = this.amountOfGETRequestsMade + this.amountOfPOSTRequestsMade;
        this.rateLimitPerSecond = 4;

        this.requestsAreDone = true;

        instance = this;
        return instance;
    }

    observeQueue() {
        let startTime = Date.now();

        setInterval(() => {
            let endTime = Date.now();

            console.log('queueSize: ' + queueHandler.size());
            if(endTime - startTime > 5000) {
                console.log('5s have passed');
                startTime = Date.now();
                this.processQueue();
            }
        }, 1000)
    }

    processQueue() {
        if(this.requestsAreDone === false) {
            return;
        }

        if(queueHandler.size() !== 0) {
            this.requestsAreDone = false;
            console.log('queue is not empty');
            let forLoopLimit = this.rateLimitPerSecond;
            if(queueHandler.size() < this.rateLimitPerSecond) {
                forLoopLimit = queueHandler.size();
            }

            let requestPromisesArray = [];

            for (let i = 0; i < forLoopLimit; i++) {
                let requestPromise = queueHandler.dequeue();
                console.log('requestPromise: ')
                console.log(requestPromise);

                let requestResultPromise;

                if(requestPromise.requestData.method === 'GET') {
                    requestResultPromise = this.requestGET(requestPromise.requestData.url, requestPromise.callback);
                }
                else if(requestPromise.requestData.method === 'POST') {
                    requestResultPromise = this.requestPOST(requestPromise.requestData.url, requestPromise.requestData.query, requestPromise.callback);
                }
                else {
                    console.log('requestPromise has no method');
                }
                requestPromisesArray.push(requestResultPromise);
            }

            Promise.all(requestPromisesArray).then((results) => {
               this.requestsAreDone = true;
            });

        }
        else {
            console.log('queue is empty');
        }
    }

    getInstance() {
        return instance || new RequestHandler();
    }

    enqueueRequest(url, method, query) {
        return new Promise((resolve, reject) => {
            this.test(
                {
                    "url" : url,
                    "method" : method,
                    "query" : query || null
                },
                (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(data)
                }
            )
        });

    //     let objectToEnqueue = new Promise(
    // {
    //             "url" : url,
    //             "method" : method,
    //             "query" : query || null
    //         });
    //
    //     queueHandler.enqueue(objectToEnqueue);
    //
    //     if(objectToEnqueue.method === 'GET') {
    //         objectToEnqueue = this.requestGET(objectToEnqueue.url);
    //     }
    //     else if(objectToEnqueue.method === 'POST') {
    //         objectToEnqueue = this.requestPOST(objectToEnqueue.url, objectToEnqueue.query);
    //     }
    //     else {
    //         console.log('requestPromise has no method');
    //     }
    //
    //     return objectToEnqueue;
    }

    test(requestData, callback) {
        let objectToEnqueue = {
            requestData: requestData,
            callback: callback
        };

        queueHandler.enqueue(objectToEnqueue);
    }

    requestGET(url, callback) {
        return new Promise((resolve, reject) => {
            request({
                        url: url,
                        method: 'GET'
                    },
                    (error, response, body) => {
                        if (error) {
                            callback(error, null);
                            return reject(error);
                        }
                        console.log('RequestHandler done with GET')
                        this.amountOfGETRequestsMade++;
                        console.log('GET: ' + this.amountOfGETRequestsMade);
                        body = JSON.parse(body);
                        callback(null, body);
                        return resolve({ body, response })
                    })
        })
    }

    requestPOST(url, query, callback) {
        return new Promise((resolve, reject) => {
            request({
                        url: url,
                        method: 'POST',
                        json: true,
                        body: query
                    },
                    (error, response, body) => {
                        if (error) {
                            callback(error, null);
                            return reject(error);
                        }
                        console.log('RequestHandler done with POST')
                        this.amountOfPOSTRequestsMade++;
                        console.log('POST: ' + this.amountOfPOSTRequestsMade);
                        callback(null, body);
                        return resolve({ body, response })
                    })
        });
    }
}

module.exports = RequestHandler;
