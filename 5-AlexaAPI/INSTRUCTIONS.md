## Model

- Aller dans l'onglet _Build_ et accéder au menu _Permissions_ en bas à gauche
- On utilise la Customer Profile API pour accéder au prénom de l'utilisateur:

  - Autoriser **Customer Name -> Given Name**

    Pas besoin de permission spécifique pour accéder au fuseau horaire

## Backend

- On déplace la méthode getPersistenceAdapter(tableName) dans util.js
- On ajoute des entrées dans le dictionnaire pour la gestion des autorisations et on ajoute également des sons en utilisant SSML
- Pour tester SSML, on peut aller dans _Test_, onglet _Voice & Tone_

Exemple:

```xml
  <speak>
    Nous allons entendre le son suivant:
    <say-as interpret-as='interjection'>Cocorico</say-as>
  </speak>
```

- Pour gérer le pluriel dans les traductions, on utilise l'extension \_plural dans le nom des clés du dictionnaire
- On déplace les intercepteurs dans un nouveau fichier interceptors.js.
- On modifie _LocalisationRequestInterceptor_ pour prendre en compte des traductions sous forme de tableau (voir traduction GOODBYE_MSG) et extraire de façon aléatoire une traduction
- On ajoute des intercepteurs pour récupérer les informations des customer API
- Lancer la skill. Votre prénom n'est pas prononcé par Alexa
- Se rendre sur https://alexa.amazon.fr/ et autoriser Alexa à récupérer votre prénom
- Relancer la skill: Votre prénom est bien prononcé
