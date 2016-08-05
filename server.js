var express = require('express');
var app = express();
var server = require('http').createServer(app);
var request = require('request');
var port = process.env.PORT || 80;
var fs = require('fs');
var util = require('util');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({
    extended: true
});
// var alexa 	= require('alexa-app');

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
var formatString = function (string) {
    var lowercaseString = string.toLowerCase();
    var formattedString = lowercaseString.replace(/\s/g, '');
    return formattedString;
};

// Configuring our post requests
var initiateClearInterface = function () {
    request({
        url: 'http://47e990b7.ngrok.io/clear',
        qs: {from: 'Sudo Alexa AI', data: 'Clear Preferences'},
        method: 'POST'
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    })
};

var triggerInputInterface = function(data) {
  request({
      url: 'http://47e990b7.ngrok.io/inverse',
      qs: {from: 'Sudo Alexa AI', data: data},
      method: 'POST'
  }, function(error, response, body) {
      if (error) {
          console.log(error);
      } else {
          console.log(response.statusCode, body);
      }
  })
};

var initNeural = function() {
    request({
        url: 'http://47e990b7.ngrok.io/connect',
        qs: {from: 'Sudo Alexa AI', data: 'init neural'},
        method: 'POST'
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    })
};

// Handles the route for echo api's
app.post('/api/echo', function (request, response) {
    console.log("received echo request");
    var requestBody = "";

    // Will accumilate the date
    request.on('data', function (data) {
        requestBody += data;
    });

    // Called when all data has been accumilated
    request.on('end', function () {
        var responseBody = {};
        console.log(requestBody);
        console.log(JSON.stringify(requestBody));

        // Parsing the request body for information
        var jsonData = JSON.parse(requestBody);
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
            var outputSpeechText = "";
            var cardContent = "";
            if (jsonData.request.intent.name == "ImportAll") {
                // The Intent "TurnOn" was successfully called
                // outputSpeechText = "Congrats! You asked to turn on " + jsonData.request.intent.slots.Device.value + " but it was not implemented";
                outputSpeechText = "will do sir, importing preferences and calibrating control environment";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
            } else if (jsonData.request.intent.name == "NeuralPlanting") {
                // The Intent "Neural Planting" was successfully called
                outputSpeechText = "As you wish sir, I’ve also prepared a safety briefing for you to entirely ignore";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
            } else if (jsonData.request.intent.name == "AlrightWhatyaSay") {
                // The Intent "Neural Planting" was successfully called
                outputSpeechText = "- I have indeed been uploaded sir.. Sir, there are still TERABYTES of calculations needed for an actual third party neural control.";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
            } else if (jsonData.request.intent.name == "RunBeforeWalk") {
                // The Intent "Neural Planting" was successfully called
                outputSpeechText = "As you wish sir.";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
                initNeural();
            } else if (jsonData.request.intent.name == "ClearPreferences") {
                // The Intent "Neural Planting" was successfully called
                outputSpeechText = "As you wish sir.. clearing all preferences and calibrating the control environment";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
                initiateClearInterface();
            } else if (jsonData.request.intent.name == "MessageInterface") {
                // The Intent "TurnOff" was successfully called
                outputSpeechText = "Will do sir, initiating the messaging interface";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
                triggerInputInterface('messaging interface');
            } else if (jsonData.request.intent.name == "InputInterface") {
                // The Intent "TurnOff" was successfully called
                outputSpeechText = "Will do sir, initiating the input interface";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
                triggerInputInterface('neural input interface');
            } else if (jsonData.request.intent.name == "TurnOff") {
                // The Intent "TurnOff" was successfully called
                outputSpeechText = "Congrats! You asked to turn off " + jsonData.request.intent.slots.Device.value + " but it was not implemented";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
            } else {
                outputSpeechText = jsonData.request.intent.name + " not implemented";
                cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
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


// For Later
// app.intent('number',
//   {
//     "slots":{"number":"NUMBER"}
// 	,"utterances":[ "say the number {1-100|number}" ]
//   },
//   function(request,response) {
//     var number = request.slot('number');
//     response.say("You asked for the number "+number);
//   }
// );

// // Manually hook the handler function into express
// express.post('/sample',function(req,res) {
//   app.request(req.body)        // connect express to alexa-app
//     .then(function(response) { // alexa-app returns a promise with the response
//       res.json(response);      // stream it to express' output
//     });
// });
