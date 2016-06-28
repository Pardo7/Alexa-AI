var express 				= require('express');
var app 	  				= express();
var server 					= require('http').createServer(app);
var port 	  				= process.env.port || 3000;
var fs		  				= require('fs');
var util	  				= require('util');
var bodyParser 			= require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({
    extended: true
});
// var alexa 	= require('alexa-app');

// Creating the website server on port #
server.listen(port, function() {
	console.log('Server is up and running sir.');
});

// Configuring Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Express routing
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/styles'));
app.engine('html', require('ejs').renderFile);

app.get('/', function(reques, response) {
	response.sendFile(__dirname + '/views/home.html');
});

// Helper function to format the strings so that they dont include spaces and are all in lowercase
var formatString = function(string) {
	var lowercaseString = string.toLowerCase();
	var formattedString = lowercaseString.replace(/\s/g, '');
	return formattedString;
};

// Handles the route for echo api's

app.post('/api/echo', function(request, response) {
	console.log("received echo request");
	var requestBody = "";

	// Will accumilate the date
	request.on('data', function(data) {
		requestBody += data;
	});

	// Called when all data has been accumilated
	request.on('end', function() {
		var responseBody = {};
		console.log(requestBody);
		console.log(JSON.stringify(requestBody));

	// Parsing the request body for information
	var jsonData = JSON.parse(requestBody);
	if(jsonData.request.type == 'LaunchRequest') {

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
            "content": "You started the Node.js Echo API Sample"
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
	} else if(jsonData.request.type == "IntentRequest") {
      var outputSpeechText = "";
      var cardContent = "";
      if (jsonData.request.intent.name == "ImportAll") {
        // The Intent "TurnOn" was successfully called
        // outputSpeechText = "Congrats! You asked to turn on " + jsonData.request.intent.slots.Device.value + " but it was not implemented";
        outputSpeechText = "will do sir, importing preferences and calibrating control environment";
        cardContent = "Successfully called " + jsonData.request.intent.name + ", but it's not implemented!";
      }
      else if (jsonData.request.intent.name == "TurnOff") {
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
