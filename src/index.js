'use strict'

var APP_ID = 'amzn1.ask.skill.7aae67c9-5555-4e27-954f-ba88b2abfef3';
var Alexa = require('./AlexaSkill');
var OUTPUT = "Welcome to symptom checker. Please list your symptoms.";

var ResponseService = function(){
	Alexa.call(this, APP_ID);
};

ResponseService.prototype = Object.create(Alexa.prototype);

var responseFunction = function(intent, session, response){
	response.tell(OUTPUT);
}

var diagnosisFunction = function(intent,session,response){
	response.tell('You will probably die');
}

ResponseService.prototype.eventHandlers.onLaunch = responseFunction;

ResponseService.prototype.intentHandlers = {

	'GetDiagnosisIntent' : diagnosisFunction;
};

exports.handler = function(event, context){
	var responseService = new ResponseService();
	responseService.execute(event,context);
}