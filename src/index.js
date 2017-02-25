'use strict'

var APP_ID = undefined;
var Alexa = require('./alexa-sdk');

//creates an Alexa object
exports.handler = function(event, context, callback){
	var alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();
}

//
var handlers = {

	'OpenSymptomCheckerIntent': function(){
		this.emit(':tell', 'Welcome to symptom checker. please list your symptoms.')
	},

    'GetDiagnonisIntent': function() {
        this.emit(':tell', 'You are gonna die');
    }

};
/*
var states = {

	SYMPTOMMODE: '_SYMPTOMMODE';,

};

var symptomModeHandler = Alexa.CreateStateHandler(states.SYMPTOMMODE, {

	'SymptomSession': function(){
		this.handler.state = '';
		this.emitWithState('New Session');
	},

	'SymptomIntent': function(){
		var guestSaid = this.event.
	}
}
*/
