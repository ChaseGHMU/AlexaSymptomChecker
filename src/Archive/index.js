'use strict'

var APP_ID = 'amzn1.ask.skill.36b93194-b1d4-4479-91c0-37e909e2ecca';
var Alexa = require('./AlexaSkill');
var OUTPUT = "You will probably die";

var ResponseService = function(){
	Alexa.call(this, APP_ID);
};

ResponseService.prototype = Object.create(Alexa.prototype);

var responseFunction = function(intent, session, response){
	response.tell(OUTPUT);
}

ResponseService.prototype.eventHandlers.onLaunch = responseFunction;

ResponseService.prototype.intentHandlers = {

	'GetDiagnosisIntent' : responseFunction
};

exports.handler = function(event, context){
	var responseService = new ResponseService();
	responseService.execute(event,context);
}