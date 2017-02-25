var Alexa = require('alexa-sdk');

//creates an Alexa object
exports.handler = function(event, context, callback){
	var alexa = Alexa.handler(event, context);
}

//
var handlers = {

    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    }

};
