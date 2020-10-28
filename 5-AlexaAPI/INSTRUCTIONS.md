## Model

- Aller dans l'onglet _Build_ et accéder au menu _Permissions_ en bas à gauche
- On utilise la Customer Profile API:
  - Autoriser **Customer Name -> Given Name**

## Backend

- On déplace la méthode getPersistenceAdapter(tableName) dans util.js
- On ajoute des entrées dans le dictionnaire pour la gestion des autorisations et on ajoute également des sons en utilisant SSML
- Pour tester SSML, on peut aller dans _Test_, onglet _Voice & Tone_
