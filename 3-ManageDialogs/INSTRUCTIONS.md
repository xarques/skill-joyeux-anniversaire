## Model

- Creation d'une intention _RegisterBirthdayIntent_
- On ajoute des uttérances:
  - ma date de naissance est le {day} {month} {year}
  - enregistre ma date de naissance
  - enregistre ma date d'anniversaire
  - enregistre mon anniversaire
  - le {day} {month} de l'année {year}
  - le {day} du mois de {month}
  - {day} {month}
  - le {day} {month} {year}
  - ma date de naissance est le {day} {month} {year}
- On crée les 3 slots
  - _day_ et _year_ de type AMAZON.NUMBER
  - _month_ de type custom _MonthSlotType_
    - On saisit les 12 mois de l'année sous forme de caractère et le numéro de mois associé
  - les slots sont ordonnés, on va pouvoir les utiliser dans un dialog
- On rend les 3 slots obligatoires et on précise les phrases qu'Alexa va prononcer pour chaque slot
- On ajoute des validations sur chaque slot
- Quand on a tout configuré, on peut activer le **Intent Confirmation**
- On utilise ensuite le profiler d'utterance pour tester le modèle

## Backend

- On enrichit le dictionnaire de traductions
- On ajoute l'instruction _addDelegateDirective_ dans _LaunchRequestIntent_ pour déléguer à l'intent _RegisterBirthdayIntent_
- Au sein de l'intent _RegisterBirthdayIntent_, on teste le confirmationStatus qui a été positionné à la fin du multi-turn dialog suite à la réponse de l'utilisateur
