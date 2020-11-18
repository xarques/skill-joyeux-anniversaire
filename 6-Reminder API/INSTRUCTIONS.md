## Model

- Aller dans l'onglet _Build_ et accéder au menu _Tools -> Permissions_ en bas à gauche
- On utilise la Reminders API pour créer des rappels:

  - Autoriser **Reminders API**

- Creation d'une intention _RemindBirthdayIntent_
- On ajoute des uttérances:

  - "crée un rappel",
  - "mets un rappel pour mon anniversaire",
  - "rappelle-moi mon anniversaire avec le texte suivant {message}",
  - "rappelle-moi mon anniversaire avec le message suivant {message}",
  - "créer un rappel",
  - "créer un rappel avec le {message}",
  - "créer un rappel avec le texte suivant {message}",
  - "créer un rappel avec le message suivant {message}",
  - "créer un rappel avec le message {message}"

- On crée 1 slot
  - _message_ de type AMAZON.SearchQuery pour enregistrer une suite de mots sans que ces mots soient analysés par Alexa. Il faut que ce slot soit précédé d'autres mots (ce qui est le cas dans les uttérances ci-dessus)
- On rend ce slot obligatoire et on précise les phrases qu'Alexa va prononcer:
  - Quel message dois-je vous rappeler pour votre anniversaire ?
  - Quel message dois-je vous lire pour votre anniversaire ?
  - Dites-moi le message à vous rappeler pour votre anniversaire ?
  - Quand on a tout configuré, on peut activer le **Intent Confirmation**
  - Le message {message} vous sera envoyé pour votre anniversaire. Etes-vous d'accord ?"
  - Je vous enverrai le message suivant pour votre anniversaire. {message} . Etes-vous d'accord ?"
- On peut utiliser ensuite le profiler d'utterance pour tester le modèle

## Backend

- On déplace les constantes _PERSISTENT_ATTRIBUTES_NAMES_ et _GIVEN_NAME_PERMISSION_ du fichier interceptors.js vers une nouveau fichier constants.js et on y ajoute la constante _REMINDERS_PERMISSION_
- On crée un fichier logic.js qui va contenir la logique de calcul de la date du prochain anniversaire et la méthode pour poser un reminder
- On ajoute dans util.js la payload de création d'un reminder conformément à l'API proposé par Alexa SDK
- Lancer la skill. Un message indique qu'ALexa n'a pas accès à la création de rappels
- Se rendre sur https://alexa.amazon.fr/ et autoriser Alexa à poser des reminders
- Relancer la skill: Un nouveau message indique que le simulateur ne supporte pas les rappels
