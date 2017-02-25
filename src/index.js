'use strict'

var http = require('http');

var APP_ID = 'amzn1.ask.skill.3b8ded99-c4c3-43a3-ad0e-2d9d86484dc4';

var IMO = require('./IMO');

var Alexa = require('./AlexaSkill');

var OUTPUT = "Welcome to symptom checker. Please list your symptoms.";

/*var config = {
                hostname : "http://184.73.124.73:80/PortalWebService",
                apiKeySecret: "YzQwNWViZTMxNDQwNGNlNWJlZjEzMmU2MWU5YzMxZGQ6N0Q4MjJBRjUxMERCMzZERDlGQzQ5NTVENDRBMDUyMjkwNzMxNjFFODU2OUI5QUUwRjFERjk1Q0ZGOTI2NjMyRQ==",
                product: "ProblemIT_Professional/search"
}*/

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

  exports.handler = (event, context, callback) => {
    var postData = {
        searchTerm: "diabetes type 2",
        numberOfResults: 5,
        clientApp: "SymptomChecker",
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
            callback(null, body);
        }
    })
};
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
