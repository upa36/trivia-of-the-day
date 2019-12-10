const alexa = require('ask-sdk-core')
const Builder = alexa.SkillBuilders.custom()
const axios = require('axios')

async function getQuestion() {
    const response = await axios.get('https://opentdb.com/api.php?amount=20&category=17')
    return response.data.Question
}

const CancelAndStopIntentsHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    },

    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Bye!')
            .withShouldEndSession(true)
            .getResponse()
    },
}
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("I am not sure what you were looking for. Do you want a trivia question?")
            .reprompt("Would you like a trivia question?")
            .withShouldEndSession(false)
            .getResponse()
    }
}
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Trivia of the day is a general knowledge quiz. You can say 'What is the trivia of the day' to get some of that knowledge.")
            .reprompt("Trivia of the day is a general knowledge quiz. You can say 'What is the trivia of the day' to get some of that knowledge.")
            .withShouldEndSession(false)
            .getResponse()
    },
}
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Welcome, to the tivia of day! Would you like to try a trivia?')
            .reprompt('Would you like a question from general knowledge?')
            .withShouldEndSession(false)
            .getResponse()
    },
}
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Alright! Have a great day.')
            .withShouldEndSession(true)
            .getResponse()
    },
}
const NoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
    },
    handle(handlerInput) {
        const speechText = 'One is enough for your brain!'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse()
    },
}
const YesIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    },
    async handle(handlerInput) {
        const Question = await getQuestion()

        return handlerInput.responseBuilder
            .speak(`Here is your trivia: <break strength='strong' />${Question}<break strength='strong' /> Would you like another one?`)
            .reprompt('Would you like one more trivia of the day?')
            .withShouldEndSession(false)
            .getResponse()
    },
}

const QuestionIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QuestionIntent'
    },

    async handle(handlerInput) {
        const quiz = await getQuestionOfTheDay()

        return handlerInput.responseBuilder
            .speak(`Here is your trivia: <break strength='strong' />${quiz}<break strength='strong' /> Would you like another one?`)
            .reprompt('Would you like to try a different one?')
            .withShouldEndSession(false)
            .getResponse()
    },
}
const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("I didn't catch that. Can you repeat it?")
            .reprompt("I didn't catch that. Can you repeat it?")
            .withShouldEndSession(false)
            .getResponse()
    },
}


exports.handler = Builder
    .addRequestHandlers(
        CancelAndStopIntentsHandler,
        FallbackIntentHandler,
        HelpIntentHandler,
        LaunchRequestHandler,
        NoIntentHandler,
        QuestionIntentHandler,
        YesIntent,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda()