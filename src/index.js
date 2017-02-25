'use strict'

var APP_ID = 'amzn1.ask.skill.3b8ded99-c4c3-43a3-ad0e-2d9d86484dc4';
var Alexa = require('./AlexaSkill');
var OUTPUT = "Welcome to symptom checker. Please list your symptoms.";

var ResponseService = function(){
	Alexa.call(this, APP_ID);
};

ResponseService.prototype = Object.create(Alexa.prototype);

var responseFunction = function(intent, session, response){
	response.tell(OUTPUT);
}

var diagnosisFunction = function(intent, session, response){
	response.tell('You will probably die' + intent.slots.symptom.value);
}

var helpFunction = function(intent,session,response){
	response.tell('Just tell me your symptoms and I will find a diagnosis for you.')
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
