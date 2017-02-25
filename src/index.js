var Alexa = require('alexa-sdk');

//creates an Alexa object
exports.handler = function(event, context, callback){
	var alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();
}

//
var handlers = {

    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    }

};
