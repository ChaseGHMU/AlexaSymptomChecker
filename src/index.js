'use strict'
var https = require('https');

var APP_ID = 'amzn1.ask.skill.7aae67c9-5555-4e27-954f-ba88b2abfef3';
var Alexa = require('./AlexaSkill');
var OUTPUT = "Welcome to symptom checker. Please list your symptoms.";

var config = {
                hostname : "https://PortalWebService.e-imo.com",
                apiKeySecret: "Basic YzQwNWViZTMxNDQwNGNlNWJlZjEzMmU2MWU5YzMxZGQ6N0Q4MjJBRjUxMERCMzZERDlGQzQ5NTVENDRBMDUyMjkwNzMxNjFFODU2OUI5QUUwRjFERjk1Q0ZGOTI2NjMyRQ==",
                product: "ProblemIT_Professional"
}

var ResponseService = function(){
	Alexa.call(this, APP_ID);
};

ResponseService.prototype = Object.create(Alexa.prototype);
var responseFunction = function(intent, session, response){
	response.tell(OUTPUT);
}

var diagnosisFunction = function(intent, session, response)
	
	 var client = new IMO.PortalWebClient(config.hostname,config.apiKeySecret,config.product);
         var promise = client.search(searchParameters);
	 response.tell(promise);

	/*var clickSearch = function () {
                var searchParameters = {
                        "numberOfResults": 10,
                        "filterByPrecedence": 1,
                        "clientApp": "App",
                        "clientAppVersion": "1.0",
                        "siteId": "HospitalA",
                        "userId": "UserA",
                        "searchTerm": value
                        }
                var client = new IMO.PortalWebClient(config.hostname,config.apiKeySecret,config.product);
                var promise = client.search(searchParameters);
                promise
                        .done(responseHandler(promise))
                return promise;
	}

	console.log(promise.key); */

	response.tell('You will probably die' + intent.slots.symptom.value);
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


