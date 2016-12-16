/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.ask.skill.7d7f59a2-8369-431c-b6b9-c36812730417';

/**Date
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var http = require('http');
var SALAH_API_KEY = "9834787bac50f07048cf947e05092678";
var SALAH_API = "http://muslimsalat.com/";

var SalahTimings = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SalahTimings.prototype = Object.create(AlexaSkill.prototype);
SalahTimings.prototype.constructor = SalahTimings;

SalahTimings.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("SalahTimings onSessionStarted requestId: " + sessionStartedRequest.requestId+ ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

//needs to be overridden
SalahTimings.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechOutput = "Hello and welcome to Salah Timings. I am here to help you find prayer timings. You can ask for prayer timings for a particular place. Now, what can I help you with?";
	
	var repromptText = "Please ask for the prayer timings";

	response.ask( speechOutput, repromptText );
};

SalahTimings.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("SalahTimings onSessionEnded requestId: " + sessionEndedRequest.requestId+ ", sessionId: " + session.sessionId);
};

SalahTimings.prototype.intentHandlers = {
    // register custom intent handlers
    ByLocation: function (intent, session, response) {
			console.log("In ByLocation" + JSON.stringify(intent));
			prayerDatesByPlace(intent, response);
	},
	SpecificPrayer: function(intent, session, response){ 
		console.log("In SpecificPrayer" + JSON.stringify(intent));
		specificPrayerDetail(intent, response);
	},
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "Hello and welcome to Salah Timings. I am here to help you find prayer timings. You can ask for prayer timings for a particular place. Now, what can I help you with?";
		var repromptText = "Would you like to ask for the prayer timings";
		response.ask( speechOutput, repromptText, false );
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
         var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

// Gets whole prayer details for a particular place
function prayerbyPlace(place, time, callback){
	// 2016-12-05
	console.log("PLACE: "+place +" TIME "+time);
	var url;
	if(time!==null){
	    url = SALAH_API + place +"/"+ time +'.json?key='+SALAH_API_KEY;
	}else{
	    url = SALAH_API + place +'.json?key='+SALAH_API_KEY; 
	}
	
	console.log("URL",url);
	http.get(url,function(res){
		var body = '';
		res.on('data',function(chunk){
			body+=chunk;
		});
		res.on('end',function(){
		    try{
		        var data = JSON.parse(body);
		        callback(body);
		    }catch(err){
		        console.log("Err: "+err);
		        callback(null);
		    }
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		callback(null);
	});
}

// gets prayer timings for a Particular place
function prayerDatesByPlace(intent, response){
	if(intent.slots.Location.value){
				console.log(intent.slots.Location.value+" "+intent.slots.Date.value);
				if(!intent.slots.Date.value){
			    	prayerbyPlace(intent.slots.Location.value, null, function(event){
			    		if(event){
			    			var data = JSON.parse(event);
			    			if(data.items){
			    				var prayerData = data.items[0];
			    				var speechOutput = {
			    		        	type:AlexaSkill.speechOutputType.SSML,
                		        	speech: "<speak>Prayer timings are  <break time='2s'/> "
                			        	+"fajr on <say-as interpret-as='time'>"+prayerData.fajr +"</say-as><break time='1s'/>"
                	    		    	+"shurooq on <say-as interpret-as='time'>"+prayerData.shurooq +"</say-as><break time='1s'/>"
										+"dhuhr on <say-as interpret-as='time'>"+prayerData.dhuhr +"</say-as><break time='1s'/>"
										+"asr on <say-as interpret-as='time'>"+prayerData.asr +"</say-as><break time='1s'/>"
										+"maghrib on <say-as interpret-as='time'>"+prayerData.maghrib +"</say-as><break time='1s'/>"
										+"isha on <say-as interpret-as='time'>"+prayerData.isha +"</say-as><break time='1s'/>"
            	            			+"</speak>"
				   				};
			    				response.tellWithCard(speechOutput,"SalahTimings","");
			    			}else{
			    				response.tellWithCard("Unable to fetch prayer timings for "+ intent.slots.Location.value,"SalahTimings","Please try again");
			    			}
			    		}else{
			    			response.tellWithCard("Sorry, something went wrong","SalahTimings","Please try again");
			    		}
		    		});
				}else{
					isValidDate(intent.slots.Date.value,function(event){
						console.log("ValidDate: "+event);
						if(event){
							prayerbyPlace(intent.slots.Location.value, intent.slots.Date.value, function(event){
								if(event){
									var data = JSON.parse(event);
			        				if(data.items){
			        					var prayerData = data.items[0];
			        					var speechOutput = {
			            					type:AlexaSkill.speechOutputType.SSML,
                        					speech: "<speak>Prayer timings in "+intent.slots.Location.value +" on <say-as interpret-as='date'>"+ intent.slots.Date.value +"</say-as> "+ constructSentance(intent.slots.Date.value, false) +"  <break time='2s'/> "
                        						+"fajr on <say-as interpret-as='time'>"+prayerData.fajr +"</say-as><break time='1s'/>"
                        						+"shurooq on <say-as interpret-as='time'>"+prayerData.shurooq +"</say-as><break time='1s'/>"
												+"dhuhr on <say-as interpret-as='time'>"+prayerData.dhuhr +"</say-as><break time='1s'/>"
												+"asr on <say-as interpret-as='time'>"+prayerData.asr +"</say-as><break time='1s'/>"
												+"maghrib on <say-as interpret-as='time'>"+prayerData.maghrib +"</say-as><break time='1s'/>"
												+"isha on <say-as interpret-as='time'>"+prayerData.isha +"</say-as><break time='1s'/>"
                        						+"</speak>"
			        						};
			        					//ask for last text
			        					response.tellWithCard(speechOutput,"SalahTimings","");
			        				}else{
			        					response.tellWithCard("Unable to fetch prayer timings for "+ intent.slots.Location.value,"SalahTimings","Please try again");
			        				}	
								}else{
									response.tellWithCard("Sorry, something went wrong","SalahTimings","Please try again");
								}
			    			});
						}else{
							//ask for last text
							response.tellWithCard("Please specify a specific date","SalahTimings","Please try again");
						}
					});
				}
			}else{
				response.tellWithCard("Please specify a specific place","SalahTimings","Please try again");
			}	
}

// gets specific prayer timings
function specificPrayerDetail(intent,response){
	if(intent.slots.PrayerLocation.value){
		if(!intent.slots.PrayerTime.value){
			prayerbyPlace(intent.slots.PrayerLocation.value, null, function(event){
				if(event){
					var data = JSON.parse(event);
					if(data.items){
					    var prayerData = data.items[0];
			    	    var prayerType = intent.slots.PrayerName.value;
			    	    var prayerTime = getPrayerTime(prayerType,prayerData);
			    	    var speechOutput = getPrayerTime(prayerType,prayerData);
			  		    if(speechOutput !=="unable to get prayer name"){
			    		    speechOutput = {
							    type:AlexaSkill.speechOutputType.SSML,
							    speech: "<speak>Prayer timing for  <break time='2s'/> "
									+ prayerType +" is <say-as interpret-as='time'>"+prayerTime +"</say-as>"+"</speak>"
			    			};
			    		}
						response.tellWithCard(speechOutput,"SalahTimings","");
					    }else{
					        response.tellWithCard("Unable to fetch prayer time for "+ prayerType +" in "+ intent.slots.PrayerLocation.value,"SalahTimings","Please try again");
					    }
					}else{
						response.tellWithCard("Sorry, something went wrong","SalahTimings","Please try again");
					}
				});
			}else{
				isValidDate(intent.slots.PrayerTime.value,function(event){
					if(event){
						prayerbyPlace(intent.slots.PrayerLocation.value, intent.slots.PrayerTime.value, function(event){
							if(event){
								var data = JSON.parse(event);
								if(data.items){
								    var prayerData = data.items[0];
			    				    var prayerType = intent.slots.PrayerName.value;
			    				    var prayerTime = getPrayerTime(prayerType,prayerData);
			    				    var speechOutput = getPrayerTime(prayerType,prayerData);
			    				    if(speechOutput !=="unable to get prayer name"){
			    					    speechOutput = {
			            				    type:AlexaSkill.speechOutputType.SSML,
                        				    speech: "<speak>Prayer timing for  <break time='2s'/> "
                        				    + prayerType +" in "+intent.slots.PrayerLocation.value + " "+constructSentance(intent.slots.PrayerTime.value, true)+"  <say-as interpret-as='time'>"+prayerTime +"</say-as>"
                        				    +"</speak>"
			    					    };
			    				    }
								    response.tellWithCard(speechOutput,"SalahTimings","");
								    }else{
								        response.tellWithCard("Unable to fetch prayer time for "+ prayerType +" in "+ intent.slots.PrayerLocation.value,"SalahTimings","Please try again");
								    }
							}else{
								response.tellWithCard("Sorry, something went wrong","SalahTimings","Please try again");
							}
						});
					}else{
						response.tellWithCard("Please specify a specific date","SalahTimings","");
					}
				});
			}
		}else{
			response.tellWithCard("Please specify a specific place","SalahTimings","");
		}
}
// matches prayerDate with current date to determine whether date is previous date or next date
function isGreaterDate(prayerDate){
	var todayDate = new Date();
	console.log("Today Date: "+todayDate);
	var todayDate = new Date();
    var matchDate = new Date(prayerDate);

    var tDate = Date.UTC(todayDate.getFullYear(), todayDate.getMonth()+1, todayDate.getDate());
    var spokenDate = Date.UTC(matchDate.getFullYear(), matchDate.getMonth()+1, matchDate.getDate());
    console.log("Today Date: "+tDate +" "+spokenDate);
    if (parseFloat(spokenDate) < parseFloat(tDate))
      return -1;  
    else if (parseFloat(spokenDate) === parseFloat(tDate))
      return 0;  
    else if (parseFloat(spokenDate) > parseFloat(tDate))
      return 1; 
    else
      return null;  // error
}
// returns is for current date, was for previous date and are for next date 
function constructSentance(prayerDate, isFromSpecificPrayer){
	var previousDay = isGreaterDate(prayerDate);
	switch(previousDay){
		case 0:
			return "is";
		break;
		case 1:
			if(isFromSpecificPrayer){
				return "is";
			}else{
				return "are";
			}
		break;
		case -1:
			return "was";
		break;
		default:
			return "";
		}
}

// checks for valid date
function isValidDate(prayerDate, callback){
	// 2016-12-05
	console.log("PrayerDate: "+prayerDate);
	var dateParse = prayerDate.split('-');
	if(typeof dateParse[2] === "undefined"){
		callback(false);
	}else{
		callback(true);
	}
}

//determines prayer time for a specific prayer
function getPrayerTime(prayerType, prayerData){
	var prayerTime;
	switch(prayerType){
	   	case 'fajr':
		    prayerTime = prayerData.fajr;
	    break;
		case 'dhuhr':
			prayerTime = prayerData.dhuhr;
		break;
		case 'shurooq':
			prayerTime = prayerData.shurooq;
		break;
		case 'asr':
			prayerTime = prayerData.asr;
		break;
		case 'maghrib':
			prayerTime = prayerData.maghrib;
		break;
		case 'isha':
			prayerTime = prayerData.isha;
		break;
		default:
			prayerTime ="unable to get prayer name";
		break;
	}
	console.log("PrayerTime: "+prayerTime);
	return prayerTime;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	console.log("handler called");
    // Create an instance of the SalahTimings skill.
    var salah = new SalahTimings();
    salah.execute(event, context);
};
