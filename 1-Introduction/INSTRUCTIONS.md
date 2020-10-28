## Model

- Le modèle est stocké dans un fichier JSON. Un fichier par langue
- Une skill est associé à un nom d'invocation
- On peut accéder directement à un cas d'usage de la skill en enchainant:

        Wake word + Launch Phrase + Invocation Name + Uttérance + Slots

- Utterance: Donner des exemples dans les formes impérative, infinitive et conjuguée:

  - enregistre ma date de naissance
  - enregistre ma date d'anniversaire
  - je vourdrais que tu enregistres ma date d'anniversaire
  - enregistrer ma date de naissance

- Slots: Paramètres permettant d'isoler les mots clés de l'uttérance:

  - ma date de naissance est le {day} {month} {year}
  - le {day} {month} de l'année {year}
  - le {day} du mois de {month}
  - {day} {month}
  - le {day} {month} {year}

- Lorsque Alexa a compris ce que demande l'utilisateur, Alexa va envoyer une requête au backend

## Backend

Développement de code intégré dans le service Lambda:

- hébergé soit sur votre compte Alexa développeur (Alexa hosted = gratuit)
- hébergé dans votre compte AWS dans le service Lambda

Structure:

- index.js: Contient l'import du sdk
  - A la fin du fichier, on trouve le point d'entrée de la skill : _Alexa.SKillBuilders_ qui contient des handlers:
    - Un handler contient 2 méthodes:
      - canHandle(handlerInput)
      - handle(handlerInput)
- package.json: Dépendances

Pour tester, sur l'onglet Code:

- Save
- Deploy

## Enchainements de différentes étapes:

1. Automatic speech recognition (ASR) (Model)
1. Natural Language Understanding (NLU) (Model)
1. Envoi d’une requete au format JSON au backend lambda (backend)
1. Traitement de la requete (backend)
1. Envoi d’un réponse écrite au Cloud Alexa qui est transformé en voix: Text To Speech (TTS).Possibilité de modifier la prosodie d’Alexa en ajoutant du Speech Synthesis Markup Language (SSML) (Model)

## Création d'une skill

Depuis https://developer.amazon.com/alexa/console/ask, vous pouvez créer une skill:

Choisissez les options:

- Custom
- Alexa Hosted
- Start from Scratch
