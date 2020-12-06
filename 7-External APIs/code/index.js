/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const moment = require('moment-timezone');

const util = require('./util');
const interceptors = require('./interceptors');
const logic = require('./logic');
const constants = require('./constants');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
   handle(handlerInput) {
        const {t, attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        const day = sessionAttributes['day']
        const monthName = sessionAttributes['monthName']
        const year = sessionAttributes['year']
        const sessionCounter = sessionAttributes['sessionCounter']
        
        const dateAvailable = day && monthName && year;
        if (dateAvailable) {
            // we can't use intent chaning because target intent is not dialog based
            return SayBirthdayIntentHandler.handle(handlerInput)
        }
        let speechText = !sessionCounter ? t('WELCOME_MSG') : t('WELCOME_BACK_MSG');
        speechText += t('MISSING_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            // we use intent chainng to trigger the birthday registration multi-turn
            .addDelegateDirective({
                name: 'RegisterBirthdayIntent',
                confirmationStatus: 'NONE',
                slots:{}
            })
            .getResponse();
    }
};

const RegisterBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterBirthdayIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope, responseBuilder, attributesManager, t} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        if (intent.confirmationStatus === 'CONFIRMED') {
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            const year = Alexa.getSlotValue(requestEnvelope, 'year');
            // we get the slot instead of the value directly as we also want to fetch the id
            const monthSlot = Alexa.getSlot(requestEnvelope, 'month');
            const monthName = monthSlot.value;
            const month = monthSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id
            
            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month;
            sessionAttributes['monthName'] = monthName;
            sessionAttributes['year'] = year
            // we can't use intent chaning because target intent is not dialog based
            return SayBirthdayIntentHandler.handle(handlerInput)
        } 
        return responseBuilder
            .speak(t('REJECTED_MSG'))
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
    }
};

const SayBirthdayIntentHandler = {
    canHandle({requestEnvelope}) {
        return Alexa.getRequestType(requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(requestEnvelope) === 'SayBirthdayIntent';
    },
    async handle(handlerInput) {
        const {t, responseBuilder, attributesManager} = handlerInput
        const sessionAttributes = attributesManager.getSessionAttributes();
        const day = sessionAttributes['day'];
        const month = sessionAttributes['month'];
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'];
        const timezone = sessionAttributes['timezone'];
        
        let speechText = '';
        const dateAvailable = day && month && year;

        if (dateAvailable) {
            if (!timezone) {
                // timezone = 'Europe/Paris'; // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                return responseBuilder.speak(t('NO_TIMEZONE_MSG')).getResponse();
            }
            const birthdayData = logic.getBirthdayData(day, month, year, timezone);
            sessionAttributes['age'] = birthdayData.age;
            sessionAttributes['daysLeft'] = birthdayData.daysUntilBirthday;
            speechText += t('DAYS_LEFT_MSG', {name, count: birthdayData.daysUntilBirthday});
            speechText += t('WILL_TURN_MSG', {count: birthdayData.age + 1});
            const isBirthday = birthdayData.daysUntilBirthday === 0;
            if (isBirthday) {
                speechText = t('GREAT_MSG', {name});
                speechText += t('NOW_TURN_MSG', {count: birthdayData.age + 1});
                const adjustedDate = logic.getAdjustedDate(timezone);
                // we'll now fetch celebrity birthdays from an external API
                const response = await logic.fetchBirthdays(adjustedDate.day, adjustedDate.month, constants.MAX_BIRTHDAYS);
                const speechResponse = logic.convertBirthdaysResponse(handlerInput, response, false, timezone);
                speechText += speechResponse;
            }
            speechText += t('POST_SAY_HELP_MSG');
        } else {
            speechText += t('MISSING_MSG');
            // we use intent chainng to trigger the birthday registration multi-turn
            responseBuilder.addDelegateDirective({
                name: 'RegisterBirthdayIntent',
                confirmationStatus: 'NONE',
                slots:{}
            })
        }
        return responseBuilder
            .speak(speechText)
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
    }
}

const RemindBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemindBirthdayIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope, responseBuilder, t} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        const day = sessionAttributes['day'];
        const month = sessionAttributes['month'];
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'];
        let timezone = sessionAttributes['timezone'];
        const message = Alexa.getSlotValue(requestEnvelope, 'message');
        
        if (intent.confirmationStatus !== 'CONFIRMED') {
            return responseBuilder
                .speak(t('CANCEL_MSG') + t('REPROMPT_MSG'))
                .reprompt(t('REPROMPT_MSG'))
                .getResponse();
        }
        
        let speechText = '';
        const dateAvailable = day && month && year;
        if (dateAvailable) {
            if (!timezone) {
                // timezone = 'Europe/Paris'; // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                return responseBuilder.speechText(t('NO_TIMEZONE_MSG')).getResponse();
            }
            
            const birthdayData = logic.getBirthdayData(day, month, year, timezone);
            
            // let's create a reminder via the Reminder API
            // don't forget to enable this permission in your skill configuration (Build tab -> Options -> Permissions)
            // or you'll get a SessionEndedRequest with an ERROR of type INVALID_RESPONSE
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if (!(permissions && permissions.consentToken)) {
                    throw {status: 401, message: 'No permission available'};
                }
                const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
                // reminders are retained for 3 days after they remind the customer before being deleted 
                const remindersList = await reminderServiceClient.getReminders();
                console.log('Current reminders: ', JSON.stringify(remindersList));
                // delete previous reminder if present
                const previousReminder = sessionAttributes['reminderId'];
                if (previousReminder) {
                    try {
                        if (remindersList.totalCount !== 0) {
                            await reminderServiceClient.deleteReminder(previousReminder);
                            delete sessionAttributes['reminderId'];
                            console.log('Deleted previous reminder token:', previousReminder);
                        }
                    } catch (error) {
                        // fails silently as it means the reminder does not exist or there was a problem with deletion
                        // either way, we can move on and create the new reminder
                        console.log('Failed to delete reminder' + previousReminder + ' via ' + JSON.stringify(error));
                    }
                }
                // create reminder structure
                const reminder = logic.createBirthdayReminder(
                    birthdayData.daysUntilBirthday, 
                    timezone, 
                    Alexa.getLocale(requestEnvelope),
                    message);
                const reminderResponse = await reminderServiceClient.createReminder(reminder); // the response will include an "alertToken" which you can use to refer to this reminder
                // save reminder id in session attributes
                sessionAttributes['reminderId'] = reminderResponse.alertToken;
                console.log('Reminder created with token: ', reminderResponse.alertToken);
                speechText = t('REMINDER_CREATED_MSG', {name});
                speechText += t('POST_REMINDER_HELP_MSG');
            } catch (error) {
                console.log(JSON.stringify(error));
                switch (error.statusCode) {
                    case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                        responseBuilder.withAskForPermissionsConsentCard(constants.REMINDERS_PERMISSION);
                        speechText = t('MISSING_PERMISSION_MSG');
                        break;
                    case 403: // devices suxh as the simulator do not support reminder management
                        speechText = t('UNSUPPORTED_DEVICE_MSG');
                        break;
                    default: 
                        speechText = t('REMINDER_ERROR_MSG');
                }
                speechText += t('REPROMPT_MSG');
            }
        } else {
            speechText += t('MISSING_MSG');
            // we use intent chaining to trigger the birthday registration multi-turn
            responseBuilder.addDelegateDirective({name: 'RegisterBirthdayIntent', confirmationStatus: 'NONE', slots:{}});
        }
        return responseBuilder
            .speak(speechText)
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
    }
}

const CelebrityBirthdaysHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CelebrityBirthdaysIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, requestEnvelope, responseBuilder, t} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const name = sessionAttributes['name'];
        const timezone = sessionAttributes['timezone'];
        if (!timezone) {
            // timezone = 'Europe/Paris'; // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
            return responseBuilder.speechText(t('NO_TIMEZONE_MSG')).getResponse();
        }
        try {
            // Call the progressive response serviceClientFactory
            await util.callDirectiveService(handlerInput, t('PROGRESSIVE_MSG'), {name});
        } catch (error) {
            // If it fails, we can continue, but the user will wait without progressive response
            console.log('Progressive response directive error :', error);
        }
        const adjustedDate = logic.getAdjustedDate(timezone);
        // we'll now fetch celebrity birthdays from external API
        const response = await logic.fetchBirthdays(adjustedDate.day, adjustedDate.month, constants.MAX_BIRTHDAYS);
        console.log(JSON.stringify(response));
        // below we convert the API response to text that Alexa can read
        const speechResponse = logic.convertBirthdaysResponse(handlerInput, response, true, timezone);
        const speechText = (speechResponse || t('API_ERROR_MSG')) + t('POST_CELEBRITIES_HELP_MSG');
        return responseBuilder
            .speak(speechText)
            .reprompt(t('REPROMPT_MSG'))
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const {t, attributesManager} = handlerInput
        const sessionAttributes = attributesManager.getSessionAttributes();
        const name = sessionAttributes['name']

        const speakOutput = t('GOODBYE_MSG', {name});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterBirthdayIntentHandler,
        SayBirthdayIntentHandler,
        RemindBirthdayIntentHandler,
        CelebrityBirthdaysHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LoadNameRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(util.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();