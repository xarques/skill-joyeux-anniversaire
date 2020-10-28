## Model

- Ajout de l'intention _SayBirthdayIntent_

## Backend

- Déplacement des traductions dans un fichier localisation.js
- Ajout de la librairie _moment-timezone_
- Ajout de _PersistenceAdapter_ pour sauvegarder les informations de la skill soit dans S3 (mode hosted), soit dans DynamoDB (mode non hosted). Dans notre cas, on utilise S3 et on récupère le nom du bucket S3 dans _process.env.S3_PERSISTENCE_BUCKET_. Ce bucket est accessible de depuis l'onglet Code (lien en bas à gauche de l'éditeur)
- Ajout des intercepteurs _LoadAttributesRequestInterceptor_ et _SaveAttributesResponseInterceptor_ pour gérer la lecture et écriture des données persistantes
- Modification de _LaunchRequestHandler_ pour récupérer les informations de session et redirection vers _SayBirthdayIntentHandler_ si une date d'anniversaire existe déja. Sinon, on délègue à _RegisterBirthdayIntentHandler_
- Modification de _RegisterBirthdayIntentHandler_ pour enregistrer la date d'anniversaire dans l'objet de session puis rediriger vers _SayBirthdayIntentHandler_
- Ajout de _SayBirthdayIntentHandler_ pour souhaiter un bon anniversaire à la personne si c'est son jour de naissance ou lui indiquer dans combien de jours est son anniversaire

  Pour supprimer les données persistantes, il faut ouvrir le service S3 accessible depuis l'onglet Code (lien en bas à gauche de l'éditeur) et supprimer le bucket dont le nom commence par **amzn1.ask.account**
