import express from 'express';
import request from 'request';
import fs from 'fs';
import util from 'util';
import aiUtils from './ai-utils.js'
import bodyParser from 'body-parser';
const parseUrlencoded = bodyParser.urlencoded({
    extended: true
});
let app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 8088;

// Creating the website server on port #
server.listen(port, function () {
    console.log('Server listening on port %d', port);
});

// Configuring Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Express routing
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/styles'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/views/home.html');
});

// Helper function to format the strings so that they dont include spaces and are all in lowercase
const formatString = string => {
	const lowercaseString = string.toLowerCase();
	const formattedString = lowercaseString.replace(/\s/g, '');
    return formattedString;
};

// Handles the route for echo api's
app.post('/api/echo', (request, response) => {
    console.log("received echo request");
    let requestBody = "";

    // Will accumilate the date
    request.on('data', data => {
        requestBody += data;
    });

    // Called when all data has been accumilated
    request.on('end', () => {
        let responseBody = {};

        // Parsing the request body for information
        const jsonData = JSON.parse(requestBody);
        if (jsonData.request.type == 'LaunchRequest') {

            // crafting a response
            responseBody = {
                "version": "0.1",
                "response": {
                    "outputSpeech": {
                        "type": "PlainText",
                        "text": "Welcome Mr. Pardo, At your service sir."
                    },
                    "card": {
                        "type": "Simple",
                        "title": "Opened",
                        "content": "You have started the Sudo AI Node Control"
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "PlainText",
                            "text": "Say a command"
                        }
                    },
                    "shouldEndSession": false
                }
            };
        } else if (jsonData.request.type == "IntentRequest") {
            let outputSpeechText = "";
            let cardContent = "";
            if (jsonData.request.intent.name == "CustomRequestThree") {
                // The Intent "Custom Request Three" was successfully called
                outputSpeechText = "will do, initiating action three";
                cardContent = `Successfully called ${jsonData.request.intent.name}, but it's not implemented!`;
                aiUtils.customRequestThree();
            } else if (jsonData.request.intent.name == "CustomRequestOne") {
                // The Intent "Custom Request One" was successfully called
                outputSpeechText = "will do, initiating action one.";
                cardContent = `Successfully called ${jsonData.request.intent.name}, but it's not implemented!`;
                aiUtils.customRequestOne();
            } else if (jsonData.request.intent.name == "CustomRequestTwo") {
                // The Intent "Custom Request Two" was successfully called
                outputSpeechText = "will do, initiating action two";
                cardContent = `Successfully called ${jsonData.request.intent.name}, but it's not implemented!`;
                aiUtils.customRequestTwo();
            } else if (jsonData.request.intent.name == "Other") {
                // The Intent "Other" was successfully called
                outputSpeechText = `You asked to turn off ${jsonData.request.intent.slots.Device.value}, but it was not implemented`;
                cardContent = `Successfully called ${jsonData.request.intent.name}, but it's not implemented!`;
            } else {
                outputSpeechText = `${jsonData.request.intent.name} not implemented`;
                cardContent = `Successfully called ${jsonData.request.intent.name}, but it's not implemented!`;
            }
            responseBody = {
                "version": "0.1",
                "response": {
                    "outputSpeech": {
                        "type": "PlainText",
                        "text": outputSpeechText
                    },
                    "card": {
                        "type": "Simple",
                        "title": "Open Smart Hub",
                        "content": cardContent
                    },
                    "shouldEndSession": false
                }
            };
        } else {
            // Not a recognized type
            responseBody = {
                "version": "0.1",
                "response": {
                    "outputSpeech": {
                        "type": "PlainText",
                        "text": "Could not parse data"
                    },
                    "card": {
                        "type": "Simple",
                        "title": "Error Parsing",
                        "content": JSON.stringify(requestBody)
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "PlainText",
                            "text": "Say a command"
                        }
                    },
                    "shouldEndSession": false
                }
            };
        }

        response.statusCode = 200;
        response.contentType('application/json');
        response.send(responseBody);
    });
});

