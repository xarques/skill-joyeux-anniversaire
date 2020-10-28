/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const moment = require('moment-timezone')
const i18n = require('i18next');

const languageStrings = require('./localisation')

const getPersistenceAdapter = (tableName) => {
    const isAlexaHosted = () => process.env.S3_PERSISTENCE_BUCKET;
    if (isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({bucketName: process.env.S3_PERSISTENCE_BUCKET})
    }
    const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
    return new DynamoDbPersistenceAdapter({tableName, createTable: true})
}

const persistenceAdapter = getPersistenceAdapter();

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
    handle(handlerInput) {
        const {t, responseBuilder, attributesManager} = handlerInput
        const sessionAttributes = attributesManager.getSessionAttributes();
        const day = sessionAttributes['day']
        const month = sessionAttributes['month']
        const year = sessionAttributes['year']
        
        let speechText = '';
        const dateAvailable = day && month && year;

        if (dateAvailable) {
            const timezone = 'Europe/Paris';
            const today = moment().tz(timezone).startOf('day');
            const wasBorn = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
            const nextBirthday = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');

            if (today.isAfter(nextBirthday)) {
                nextBirthday.add(1, 'years');
            }
            const age = today.diff(wasBorn, 'years');
            const daysUntilBirthday = nextBirthday.startOf('day').diff(today, 'days');
            speechText = t('DAYS_LEFT_MSG', {count: daysUntilBirthday});
            speechText += t('WILL_TURN_MSG', {count: age + 1});

            if (daysUntilBirthday === 0) {
                speechText = t('GREAT_MSG', {count: age});
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
        const speakOutput = handlerInput.t('GOODBYE_MSG');

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

// This request interceptor will bind a translation function 't' to the handlerInput.
const LocalisationRequestInterceptor = {
  process(handlerInput) {
      i18n.init({
          // lng: handlerInput.requestEnvelope.request.locale,
          lng: Alexa.getLocale(handlerInput.requestEnvelope),
          resources: languageStrings
      }).then((t) => {
          handlerInput.t = (...args) => t(...args);
      });
  }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        if (Alexa.isNewSession(requestEnvelope)) {
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ', JSON.stringify(persistentAttributes));
            attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
}

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        if (!response) return;
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true: response.shouldEndSession);
        if (shouldEndSession || Alexa.getRequestType(requestEnvelope) === "SessionEndedRequest") {
            sessionAttributes['sessionCounter'] = sessionAttributes['sessionCounter'] ? sessionAttributes['sessionCounter'] + 1: 1;
            console.log('Saving to persistent storage: ', JSON.stringify(sessionAttributes));
            attributesManager.setPersistentAttributes(sessionAttributes)
            await attributesManager.savePersistentAttributes();
        }
    }
}
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
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor,
        LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor,
        SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    // .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();