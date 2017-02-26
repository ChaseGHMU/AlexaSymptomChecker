'use strict';

//This app_id is given to you while setting up your lambda on AWS
var APP_ID = 'amzn1.ask.skill.6a08a1ad-ca92-4cf6-8b33-eb63a7e3cc6a';
//outside files required to get Alexa and the API request to respond
var request = require('request');
var Alexa = require('./AlexaSkill');

var OUTPUT = "Welcome to symptom checker. Please list your symptoms.";

var ResponseService = function(){
	Alexa.call(this, APP_ID);
};
//create an Alexa object
ResponseService.prototype = Object.create(Alexa.prototype);

//function for alexa to greet you when first entering the app
var responseFunction = function(intent, session, response){
	response.tell(OUTPUT);
  console.log(response);
  console.log(intent);
  console.log(session);
};

//this function is called when asking for symptoms
//it connects to the IMO api and returns information on symptoms
var diagnosisFunction = function(intent, session, response){

  var postData = {
       searchTerm: intent.slots.symptom.value,
       numberOfResults: 5,
       clientApp: "TestApp",
       clientAppVersion:  "0.0.1",
       siteId: "site",
       userId: "user"
   };
   var url = 'http://184.73.124.73/PortalWebService/api/v2/product/problemIT_Professional/search';
   var options = {
       method: 'post',
       body: postData,
       json: true,
       url: url,
       headers: {
           'Authorization': 'Basic YzQwNWViZTMxNDQwNGNlNWJlZjEzMmU2MWU5YzMxZGQ6N0Q4MjJBRjUxMERCMzZERDlGQzQ5NTVENDRBMDUyMjkwNzMxNjFFODU2OUI5QUUwRjFERjk1Q0ZGOTI2NjMyRQ=='
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

//export handler to initalize the intents
exports.handler = function(event,context){
  var responseService = new ResponseService();
  responseService.execute(event,context);
};

//function thats called when user is confused on what to do
var helpFunction = function(intent,session,response){
	response.tell('Just tell me your symptoms and I will find a diagnosis for you.');
};

//this line of code makes sure the first thing done when entering the application
//is to call the response function
ResponseService.prototype.eventHandlers.onLaunch = responseFunction;

//function called so index know what functions go with what intents
ResponseService.prototype.intentHandlers = {
	'GetDiagnosisIntent' : diagnosisFunction,
	'HelpIntent' : helpFunction
};
