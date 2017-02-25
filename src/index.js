'use strict'

var https = require('https');

var APP_ID = 'amzn1.ask.skill.3b8ded99-c4c3-43a3-ad0e-2d9d86484dc4';

var IMO = require('./IMO');

var Alexa = require('./AlexaSkill');

var OUTPUT = "Welcome to symptom checker. Please list your symptoms.";

var config = {
                hostname : "http://184.73.124.73:80/PortalWebService",
                apiKeySecret: "YzQwNWViZTMxNDQwNGNlNWJlZjEzMmU2MWU5YzMxZGQ6N0Q4MjJBRjUxMERCMzZERDlGQzQ5NTVENDRBMDUyMjkwNzMxNjFFODU2OUI5QUUwRjFERjk1Q0ZGOTI2NjMyRQ==",
                product: "ProblemIT_Professional"
}

var ResponseService = function(){
	Alexa.call(this, APP_ID);
}

ResponseService.prototype = Object.create(Alexa.prototype);

var responseFunction = function(intent, session, response){
	response.tell(OUTPUT);
}

var diagnosisFunction = function(intent, session, response){

	//Should be working
	var clickSearch = function () {
                var searchParameters = {
                        "numberOfResults": 10,
                        "filterByPrecedence": 1,
                        "clientApp": "App",
                        "clientAppVersion": "1.0",
                        "siteId": "HospitalA",
                        "userId": "UserA",
                        "searchTerm": intent.slots.system.value
                        };
                var client = new IMO.PortalWebClient(config.hostname,config.apiKeySecret,config.product);
                var promise = client.search(searchParameters);
		promise
			.done(responseHandler)
			.fail(function (response) {
				console.log((response.responseJSON === undefined)
					? response.statusText
					: formatJSON(response.responseText));
		});
		return promise;
	}

	//PROBABLY WRONG
	var responseHandler = function (response) {
		response.tell(response.status);
		var msg = (response.status == 200)
		? formatJSON(response.responseText)
		: response.responseText;
		response.tell('Response: ', msg);
	}

	//This one works
	response.tell('You will probably die' + responseHandler.msg);
}

//MAY BE WRONg
var formatJSON = function(jsonString) {
	jsonString.trim();
	var jsonObj = JSON.parse(jsonString);
	return jsonObj;
}

var helpFunction = function(intent,session,response){
	response.tell('Just tell me your symptoms and I will find a diagnosis for you.');
}

ResponseService.prototype.eventHandlers.onLaunch = responseFunction;

ResponseService.prototype.intentHandlers = {

	'GetDiagnosisIntent' : diagnosisFunction,
	'HelpIntent' : helpFunction
};

exports.handler = function(event, context){
	var responseService = new ResponseService();
	responseService.execute(event,context);
}
