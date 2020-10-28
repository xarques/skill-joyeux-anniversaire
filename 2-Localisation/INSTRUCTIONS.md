## Model

- Dans l'onglet Build, Language Settings -> Add new Language French (FR)
- On copie le JSON anglais dans la partie française
- On traduit les utterances

## Backend

- Ajouter i18next dans package.json
- Importer i18next
- Créer un objet contenant les clés/valeurs du dictionnaire pour chaque langue
- Ajouter un intercepteur de requête (_RequestInterceptor_) qui sera appelé avant l'appel des handlers
  - Il contient uniquement une méthode process
  - On ajoute une méthode _t_ qu'on utilisera dans les handlers
- Ajouter l'intercepteur avec la méthode _addRequestInterceptors_
- Changer les textes en durs par _handlerInput.t('MSG_KEY')_
- Déployer
- Tester en français
