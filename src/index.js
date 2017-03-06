'use strict';

var APP_ID = '';

var request = require('request');
var Alexa = require('./AlexaSkill');

var OUTPUT = "Welcome to symptom checker. Please list your symptoms.";

/*var config = {
                hostname : "http://184.73.124.73:80/PortalWebService",
                apiKeySecret: "YzQwNWViZTMxNDQwNGNlNWJlZjEzMmU2MWU5YzMxZGQ6N0Q4MjJBRjUxMERCMzZERDlGQzQ5NTVENDRBMDUyMjkwNzMxNjFFODU2OUI5QUUwRjFERjk1Q0ZGOTI2NjMyRQ==",
                product: "ProblemIT_Professional/search"
}*/

var ResponseService = function(){
	Alexa.call(this, APP_ID);
};

ResponseService.prototype = Object.create(Alexa.prototype);

var responseFunction = function(intent, session, response){
	response.tell(OUTPUT);
  console.log(response);
  console.log(intent);
  console.log(session);
};

var diagnosisFunction = function(intent, session, response){

  var postData = {
       searchTerm: intent.slots.symptom.value,
       numberOfResults: 5,
       clientApp: "TestApp",
       clientAppVersion:  "0.0.1",
       siteId: "site",
       userId: "user"
   };
   var url = '';
   var options = {
       method: 'post',
       body: postData,
       json: true,
       url: url,
       headers: {
           'Authorization': ''
       }
   };
   request(options, function (err, res, body) {
       if (err) {
           console.log('error posting json', err);
       } else {
           var headers = res.headers;
           var statusCode = res.statusCode;
           console.log('headers', headers);
           console.log('statusCode', statusCode);
           console.log('body', body);
           response.tell('the description of ' + intent.slots.symptom.value + ' is ' + body.SearchTermResponse.items[0].ICD10CM_TITLE);
       }
   });
};

exports.handler = function(event,context){
  var responseService = new ResponseService();
  responseService.execute(event,context);
};

var helpFunction = function(intent,session,response){
	response.tell('Just tell me your symptoms and I will find a diagnosis for you.');
};

ResponseService.prototype.eventHandlers.onLaunch = responseFunction;

ResponseService.prototype.intentHandlers = {
	'GetDiagnosisIntent' : diagnosisFunction,
	'HelpIntent' : helpFunction
};
