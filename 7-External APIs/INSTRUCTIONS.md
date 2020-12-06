On va utiliser l'API WikiData pour récupérer les dates anniversaires de célébrités

## Model

- Creation d'une intention _CelebrityBirthdaysIntent_
- On ajoute des uttérances:
  - me dire qui est né ce jour
  - qui est né aujourd'hui
  - trouve moi des célébrités nées aujourd'hui
  - quelles sont les célébrités nées aujourd'hui
  - me dire qui est né aujourd'hui
  - c'est l'anniversaire de qui aujourd'hui

## Backend

- On ajoute un nouveau handler _CelebrityBirthdaysHandler_
  On utilise le service Progressive Response API qui va permettre de faire patienter l'utilisateur en attendant la réponse de l'API externe
- On ajoute la méthode _callDirectiveService_ dans util.js
  On récupère _serviceClientFactory.getDirectiveServiceClient()_ pour utiliser le service Progressive Response API
