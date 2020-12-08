Jusqu'à présent, on a utilisé Alexa Hosted et la console Développeur Alexa.

Une autre façon de développer est d'utiliser la ligne de commande en utilisant [Alexa Skills Kit Command Line Interface (ASK CLI)](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-intro.html#deploy-skill)

Attention: Le tutoriel [De zéro à Héros, Partie 10: Utilisez la Ligne de Commande Alexa (ASK CLI)](https://www.youtube.com/watch?v=0V_FulsgZLE&ab_channel=AlexaDevelopers) n'est plus à jour. Il utilise la version 1 de ASK CLI.

## Prérequis

- Un compte développeur Amazon
- Logiciels à installer sur votre ordinateur:
  - Node.js et npm
  - GIT
  - ASK CLI: https:alexa.design/askcli

## Initialisation

- Configuration de ask

```
    ask configure

    This command will configure the ASK CLI with a profile associated with your Amazon developer credentials.
    ------------------------- Step 1 of 2 : ASK CLI Configuration -------------------------
    [Warn]: ASK CLI uses authorization code to fetch LWA tokens. Do not share neither your authorization code nor access tokens.
    Switch to "Login with Amazon" page and sign-in with your Amazon developer credentials.
    If your browser did not open the page, try to run the command again with "--no-browser" option.

    ASK Profile "default" was successfully created. The details are recorded in ask-cli config file (.ask/cli_config) located at your **HOME** folder.
    Vendor ID set as XXXXXXXXX.

    ------------------------- Step 2 of 2 : Associate an AWS Profile with ASK CLI -------------------------
    [Warn]: ASK CLI will create an IAM user and generate corresponding access key id and secret access key. Do not share neither of them.
    ? Do you want to link your AWS account in order to host your Alexa skills? No
    ------------------------- Skipping the AWS profile association -------------------------
    You will only be able to deploy your Alexa skill. To set up AWS credentials later, use the "ask configure" command towards the same profile again.
    ------------------------- Configuration Complete -------------------------
    Here is the summary for the profile setup:
    ASK Profile: default
    AWS Profile: undefined
    Vendor ID: XXXXXXXXX
```

- Cloner votre skill

  Allez sur la console Alexa, dans l'écran présentant la liste des skills. En dessous du nom de la skill que vous voulez cloner, cliquer sur le lien _Copy Skill ID_ puis taper la commande suivante comme indiqué ici [Create an Alexa-hosted skill with the ASK CLI v2](https://developer.amazon.com/en-US/docs/alexa/hosted-skills/alexa-hosted-skills-ask-cli.html#create-an-alexa-hosted-skill-with-the-ask-cli-v2):

  ```
  ask init --hosted-skill-id id_de_votre_skill
  ```

  Vous obtiendrez ainsi une copie de votre skill en local dans le répertoire que vous avez indiqué.

  **Si vous avez une erreur Git, vérifier que vous n'utilisez pas la version 2.26.x ou 2.25.x de Git. Si c'est le cas, vous devez upgrader vers Git >= 2.27.x**

  Par défaut vous êtes positionné sur la branche `master`.

- Pour effectuer des modifications en local, vous devez d'abord vous positionner sur la branche `dev`:

  ```
  git checkout dev
  ```

- Lorsque vous voulez pousser vos modifications:

  ```
  git add .
  git commit -m 'Change backend'
  git push origin dev
  ```

- Lorsque vous voulez déployer vos modifications:

  ```
  git checkout master
  git merge dev
  git push origin master
  ```

  Cette commande déploie la dernière version validée de votre skill sur une skill hébergée par Alexa. Une fois que vous avez transmis vos modifications, la skill hébergée par Alexa déploie à la fois les ressources de votre package de skill et le code de skill backend du master distant. Une skill hébergée par Alexa déploie uniquement le code que vous transmettez à la branche principale distante (master)

- Tester le dialogue en ligne de commande

  ```
  ask dialog --locale fr-FR
  User  > ouvre sept joyeux anniversaire
  Alexa > John, Il vous reste 100 jours avant d'avoir 23 ans. Si vous souhaitez changer votre date d'anniversaire, dites simplement 'enregistre mon anniversaire' ou bien dites moi directement votre date de naissance.
  User  > qui est né aujourd'hui
  Alexa > C'est aussi l'anniversaire de : Erika Amato qui vient d'avoir 51 ans. Kirsti Sparboe qui vient d'avoir 74 ans. Mariusz Saniternik avec 66 ans. Imman Annachi avec 52 ans et Jack Huston qui vient d'avoir 38 ans. Voulez-vous connaitre le nombre de jours avant votre anniversaire ou bien enregistrer un rappel: quel est votre choix ?
  User  > stop
  Alexa > A la prochaine fois John
  User  >
  ```
