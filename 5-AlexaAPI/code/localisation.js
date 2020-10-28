module.exports = {
    en: {
        translation: {
            WELCOME_MSG: 'Welcome to Happy Birthday. Let\'s have some fun with your birthday ?',
            REGISTER_MSG: 'Your birthday is {{month}} {{day}} {{year}}.',
            REJECTED_MSG: 'OK. Give me another birthday date',
            HELP_MSG: 'You can say Hello to me ! How can I help ?',
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            GOODBYE_MSG: 'Goodbye !',
            FALLBACK_MSG: 'Sorry, I don\t know about that. Please try again',
            ERROR_MSG: 'Sorry, there was an error. Please try again'
        }
    },
    fr: {
        translation: {
            POSITIVE_SOUND:"<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>",
            GREETING_SPEECHCON: "<say-as interpret-as='interjection'>Cocorico</say-as>",
            DOUBT_SPEECHCON: "<say-as interpret-as='interjection'>Hmmm</say-as>",
            WELCOME_MSG: "Bienvenue sur la skill des anniversaires !",
            WELCOME_BACK_MSG: "Content de vous revoir !",
            REJECTED_MSG: "D'accord. Je ne vais pas prendre en compte cette date. Donnez-moi une autre date pour que je puisse l'enregistrer",
            DAYS_LEFT_MSG: "Il vous reste {{count}} jour ",
            DAYS_LEFT_MSG_plural: "Il vous reste {{count}} jours ",
            WILL_TURN_MSG: "avant d'avoir {{count}} an. ",
            WILL_TURN_MSG_plural: "avant d'avoir {{count}} ans. ",
            GREAT_MSG: "$t(POSITIVE_SOUND) $t(GREETING_SPEECHCON) {{name}}",
            NOW_TURN_MSG: "Vous avez {{count}} an aujourd'hui",
            NOW_TURN_MSG_plural: "Vous avez maintenant {{count}} ans aujourd'hui",
            MISSING_MSG: "Il me semble que vous ne m'avez pas encore dit votre date d'anniversaire",
            POST_SAY_HELP_MSG: "Si vous souhaitez changer votre date d'anniversaire, dites simplement 'enregistre mon anniversaire' ou bien dites moi directement votre date de naissance",
            HELP_MSG: "Je peux me souvenir de votre date de naissance. Dites-moi votre jour, mois et année de naissance ou bien dites moi simplement \"enregistre mon anniversaire\"",
            REPROMPT_MSG: "Pour obtenir plus d'informations sur ce que je peux faire pour vous, demandez moi de l'aide. Si vous voulez quitter la skill, dites simplement 'stop'",
            REGISTER_MSG: 'Votre date d\'anniversaire est le {{day}} {{month}} {{year}}.',
            GOODBYE_MSG: 'Au revoir !',
            REFLECTOR_MSG: "Vous avez invoqué l'intention {{intent}}",
            FALLBACK_MSG: 'Désolé, je ne sais pas. Pouvez vous reformuler ?',
            ERROR_MSG: 'Désolé, je n\'ai pas compris. Pouvez vous reformuler ?',
            NO_TIMEZONE_MSG: "Je n'ai pas réussi à déterminer votre fuseau horaire. Veuillez vérifier les paramètres de votre appareil et réessayez"
        }
    },
    "fr-CA": {
        translation: {
            WELCOME_MSG: "Bienvenue sur la skill des fêtes !",
        }
    }
}