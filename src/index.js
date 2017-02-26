'use strict'

var request = require('request');

var APP_ID = 'amzn1.ask.skill.3b8ded99-c4c3-43a3-ad0e-2d9d86484dc4';

var IMO = require('./IMO');
var Alexa = require('./AlexaSkill');

var OUTPUT = "Welcome to symptom checker. Please list your symptoms.";

/*var config = {
                hostname : "http://184.73.124.73:80/PortalWebService",
                apiKeySecret: "YzQwNWViZTMxNDQwNGNlNWJlZjEzMmU2MWU5YzMxZGQ6N0Q4MjJBRjUxMERCMzZERDlGQzQ5NTVENDRBMDUyMjkwNzMxNjFFODU2OUI5QUUwRjFERjk1Q0ZGOTI2NjMyRQ==",
                product: "ProblemIT_Professional/search"
}*/
exports.handler = function(event,context){
  var responseService = new ResponseService();
  responseService.execute(event,context);
};

var ResponseService = function(){
	Alexa.call(this, APP_ID);
}

ResponseService.prototype = Object.create(Alexa.prototype);

var responseFunction = function(intent, session, response){
	response.tell(OUTPUT);
}

var diagnosisFunction = function(intent, session, response){
	console.log(intent);
	console.log(intent.slots.system.value);

}

exports.handler = (event, context, callback) => {
    var postData = {
        searchTerm: "diabetes type 2",
        numberOfResults: 5,
        clientApp: "TestApp",
        clientAppVersion:  "0.0.1",
        siteId: "site",
        userId: "user"
    }
    var url = 'http://184.73.124.73/PortalWebService/api/v2/product/problemIT_Professional/search'
    var options = {
        method: 'post',
        body: postData,
        json: true,
        url: url,
        headers: {
            'Authorization': 'Basic YzQwNWViZTMxNDQwNGNlNWJlZjEzMmU2MWU5YzMxZGQ6N0Q4MjJBRjUxMERCMzZERDlGQzQ5NTVENDRBMDUyMjkwNzMxNjFFODU2OUI5QUUwRjFERjk1Q0ZGOTI2NjMyRQ=='
        }
    }
    request(options, function (err, res, body) {
        if (err) {
            console.log('error posting json', err)
            callback(err);
        } else {
            var headers = res.headers
            var statusCode = res.statusCode
            console.log('headers', headers)
            console.log('statusCode', statusCode)
            console.log('body', body)
            callback(null, body.SearchTermResponse.items[0].title);
        }
    })
};

var helpFunction = function(intent,session,response){
	response.tell('Just tell me your symptoms and I will find a diagnosis for you.');
}

var newPatientFunction = function(intent,session,response) {

    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.dynamoDBTableName = 'PatientTable';
    alexa.registerHandlers(State1Handlers, State2Handlers);
    alexa.execute();
	
	var State1Handlers = Alexa.CreateStateHandler( {

    	'NewPatientIntent': function() {
        	this.attributes[patientId] = intent.slots.patientId.value;
        	this.emit(':ask',"Patient record created. What is their name?");
	}

	'PatientNameIntent': function() {
		this.attributes[patientName] = intent.slots.patientName.value;
		this.emit(':ask',"What is the patient\'s gender?");
	}

	'GenderIntent' : function() {
		this.attributes[gender] = intent.slots.patientName.value;
		this.emit(':ask',"What is the patient\'s height?");
	}

	'HeightIntent' : function() {
		this.attributes[height] = intent.slots.height.value;
		this.emit(':ask',"What is the patient\'s weight?");
	}

	'WeightIntent' : function() {
		this.attributes[weight] = intent.slots.weight.value;
		this.emit(':ask',"what is the patient\'s symptom?"); 
	}

	'DiagnoseIntent' : function() {
		this.attributes[symptom] = intent.slots.weight.value;
		this.emit(':tell',"Thank you. Patient record is finished.");
	}
	
	'OldPatientIntent' : function() {
		this.emit(':tell',"Patient" + this.attributes[patientId] + "also known as " +
			this.attributes[patientName] + "is a " + this.attributes[gender] + 
			"with a height of " + this.attributes[height] + "and a width of " +
			this.attributes[width] + ". Their symptom was " + this.attributes[symptom]);		


	}

    	'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Please try again.');
   	}

});



ResponseService.prototype.eventHandlers.onLaunch = responseFunction;

ResponseService.prototype.intentHandlers = {
	'GetDiagnosisIntent' : diagnosisFunction,
	'HelpIntent' : helpFunction,
	'NewPatientIntent' : newPatientFunction
};
